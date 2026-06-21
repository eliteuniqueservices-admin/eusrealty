export const SITE_URL = "https://eusrealty.co.in";

export const localityMetrics = {
  baner: {
    name: "Baner",
    region: "West Pune",
    avgPrice: "Rs. 8,500 - Rs. 12,500 / sqft",
    rating: "4.7",
    yearlyGrowth: "+8.4%",
    rentalYield: "3.4% - 4.1%",
    buyerProfile: "Premium families, IT leaders, investors",
    nearbyIT: "Hinjawadi IT Park, Baner-Balewadi offices",
    metro: "Hinjawadi-Shivajinagar Metro corridor access",
  },
  wakad: {
    name: "Wakad",
    region: "West Pune",
    avgPrice: "Rs. 7,000 - Rs. 9,500 / sqft",
    rating: "4.6",
    yearlyGrowth: "+7.9%",
    rentalYield: "3.6% - 4.3%",
    buyerProfile: "IT professionals and young families",
    nearbyIT: "Hinjawadi Phase 1, 2 and 3",
    metro: "Metro corridor influence and expressway access",
  },
  hinjawadi: {
    name: "Hinjawadi",
    region: "West Pune",
    avgPrice: "Rs. 6,800 - Rs. 8,800 / sqft",
    rating: "4.5",
    yearlyGrowth: "+9.1%",
    rentalYield: "3.8% - 4.8%",
    buyerProfile: "Tech professionals and rental investors",
    nearbyIT: "Rajiv Gandhi Infotech Park",
    metro: "Metro Line 3 improves city connectivity",
  },
  tathawade: {
    name: "Tathawade",
    region: "West Pune",
    avgPrice: "Rs. 6,500 - Rs. 8,500 / sqft",
    rating: "4.4",
    yearlyGrowth: "+8.1%",
    rentalYield: "3.3% - 4.0%",
    buyerProfile: "First-time buyers and education corridor investors",
    nearbyIT: "Hinjawadi and PCMC employment belt",
    metro: "Highway and BRTS-led connectivity",
  },
  aundh: {
    name: "Aundh",
    region: "Central-West Pune",
    avgPrice: "Rs. 10,500 - Rs. 14,500 / sqft",
    rating: "4.6",
    yearlyGrowth: "+6.8%",
    rentalYield: "2.8% - 3.5%",
    buyerProfile: "End users, HNW families, established buyers",
    nearbyIT: "Baner, University Road, Shivajinagar offices",
    metro: "Strong road connectivity to central Pune",
  },
  balewadi: {
    name: "Balewadi",
    region: "West Pune",
    avgPrice: "Rs. 9,000 - Rs. 13,000 / sqft",
    rating: "4.7",
    yearlyGrowth: "+8.7%",
    rentalYield: "3.2% - 4.0%",
    buyerProfile: "Luxury buyers and High Street lifestyle seekers",
    nearbyIT: "Baner, Hinjawadi, Balewadi High Street",
    metro: "Close to proposed West Pune metro influence zones",
  },
  pimpri: {
    name: "Pimpri",
    region: "PCMC",
    avgPrice: "Rs. 6,000 - Rs. 8,300 / sqft",
    rating: "4.2",
    yearlyGrowth: "+6.9%",
    rentalYield: "3.4% - 4.2%",
    buyerProfile: "Industrial belt professionals and budget buyers",
    nearbyIT: "PCMC offices, Chinchwad MIDC, Hinjawadi access",
    metro: "Pune Metro PCMC corridor",
  },
  chinchwad: {
    name: "Chinchwad",
    region: "PCMC",
    avgPrice: "Rs. 6,200 - Rs. 8,700 / sqft",
    rating: "4.3",
    yearlyGrowth: "+7.2%",
    rentalYield: "3.4% - 4.1%",
    buyerProfile: "Families, PCMC professionals, value investors",
    nearbyIT: "PCMC, Talawade IT Park, Hinjawadi via expressway",
    metro: "PCMC metro access and highway connectivity",
  },
};

