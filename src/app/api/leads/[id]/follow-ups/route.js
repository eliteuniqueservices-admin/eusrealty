import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

// GET /api/leads/[id]/follow-ups — Fetch all follow-ups for a lead
export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const lead = await Lead.findById(id).select('followUps nextFollowUp lastContactedAt name phone').lean();
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Sort follow-ups: pending first (by scheduledAt), then completed (by completedAt desc)
    const pending = (lead.followUps || [])
      .filter(f => !f.completedAt)
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    const completed = (lead.followUps || [])
      .filter(f => f.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    return NextResponse.json({
      followUps: [...pending, ...completed],
      nextFollowUp: lead.nextFollowUp,
      lastContactedAt: lead.lastContactedAt,
    });
  } catch (error) {
    console.error('Follow-ups GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
  }
});

// POST /api/leads/[id]/follow-ups — Schedule a new follow-up
export const POST = auth(async function POST(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { type, scheduledAt, notes } = body;

    if (!type || !scheduledAt) {
      return NextResponse.json({ error: 'Type and scheduledAt are required' }, { status: 400 });
    }

    await dbConnect();

    const followUp = {
      type,
      scheduledAt: new Date(scheduledAt),
      notes: notes || '',
      addedBy: req.auth.user?.name || 'Admin',
      createdAt: new Date(),
    };

    // Push new follow-up and recalculate nextFollowUp
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    lead.followUps.push(followUp);

    // Recalculate nextFollowUp — earliest pending follow-up
    const pendingFollowUps = lead.followUps
      .filter(f => !f.completedAt)
      .map(f => new Date(f.scheduledAt))
      .sort((a, b) => a - b);

    lead.nextFollowUp = pendingFollowUps.length > 0 ? pendingFollowUps[0] : null;

    await lead.save();

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Follow-up POST error:', error);
    return NextResponse.json({ error: 'Failed to schedule follow-up' }, { status: 500 });
  }
});

// PATCH /api/leads/[id]/follow-ups — Complete a follow-up
export const PATCH = auth(async function PATCH(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { followUpId, outcome, notes } = body;

    if (!followUpId) {
      return NextResponse.json({ error: 'followUpId is required' }, { status: 400 });
    }

    await dbConnect();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const followUp = lead.followUps.id(followUpId);
    if (!followUp) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    followUp.completedAt = new Date();
    followUp.outcome = outcome || '';
    if (notes) followUp.notes = notes;

    // Update lastContactedAt
    lead.lastContactedAt = new Date();

    // Recalculate nextFollowUp
    const pendingFollowUps = lead.followUps
      .filter(f => !f.completedAt)
      .map(f => new Date(f.scheduledAt))
      .sort((a, b) => a - b);

    lead.nextFollowUp = pendingFollowUps.length > 0 ? pendingFollowUps[0] : null;

    await lead.save();

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Follow-up PATCH error:', error);
    return NextResponse.json({ error: 'Failed to complete follow-up' }, { status: 500 });
  }
});
