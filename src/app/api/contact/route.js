import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Notification from '@/models/Notification';
import { calculateLeadScore } from '@/lib/leadScoring';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      email, 
      objective, 
      position, 
      message,
      budget,
      preferredLocation,
      propertyType,
      possession,
      sessionId
    } = body;

    // --- Basic validation (email is optional — chatbot form may omit it) ---
    if (!name || !phone || !objective) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // -------------------------------------------------------
    // Save Lead to MongoDB
    // -------------------------------------------------------
    let dbLead = null;
    try {
      await dbConnect();
      
      const cleanPhone = phone.trim();
      
      // Calculate score & quality
      const leadDataForScore = {
        name: name.trim(),
        phone: cleanPhone,
        email: email || '',
        budget: budget || '',
        preferredLocation: preferredLocation || (objective !== 'Home Loan Help' && objective !== 'Free Site Visit' ? objective : ''),
        propertyType: propertyType || '',
        possession: possession || '',
        siteVisitRequested: objective === 'Free Site Visit',
        callbackRequested: true
      };
      
      const { score, quality } = calculateLeadScore(leadDataForScore);

      dbLead = await Lead.create({
        name: name.trim(),
        phone: cleanPhone,
        email: email || '',
        budget: budget || '',
        preferredLocation: preferredLocation || leadDataForScore.preferredLocation,
        propertyType: propertyType || '',
        possession: possession || '',
        leadScore: score,
        leadQuality: quality,
        status: 'New',
        source: body.source === 'Chatbot Widget' ? 'chatbot' : 'contact_form',
        sessionId: sessionId || '',
        siteVisitRequested: objective === 'Free Site Visit',
        callbackRequested: true,
        notes: message ? [{ text: message, addedBy: 'System', addedAt: new Date() }] : []
      });

      // Create Admin Notification in DB
      await Notification.create({
        title: `${quality === 'Hot' ? '🔥 Hot' : quality === 'Warm' ? '🟡 Warm' : '❄️ Cold'} Lead: ${dbLead.name}`,
        message: `${dbLead.name} (${dbLead.phone}) requested callback for: ${objective}${budget ? ` | Budget: ${budget}` : ''}`,
        type: quality === 'Hot' ? 'hot_lead' : 'lead',
        isRead: false,
        relatedId: dbLead._id.toString(),
        relatedModel: 'Lead',
        icon: quality === 'Hot' ? '🔥' : '📞'
      });
    } catch (dbErr) {
      console.error('Failed to save lead in database:', dbErr.message);
    }

    // -------------------------------------------------------
    // 1. SEND EMAILS via Gmail SMTP (Nodemailer)
    // -------------------------------------------------------
    try {
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
              .header h1 { color: #f59e0b; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
              .header p { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
              .body { padding: 36px 40px; }
              .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
              .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
              .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 700; }
              .message-box { background: #f8f9fa; border-left: 3px solid #f59e0b; border-radius: 8px; padding: 16px 20px; font-size: 15px; color: #334155; line-height: 1.6; }
              .footer { padding: 20px 40px; background: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>🏠 New Lead — EUS Realty</h1>
                <p>A client just submitted a contact/lead form</p>
              </div>
              <div class="body">
                <div class="label">Full Name</div>
                <div class="value">${name}</div>

                <div class="label">Phone</div>
                <div class="value"><a href="tel:${phone}" style="color:#f59e0b;">${phone}</a></div>

                ${email ? `
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></div>
                ` : ''}

                <div class="label">Objective / Interest</div>
                <div class="value"><span class="badge">${objective}</span></div>

                ${budget ? `
                <div class="label">Budget</div>
                <div class="value">${budget}</div>
                ` : ''}

                ${preferredLocation ? `
                <div class="label">Preferred Location</div>
                <div class="value">${preferredLocation}</div>
                ` : ''}

                ${propertyType ? `
                <div class="label">Property Type</div>
                <div class="value">${propertyType}</div>
                ` : ''}

                ${possession ? `
                <div class="label">Possession Requirement</div>
                <div class="value">${possession}</div>
                ` : ''}

                ${position ? `
                <div class="label">Applying for Position</div>
                <div class="value">${position}</div>
                ` : ''}

                ${message ? `
                <div class="label">Message / Notes</div>
                <div class="message-box">${message}</div>
                ` : ''}

                <div class="label">Lead Source</div>
                <div class="value" style="font-size:13px;color:#64748b;">${body.source || 'Contact Page'}</div>
              </div>
              <div class="footer">
                Received from eusrealty.com · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: `"EUS Realty Leads" <${process.env.GMAIL_USER}>`,
        to: [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2].filter(Boolean).join(', '),
        subject: `🏠 New Lead: ${name} — ${objective}`,
        html: emailHtml,
        replyTo: email || undefined,
      };

      await transporter.sendMail(mailOptions);

      // Send Professional Auto-Reply to the Customer
      if (email) {
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
                  <p>Hi <span class="highlight">${name}</span>,</p>
                  <p>Thank you for reaching out to EUS Realty! We have received your request for <strong>${objective}</strong>.</p>
                  <p>Our premium real estate advisors are currently reviewing your details. <strong>We will connect with you within the next 30 minutes</strong> to discuss how we can best assist you.</p>
                  <p>In the meantime, feel free to explore our exclusive collection of luxury properties in Pune.</p>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://eusrealty.com/properties" class="btn">Explore Properties</a>
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
          to: email,
          subject: "We've received your request! | EUS Realty",
          html: autoReplyHtml,
        };

        await transporter.sendMail(autoReplyOptions);
      }
    } catch (mailErr) {
      console.error('Email notification failed:', mailErr);
    }

    // -------------------------------------------------------
    // 2. SEND TELEGRAM ALERT via Telegram Bot API (Admin & Sales Group)
    // -------------------------------------------------------
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      const telegramSalesChatId = process.env.TELEGRAM_SALES_CHAT_ID;

      if (telegramBotToken) {
        const chatIds = [telegramChatId, telegramSalesChatId].filter(Boolean);

        if (chatIds.length > 0) {
          const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
          const telegramMessage = 
            `🏠 *New EUS Realty Lead*\n\n` +
            `👤 *Name:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `📧 *Email:* ${email || 'N/A'}\n` +
            `🎯 *Objective:* ${objective}\n` +
            (budget ? `💰 *Budget:* ${budget}\n` : '') +
            (preferredLocation ? `📍 *Location:* ${preferredLocation}\n` : '') +
            (propertyType ? `🏢 *Prop Type:* ${propertyType}\n` : '') +
            (possession ? `🔑 *Possession:* ${possession}\n` : '') +
            (position ? `💼 *Position:* ${position}\n` : '') +
            (message ? `💬 *Message:* ${message}` : '');

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
      console.error('Telegram integration error:', tgErr);
    }

    return Response.json({ success: true, leadId: dbLead?._id }, { status: 200 });

  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
