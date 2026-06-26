import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// POST /api/telegram-webhook — Handler for Telegram webhook updates
export async function POST(req) {
  try {
    const update = await req.json();

    // Check if the update is a message and a reply to another message
    if (update.message && update.message.reply_to_message) {
      const replyToMsg = update.message.reply_to_message;
      const originalMessageId = replyToMsg.message_id;
      const chatId = update.message.chat.id;
      const replyText = update.message.text;
      const senderName = update.message.from?.first_name || 'Consultant';

      if (!replyText || replyText.trim().length === 0) {
        return NextResponse.json({ ok: true });
      }

      await dbConnect();

      // Find the session that has this specific notification message ID mapped
      const session = await ChatSession.findOne({
        telegramMessageMappings: {
          $elemMatch: {
            chatId: Number(chatId),
            messageId: Number(originalMessageId)
          }
        }
      });

      if (session) {
        // Relay the consultant's message back to the session messages
        // Format it with a bold consultant name prefix
        session.messages.push({
          role: 'model',
          content: `👨‍💼 *${senderName}*: ${replyText.trim()}`
        });

        await session.save();

        // Send an acknowledgment reply back to the Telegram chat
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        if (telegramBotToken) {
          const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
          try {
            await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `✅ <b>Relayed to client chat</b>`,
                reply_to_message_id: update.message.message_id,
                parse_mode: 'HTML'
              })
            });
          } catch (err) {
            console.error('Failed to send Telegram acknowledgment:', err);
          }
        }

        console.log(`Relayed message from Telegram user ${senderName} to chat session ${session.sessionId}`);
      } else {
        console.log(`No active chat session found matching messageId ${originalMessageId} and chatId ${chatId}`);
      }
    }

    // Always return 200 OK so Telegram stops retrying this update
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
