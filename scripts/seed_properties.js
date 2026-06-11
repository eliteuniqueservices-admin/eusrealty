// Property seeding script: Inserts 10 high-quality Pune properties
// Run: node scripts/seed_properties.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Define Property schemas self-contained for simple Node script execution
const ConfigDetailSchema = new mongoose.Schema({
  type: { type: String },
  carpet: { type: String },
  price: { type: String }
}, { _id: false });

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  developer: { type: String },
  location: { type: String, required: true },
  rera: { type: String },
  possession: { type: String },
  status: { type: String },
  landParcel: { type: String },
  openSpace: { type: String },
  totalFloors: { type: String },
  floorBreakdown: { type: String },
  configurations: [{ type: String }],
  configDetails: [ConfigDetailSchema],
  description: { type: String },
  amenities: { type: String },
  usp: { type: String },
  launchYear: { type: String },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isSignature: { type: Boolean, default: false },
  isMandate: { type: Boolean, default: false }
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const properties = [
  {
    name: "Godrej Woodsville",
    developer: "Godrej Properties",
    location: "Hinjewadi, Pune",
    rera: "P52100046738",
    possession: "Dec 2026",
    status: "Under Construction",
    landParcel: "4.5 Acres",
    openSpace: "65%",
    totalFloors: "25",
    floorBreakdown: "2 Podium + 23 Floors",
    configurations: ["2BHK", "3BHK"],
    configDetails: [
      { type: "2BHK", carpet: "780 sqft", price: "1.2 Cr" },
      { type: "3BHK", carpet: "1050 sqft", price: "1.65 Cr" }
    ],
    description: "Premium green-inspired residential development in the heart of Hinjewadi Phase 1.",
    amenities: "Sky lounge, Swimming Pool, Gym, Organic garden, Kids play area",
    isFeatured: true,
    isSignature: false,
    isMandate: true,
    images: ["/uploads/1780825436591-Lara-Solitaire.avif"]
  },
  {
    name: "Karia Konark Vista",
    developer: "Karia Developers",
    location: "Magarpatta, Pune",
    rera: "P52100034190",
    possession: "Immediate",
    status: "Ready to Move",
    landParcel: "3 Acres",
    openSpace: "60%",
    totalFloors: "18",
    floorBreakdown: "1 Podium + 17 Floors",
    configurations: ["3BHK", "4BHK"],
    configDetails: [
      { type: "3BHK", carpet: "1650 sqft", price: "2.8 Cr" },
      { type: "4BHK", carpet: "2200 sqft", price: "3.9 Cr" }
    ],
    description: "Ultra-luxurious apartments overlooking the golf course at Magarpatta.",
    amenities: "Infinity Pool, Clubhouse, Private Elevators, Tennis Court",
    isFeatured: true,
    isSignature: true,
    isMandate: false,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "VTP Cygnus",
    developer: "VTP Realty",
    location: "Kharadi, Pune",
    rera: "P52100028755",
    possession: "Jun 2027",
    status: "New Launch",
    landParcel: "7 Acres",
    openSpace: "70%",
    totalFloors: "30",
    floorBreakdown: "3 Podium + 27 Floors",
    configurations: ["2BHK", "3BHK"],
    configDetails: [
      { type: "2BHK", carpet: "850 sqft", price: "1.45 Cr" },
      { type: "3BHK", carpet: "1150 sqft", price: "1.95 Cr" }
    ],
    description: "Smart homes featuring VTP's signature MLS (Maximum Living Space) design philosophy.",
    amenities: "Yoga deck, Jogging track, Olympic-size pool, Sports lounge",
    isFeatured: true,
    isSignature: false,
    isMandate: true,
    images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"]
  },
  {
    name: "Supreme Estia",
    developer: "Supreme Universal",
    location: "Baner, Pune",
    rera: "P52100022441",
    possession: "Immediate",
    status: "Ready to Move",
    landParcel: "5 Acres",
    openSpace: "65%",
    totalFloors: "22",
    floorBreakdown: "2 Podium + 20 Floors",
    configurations: ["3BHK", "4BHK"],
    configDetails: [
      { type: "3BHK", carpet: "1450 sqft", price: "2.35 Cr" },
      { type: "4BHK", carpet: "1980 sqft", price: "3.2 Cr" }
    ],
    description: "Luxury community in the high-street region of Baner with exquisite art deco architecture.",
    amenities: "Double-height lobby, Concierge, Swimming Pool, Squash Court",
    isFeatured: true,
    isSignature: true,
    isMandate: false,
    images: ["/uploads/1780825436591-Lara-Solitaire.avif"]
  },
  {
    name: "Pride World City",
    developer: "Pride Group",
    location: "Charholi, Pune",
    rera: "P52100001890",
    possession: "Dec 2028",
    status: "Under Construction",
    landParcel: "400 Acres",
    openSpace: "80%",
    totalFloors: "15",
    floorBreakdown: "Ground + 15 Floors",
    configurations: ["2BHK", "3BHK"],
    configDetails: [
      { type: "2BHK", carpet: "720 sqft", price: "0.85 Cr" },
      { type: "3BHK", carpet: "980 sqft", price: "1.15 Cr" }
    ],
    description: "Mega township featuring world-class amenities, school, shopping mall, and IT parks.",
    amenities: "Lakeview boardwalk, Clubhouse, Amphitheater, Skating rink",
    isFeatured: true,
    isSignature: false,
    isMandate: false,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Kasturi The Balmoral Riverside",
    developer: "Kasturi Builders",
    location: "Balewadi, Pune",
    rera: "P52100029310",
    possession: "Dec 2027",
    status: "Under Construction",
    landParcel: "6 Acres",
    openSpace: "75%",
    totalFloors: "28",
    floorBreakdown: "3 Basement + 25 Floors",
    configurations: ["3BHK", "4BHK"],
    configDetails: [
      { type: "3BHK", carpet: "1900 sqft", price: "4.2 Cr" },
      { type: "4BHK", carpet: "2600 sqft", price: "5.8 Cr" }
    ],
    description: "Super-premium waterfront residences in the elite Balewadi enclave, featuring global fixtures.",
    amenities: "Heated indoor pool, Wine cellar, Golf simulator, Wellness spa",
    isFeatured: true,
    isSignature: true,
    isMandate: true,
    images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"]
  },
  {
    name: "Rohan Ekam",
    developer: "Rohan Builders",
    location: "Balewadi, Pune",
    rera: "P52100045980",
    possession: "Jun 2028",
    status: "Pre-Launch",
    landParcel: "12 Acres",
    openSpace: "70%",
    totalFloors: "32",
    floorBreakdown: "2 Podium + 30 Floors",
    configurations: ["2BHK", "3BHK", "4BHK"],
    configDetails: [
      { type: "2BHK", carpet: "850 sqft", price: "1.38 Cr" },
      { type: "3BHK", carpet: "1200 sqft", price: "1.92 Cr" },
      { type: "4BHK", carpet: "1750 sqft", price: "2.75 Cr" }
    ],
    description: "Unique design centered around Rohan's signature PLUS homes: Perfect ventilation, Lively light, Utmost privacy, and Smart space.",
    amenities: "Hammock garden, Camping area, Gym, Coworking space",
    isFeatured: true,
    isSignature: false,
    isMandate: false,
    images: ["/uploads/1780825436591-Lara-Solitaire.avif"]
  },
  {
    name: "Gera World of Joy",
    developer: "Gera Developments",
    location: "Kharadi, Pune",
    rera: "P52100022490",
    possession: "Dec 2026",
    status: "Under Construction",
    landParcel: "20 Acres",
    openSpace: "75%",
    totalFloors: "22",
    floorBreakdown: "2 Podium + 20 Floors",
    configurations: ["2BHK", "3BHK"],
    configDetails: [
      { type: "2BHK", carpet: "810 sqft", price: "1.3 Cr" },
      { type: "3BHK", carpet: "1120 sqft", price: "1.8 Cr" }
    ],
    description: "Child-centric residences with training academies for sports, performing arts, and science.",
    amenities: "Sports academy, Music room, Dance studio, Wave pool, Skating rink",
    isFeatured: true,
    isSignature: false,
    isMandate: true,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Kolte Patil Life Republic",
    developer: "Kolte Patil",
    location: "Hinjewadi, Pune",
    rera: "P52100018765",
    possession: "Immediate",
    status: "Ready to Move",
    landParcel: "400 Acres",
    openSpace: "70%",
    totalFloors: "20",
    floorBreakdown: "Ground + 20 Floors",
    configurations: ["1BHK", "2BHK", "3BHK"],
    configDetails: [
      { type: "1BHK", carpet: "480 sqft", price: "0.52 Cr" },
      { type: "2BHK", carpet: "750 sqft", price: "0.82 Cr" },
      { type: "3BHK", carpet: "1050 sqft", price: "1.25 Cr" }
    ],
    description: "An expansive gated township project offering a complete ecosystem of convenience and security.",
    amenities: "Township park, Shopping plaza, Multi-specialty clinic, School",
    isFeatured: true,
    isSignature: false,
    isMandate: false,
    images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"]
  },
  {
    name: "Panchshil Trump Towers",
    developer: "Panchshil Realty",
    location: "Koregaon Park, Pune",
    rera: "P52100000001",
    possession: "Immediate",
    status: "Ready to Move",
    landParcel: "2.5 Acres",
    openSpace: "60%",
    totalFloors: "22",
    floorBreakdown: "Ground + 22 Floors",
    configurations: ["4BHK"],
    configDetails: [
      { type: "4BHK", carpet: "4400 sqft", price: "12.5 Cr" }
    ],
    description: "The epitome of ultra-luxury living. Sleek black glass facade with custom interiors by Matteo Nunziati.",
    amenities: "24/7 Concierge, Private Valet, Cigar Lounge, Temperature-controlled pool",
    isFeatured: true,
    isSignature: true,
    isMandate: true,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]
  }
];

async function seedProperties() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  console.log("\n--- Cleaning Existing Properties ---");
  const deleteResult = await Property.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} properties.`);

  console.log("\n--- Seeding 10 Properties ---");
  const insertResult = await Property.insertMany(properties);
  console.log(`Successfully seeded ${insertResult.length} properties!`);

  console.log("\n✅ Seeding completed successfully.");
  process.exit(0);
}

seedProperties().catch(err => {
  console.error("Database seed failed:", err);
  process.exit(1);
});
