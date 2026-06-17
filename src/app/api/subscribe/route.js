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
    } catch (mailErr) {
      console.error('Welcome email failed:', mailErr);
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
