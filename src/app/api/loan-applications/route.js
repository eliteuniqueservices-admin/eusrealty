import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LoanApplication from '@/models/LoanApplication';
import Notification from '@/models/Notification';
import { auth } from '@/auth'; // Adjust based on your auth setup, we'll try to protect GET
import { isRateLimited } from '@/lib/rateLimit';

// Ensure DB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Generate next Application Number: HL-YYYY-XXXXX
const generateAppNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `HL-${year}-`;
  
  // Find the highest sequence for this year
  const lastApp = await LoanApplication.findOne({ applicationNumber: new RegExp(`^${prefix}`) })
    .sort({ applicationNumber: -1 })
    .limit(1);

  let seq = 1;
  if (lastApp) {
    const lastSeqStr = lastApp.applicationNumber.replace(prefix, '');
    seq = parseInt(lastSeqStr, 10) + 1;
  }

  return `${prefix}${seq.toString().padStart(5, '0')}`;
};

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    
    // Rate limit: Max 5 applications per minute per IP
    if (isRateLimited(ip, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    await connectDB();
    const data = await req.json();
    
    console.log("=== NEW HOME LOAN APPLICATION RECEIVED ===");
    console.log(JSON.stringify(data, null, 2));

    // Sanitization and extraction of personal and financial fields to prevent injection
    const cleanData = {
      personalDetails: {
        fullName: data.personalDetails?.fullName?.trim()?.substring(0, 100) || '',
        mobile: data.personalDetails?.mobile?.trim()?.replace(/[^\d+-\s()]/g, '')?.substring(0, 20) || '',
        email: data.personalDetails?.email?.trim()?.toLowerCase()?.substring(0, 150) || '',
        dob: data.personalDetails?.dob ? new Date(data.personalDetails.dob) : null,
        age: parseInt(data.personalDetails?.age) || 0,
        city: data.personalDetails?.city?.trim()?.substring(0, 100) || '',
        state: data.personalDetails?.state?.trim()?.substring(0, 100) || '',
      },
      employment: {
        employmentType: data.employment?.employmentType || 'Salaried',
        companyOrBusiness: data.employment?.companyOrBusiness?.trim()?.substring(0, 150) || '',
        grossSalary: parseFloat(data.employment?.grossSalary) || 0,
        netSalary: parseFloat(data.employment?.netSalary) || 0,
        annualIncome: parseFloat(data.employment?.annualIncome) || 0,
        experience: parseFloat(data.employment?.experience) || 0,
        vintage: parseFloat(data.employment?.vintage) || 0,
        gstNumber: data.employment?.gstNumber?.trim()?.substring(0, 30) || '',
      },
      obligations: {
        personalLoanEmi: parseFloat(data.obligations?.personalLoanEmi) || 0,
        carLoanEmi: parseFloat(data.obligations?.carLoanEmi) || 0,
        creditCardEmi: parseFloat(data.obligations?.creditCardEmi) || 0,
        otherEmi: parseFloat(data.obligations?.otherEmi) || 0,
        totalExistingEmi: parseFloat(data.obligations?.totalExistingEmi) || 0,
      },
      property: {
        propertyType: data.property?.propertyType || 'Flat',
        propertyValue: parseFloat(data.property?.propertyValue) || 0,
        location: data.property?.location?.trim()?.substring(0, 200) || '',
        downPayment: parseFloat(data.property?.downPayment) || 0,
        loanRequirement: parseFloat(data.property?.loanRequirement) || 0,
      },
      creditInfo: {
        creditScore: parseInt(data.creditInfo?.creditScore) || 0,
        existingHomeLoan: data.creditInfo?.existingHomeLoan || 'No',
        defaults: data.creditInfo?.defaults || 'No',
      }
    };

    // Server-side validation
    if (!cleanData.personalDetails.fullName || !cleanData.personalDetails.mobile || !cleanData.personalDetails.email) {
      return NextResponse.json({ error: 'Missing required personal details.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanData.personalDetails.email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }
    const mobileDigits = cleanData.personalDetails.mobile.replace(/\D/g, '').length;
    if (mobileDigits < 8 || mobileDigits > 15) {
      return NextResponse.json({ error: 'Invalid mobile number.' }, { status: 400 });
    }
    if (cleanData.personalDetails.age <= 0 || cleanData.personalDetails.age > 120) {
      return NextResponse.json({ error: 'Invalid age value.' }, { status: 400 });
    }
    if (cleanData.property.propertyValue <= 0 || cleanData.property.loanRequirement <= 0) {
      return NextResponse.json({ error: 'Invalid property value or loan requirement.' }, { status: 400 });
    }

    // Re-calculate rules to prevent client tampering
    const monthlyIncome = cleanData.employment.netSalary || (cleanData.employment.annualIncome / 12) || 0;
    const propertyValue = cleanData.property.propertyValue || 0;
    const loanRequirement = cleanData.property.loanRequirement || 0;
    const totalExistingEmi = cleanData.obligations.totalExistingEmi || 0;

    // 1. Calculate FOIR Limit
    let maxFoirLimit = 0.50;
    if (monthlyIncome >= 50000 && monthlyIncome <= 100000) maxFoirLimit = 0.60;
    if (monthlyIncome > 100000) maxFoirLimit = 0.70;

    const maxEligibleEmi = (monthlyIncome * maxFoirLimit) - totalExistingEmi;

    // 2. Calculate LTV Limit
    let maxLtvLimit = 0.90;
    if (propertyValue > 3000000 && propertyValue <= 7500000) maxLtvLimit = 0.80;
    if (propertyValue > 7500000) maxLtvLimit = 0.75;

    const maxEligibleLoanByLtv = propertyValue * maxLtvLimit;

    // Determine actual eligible loan based on standard interest rate (e.g., 8.5% for 20 years)
    const rate = 8.5 / 12 / 100;
    const tenureMonths = 240; // 20 years default
    const mathFactor = (rate * Math.pow(1 + rate, tenureMonths)) / (Math.pow(1 + rate, tenureMonths) - 1);
    const maxEligibleLoanByIncome = maxEligibleEmi > 0 ? maxEligibleEmi / mathFactor : 0;

    // Final Eligible Amount is the minimum of LTV limit and Income limit
    const eligibleLoanAmount = Math.max(0, Math.min(maxEligibleLoanByLtv, maxEligibleLoanByIncome));
    
    // Suggested EMI for requested loan amount
    const suggestedEmi = loanRequirement > 0 ? loanRequirement * mathFactor : 0;

    // Final actual FOIR & LTV based on the requested loan Requirement
    const actualFoir = ((totalExistingEmi + suggestedEmi) / monthlyIncome) * 100;
    const actualLtv = (loanRequirement / propertyValue) * 100;

    // Credit Risk
    let riskLevel = 'Average';
    const score = cleanData.creditInfo.creditScore;
    if (score >= 750) riskLevel = 'Excellent';
    else if (score >= 700) riskLevel = 'Good';
    else if (score < 650 || cleanData.creditInfo.defaults === 'Yes') riskLevel = 'High Risk';

    // Decision Logic
    let eligibilityStatus = 'Eligible';
    if (riskLevel === 'High Risk' || actualFoir > (maxFoirLimit * 100) || actualLtv > (maxLtvLimit * 100) || eligibleLoanAmount < loanRequirement) {
        eligibilityStatus = 'Not Eligible';
    } else if (riskLevel === 'Average') {
        eligibilityStatus = 'Conditionally Eligible';
    }

    // Attach server calculations to payload
    cleanData.calculatedMetrics = {
        foir: parseFloat(actualFoir.toFixed(2)),
        ltv: parseFloat(actualLtv.toFixed(2)),
        maxEligibleEmi: Math.round(maxEligibleEmi),
        eligibleLoanAmount: Math.round(eligibleLoanAmount),
        suggestedEmi: Math.round(suggestedEmi),
        riskLevel
    };
    cleanData.eligibilityStatus = eligibilityStatus;
    cleanData.applicationNumber = await generateAppNumber();

    // Save
    const application = await LoanApplication.create(cleanData);

    // CREATE DB NOTIFICATION FOR ADMIN BELL
    try {
      await Notification.create({
        title: `🏦 New Loan Application: ${cleanData.personalDetails.fullName}`,
        message: `App ID: ${cleanData.applicationNumber} | Req: ₹${cleanData.property.loanRequirement.toLocaleString('en-IN')} | ${cleanData.eligibilityStatus}`,
        type: 'loan_application',
        isRead: false,
        relatedId: application._id.toString(),
        relatedModel: 'LoanApplication',
        icon: '🏦'
      });
    } catch (dbNotifErr) {
      console.error('Failed to create loan application notification:', dbNotifErr);
    }

    // SEND TELEGRAM ALERT
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      const telegramSalesChatId = process.env.TELEGRAM_SALES_CHAT_ID;

      if (telegramBotToken) {
        const chatIds = [telegramChatId, telegramSalesChatId].filter(Boolean);

        if (chatIds.length > 0) {
          const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
          const telegramMessage = 
            `🏦 *New Home Loan Application*\n\n` +
            `🆔 *App Number:* \`${cleanData.applicationNumber}\`\n` +
            `👤 *Name:* ${cleanData.personalDetails.fullName}\n` +
            `📞 *Phone:* ${cleanData.personalDetails.mobile}\n` +
            `📧 *Email:* ${cleanData.personalDetails.email || 'N/A'}\n` +
            `💰 *Loan Requirement:* ₹${cleanData.property.loanRequirement.toLocaleString('en-IN')}\n` +
            `🏢 *Property Value:* ₹${cleanData.property.propertyValue.toLocaleString('en-IN')}\n` +
            `📍 *Location:* ${cleanData.property.location || 'N/A'}\n` +
            `💼 *Income:* ₹${Math.round(monthlyIncome).toLocaleString('en-IN')}/mo\n` +
            `📝 *Status:* *${eligibilityStatus}*\n` +
            `🛡️ *Risk Level:* ${riskLevel}\n` +
            `💵 *Max Eligible Loan:* ₹${Math.round(eligibleLoanAmount).toLocaleString('en-IN')}`;

          for (const chatId of chatIds) {
            fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
              })
            }).catch((err) => {
              console.error(`Telegram notification failed for chat ID ${chatId}:`, err);
            });
          }
        }
      }
    } catch (tgErr) {
      console.error('Telegram integration error for loan application:', tgErr);
    }

    // SEND EMAIL NOTIFICATION
    try {
      const nodemailer = (await import('nodemailer')).default;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
              .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
              .header { background: #0f172a; padding: 32px 40px; }
              .header h1 { color: #f59e0b; margin: 0; font-size: 22px; font-weight: 800; }
              .header p { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
              .body { padding: 36px 40px; }
              .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
              .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
              .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 700; }
              .footer { padding: 20px 40px; background: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>🏦 New Home Loan Application</h1>
                <p>Application ID: ${cleanData.applicationNumber}</p>
              </div>
              <div class="body">
                <div class="label">Applicant Name</div>
                <div class="value">${cleanData.personalDetails.fullName}</div>

                <div class="label">Contact</div>
                <div class="value"><a href="tel:${cleanData.personalDetails.mobile}" style="color:#f59e0b;">${cleanData.personalDetails.mobile}</a> | ${cleanData.personalDetails.email}</div>

                <div class="label">Loan Requirement</div>
                <div class="value">₹${cleanData.property.loanRequirement.toLocaleString('en-IN')}</div>

                <div class="label">System Eligibility Decision</div>
                <div class="value">
                  <span class="badge" style="background: ${eligibilityStatus === 'Eligible' ? '#d1fae5; color: #065f46;' : eligibilityStatus === 'Conditionally Eligible' ? '#fef3c7; color: #92400e;' : '#fee2e2; color: #991b1b;'}">
                    ${eligibilityStatus}
                  </span>
                </div>

                <div class="label">Max Eligible Loan Amount</div>
                <div class="value">₹${Math.round(eligibleLoanAmount).toLocaleString('en-IN')}</div>
              </div>
              <div class="footer">
                Please log in to the admin dashboard to process this application.
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: `"EUS Realty Loans" <${process.env.GMAIL_USER}>`,
        to: [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2].filter(Boolean).join(', '),
        subject: `🏦 New Home Loan Application: ${cleanData.personalDetails.fullName} (${cleanData.applicationNumber})`,
        html: emailHtml,
        replyTo: cleanData.personalDetails.email,
      };

      await transporter.sendMail(mailOptions);

      // Send Professional Auto-Reply to the Customer
      const autoReplyHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Inter', 'Segoe UI', sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
              .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
              .header { background: #0f172a; padding: 40px; text-align: center; }
              .header h1 { color: #f59e0b; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
              .body { padding: 40px; color: #334155; font-size: 16px; line-height: 1.6; }
              .body p { margin: 0 0 20px 0; }
              .highlight { color: #0f172a; font-weight: 700; }
              .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 700; margin-top: 5px;}
              .btn { display: inline-block; background: #f59e0b; color: #0f172a; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; margin-top: 10px; }
              .footer { padding: 30px 40px; background: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>EUS Realty</h1>
              </div>
              <div class="body">
                <p>Hi <span class="highlight">${cleanData.personalDetails.fullName}</span>,</p>
                <p>Thank you for choosing EUS Realty for your home loan advisory. We have successfully received your application!</p>
                
                <div style="background: #f1f5f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #475569;">Application ID</p>
                  <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 800; color: #0f172a;">${cleanData.applicationNumber}</p>
                </div>

                <p>Our dedicated mortgage advisors are currently reviewing your financial profile and property requirements. <strong>We will connect with you within the next 30 minutes</strong> to discuss your eligibility and guide you through the next steps to secure your loan.</p>
                
                <p>In the meantime, feel free to explore our exclusive collection of premium properties in Pune.</p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://eusrealty.co.in/properties" class="btn">Explore Properties</a>
                </div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} EUS Realty. All rights reserved.</p>
                <p>Pune's Premier Luxury Real Estate Advisory</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const autoReplyOptions = {
        from: `"EUS Realty" <${process.env.GMAIL_USER}>`,
        to: cleanData.personalDetails.email,
        subject: "Your Home Loan Application is Under Review | EUS Realty",
        html: autoReplyHtml,
      };

      await transporter.sendMail(autoReplyOptions);
    } catch (mailErr) {
      console.error('Home Loan Email notification failed:', mailErr);
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Home Loan Submission Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Parse query params for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    
    let query = {};
    if (status && status !== 'All') {
        query.applicationStatus = status;
    }
    if (search) {
        query.$or = [
            { applicationNumber: new RegExp(search, 'i') },
            { 'personalDetails.fullName': new RegExp(search, 'i') },
            { 'personalDetails.mobile': new RegExp(search, 'i') }
        ];
    }

    const applications = await LoanApplication.find(query).sort({ createdAt: -1 });
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