export const popularSearchLinks = [
  { label: "2 BHK flats in Baner Pune", href: "/properties/2-bhk-flats-in-baner-pune" },
  { label: "3 BHK flats in Wakad Pune", href: "/properties/3-bhk-flats-in-wakad-pune" },
  { label: "Flats under 1 Cr in Hinjawadi", href: "/properties/flats-under-1-cr-in-hinjawadi" },
  { label: "Ready to move flats in Pune", href: "/properties/ready-to-move-flats-in-pune" },
  { label: "New launch projects in Pune", href: "/properties/new-launch-projects-in-pune" },
  { label: "RERA approved projects in Pune", href: "/properties/rera-approved-projects-in-pune" },
  { label: "Luxury flats in Baner", href: "/properties/luxury-flats-in-baner" },
  { label: "No brokerage flats in Pune", href: "/properties/no-brokerage-flats-in-pune" },
];

export const seoLandingPages = {
  "2-bhk-flats-in-baner-pune": {
    title: "2 BHK Flats for Sale in Baner Pune",
    h1: "2 BHK Flats for Sale in Baner Pune",
    description: "Explore RERA-verified 2 BHK flats in Baner, Pune with zero brokerage, direct-builder pricing, possession timelines, and expert site visit support.",
    filters: { bhk: "2", locality: "Baner" },
    keywords: ["2 BHK flats in Baner Pune", "zero brokerage flats Baner", "RERA approved 2 BHK Baner"],
  },
  "3-bhk-flats-in-wakad-pune": {
    title: "3 BHK Flats for Sale in Wakad Pune",
    h1: "3 BHK Flats for Sale in Wakad Pune",
    description: "Compare premium 3 BHK flats in Wakad, Pune near Hinjawadi IT Park with verified RERA details, carpet area, possession, and site visit support.",
    filters: { bhk: "3", locality: "Wakad" },
    keywords: ["3 BHK flats in Wakad Pune", "Wakad family apartments", "flats near Hinjawadi IT Park"],
  },
  "flats-under-1-cr-in-hinjawadi": {
    title: "Flats Under 1 Cr in Hinjawadi Pune",
    h1: "Flats Under 1 Cr in Hinjawadi Pune",
    description: "Find budget-friendly flats under Rs. 1 Cr in Hinjawadi, Pune with RERA verification, IT corridor connectivity, and zero brokerage advisory.",
    filters: { locality: "Hinjawadi", maxCr: 1 },
    keywords: ["flats under 1 crore Hinjawadi", "budget flats Hinjawadi", "IT park flats Pune"],
  },
  "ready-to-move-flats-in-pune": {
    title: "Ready to Move Flats for Sale in Pune",
    h1: "Ready to Move Flats for Sale in Pune",
    description: "Browse ready-to-move flats in Pune with verified possession, RERA details, direct-builder inventory, and zero brokerage buying support.",
    filters: { status: "Ready to Move" },
    keywords: ["ready to move flats in Pune", "immediate possession flats Pune", "RERA ready homes Pune"],
  },
  "new-launch-projects-in-pune": {
    title: "New Launch Projects in Pune",
    h1: "New Launch Projects in Pune",
    description: "Discover new launch and pre-launch residential projects in Pune with early pricing, floor-plan access, and EUS Realty site visit assistance.",
    filters: { status: "New Launch" },
    keywords: ["new launch projects in Pune", "pre launch projects Pune", "upcoming flats Pune"],
  },
  "rera-approved-projects-in-pune": {
    title: "RERA Approved Projects in Pune",
    h1: "RERA Approved Projects in Pune",
    description: "Explore RERA-approved residential projects in Pune listed by a MahaRERA registered channel partner with verified developer and possession details.",
    filters: { reraOnly: true },
    keywords: ["RERA approved projects in Pune", "MahaRERA flats Pune", "verified properties Pune"],
  },
  "luxury-flats-in-baner": {
    title: "Luxury Flats for Sale in Baner Pune",
    h1: "Luxury Flats for Sale in Baner Pune",
    description: "Compare luxury flats in Baner, Pune with premium amenities, spacious carpet areas, RERA verification, and direct-builder pricing.",
    filters: { locality: "Baner", luxury: true },
    keywords: ["luxury flats in Baner", "premium apartments Baner Pune", "Baner luxury homes"],
  },
  "no-brokerage-flats-in-pune": {
    title: "No Brokerage Flats for Sale in Pune",
    h1: "No Brokerage Flats for Sale in Pune",
    description: "Buy flats in Pune with zero brokerage through EUS Realty, a MahaRERA registered strategic channel partner for verified builder projects.",
    filters: {},
    keywords: ["no brokerage flats in Pune", "zero brokerage properties Pune", "direct builder flats Pune"],
  },
};

