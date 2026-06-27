import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { auth } from '@/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    
    if (existing) {
      if (existing.status === 'Unsubscribed') {
        // Resubscribe them
        existing.status = 'Active';
        await existing.save();
        return NextResponse.json({ message: 'Welcome back! You have been resubscribed successfully.' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
      }
    }

    // Create new subscriber
    const newSubscriber = await Subscriber.create({ email, status: 'Active' });
    
    // Send Welcome Email
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
          <head><meta charset="utf-8" /></head>
          <body style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
            <div style="max-w-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 10px;">
              <h1 style="color: #f59e0b; margin-top: 0;">Welcome to EUS Realty!</h1>
              <p style="color: #334155; font-size: 16px; line-height: 1.5;">Thank you for subscribing to our newsletter. You're now on the exclusive list to receive instant alerts whenever we add new premium luxury properties to our portfolio.</p>
              <p style="color: #334155; font-size: 16px; line-height: 1.5;">We look forward to helping you find your dream home.</p>
              <br/>
              <p style="color: #94a3b8; font-size: 14px;">EUS Realty Team</p>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"EUS Realty" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Welcome to EUS Realty Exclusive Properties",
        html: emailHtml,
      });

      // Send Email Notification to Admin
      const adminEmails = [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2].filter(Boolean).join(', ');
      if (adminEmails) {
        const subscriberEmailHtml = `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8" /></head>
            <body style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #e2e8f0;">
                <h2 style="color: #f59e0b; margin-top: 0;">📧 New Newsletter Subscriber</h2>
                <p style="color: #334155; font-size: 16px;">A user has subscribed to the EUS Realty newsletter.</p>
                <p style="color: #334155; font-size: 16px;"><strong>Subscriber Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <br/>
                <p style="color: #94a3b8; font-size: 12px;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              </div>
            </body>
          </html>
        `;
        await transporter.sendMail({
          from: `"EUS Realty Alerts" <${process.env.GMAIL_USER}>`,
          to: adminEmails,
          subject: `📧 New Newsletter Subscriber: ${email}`,
          html: subscriberEmailHtml,
        }).catch(err => console.error('Admin subscriber email notification failed:', err));
      }
    } catch (mailErr) {
      console.error('Welcome email failed:', mailErr);
    }

    // Send Telegram Notification to Admin
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      const telegramSalesChatId = process.env.TELEGRAM_SALES_CHAT_ID;

      if (telegramBotToken) {
        const chatIds = [telegramChatId, telegramSalesChatId].filter(Boolean);
        if (chatIds.length > 0) {
          const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
          const telegramMessage = 
            `📧 <b>New Newsletter Subscription</b>\n\n` +
            `👤 <b>Email:</b> ${email}\n` +
            `📊 <b>Source:</b> Footer Newsletter`;

          for (const chatId of chatIds) {
            fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'HTML'
              })
            }).catch((err) => {
              console.error(`Telegram notification failed for subscriber chat ID ${chatId}:`, err);
            });
          }
        }
      }
    } catch (tgErr) {
      console.error('Telegram subscriber notification error:', tgErr);
    }

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth || req.auth.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error('Subscribers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
});
