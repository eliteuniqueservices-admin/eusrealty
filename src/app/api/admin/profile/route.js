import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { logAdminAction } from '@/lib/audit';

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = req.auth.user?.email || req.auth.email;
    await dbConnect();
    
    let user = await User.findOne({ email }).select('name email phone role office');
    
    if (!user) {
      // Fallback response for mock configurations during dev
      if (email === 'admin@eusrealty.com' || email === 'rahulupadhyay0053@gmail.com') {
        user = {
          name: 'Admin User',
          email: email,
          phone: '+91 98765 43210',
          role: 'admin',
          office: 'Wakad Branch, Pune'
        };
        return NextResponse.json(user);
      }
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET profile API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
});

export const PATCH = auth(async function PATCH(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = req.auth.user?.email || req.auth.email;
    const { name, phone, office } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    await dbConnect();
    
    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    // Save changes
    user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (office !== undefined) user.office = office;
    
    await user.save();

    // Log the change
    await logAdminAction(
      req, 
      'Profile Updated', 
      `Name: "${name}", Phone: "${phone || 'N/A'}", Office: "${office || 'N/A'}"`
    );

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      office: user.office
    });
  } catch (error) {
    console.error('PATCH profile API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
});
