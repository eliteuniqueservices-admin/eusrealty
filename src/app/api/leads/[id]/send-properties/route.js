import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Property from '@/models/Property';

// POST /api/leads/[id]/send-properties — Send property recommendations to a lead
export const POST = auth(async function POST(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { propertyIds, channel } = body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json({ error: 'propertyIds array is required' }, { status: 400 });
    }

    if (!channel || !['whatsapp', 'email'].includes(channel)) {
      return NextResponse.json({ error: 'Channel must be whatsapp or email' }, { status: 400 });
    }

    await dbConnect();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const properties = await Property.find({ _id: { $in: propertyIds } }).lean();
    if (properties.length === 0) {
      return NextResponse.json({ error: 'No valid properties found' }, { status: 404 });
    }

    const sentBy = req.auth.user?.name || 'Admin';

    if (channel === 'whatsapp') {
      // Build WhatsApp message
      let message = `Hi ${lead.name},\n\nWe have some exciting property recommendations for you:\n\n`;

      properties.forEach((prop, idx) => {
        const priceStr = prop.configDetails?.[0]?.price || 'Price on Request';
        const configs = prop.configurations?.join(', ') || 'N/A';
        message += `${idx + 1}. *${prop.name}*\n`;
        message += `📍 ${prop.location}\n`;
        message += `🏗️ ${prop.developer || 'Premium Developer'}\n`;
        message += `🏠 ${configs}\n`;
        message += `💰 ${priceStr}\n`;
        if (prop.possession) message += `📅 Possession: ${prop.possession}\n`;
        message += `\n`;
      });

      message += `For more details, visit: https://eusrealty.co.in/properties\n\n`;
      message += `Best Regards,\nEUS Realty Team`;

      // Clean phone number for wa.me
      const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
      const whatsappPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

      // Record properties sent
      properties.forEach(prop => {
        lead.propertiesSent.push({
          propertyId: prop._id,
          propertyName: prop.name,
          channel: 'whatsapp',
          sentAt: new Date(),
          sentBy,
        });
      });

      lead.lastContactedAt = new Date();
      await lead.save();

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        waUrl,
        propertiesSent: properties.length,
      });
    }

    if (channel === 'email') {
      if (!lead.email) {
        return NextResponse.json({ error: 'Lead does not have an email address' }, { status: 400 });
      }

      // Build email HTML
      const propertyCards = properties.map(prop => {
        const priceStr = prop.configDetails?.[0]?.price || 'Price on Request';
        const configs = prop.configurations?.join(', ') || 'N/A';
        const imgSrc = prop.images?.[0]
          ? (prop.images[0].startsWith('http') ? prop.images[0] : `https://eusrealty.co.in${prop.images[0]}`)
          : 'https://eusrealty.co.in/placeholder-property.jpg';

        return `
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px; background: #ffffff;">
            <img src="${imgSrc}" alt="${prop.name}" style="width: 100%; height: 200px; object-fit: cover;" />
            <div style="padding: 20px;">
              <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">${prop.name}</h3>
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">📍 ${prop.location} | 🏗️ ${prop.developer || ''}</p>
              <p style="margin: 0 0 4px 0; color: #334155; font-size: 14px;">🏠 Configurations: ${configs}</p>
              <p style="margin: 0 0 4px 0; color: #f59e0b; font-weight: bold; font-size: 16px;">💰 ${priceStr}</p>
              ${prop.possession ? `<p style="margin: 0; color: #64748b; font-size: 13px;">📅 Possession: ${prop.possession}</p>` : ''}
            </div>
          </div>
        `;
      }).join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
              <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center;">
                <h1 style="color: #f59e0b; margin: 0; font-size: 22px;">🏠 Property Recommendations</h1>
                <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Handpicked just for you, ${lead.name}</p>
              </div>
              <div style="padding: 24px;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                  Based on your preferences, we've selected the following properties we think you'll love:
                </p>
                ${propertyCards}
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://eusrealty.co.in/properties" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px;">
                    View All Properties →
                  </a>
                </div>
              </div>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Sent by EUS Realty | Premium Real Estate Consultancy</p>
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"EUS Realty" <${process.env.GMAIL_USER}>`,
          to: lead.email,
          subject: `🏠 Property Recommendations for You — ${properties.map(p => p.name).join(', ')}`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error('Failed to send property email:', emailErr);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }

      // Record properties sent
      properties.forEach(prop => {
        lead.propertiesSent.push({
          propertyId: prop._id,
          propertyName: prop.name,
          channel: 'email',
          sentAt: new Date(),
          sentBy,
        });
      });

      lead.lastContactedAt = new Date();
      await lead.save();

      return NextResponse.json({
        success: true,
        channel: 'email',
        emailSentTo: lead.email,
        propertiesSent: properties.length,
      });
    }
  } catch (error) {
    console.error('Send properties error:', error);
    return NextResponse.json({ error: 'Failed to send properties' }, { status: 500 });
  }
});
