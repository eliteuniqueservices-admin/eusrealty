import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// GET /api/chat/sessions — Admin: list all chat sessions
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const quality = searchParams.get('quality'); // Hot, Warm, Cold
    const status = searchParams.get('status'); // Active, Escalated, Closed

    await dbConnect();

    const filter = {};
    if (quality) filter.leadQuality = quality;
    if (status) filter.status = status;

    const total = await ChatSession.countDocuments(filter);
    const sessions = await ChatSession.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('sessionId leadData leadScore leadQuality status messages updatedAt createdAt leadId')
      .lean();

    // Add message count and last message preview
    const enriched = sessions.map(s => ({
      ...s,
      messageCount: s.messages?.length || 0,
      lastMessage: s.messages?.length > 0 ? s.messages[s.messages.length - 1].content.substring(0, 100) : '',
      messages: undefined, // don't send full messages in list
    }));

    return NextResponse.json({ sessions: enriched, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Sessions GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
});
