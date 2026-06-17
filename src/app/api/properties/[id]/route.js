import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { auth } from '@/auth';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export const PUT = auth(async function PUT(req, { params }) {
  try {
    if (!req.auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    const property = await Property.findByIdAndUpdate(id, data, { new: true });
    
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    
    // Trigger cache revalidation
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/');

    await logAdminAction(req, 'Property Updated', `Property "${property.name}" (ID: ${id}) updated.`);
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    if (!req.auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const property = await Property.findByIdAndDelete(id);
    
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    
    // Trigger cache revalidation
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/');

    await logAdminAction(req, 'Property Deleted', `Property "${property.name}" (ID: ${id}) deleted.`);
    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
});
