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

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    // Check fallback mock jobs first
    const mockJob = MOCK_JOBS.find(j => j._id === id);
    if (mockJob) {
      return NextResponse.json(mockJob);
    }
    
    await dbConnect();
    const job = await JobPost.findById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.warn('Job database fetch by ID failed. Returning fallback mock job if exists.', error.message);
    const { id } = await params;
    const mockJob = MOCK_JOBS.find(j => j._id === id);
    if (mockJob) {
      return NextResponse.json(mockJob);
    }
    return NextResponse.json({ error: 'Failed to fetch job posting' }, { status: 500 });
  }
}

export const PUT = auth(async function PUT(req, { params }) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    const job = await JobPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    
    // Trigger Next.js static cache revalidation
    revalidatePath('/careers');
    revalidatePath(`/careers/${id}`);
    revalidatePath('/careers/[id]');
    
    await logAdminAction(req, 'Job Post Updated', `Job post "${job.title}" (ID: ${id}) updated.`);
    return NextResponse.json(job);
  } catch (error) {
    console.error('Job post PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update job posting' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    const role = req.auth?.user?.role || req.auth?.role;
    if (!req.auth || !['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    await dbConnect();
    const job = await JobPost.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    
    // Trigger Next.js static cache revalidation
    revalidatePath('/careers');
    revalidatePath(`/careers/${id}`);
    revalidatePath('/careers/[id]');
    
    await logAdminAction(req, 'Job Post Deleted', `Job post "${job.title}" (ID: ${id}) deleted.`);
    return NextResponse.json({ message: 'Job posting deleted' });
  } catch (error) {
    console.error('Job post DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 });
  }
});
