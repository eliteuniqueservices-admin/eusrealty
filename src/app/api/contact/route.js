import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, objective, position, message } = body;

    // --- Basic validation (email is optional — chatbot form may omit it) ---
    if (!name || !phone || !objective) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // -------------------------------------------------------
    // 1. SEND EMAILS via Gmail SMTP (Nodemailer)
    // -------------------------------------------------------
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
              <p>A client just submitted the contact form</p>
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

              <div class="label">Objective</div>
              <div class="value"><span class="badge">${objective}</span></div>

              ${position ? `
              <div class="label">Applying for Position</div>
              <div class="value">${position}</div>
              ` : ''}

              ${message ? `
              <div class="label">Message</div>
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
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // -------------------------------------------------------
    // 2. SEND WHATSAPP via CallMeBot API
    // -------------------------------------------------------
    const whatsappMessage = encodeURIComponent(
      `🏠 *New EUS Realty Lead*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📧 *Email:* ${email || 'N/A'}\n` +
      `🎯 *Objective:* ${objective}\n` +
      (position ? `💼 *Position:* ${position}\n` : '') +
      (message ? `💬 *Message:* ${message}` : '')
    );

    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WHATSAPP_PHONE}&text=${whatsappMessage}&apikey=${process.env.WHATSAPP_APIKEY}`;

    // Fire-and-forget — don't block the response if WhatsApp fails
    fetch(whatsappUrl).catch((err) => {
      console.error('WhatsApp notification failed:', err);
    });

    return Response.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
