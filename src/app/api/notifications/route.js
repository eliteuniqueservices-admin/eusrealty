import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET /api/notifications — Admin: get all/unread notifications
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    await dbConnect();

    const query = unreadOnly ? { isRead: false } : {};
    const list = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({ isRead: false });

    return NextResponse.json({
      notifications: list,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
});

// PATCH /api/notifications — Admin: mark a specific notification or all notifications as read
export const PATCH = auth(async function PATCH(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, all } = body;

    await dbConnect();

    if (all) {
      await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Notification ID or "all" flag is required' }, { status: 400 });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Notification PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
});
