import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import Lead from '@/models/Lead';
import Notification from '@/models/Notification';
import { generateChatResponse } from '@/lib/gemini';
import { calculateLeadScore, mergLeadData, detectEscalation } from '@/lib/leadScoring';

// ─────────────────────────────────────────────────────────────
// POST /api/chat — Main AI chat endpoint
// ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { message, sessionId: clientSessionId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await dbConnect();

    // Get or create session
    const sessionId = clientSessionId || uuidv4();
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({ sessionId, messages: [], leadData: {}, source: 'chatbot' });
    }

    // Append user message to history
    session.messages.push({ role: 'user', content: message.trim() });

    // Build history for Gemini (last 12 messages, exclude current)
    const historyForAI = session.messages.slice(0, -1).slice(-12).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call Gemini AI
    let aiText = '';
    let extractedLead = null;
    let chips = [];

    try {
      const aiResponse = await generateChatResponse(historyForAI, message.trim());
      aiText = aiResponse.text;
      extractedLead = aiResponse.extractedLead;
      chips = aiResponse.chips || [];
    } catch (aiErr) {
      console.error('Gemini API error:', aiErr.message);
      // Fall back to a generic helpful response
      aiText = "I'm having a small hiccup right now! 🙏 Please try again in a moment, or reach us directly:\n📞 +91 7620733613\n📧 eliteuniqueservices@gmail.com";
      chips = ["📞 Call us", "📋 Request callback"];
    }

    // Save AI reply to history
    session.messages.push({ role: 'model', content: aiText });

    // ── Lead data extraction & scoring ──
    if (extractedLead) {
      // Also check the raw message for site visit / callback signals
      if (detectEscalation(message)) {
        extractedLead.siteVisitRequested = true;
      }
      if (message.toLowerCase().includes('callback') || message.toLowerCase().includes('call back') || message.toLowerCase().includes('call me')) {
        extractedLead.callbackRequested = true;
      }

      const newLeadData = mergLeadData(session.leadData || {}, extractedLead);
      session.leadData = newLeadData;
    }

    // Recalculate score
    const { score, quality } = calculateLeadScore(session.leadData || {});
    session.leadScore = score;
    session.leadQuality = quality;

    // Detect escalation
    if (detectEscalation(message) && session.status !== 'Escalated') {
      session.status = 'Escalated';
    }

    // ── Auto-create or update Lead if score threshold met ──
    const isLeadQualified = score >= 35 && session.leadData?.phone;

    if (isLeadQualified) {
      if (!session.leadId) {
        // Create new Lead document
        try {
          const newLead = await Lead.create({
            name: session.leadData.name || 'Chat Lead',
            phone: session.leadData.phone,
            email: session.leadData.email || '',
            budget: session.leadData.budget || '',
            preferredLocation: session.leadData.preferredLocation || '',
            propertyType: session.leadData.propertyType || '',
            possession: session.leadData.possession || '',
            leadScore: score,
            leadQuality: quality,
            status: session.status === 'Escalated' ? 'Escalated' : 'New',
            source: 'chatbot',
            sessionId,
            siteVisitRequested: session.leadData.siteVisitRequested || false,
            callbackRequested: session.leadData.callbackRequested || false,
          });
          session.leadId = newLead._id;

          // Create admin notification
          await Notification.create({
            title: `${quality === 'Hot' ? '🔥 Hot' : quality === 'Warm' ? '🟡 Warm' : '❄️ Cold'} Lead: ${newLead.name || 'New Chat Lead'}`,
            message: `${newLead.name || 'Someone'} (${newLead.phone}) is interested in ${newLead.preferredLocation || 'Pune'} — Budget: ${newLead.budget || 'Not specified'}`,
            type: quality === 'Hot' ? 'hot_lead' : 'lead',
            isRead: false,
            relatedId: newLead._id.toString(),
            relatedModel: 'Lead',
            icon: quality === 'Hot' ? '🔥' : quality === 'Warm' ? '🟡' : '🏠',
          });
        } catch (leadErr) {
          console.error('Lead creation error:', leadErr.message);
        }
      } else {
        // Update existing Lead
        await Lead.findByIdAndUpdate(session.leadId, {
          name: session.leadData.name || undefined,
          phone: session.leadData.phone,
          email: session.leadData.email || undefined,
          budget: session.leadData.budget || undefined,
          preferredLocation: session.leadData.preferredLocation || undefined,
          propertyType: session.leadData.propertyType || undefined,
          possession: session.leadData.possession || undefined,
          leadScore: score,
          leadQuality: quality,
          siteVisitRequested: session.leadData.siteVisitRequested || false,
          callbackRequested: session.leadData.callbackRequested || false,
          ...(session.status === 'Escalated' ? { status: 'Escalated' } : {}),
        });
      }
    }

    // Save session
    await session.save();

    return NextResponse.json({
      reply: aiText,
      sessionId,
      chips,
      leadScore: score,
      leadQuality: quality,
      isEscalated: session.status === 'Escalated',
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/chat?sessionId=xxx — Fetch session history
// ─────────────────────────────────────────────────────────────
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ messages: [] });
    }

    await dbConnect();
    const session = await ChatSession.findOne({ sessionId }).select('messages leadData leadScore leadQuality status');

    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      messages: session.messages,
      leadData: session.leadData,
      leadScore: session.leadScore,
      leadQuality: session.leadQuality,
      status: session.status,
    });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ messages: [] });
  }
}
