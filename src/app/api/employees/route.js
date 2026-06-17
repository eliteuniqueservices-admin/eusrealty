import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { logAdminAction } from '@/lib/audit';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';

// GET all employees (admin only)
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Employees fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
});

// POST create employee (admin only)
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const data = await req.json();

    if (!data.name || !data.email || !data.mobile || !data.department || !data.designation) {
      return NextResponse.json({ error: 'Missing required fields: name, email, mobile, department, designation' }, { status: 400 });
    }

    const employee = await Employee.create(data);
    await logAdminAction(req, 'Employee Registered', `Employee "${employee.name}" (${employee.email}) registered.`);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Employee create error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'An employee with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create employee' }, { status: 500 });
  }
});
