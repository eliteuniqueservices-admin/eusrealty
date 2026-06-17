import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { logAdminAction } from '@/lib/audit';

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = req.auth.user?.email || req.auth.email;
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
    }

    // Set new password (pre-save hook will automatically salt and hash it)
    user.password = newPassword;
    
    // Clear any temporary login OTPs
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    // Log the event
    await logAdminAction(req, 'Password Rotated', 'Account password successfully updated.');

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Password change API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to rotate password.' }, { status: 500 });
  }
});