export const builderPages = {
  "godrej-properties-pune": {
    name: "Godrej Properties",
    title: "Godrej Properties Projects in Pune",
    description: "Explore Godrej Properties projects in Pune with verified inventory, direct-builder pricing, floor plans, RERA details, and site visit support.",
    search: "Godrej",
  },
  "kolte-patil-pune": {
    name: "Kolte Patil",
    title: "Kolte Patil Projects in Pune",
    description: "Compare Kolte Patil projects in Pune across West Pune, PCMC, and premium residential corridors with EUS Realty advisory.",
    search: "Kolte",
  },
  "vtp-realty-pune": {
    name: "VTP Realty",
    title: "VTP Realty Projects in Pune",
    description: "Find VTP Realty projects in Pune with RERA details, configurations, possession updates, and zero brokerage buyer assistance.",
    search: "VTP",
  },
};

export const comparisonPages = {
  "baner-vs-wakad-property-investment": {
    title: "Baner vs Wakad Property Investment",
    h1: "Baner vs Wakad: Which Is Better for Property Investment?",
    left: "baner",
    right: "wakad",
    summary: "Baner suits premium end-use and lifestyle-led appreciation, while Wakad is stronger for Hinjawadi-linked rental demand and relatively efficient entry pricing.",
  },
  "tathawade-vs-hinjawadi": {
    title: "Tathawade vs Hinjawadi Property Investment",
    h1: "Tathawade vs Hinjawadi: Property Investment Comparison",
    left: "tathawade",
    right: "hinjawadi",
    summary: "Tathawade works well for education corridor and highway-led appreciation, while Hinjawadi offers stronger IT rental demand and metro-led upside.",
  },
  "2-bhk-vs-3-bhk-in-pune": {
    title: "2 BHK vs 3 BHK in Pune",
    h1: "2 BHK vs 3 BHK in Pune: Which Should You Buy?",
    summary: "A 2 BHK keeps entry cost and EMI manageable. A 3 BHK usually has better end-use comfort, higher ticket appreciation, and stronger family resale demand.",
  },
  "under-construction-vs-ready-to-move-pune": {
    title: "Under Construction vs Ready to Move Property in Pune",
    h1: "Under Construction vs Ready to Move Property in Pune",
    summary: "Under-construction homes can offer better launch pricing and appreciation, while ready-to-move homes reduce timeline risk and allow immediate use or rental income.",
  },
};

export const cityFaqs = [
  {
    q: "Which are the best areas to buy flats in Pune?",
    a: "Baner, Balewadi, Wakad, Hinjawadi, Tathawade, Aundh, Pimpri and Chinchwad are strong options depending on budget, commute, rental goals and lifestyle preferences.",
  },
  {
    q: "Does EUS Realty charge brokerage?",
    a: "No. EUS Realty works as a MahaRERA registered strategic channel partner and does not charge brokerage to buyers for listed builder projects.",
  },
  {
    q: "How should I verify a project before buying?",
    a: "Check the MahaRERA registration, developer track record, approved floor plans, possession timeline, payment schedule, carpet area, bank approvals and legal documents.",
  },
  {
    q: "Are new launch projects better than ready-to-move flats?",
    a: "New launches can offer early pricing and appreciation potential. Ready-to-move flats reduce construction timeline risk and suit buyers who need immediate possession.",
  },
];
