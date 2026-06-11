import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';

// PUT update employee (admin only)
export const PUT = auth(async function PUT(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Employee update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update employee' }, { status: 500 });
  }
});

// DELETE employee (admin only)
export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Employee delete error:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
});
