import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { auth } from '@/auth';

const MOCK_PROPERTIES = [
  {
    _id: "mock1",
    name: "Omega Retreat (Phase 2)",
    developer: "Omega Developers",
    location: "Wakad, Pune",
    rera: "P52100012345",
    possession: "Immediate",
    status: "Ready to Move",
    landParcel: "3 Acres",
    openSpace: "60%",
    totalFloors: "15",
    floorBreakdown: "1 Podium + 14 Floors",
    configurations: ["3BHK"],
    configDetails: [{ type: "3BHK", carpet: "1450 sqft", price: "2.5 Cr" }],
    description: "Premium luxury apartments with modern amenities in Wakad.",
    amenities: "Swimming Pool, Gym, Clubhouse, Security",
    images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"],
    isFeatured: true
  },
  {
    _id: "mock2",
    name: "Lara Solitaire",
    developer: "Lara Group",
    location: "Baner, Pune",
    rera: "P52100054321",
    possession: "Dec 2026",
    status: "Under Construction",
    landParcel: "5 Acres",
    openSpace: "70%",
    totalFloors: "22",
    floorBreakdown: "2 Podium + 20 Floors",
    configurations: ["4BHK"],
    configDetails: [{ type: "4BHK", carpet: "2100 sqft", price: "4.2 Cr" }],
    description: "Spacious premium apartments in the prime IT corridor of Baner.",
    amenities: "Swimming Pool, Gym, Children Play Area, Power Backup",
    images: ["/uploads/1780825436591-Lara-Solitaire.avif"],
    isFeatured: true
  },
  {
    _id: "mock3",
    name: "Skyline Villas",
    developer: "Skyline Group",
    location: "Koregaon Park, Pune",
    rera: "P52100099999",
    possession: "Jun 2027",
    status: "New Launch",
    landParcel: "10 Acres",
    openSpace: "80%",
    totalFloors: "3",
    floorBreakdown: "Ground + 2 Floors",
    configurations: ["5BHK"],
    configDetails: [{ type: "5BHK", carpet: "4500 sqft", price: "8.9 Cr" }],
    description: "Super-luxury boutique villas in the leafy green lanes of Koregaon Park.",
    amenities: "Gym, Clubhouse, Garden, Security, Swimming Pool",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"],
    isFeatured: true
  }
];

export async function GET() {
  try {
    await dbConnect();
    const properties = await Property.find({}).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.warn('Properties database fetch failed. Returning mock fallback properties.', error.message);
    return NextResponse.json(MOCK_PROPERTIES);
  }
}

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    const property = await Property.create(data);

    // Send New Property Alert to Subscribers
    try {
      const Subscriber = (await import('@/models/Subscriber')).default;
      const activeSubscribers = await Subscriber.find({ status: 'Active' });
      
      if (activeSubscribers.length > 0) {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const emails = activeSubscribers.map(sub => sub.email);
        
        const priceString = property.configDetails?.[0]?.price ? `Starting at ${property.configDetails[0].price}` : 'Price on Request';

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8" /></head>
            <body style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="background: #0f172a; padding: 30px; text-align: center;">
                  <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">New Premium Property Alert</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #0f172a; margin-top: 0;">${property.name}</h2>
                  <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">📍 ${property.location} | 🏢 By ${property.developer}</p>
                  
                  <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="margin: 0; font-size: 16px; color: #0f172a;"><strong>Configurations:</strong> ${property.configurations?.join(', ')}</p>
                    <p style="margin: 10px 0 0 0; font-size: 16px; color: #f59e0b; font-weight: bold;">${priceString}</p>
                  </div>
                  
                  <p style="color: #334155; line-height: 1.6;">${property.description || 'Explore our newest luxury addition in Pune. Designed for premium living.'}</p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://eusrealty.com/properties" style="display: inline-block; background: #f59e0b; color: #0f172a; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Details</a>
                  </div>
                </div>
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">You are receiving this because you subscribed to EUS Realty updates.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"EUS Realty" <${process.env.GMAIL_USER}>`,
          bcc: emails, // Send as BCC for privacy
          subject: `New Luxury Property: ${property.name} in ${property.location}`,
          html: emailHtml,
        });
      }
    } catch (err) {
      console.error('Failed to send subscriber alerts:', err);
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
});
