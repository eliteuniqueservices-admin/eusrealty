import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

// GET /api/leads/crm-stats — CRM dashboard stats
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // Aggregate follow-up stats using $unwind on followUps array
    const allLeads = await Lead.find({}).lean();
    const totalLeads = allLeads.length;

    let overdueCount = 0;
    let dueTodayCount = 0;
    let upcomingWeekCount = 0;
    let completedThisWeekCount = 0;
    let noFollowUpCount = 0;

    // Pipeline stats
    const pipelineStats = {
      New: 0,
      Contacted: 0,
      Interested: 0,
      Escalated: 0,
      Converted: 0,
      Lost: 0,
      'Waiting for Sales Consultant': 0,
    };

    allLeads.forEach(lead => {
      // Pipeline
      if (pipelineStats[lead.status] !== undefined) {
        pipelineStats[lead.status]++;
      }

      const followUps = lead.followUps || [];
      const pendingFollowUps = followUps.filter(f => !f.completedAt);
      const completedFollowUps = followUps.filter(f => f.completedAt);

      if (pendingFollowUps.length === 0 && lead.status !== 'Converted' && lead.status !== 'Lost') {
        noFollowUpCount++;
      }

      pendingFollowUps.forEach(f => {
        const scheduledDate = new Date(f.scheduledAt);
        if (scheduledDate < todayStart) {
          overdueCount++;
        } else if (scheduledDate >= todayStart && scheduledDate < todayEnd) {
          dueTodayCount++;
        } else if (scheduledDate >= todayEnd && scheduledDate < weekEnd) {
          upcomingWeekCount++;
        }
      });

      completedFollowUps.forEach(f => {
        const completedDate = new Date(f.completedAt);
        if (completedDate >= weekStart && completedDate < todayEnd) {
          completedThisWeekCount++;
        }
      });
    });

    return NextResponse.json({
      totalLeads,
      overdueCount,
      dueTodayCount,
      upcomingWeekCount,
      completedThisWeekCount,
      noFollowUpCount,
      pipelineStats,
    });
  } catch (error) {
    console.error('CRM stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch CRM stats' }, { status: 500 });
  }
});
