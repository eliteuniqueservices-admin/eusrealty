import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { logAdminAction } from '@/lib/audit';
import dbConnect from '@/lib/mongodb';
import JobPost from '@/models/JobPost';
import { revalidatePath } from 'next/cache';

const MOCK_JOBS = [
  {
    _id: "mockjob1",
    title: "Relationship Manager",
    department: "Sales",
    location: "Wakad, Pune",
    salary: "₹8L Base + 20% Commission",
    type: "Full Time",
    mode: "On-site",
    experience: "Mid-Level (3-5 Yrs)",
    skills: ["B2B Sales", "Negotiation", "Real Estate"],
    description: "Looking for an experienced closer to manage premium client portfolios and drive site visits for grade-A builder projects.",
    status: "Active",
    deadline: "2026-07-31"
  },
  {
    _id: "mockjob2",
    title: "Digital Marketing Executive",
    department: "Growth",
    location: "Tathawade, Pune",
    salary: "₹6L Fixed + Performance",
    type: "Full Time",
    mode: "Hybrid",
    experience: "Junior (1-3 Yrs)",
    skills: ["SEO", "Meta Ads", "Google Analytics"],
    description: "Lead digital marketing lead generation campaigns across Meta ads, Google ads, and SEO optimization projects.",
    status: "Active",
    deadline: "2026-08-15"
  },
  {
    _id: "mockjob3",
    title: "Sourcing Manager",
    department: "Inventory",
    location: "West Pune",
    salary: "₹10L + High Incentives",
    type: "Full Time",
    mode: "On-site",
    experience: "Senior (5-8 Yrs)",
    skills: ["Builder Relations", "Real Estate Market", "Procurement"],
    description: "Manage exclusive builder mandates, inventory allocations, and builder relationship programs in Hinjewadi/Balewadi.",
    status: "Active",
    deadline: "2026-07-15"
  }
];

export const GET = auth(async function GET(req) {
  let all = false;
  try {
    const { searchParams } = new URL(req.url);
    all = searchParams.get('all') === 'true';
    
    await dbConnect();
    let query = { status: 'Active' };
    
    // If requesting all (including closed ones), verify authentication
    if (all) {
      const role = req.auth?.user?.role || req.auth?.role;
      if (!req.auth || !['admin', 'hr'].includes(role)) {
        return NextResponse.json({ error: 'Unauthorized to view all postings' }, { status: 401 });
      }
      query = {};
    }
    
    const jobs = await JobPost.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.warn('Job posts database fetch failed. Returning mock fallback jobs.', error.message);
    const fallbackJobs = all ? MOCK_JOBS : MOCK_JOBS.filter(j => j.status === 'Active');
    return NextResponse.json(fallbackJobs);
  }
});

export const POST = auth(async function POST(req) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const data = await req.json();
    const job = await JobPost.create(data);
    
    // Trigger Next.js static cache revalidation
    revalidatePath('/careers');
    revalidatePath('/careers/[id]');
    
    await logAdminAction(req, 'Job Post Created', `Job post "${job.title}" created.`);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Job post POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create job posting' }, { status: 500 });
  }
});
