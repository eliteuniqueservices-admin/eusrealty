import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import nodemailer from 'nodemailer';

// helper to format HTML emails
const getEmailTemplate = (name, email, phone, position, experience, resumeUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
          .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
          .header { background: #0f172a; padding: 32px 40px; }
          .header h1 { color: #fbbf24; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
          .body { padding: 36px 40px; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
          .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 700; }
          .footer { padding: 20px 40px; background: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>💼 New Job Application — EUS Realty</h1>
            <p>A candidate just applied through the careers portal</p>
          </div>
          <div class="body">
            <div class="label">Candidate Name</div>
            <div class="value">${name}</div>

            <div class="label">Position Applied For</div>
            <div class="value"><span class="badge">${position}</span></div>

            <div class="label">Phone</div>
            <div class="value"><a href="tel:${phone}" style="color:#fbbf24;">${phone}</a></div>

            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${email}" style="color:#fbbf24;">${email}</a></div>

            <div class="label">Total Experience</div>
            <div class="value">${experience}</div>

            <div class="label">Resume Link</div>
            <div class="value">
              <a href="${resumeUrl}" target="_blank" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 20px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;">
                Download / View Resume
              </a>
            </div>
          </div>
          <div class="footer">
            Received via EUS Careers · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </div>
        </div>
      </body>
    </html>
  `;
};

// 1. POST: Submit a new application
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, position, experience, resumeUrl } = body;

    if (!name || !email || !phone || !position || !experience || !resumeUrl) {
      return NextResponse.json({ error: 'Missing required application fields.' }, { status: 400 });
    }

    // Connect to database and save
    await dbConnect();
    const application = await JobApplication.create({
      name,
      email,
      phone,
      position,
      experience,
      resumeUrl,
      status: 'New'
    });

    // Send email notification
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `"EUS Careers" <${process.env.GMAIL_USER}>`,
          to: [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2].filter(Boolean).join(', '),
          subject: `💼 New Candidate: ${name} — ${position}`,
          html: getEmailTemplate(name, email, phone, position, experience, resumeUrl),
          replyTo: email,
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.error('Failed to send application email:', mailErr);
    }

    // Send WhatsApp notification
    try {
      if (process.env.WHATSAPP_PHONE && process.env.WHATSAPP_APIKEY) {
        const messageText = 
          `💼 *New Job Application*\n\n` +
          `👤 *Name:* ${name}\n` +
          `🎯 *Position:* ${position}\n` +
          `📞 *Phone:* ${phone}\n` +
          `📧 *Email:* ${email}\n` +
          `⏳ *Experience:* ${experience}\n` +
          `📎 *Resume:* ${resumeUrl}`;
        
        const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WHATSAPP_PHONE}&text=${encodeURIComponent(messageText)}&apikey=${process.env.WHATSAPP_APIKEY}`;
        
        fetch(whatsappUrl).catch(err => console.error('CallMeBot error:', err));
      }
    } catch (wsErr) {
      console.error('Failed to send WhatsApp alert:', wsErr);
    }

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error('Job application submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}

// 2. GET: Retrieve list of candidates (Authenticated Admin/HR)
export const GET = auth(async function GET(req) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const apps = await JobApplication.find().sort({ createdAt: -1 });
    return NextResponse.json(apps);
  } catch (error) {
    console.error('Job applications fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve job applications' }, { status: 500 });
  }
});

// 3. PUT: Update candidate status (Authenticated Admin/HR)
export const PUT = auth(async function PUT(req) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const app = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
    if (!app) {
      return NextResponse.json({ error: 'Applicant record not found' }, { status: 404 });
    }

    return NextResponse.json(app);
  } catch (error) {
    console.error('Job application update error:', error);
    return NextResponse.json({ error: 'Failed to update applicant record' }, { status: 500 });
  }
});

// 4. DELETE: Remove candidate record (Authenticated Admin/HR)
export const DELETE = auth(async function DELETE(req) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing application id' }, { status: 400 });
    }

    await dbConnect();
    const deleted = await JobApplication.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Applicant record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Applicant record deleted' });
  } catch (error) {
    console.error('Job application delete error:', error);
    return NextResponse.json({ error: 'Failed to delete applicant record' }, { status: 500 });
  }
});
