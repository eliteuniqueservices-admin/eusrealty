import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Property from '@/models/Property';
import JobApplication from '@/models/JobApplication';
import JobPost from '@/models/JobPost';
import LoanApplication from '@/models/LoanApplication';
import Subscriber from '@/models/Subscriber';
import Employee from '@/models/Employee';
import BlogPost from '@/models/BlogPost';

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    
    // Today's start
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // This month's start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayLeads, 
      monthLeads, 
      totalLeads, 
      totalProperties, 
      totalApplications,
      totalJobPosts,
      totalLoanApplications,
      totalSubscribers,
      totalEmployees,
      totalBlogs
    ] = await Promise.all([
      Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments(),
      Property.countDocuments(),
      JobApplication.countDocuments(),
      JobPost.countDocuments(),
      LoanApplication.countDocuments(),
      Subscriber.countDocuments(),
      Employee.countDocuments(),
      BlogPost.countDocuments()
    ]);

    return NextResponse.json({
      todayLeads,
      monthLeads,
      totalLeads,
      totalProperties,
      totalApplications,
      totalJobPosts,
      totalLoanApplications,
      totalSubscribers,
      totalEmployees,
      totalBlogs
    });
  } catch (error) {
    console.error('Dashboard Stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
});
