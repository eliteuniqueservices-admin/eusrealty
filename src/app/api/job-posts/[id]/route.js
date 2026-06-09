import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import JobPost from '@/models/JobPost';

export const PUT = auth(async function PUT(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const role = req.auth.user?.role;
    if (!['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    const job = await JobPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.error('Job post PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update job posting' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const role = req.auth.user?.role;
    if (!['admin', 'hr'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = await params;
    await dbConnect();
    const job = await JobPost.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Job posting deleted' });
  } catch (error) {
    console.error('Job post DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 });
  }
});
