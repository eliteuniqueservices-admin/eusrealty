import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import Property from '@/models/Property';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

// POST /api/properties/bulk  — authenticated admin only
// Body: { properties: [ { name, developer, location, ... }, ... ] }
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { properties } = await req.json();

    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json({ error: 'No properties provided.' }, { status: 400 });
    }

    if (properties.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 properties per bulk import.' }, { status: 400 });
    }

    // Validate each property has required fields
    const invalid = properties.filter(p => !p.name || !p.location);
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `${invalid.length} properties are missing required fields (name, location).` },
        { status: 400 }
      );
    }

    // Insert all at once
    const inserted = await Property.insertMany(properties, { ordered: false });

    revalidatePath('/properties');
    revalidatePath('/');

    await logAdminAction(req, 'Bulk Property Import', `${inserted.length} properties imported via bulk upload.`);

    return NextResponse.json({ success: true, inserted: inserted.length }, { status: 201 });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Bulk import failed.', detail: error.message }, { status: 500 });
  }
});
