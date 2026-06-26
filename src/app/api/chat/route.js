import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import Lead from '@/models/Lead';
import Notification from '@/models/Notification';
import Property from '@/models/Property';
import { getPropertySlug } from '@/lib/propertyUrls';
import { generateChatResponse } from '@/lib/gemini';
import { calculateLeadScore, mergLeadData, detectEscalation } from '@/lib/leadScoring';
import { getLocalFallbackReply } from '@/lib/localIntents';

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

    // Fetch live properties from database for inventory-based AI matching
    const dbProperties = await Property.find({}).lean();
    const inventory = dbProperties.map((p) => {
      const priceVal = p.configDetails?.[0]?.price || "Call";
      const carpetVal = p.configDetails?.[0]?.carpet || "1500 sqft";
      const bhkVal = p.configDetails?.[0]?.type || "3BHK";
      return {
        name: p.name,
        slug: getPropertySlug(p),
        location: p.location,
        developer: p.developer || "Premium Builder",
        priceRange: priceVal,
        bhkOptions: bhkVal,
        carpetArea: carpetVal,
        status: p.status || "Premium",
        rera: p.rera || "Verified",
        description: p.description || ""
      };
    });

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
    let rawMatches = [];
    let handover = null;

    try {
      const aiResponse = await generateChatResponse(historyForAI, message.trim(), inventory);
      aiText = aiResponse.text;
      extractedLead = aiResponse.extractedLead;
      chips = aiResponse.chips || [];
      rawMatches = aiResponse.matches || [];
      handover = aiResponse.handover || null;
    } catch (aiErr) {
      console.error('Gemini API error:', aiErr.message);
      
      // Attempt local fallback matching if Gemini is rate-limited or offline
      const localMatch = getLocalFallbackReply(message.trim(), inventory);
      if (localMatch) {
        aiText = localMatch.reply;
        chips = localMatch.chips;
        rawMatches = localMatch.matches || [];
      } else {
        // Fall back to a generic helpful response
        aiText = "I'm having a small hiccup right now! 🙏 Please try again in a moment, or reach us directly:\n📞 +91 7620733613\n📧 eliteuniqueservices@gmail.com";
        chips = ["📞 Call us", "📋 Request callback"];
      }
    }

    // Gather full database documents for matches
    const matchedProperties = [];
    for (const slug of rawMatches) {
      const matchDoc = dbProperties.find(p => getPropertySlug(p) === slug);
      if (matchDoc) {
        const priceVal = matchDoc.configDetails?.[0]?.price || "Call";
        const carpetVal = matchDoc.configDetails?.[0]?.carpet || "1500";
        const areaParsed = parseInt(carpetVal.replace(/[^\d]/g, "")) || 1500;
        const configType = matchDoc.configDetails?.[0]?.type || matchDoc.configurations?.[0] || "3BHK";
        const bhkParsed = parseInt(configType.replace(/[^\d]/g, "")) || 3;
        const imageVal = matchDoc.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

        matchedProperties.push({
          _id: matchDoc._id.toString(),
          name: matchDoc.name,
          location: matchDoc.location,
          price: priceVal,
          bhk: bhkParsed,
          baths: bhkParsed,
          area: areaParsed,
          image: imageVal,
          badge: matchDoc.status || "Premium",
          rera: matchDoc.rera || "Verified",
          slug: slug
        });
      }
    }

    // Save AI reply to history
    session.messages.push({ role: 'model', content: aiText, matches: matchedProperties });

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

    // Handover processing details
    let handoverRequested = false;
    let telegramHandover = false;
    let telegramUsername = '';
    let reasonForEscalation = '';
    let priority = '';
    let requiredAction = '';
    let conversationSummary = '';

    if (handover) {
      handoverRequested = !!handover.handoverRequested;
      telegramHandover = !!handover.telegramHandover;
      telegramUsername = handover.telegramUsername || '';
      reasonForEscalation = handover.reasonForEscalation || '';
      priority = handover.priority || '';
      requiredAction = handover.requiredAction || '';
      conversationSummary = handover.conversationSummary || '';
      
      if (handoverRequested) {
        session.status = 'Escalated';
      }
    }

    // Detect basic local triggers in message if Gemini is down/limited
    if (!handoverRequested && detectEscalation(message)) {
      const lower = message.toLowerCase();
      if (lower.includes('human') || lower.includes('speak to agent') || lower.includes('speak to someone') || lower.includes('sales team') || lower.includes('speak')) {
        handoverRequested = true;
        session.status = 'Escalated';
        reasonForEscalation = "Customer explicitly requested live agent assistance.";
        priority = "High";
        requiredAction = "Contact client immediately to assist with property inquiry.";
      }
    }

    // ── Auto-create or update Lead if score threshold met OR human handover requested ──
    const isLeadQualified = (score >= 35 && session.leadData?.phone) || handoverRequested;

    if (isLeadQualified) {
      const statusToSet = handoverRequested ? 'Waiting for Sales Consultant' : (session.status === 'Escalated' ? 'Escalated' : 'New');

      const leadDataToSave = {
        name: session.leadData.name || 'Chat Lead',
        phone: session.leadData.phone || 'Not Provided',
        email: session.leadData.email || '',
        telegramUsername: telegramUsername || '',
        budget: session.leadData.budget || '',
        preferredLocation: session.leadData.preferredLocation || '',
        propertyType: session.leadData.propertyType || '',
        possession: session.leadData.possession || '',
        leadScore: score,
        leadQuality: quality,
        status: statusToSet,
        source: 'chatbot',
        sessionId,
        siteVisitRequested: session.leadData.siteVisitRequested || false,
        callbackRequested: session.leadData.callbackRequested || false,
        conversationSummary: conversationSummary || undefined,
        reasonForEscalation: reasonForEscalation || undefined,
        priority: priority || undefined,
        requiredAction: requiredAction || undefined,
      };

      if (!session.leadId) {
        // Create new Lead document
        try {
          const newLead = await Lead.create(leadDataToSave);
          session.leadId = newLead._id;

          // Create admin notification
          await Notification.create({
            title: handoverRequested ? `🚨 Handover Lead: ${newLead.name}` : `${quality === 'Hot' ? '🔥 Hot' : quality === 'Warm' ? '🟡 Warm' : '❄️ Cold'} Lead: ${newLead.name}`,
            message: handoverRequested
              ? `${newLead.name} needs human assistance — Status: Waiting for Sales Consultant`
              : `${newLead.name} (${newLead.phone}) is interested in ${newLead.preferredLocation || 'Pune'}`,
            type: handoverRequested ? 'hot_lead' : (quality === 'Hot' ? 'hot_lead' : 'lead'),
            isRead: false,
            relatedId: newLead._id.toString(),
            relatedModel: 'Lead',
            icon: handoverRequested ? '🚨' : (quality === 'Hot' ? '🔥' : '🏠'),
          });
        } catch (leadErr) {
          console.error('Lead creation error:', leadErr.message);
        }
      } else {
        // Update existing Lead
        try {
          await Lead.findByIdAndUpdate(session.leadId, leadDataToSave);
        } catch (updateErr) {
          console.error('Lead update error:', updateErr.message);
        }
      }
    }

    // ── Send Telegram Notifications if human handover requested ──
    if (handoverRequested) {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatIds = [process.env.TELEGRAM_CHAT_ID, process.env.TELEGRAM_SALES_CHAT_ID].filter(Boolean);

      if (telegramBotToken && telegramChatIds.length > 0) {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        
        const telegramMessage = 
          `🚨 <b>HUMAN HANDOVER REQUESTED</b> 🚨\n\n` +
          `👤 <b>Name:</b> ${session.leadData.name || 'Chat Lead'}\n` +
          `📞 <b>Phone:</b> ${session.leadData.phone || 'Not Provided'}\n` +
          `📧 <b>Email:</b> ${session.leadData.email || 'N/A'}\n` +
          (telegramUsername ? `✈️ <b>Telegram Username:</b> ${telegramUsername}\n` : '') +
          `💰 <b>Budget:</b> ${session.leadData.budget || 'Not specified'}\n` +
          `📍 <b>Location:</b> ${session.leadData.preferredLocation || 'Not specified'}\n` +
          `🏢 <b>Prop Type:</b> ${session.leadData.propertyType || 'Not specified'}\n` +
          `🔑 <b>Possession:</b> ${session.leadData.possession || 'Not specified'}\n` +
          `🎯 <b>Escalation Reason:</b> ${reasonForEscalation || 'General Handover Request'}\n` +
          `⚠️ <b>Priority:</b> ${priority || 'Medium'}\n` +
          `⚡ <b>Required Action:</b> ${requiredAction || 'Contact client immediately'}\n\n` +
          `📝 <b>Conversation Summary:</b>\n${conversationSummary || 'No summary available.'}\n\n` +
          `🕐 <b>Timestamp:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

        for (const chatId of telegramChatIds) {
          try {
            const tgRes = await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'HTML'
              })
            });
            if (tgRes.ok) {
              const tgData = await tgRes.json();
              if (tgData.ok && tgData.result && tgData.result.message_id) {
                if (!session.telegramMessageMappings) {
                  session.telegramMessageMappings = [];
                }
                session.telegramMessageMappings.push({
                  chatId: Number(chatId),
                  messageId: Number(tgData.result.message_id)
                });
              }
            }
          } catch (err) {
            console.error(`Telegram handover alert failed for chat ID ${chatId}:`, err.message);
          }
        }
      }
    }

    // Save session
    await session.save();

    return NextResponse.json({
      reply: aiText,
      sessionId,
      chips,
      matches: matchedProperties,
      leadScore: score,
      leadQuality: quality,
      isEscalated: session.status === 'Escalated',
      isHandoverRequested: handoverRequested,
      isTelegramHandover: telegramHandover,
      telegramUsername: telegramUsername,
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
