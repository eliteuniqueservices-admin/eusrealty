import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// GET /api/chat/sessions/[id] — Get full session transcript
export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const session = await ChatSession.findOne({ sessionId: id }).lean();
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Session GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
});

// PATCH /api/chat/sessions/[id] — Update session status
export const PATCH = auth(async function PATCH(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    await dbConnect();
    const session = await ChatSession.findOneAndUpdate(
      { sessionId: id },
      { ...(status ? { status } : {}) },
      { new: true }
    );

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Session PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
});
