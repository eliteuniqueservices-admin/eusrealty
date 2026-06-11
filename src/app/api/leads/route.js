import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

// GET /api/leads — Admin: list all leads with pagination & filters
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const quality = searchParams.get('quality'); // Hot, Warm, Cold
    const status = searchParams.get('status'); // New, Contacted, etc.
    const search = searchParams.get('search'); // search by name or phone or email

    await dbConnect();

    const filter = {};
    if (quality) filter.leadQuality = quality;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
});

// POST /api/leads — Admin: manually create a new lead
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      source,
      notes,
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    await dbConnect();

    const leadData = {
      name,
      phone,
      email: email || '',
      budget: budget || '',
      preferredLocation: preferredLocation || '',
      propertyType: propertyType || '',
      possession: possession || '',
      leadQuality: leadQuality || 'Cold',
      status: status || 'New',
      source: source || 'manual',
      notes: notes ? (Array.isArray(notes) ? notes : [{ text: notes }]) : [],
    };

    const lead = await Lead.create(leadData);

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Lead POST error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
});
