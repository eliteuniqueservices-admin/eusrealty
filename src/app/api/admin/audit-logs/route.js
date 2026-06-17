import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = req.auth.user?.role || req.auth.role;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Administrative role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');

    await dbConnect();

    const total = await AuditLog.countDocuments({});
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Audit logs retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs.' }, { status: 500 });
  }
});
