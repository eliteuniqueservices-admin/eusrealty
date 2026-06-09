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
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
});
