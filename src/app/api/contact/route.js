import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Notification from '@/models/Notification';
import { calculateLeadScore } from '@/lib/leadScoring';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    // Determine client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Rate limit: Max 5 form submissions per minute per IP
    if (isRateLimited(ip, 5, 60000)) {
      return Response.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

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

    // --- Input Sanitization & Length Restrictions ---
    const cleanName = name?.trim()?.substring(0, 100);
    const cleanPhone = phone?.trim()?.replace(/[^\d+-\s()]/g, '')?.substring(0, 20);
    const cleanEmail = email?.trim()?.toLowerCase()?.substring(0, 150);
    const cleanMessage = message?.trim()?.substring(0, 2000);
    const cleanObjective = objective?.trim()?.substring(0, 100);
    const cleanPosition = position?.trim()?.substring(0, 100);
    const cleanBudget = budget?.trim()?.substring(0, 100);
    const cleanPreferredLocation = preferredLocation?.trim()?.substring(0, 200);
    const cleanPropertyType = propertyType?.trim()?.substring(0, 100);
    const cleanPossession = possession?.trim()?.substring(0, 100);
    const cleanSessionId = sessionId?.trim()?.substring(0, 150);

    // --- Basic validation (email is optional — chatbot form may omit it) ---
    if (!cleanName || !cleanPhone || !cleanObjective) {
      return Response.json({ error: 'Missing required fields or invalid input.' }, { status: 400 });
    }

    // Validate email format if provided
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return Response.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    // Validate phone has between 8 and 15 digits
    const digitCount = cleanPhone.replace(/\D/g, '').length;
    if (digitCount < 8 || digitCount > 15) {
      return Response.json({ error: 'Invalid phone number length. Must be between 8 and 15 digits.' }, { status: 400 });
    }

    // Calculate score & quality
    const leadDataForScore = {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || '',
      budget: cleanBudget || '',
      preferredLocation: cleanPreferredLocation || (cleanObjective !== 'Home Loan Help' && cleanObjective !== 'Free Site Visit' ? cleanObjective : ''),
      propertyType: cleanPropertyType || '',
      possession: cleanPossession || '',
      siteVisitRequested: cleanObjective === 'Free Site Visit',
      callbackRequested: true
    };
    
    const { score, quality } = calculateLeadScore(leadDataForScore);

    // -------------------------------------------------------
    // Save Lead to MongoDB
    // -------------------------------------------------------
    let dbLead = null;
    let dbErrorMsg = null;
    try {
      await dbConnect();
      
      dbLead = await Lead.create({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || '',
        budget: cleanBudget || '',
        preferredLocation: cleanPreferredLocation || leadDataForScore.preferredLocation,
        propertyType: cleanPropertyType || '',
        possession: cleanPossession || '',
        leadScore: score,
        leadQuality: quality,
        status: 'New',
        source: body.source === 'Chatbot Widget' ? 'chatbot' 
          : body.source === 'Homepage Hero Form' ? 'homepage'
          : body.source === 'Exit Popup' ? 'exit_popup'
          : 'contact_form',
        objective: cleanObjective || '',
        position: cleanPosition || '',
        sessionId: cleanSessionId || '',
        siteVisitRequested: cleanObjective === 'Free Site Visit',
        callbackRequested: true,
        notes: cleanMessage ? [{ text: cleanMessage, addedBy: 'System', addedAt: new Date() }] : []
      });
    } catch (dbErr) {
      console.error('Failed to save lead in database:', dbErr.message);
      dbErrorMsg = dbErr.message;
    }

    // -------------------------------------------------------
    // Execute all background tasks (Emails, Telegram, Notifications) in parallel
    // -------------------------------------------------------
    const backgroundTasks = [];

    // 1. Create Admin Notification
    if (dbLead) {
      const notificationPromise = Notification.create({
        title: `${quality === 'Hot' ? '🔥 Hot' : quality === 'Warm' ? '🟡 Warm' : '❄️ Cold'} Lead: ${dbLead.name}`,
        message: `${dbLead.name} (${dbLead.phone}) requested callback for: ${cleanObjective}${cleanBudget ? ` | Budget: ${cleanBudget}` : ''}`,
        type: quality === 'Hot' ? 'hot_lead' : 'lead',
        isRead: false,
        relatedId: dbLead._id.toString(),
        relatedModel: 'Lead',
        icon: quality === 'Hot' ? '🔥' : '📞'
      }).catch(err => console.error('Notification creation failed:', err));
      
      backgroundTasks.push(notificationPromise);
    }

    // 2. SEND EMAILS via Gmail SMTP
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    } catch (err) {
      console.error('Nodemailer init failed:', err);
    }

    if (transporter) {
      // Admin Notification Email
      const adminEmails = [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2].filter(Boolean).join(', ');
      if (adminEmails) {
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
                  <div class="value">${cleanName}</div>

                  <div class="label">Phone</div>
                  <div class="value"><a href="tel:${cleanPhone}" style="color:#f59e0b;">${cleanPhone}</a></div>

                  ${cleanEmail ? `
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${cleanEmail}" style="color:#f59e0b;">${cleanEmail}</a></div>
                  ` : ''}

                  <div class="label">Objective / Interest</div>
                  <div class="value"><span class="badge">${cleanObjective}</span></div>

                  ${cleanBudget ? `
                  <div class="label">Budget</div>
                  <div class="value">${cleanBudget}</div>
                  ` : ''}

                  ${cleanPreferredLocation ? `
                  <div class="label">Preferred Location</div>
                  <div class="value">${cleanPreferredLocation}</div>
                  ` : ''}

                  ${cleanPropertyType ? `
                  <div class="label">Property Type</div>
                  <div class="value">${cleanPropertyType}</div>
                  ` : ''}

                  ${cleanPossession ? `
                  <div class="label">Possession Requirement</div>
                  <div class="value">${cleanPossession}</div>
                  ` : ''}

                  ${cleanPosition ? `
                  <div class="label">Applying for Position</div>
                  <div class="value">${cleanPosition}</div>
                  ` : ''}

                  ${cleanMessage ? `
                  <div class="label">Message / Notes</div>
                  <div class="message-box">${cleanMessage}</div>
                  ` : ''}

                  <div class="label">Lead Source</div>
                  <div class="value" style="font-size:13px;color:#64748b;">${body.source || 'Contact Page'}</div>
                </div>
                <div class="footer">
                  Received from eusrealty.co.in · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                </div>
              </div>
            </body>
          </html>
        `;

        const mailOptions = {
          from: `"EUS Realty Leads" <${process.env.GMAIL_USER}>`,
          to: adminEmails,
          subject: `🏠 New Lead: ${cleanName} — ${cleanObjective}`,
          html: emailHtml,
          replyTo: cleanEmail || undefined,
        };

        const adminMailPromise = transporter.sendMail(mailOptions).catch(err => console.error('Admin Email failed:', err));
        backgroundTasks.push(adminMailPromise);
      }

      // Send Professional Auto-Reply to the Customer
      if (cleanEmail) {
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
                  <p>Hi <span class="highlight">${cleanName}</span>,</p>
                  <p>Thank you for reaching out to EUS Realty! We have received your request for <strong>${cleanObjective}</strong>.</p>
                  <p>Our premium real estate advisors are currently reviewing your details. <strong>We will connect with you within the next 30 minutes</strong> to discuss how we can best assist you.</p>
                  <p>In the meantime, feel free to explore our exclusive collection of luxury properties in Pune.</p>
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
          to: cleanEmail,
          subject: "We've received your request! | EUS Realty",
          html: autoReplyHtml,
        };

        const customerMailPromise = transporter.sendMail(autoReplyOptions).catch(err => console.error('Customer Mail failed:', err));
        backgroundTasks.push(customerMailPromise);
      }
    }

    // 3. SEND TELEGRAM ALERT via Telegram Bot API
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const telegramSalesChatId = process.env.TELEGRAM_SALES_CHAT_ID;

    if (telegramBotToken) {
      const chatIds = [telegramChatId, telegramSalesChatId].filter(Boolean);

      if (chatIds.length > 0) {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        
        const telegramMessage = 
          `🏠 <b>New EUS Realty Lead</b>\n\n` +
          `👤 <b>Name:</b> ${cleanName}\n` +
          `📞 <b>Phone:</b> ${cleanPhone}\n` +
          `📧 <b>Email:</b> ${cleanEmail || 'N/A'}\n` +
          `🎯 <b>Objective:</b> ${cleanObjective}\n` +
          (cleanBudget ? `💰 <b>Budget:</b> ${cleanBudget}\n` : '') +
          (cleanPreferredLocation ? `📍 <b>Location:</b> ${cleanPreferredLocation}\n` : '') +
          (cleanPropertyType ? `🏢 <b>Prop Type:</b> ${cleanPropertyType}\n` : '') +
          (cleanPossession ? `🔑 <b>Possession:</b> ${cleanPossession}\n` : '') +
          (cleanPosition ? `💼 <b>Position:</b> ${cleanPosition}\n` : '') +
          (cleanMessage ? `💬 <b>Message:</b> ${cleanMessage}` : '') +
          `\n\n📊 <b>Source:</b> ${body.source || 'Contact Form'}`;

        const tgPromises = chatIds.map(chatId => 
          fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMessage,
              parse_mode: 'HTML'
            })
          }).then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              console.error(`Telegram API error for chat ${chatId}:`, text);
            }
          }).catch((err) => {
            console.error(`Telegram fetch failed for chat ID ${chatId}:`, err);
          })
        );
        
        backgroundTasks.push(...tgPromises);
      }
    }

    // Wait for all external API calls and notifications to finish concurrently
    await Promise.all(backgroundTasks);

    if (dbErrorMsg) {
      console.warn('Database save failed, but proceeding with success response since email/Telegram alerts were processed:', dbErrorMsg);
      return Response.json({ success: true, warning: 'Database offline, fallback notification dispatched' }, { status: 200 });
    }

    return Response.json({ success: true, leadId: dbLead?._id }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again or call us directly.', actualError: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
