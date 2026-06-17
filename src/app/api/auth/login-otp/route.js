import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { isRateLimited } from '@/lib/rateLimit';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req) {
  try {
    // 1. IP-based Rate Limiting (Defense against brute force login attacks)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    
    // Max 5 attempts per minute per IP
    if (isRateLimited(`login_${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await connectDB();

    // 2. Locate User
    const user = await User.findOne({ email: cleanEmail });

    // Fallback logic for initial setup/development
    const isMockAdmin = (cleanEmail === 'admin@eusrealty.com' || cleanEmail === 'rahulupadhyay0053@gmail.com') && (password === 'Admin@123' || password === 'admin123');

    if (!user && !isMockAdmin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (user) {
      // 3. Verify role
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Access denied. Administrator privileges required.' }, { status: 403 });
      }

      // 4. Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }
    }

    // 5. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Log the OTP to the server console for easy verification and test access
    console.log(`\n==================================================`);
    console.log(`🔒 [SECURITY 2FA OTP] for: ${cleanEmail}`);
    console.log(`🔑 CODE: ${otp}`);
    console.log(`==================================================\n`);

    // 6. Update User Record with OTP (or fallback in memory for dev config)
    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else if (isMockAdmin) {
      global.tempOtp = otp;
      global.tempOtpExpires = otpExpires;
    }

    // 7. Dispatch OTP Email
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
              .header { background: #0f172a; padding: 32px 40px; text-align: center; }
              .header h1 { color: #f59e0b; margin: 0; font-size: 22px; font-weight: 800; }
              .body { padding: 36px 40px; text-align: center; }
              .otp-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; }
              .otp-code { font-size: 36px; font-weight: 800; color: #0f172a; background: #f1f5f9; padding: 12px 24px; border-radius: 12px; letter-spacing: 6px; display: inline-block; font-family: monospace; }
              .note { color: #64748b; font-size: 14px; margin-top: 24px; line-height: 1.5; }
              .footer { padding: 20px 40px; background: #f8f9fa; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>🛡️ EUS Realty Admin Login Security</h1>
              </div>
              <div class="body">
                <div class="otp-title">Your Two-Factor Verification Code</div>
                <div class="otp-code">${otp}</div>
                <p class="note">This code is valid for <strong>5 minutes</strong>. If you did not request this login attempt, please change your password immediately.</p>
              </div>
              <div class="footer">
                Elite Unique Services (EUS Realty) · Secure Admin Portal
              </div>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"EUS Realty Security" <${process.env.GMAIL_USER}>`,
        to: cleanEmail,
        subject: `🔒 ${otp} is your EUS Realty verification code`,
        html: emailHtml,
      });
      
      console.log(`📧 OTP email dispatched successfully to ${cleanEmail}`);
    } catch (mailErr) {
      console.error('Failed to dispatch 2FA email notification:', mailErr.message);
      // Fail open for development fallback if nodemailer details are missing
    }

    return NextResponse.json({ status: 'OTP_REQUIRED' }, { status: 200 });

  } catch (error) {
    console.error('Login OTP API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
