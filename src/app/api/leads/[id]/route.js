import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

// GET /api/leads/[id] — Admin: get a specific lead
export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const lead = await Lead.findById(id).lean();
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Lead GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
});

// PATCH /api/leads/[id] — Admin: update a specific lead (including adding notes)
export const PATCH = auth(async function PATCH(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      name,
      phone,
      email,
      budget,
      preferredLocation,
      propertyType,
      possession,
      leadQuality,
      status,
      assignedTo,
      noteText, // optional single note to append
    } = body;

    await dbConnect();

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (email !== undefined) updateFields.email = email;
    if (budget !== undefined) updateFields.budget = budget;
    if (preferredLocation !== undefined) updateFields.preferredLocation = preferredLocation;
    if (propertyType !== undefined) updateFields.propertyType = propertyType;
    if (possession !== undefined) updateFields.possession = possession;
    if (leadQuality !== undefined) updateFields.leadQuality = leadQuality;
    if (status !== undefined) updateFields.status = status;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;

    const updateQuery = { $set: updateFields };

    if (noteText && typeof noteText === 'string' && noteText.trim()) {
      updateQuery.$push = {
        notes: {
          text: noteText.trim(),
          addedBy: req.auth.user?.name || 'Admin',
          addedAt: new Date(),
        },
      };
    }

    const lead = await Lead.findByIdAndUpdate(id, updateQuery, { new: true });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Lead PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
});
