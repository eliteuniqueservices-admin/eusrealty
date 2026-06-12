import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import LoanApplication from '@/models/LoanApplication';

// GET /api/loan-applications/[id] - Admin: get a specific loan application
export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const application = await LoanApplication.findById(id).lean();
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('LoanApplication GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
});

// PATCH /api/loan-applications/[id] - Admin: update status of a loan application
export const PATCH = auth(async function PATCH(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { applicationStatus } = body;

    await dbConnect();

    const application = await LoanApplication.findByIdAndUpdate(
      id,
      { $set: { applicationStatus } },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('LoanApplication PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
});

// DELETE /api/loan-applications/[id] - Admin: delete a loan application
export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const application = await LoanApplication.findByIdAndDelete(id);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('LoanApplication DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
});
