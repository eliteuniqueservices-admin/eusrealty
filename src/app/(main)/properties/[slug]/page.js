import React from 'react';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, BedDouble, Bath, Maximize, Calendar, 
  ShieldCheck, Share2, MessageCircle, Eye, Flame, Zap, ArrowLeft,
  Building2, Layers, Landmark
} from 'lucide-react';
import mongoose from 'mongoose';
import { getPropertySlug, getPropertyUrl, getIdFromPropertyParam } from '@/lib/propertyUrls';
import { seoLandingPages } from '@/lib/seoData';
import { getRichDataForProperty } from '@/lib/richProjectData';
import dynamic from 'next/dynamic';
import PropertiesPageClient from '@/components/PropertiesPageClient';
const ProjectDetailClient = dynamic(() => import('@/components/ProjectDetailClient'), { loading: () => <div className="h-96 w-full animate-pulse bg-slate-100 rounded-[2rem]"></div> });
import SmartLeadPopup from '@/components/SmartLeadPopup';
import PropertyCard from '@/components/PropertyCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 3600; // Revalidate cache hourly

// Generate static params for all programmatic SEO pages and seeded properties
export async function generateStaticParams() {
  const programmaticPaths = Object.keys(seoLandingPages).map(slug => ({ slug }));
  
  let propertyPaths = [];
  try {
    await dbConnect();
    const dbProperties = await Property.find({}).lean();
    propertyPaths = dbProperties.map(p => ({ slug: getPropertySlug(p) }));
    // Also include legacy ID paths just in case
    dbProperties.forEach(p => {
      propertyPaths.push({ slug: String(p._id) });
    });
  } catch (error) {
    console.error('Static params properties error:', error.message);
  }

  return [...programmaticPaths, ...propertyPaths];
}

// Generate dynamic metadata for all pages
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Check if programmatic SEO page
  if (seoLandingPages[slug]) {
    const landing = seoLandingPages[slug];
    return {
      title: `${landing.title} | EUS Realty`,
      description: landing.description,
      alternates: {
        canonical: `https://eusrealty.co.in/properties/${slug}`,
      }
    };
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('generateMetadata dbConnect error:', error.message);
    return { title: 'EUS Realty | Premium Properties' };
  }

  // 2. Check if specific property details page
  const potentialId = getIdFromPropertyParam(slug);
  let property = null;
  try {
    if (mongoose.Types.ObjectId.isValid(potentialId)) {
      property = await Property.findById(potentialId).lean();
    } else {
      const allProps = await Property.find({}).lean();
      property = allProps.find(p => getPropertySlug(p) === slug);
    }
  } catch (e) {
    // Ignore db errors
  }

  if (!property) return { title: 'Property Not Found | EUS Realty' };

  const cleanSlug = getPropertySlug(property);
  return {
    title: `${property.name} - Luxury Project in ${property.location} | EUS Realty`,
    description: property.description || `Explore ${property.name} in ${property.location}. Find premium 0% brokerage properties in Pune.`,
    alternates: {
      canonical: `https://eusrealty.co.in/properties/${cleanSlug}`,
    },
    openGraph: {
      title: `${property.name} - Luxury Project in ${property.location} | EUS Realty`,
      description: property.description || `Explore premium properties in Pune with EUS Realty.`,
      images: property.images && property.images.length > 0 ? [{ url: property.images[0] }] : [],
      url: `https://eusrealty.co.in/properties/${cleanSlug}`,
      type: "website",
    }
  };
}

export default async function PropertyOrListingPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // ─────────────────────────────────────────────────────────────
  // CASE A: PROGRAMMATIC SEO LISTING PAGE
  // ─────────────────────────────────────────────────────────────
  if (seoLandingPages[slug]) {
    const landing = seoLandingPages[slug];
    const query = {};

    // Apply specific filters
    if (landing.filters.locality) {
      query.location = { $regex: new RegExp(landing.filters.locality, 'i') };
    }
    if (landing.filters.status) {
      query.status = landing.filters.status;
    }
    if (landing.filters.bhk) {
      query.$or = [
        { configurations: { $regex: new RegExp(landing.filters.bhk, 'i') } },
        { "configDetails.type": { $regex: new RegExp(landing.filters.bhk, 'i') } }
      ];
    }
    if (landing.filters.reraOnly) {
      query.rera = { $exists: true, $ne: "" };
    }
    if (landing.filters.luxury) {
      query.$or = [
        { isSignature: true },
        { isMandate: true },
        { "configDetails.price": { $regex: /^[2-9]\s*Cr/ } } // prices >= 2 Cr
      ];
    }

    let dbProperties = [];
    try {
      await dbConnect();
      dbProperties = await Property.find(query).sort({ createdAt: -1 }).lean();
    } catch (e) {
      console.error('Programmatic page query error:', e.message);
    }

    // Filter budget in memory if maxCr set
    if (landing.filters.maxCr) {
      dbProperties = dbProperties.filter(p => {
        let priceVal = 0;
        if (p.configDetails && p.configDetails.length > 0) {
          const priceStr = p.configDetails[0].price || "";
          if (priceStr.toLowerCase().includes('cr')) {
            priceVal = parseFloat(priceStr) || 0;
          } else if (priceStr.toLowerCase().includes('l')) {
            priceVal = (parseFloat(priceStr) || 0) / 100;
          }
        }
        return priceVal <= landing.filters.maxCr && priceVal > 0;
      });
    }

    // Map database properties to Client component interface
    const mappedProperties = dbProperties.map(dbProp => {
      let priceVal = 0;
      let priceStr = "On Request";
      let area = "N/A";
      let bhk = "3";

      if (dbProp.configDetails && dbProp.configDetails.length > 0) {
        priceStr = dbProp.configDetails[0].price || priceStr;
        area = dbProp.configDetails[0].carpet || area;
        const configType = dbProp.configDetails[0].type || "";
        bhk = String(configType).replace(/[^0-9]/g, '') || "3";

        if (priceStr.toLowerCase().includes('cr')) {
          priceVal = parseFloat(priceStr) || 0;
        } else if (priceStr.toLowerCase().includes('l')) {
          priceVal = (parseFloat(priceStr) || 0) / 100;
        }
      }

      let sqFtRate = "On Request";
      const cleanArea = parseInt(area.replace(/[^0-9]/g, "")) || 0;
      if (cleanArea > 0 && priceVal > 0) {
        const priceInInr = priceVal * 10000000;
        const rate = Math.round(priceInInr / cleanArea);
        sqFtRate = `₹${rate.toLocaleString('en-IN')}/sq.ft`;
      }

      return {
        id: String(dbProp._id),
        title: dbProp.name,
        location: dbProp.location,
        price: priceStr,
        priceVal: priceVal,
        bhk: bhk,
        baths: "N/A",
        area: area,
        type: dbProp.propertyType || "Apartments",
        status: dbProp.status,
        possession: dbProp.possession || "Immediate",
        image: dbProp.images?.[0] || null,
        rera: dbProp.rera || "Verified",
        developer: dbProp.developer || "Premium Builder",
        updatedAt: dbProp.updatedAt ? new Date(dbProp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 20, 2026",
        sqFtRate: sqFtRate
      };
    });

    const customTitle = (
      <span>
        {landing.h1.split(" Pune")[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Pune</span>
      </span>
    );

    return (
      <PropertiesPageClient
        initialProperties={mappedProperties}
        customTitle={customTitle}
        customDescription={landing.description}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CASE B: RICH PROPERTY DETAILS PAGE
  // ─────────────────────────────────────────────────────────────
  const potentialId = getIdFromPropertyParam(slug);
  let property = null;
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(potentialId)) {
      property = await Property.findById(potentialId).lean();
    } else {
      const allProps = await Property.find({}).lean();
      property = allProps.find(p => getPropertySlug(p) === slug);
    }
  } catch (error) {
    console.error('Property detail page query error:', error.message);
    return notFound();
  }

  if (!property) {
    return notFound();
  }

  // Serialize Mongoose document and enrich with client-friendly fields to fix boundary crash
  property = {
    ...JSON.parse(JSON.stringify(property)),
    id: String(property._id),
    slug: getPropertySlug(property),
    price: property.configDetails?.[0]?.price || "On Request"
  };

  const whatsappNumber = "917620733613";
  const getWhatsappMsg = (type) => {
    let base = "";
    if (type === "general") {
      base = `Hi! I'm interested in "${property.name}" located in ${property.location}. Can you share more details?`;
    } else if (type === "sitevisit") {
      base = `Hello! I would like to schedule a site visit to "${property.name}" in ${property.location}. Please tell me available slots.`;
    } else {
      base = `Hi! I would like to get the best pricing quote/payment plan for "${property.name}" in ${property.location}.`;
    }
    return encodeURIComponent(`${base} URL: https://eusrealty.co.in/properties/${property.slug}`);
  };

  // Enrich details with static lookup config
  const richData = getRichDataForProperty(property);

  const image = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const config = property.configDetails && property.configDetails.length > 0 
    ? property.configDetails[0] 
    : { carpet: '1200 sqft', price: 'On Request', type: '3 BHK' };

  // Simulated social proof viewers
  const liveViewers = (property.name.charCodeAt(0) % 5) + 3;

  // Compute average rate per sqft for quick metrics card
  let numericPrice = 0;
  if (config.price.toLowerCase().includes('cr')) {
    numericPrice = parseFloat(config.price) * 10000000;
  } else if (config.price.toLowerCase().includes('l')) {
    numericPrice = parseFloat(config.price) * 100000;
  }
  const numericCarpet = parseInt(config.carpet.replace(/[^0-9]/g, "")) || 0;
  const calculatedRate = numericCarpet > 0 && numericPrice > 0
    ? `₹${Math.round(numericPrice / numericCarpet).toLocaleString('en-IN')}/sq.ft`
    : "On Request";

  // Fetch similar projects in the same locality
  let similarProperties = [];
  try {
    const locKeyword = property.location.split(",")[0].trim();
    const dbSimilars = await Property.find({
      location: { $regex: new RegExp(locKeyword, "i") },
      _id: { $ne: property._id }
    }).limit(3).lean();

    similarProperties = dbSimilars.map(p => {
      let pPrice = p.configDetails?.[0]?.price || "On Request";
      let pArea = p.configDetails?.[0]?.carpet || "N/A";
      let pBhk = p.configDetails?.[0]?.type?.replace(/[^0-9]/g, '') || "3";
      
      let pPriceVal = 0;
      if (pPrice.toLowerCase().includes('cr')) pPriceVal = parseFloat(pPrice) || 0;
      else if (pPrice.toLowerCase().includes('l')) pPriceVal = (parseFloat(pPrice) || 0) / 100;

      let pRate = "On Request";
      const pCleanArea = parseInt(pArea.replace(/[^0-9]/g, "")) || 0;
      if (pCleanArea > 0 && pPriceVal > 0) {
        pRate = `₹${Math.round((pPriceVal * 10000000) / pCleanArea).toLocaleString('en-IN')}/sq.ft`;
      }

      return {
        id: String(p._id),
        title: p.name,
        location: p.location,
        price: pPrice,
        priceVal: pPriceVal,
        bhk: pBhk,
        baths: pBhk,
        area: pArea,
        type: p.propertyType || "Apartments",
        status: p.status,
        possession: p.possession || "Immediate",
        image: p.images?.[0] || null,
        rera: p.rera || "Verified",
        developer: p.developer || "Premium Builder",
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 20, 2026",
        sqFtRate: pRate
      };
    });
  } catch (err) {
    console.error("Similar projects load error:", err);
  }

  // Schema LD JSON structures
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": `${property.name} in ${property.location}`,
    "description": property.description || `Discover ${property.name} in ${property.location}, Pune. Premium luxury development with direct builder pricing and 0% brokerage fees.`,
    "image": image,
    "url": `https://eusrealty.co.in/properties/${getPropertySlug(property)}`,
    "datePosted": property.createdAt || new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": config.price,
      "availability": "https://schema.org/InStock",
      "url": `https://eusrealty.co.in/properties/${getPropertySlug(property)}`
    },
    "itemOffered": {
      "@type": ["Apartment", "Product"],
      "name": property.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.location,
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "brand": {
        "@type": "Brand",
        "name": property.developer || "Premium Builder"
      },
      "identifier": {
        "@type": "PropertyValue",
        "name": "MahaRERA Registration Number",
        "value": property.rera || "Verified"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (4.5 + (property.name.charCodeAt(0) % 5) / 10).toFixed(1),
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": (50 + (property.name.charCodeAt(1) % 100)).toString()
      }
    }
  };

  const formattedLocalityUrl = `/localities/${property.location.split(",")[0].trim().toLowerCase().replace(/\s+/g, "-")}`;
  const formattedBuilderUrl = `/builders/${property.developer ? property.developer.toLowerCase().replace(/\s+/g, "-").replace("-properties", "") + "-pune" : "premium-builder"}`;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Layout */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-slate-900">
        <Image 
          src={image}
          alt={property.name}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white w-full">
              <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 mb-6 inline-block">
                <Breadcrumbs theme="dark" items={[
                  { label: "Pune", href: "/pune-real-estate" },
                  { label: property.location.split(",")[0], href: formattedLocalityUrl },
                  { label: property.name, href: `/properties/${getPropertySlug(property)}` }
                ]} />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">
                  {property.status || 'Premium Project'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-red-400/50 shadow-lg animate-pulse">
                  <Flame size={14} /> {liveViewers} active buyers looking now
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight leading-tight">
                {property.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-200 font-medium text-lg">
                <MapPin size={20} className="text-amber-400" />
                <Link href={formattedLocalityUrl} className="hover:underline">{property.location}, Pune</Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Check out this property: https://eusrealty.co.in/properties/${getPropertySlug(property)}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-lg"
                title="Share via WhatsApp"
              >
                <Share2 size={20} />
              </a>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want details about ${property.name} in ${property.location}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={20} /> Request Details
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-10">
            {/* Top Specs Strip */}
            <div className="flex flex-wrap gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Developer</p>
                <Link href={formattedBuilderUrl} className="text-lg font-black text-slate-900 hover:text-amber-600 flex items-center gap-1.5">
                  <Building2 size={16} /> {property.developer || 'Premium Developer'}
                </Link>
              </div>
              <div className="w-[1px] bg-slate-200 hidden sm:block"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">RERA Number</p>
                <p className="text-lg font-black text-emerald-600 flex items-center gap-1">
                  <ShieldCheck size={18} /> {property.rera || 'Verified'}
                </p>
              </div>
              <div className="w-[1px] bg-slate-200 hidden sm:block"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Possession</p>
                <p className="text-lg font-black text-slate-900 flex items-center gap-1">
                  <Calendar size={18} className="text-amber-500" /> {property.possession || 'Ready to Move'}
                </p>
              </div>
            </div>

            {/* Quick Metrics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Sq.Ft Rate</span>
                <span className="text-base font-black text-slate-900">{calculatedRate}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Land Parcel</span>
                <span className="text-base font-black text-slate-900">{property.landParcel || "4.5 Acres"}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Open Spaces</span>
                <span className="text-base font-black text-slate-900">{property.openSpace || "65% Green"}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Floors</span>
                <span className="text-base font-black text-slate-900">{property.totalFloors || "24 Floors"}</span>
              </div>
            </div>

            {/* About / Description */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">About the Project</h2>
              <p className="text-slate-600 leading-relaxed text-base font-light">
                {property.description || "An exclusive collection of premium residences designed for those who appreciate the finer things in life. Featuring state-of-the-art amenities, breathtaking views, and uncompromising quality."}
              </p>
              <div className="mt-8 flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <Zap size={24} className="text-amber-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800">0% Brokerage & Direct Builder Pricing available exclusively through EUS Realty advisors.</p>
              </div>
            </div>

            {/* Project Details Interactive Area */}
            <ProjectDetailClient property={property} richData={richData} />
            
            {/* Similar projects in local area */}
            {similarProperties.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers size={22} className="text-amber-500" />
                  Similar Projects in {property.location.split(",")[0].trim()}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {similarProperties.map((sim, i) => (
                    <PropertyCard key={sim.id} {...sim} />
                  ))}
                </div>
              </div>
            )}

            {/* Deep Internal Linking bottom block */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-black tracking-tight text-amber-400 border-b border-white/10 pb-3">Pune Real Estate Internal Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400">
                <div className="space-y-2">
                  <span className="text-white font-bold block mb-1">Localities</span>
                  <Link href="/localities/baner" className="hover:text-amber-400 block hover:underline">Baner Real Estate Guide</Link>
                  <Link href="/localities/wakad" className="hover:text-amber-400 block hover:underline">Wakad Real Estate Guide</Link>
                  <Link href="/localities/hinjawadi" className="hover:text-amber-400 block hover:underline">Hinjawadi IT Corridor</Link>
                  <Link href="/localities/tathawade" className="hover:text-amber-400 block hover:underline">Tathawade Area Guide</Link>
                </div>
                <div className="space-y-2">
                  <span className="text-white font-bold block mb-1">Top Developers</span>
                  <Link href="/builders/godrej-properties-pune" className="hover:text-amber-400 block hover:underline">Godrej Projects Pune</Link>
                  <Link href="/builders/kolte-patil-pune" className="hover:text-amber-400 block hover:underline">Kolte Patil Projects</Link>
                  <Link href="/builders/vtp-realty-pune" className="hover:text-amber-400 block hover:underline">VTP Realty Projects</Link>
                </div>
                <div className="space-y-2">
                  <span className="text-white font-bold block mb-1">Calculators</span>
                  <Link href="/calculator/emi" className="hover:text-amber-400 block hover:underline">Home Loan EMI Calculator</Link>
                  <Link href="/calculator/affordability" className="hover:text-amber-400 block hover:underline">Home Affordability Calc</Link>
                  <Link href="/calculator/valuation" className="hover:text-amber-400 block hover:underline">Property Valuation Index</Link>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)]">
              <div className="text-center mb-8">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Starting From</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">₹{config.price}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-100 py-1.5 px-3 rounded-full inline-block">Direct Developer Price • 0% Brokerage</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-3 font-semibold text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>MahaRERA:</span>
                    <span className="text-slate-900 font-black uppercase text-[10px] bg-slate-200/60 px-2 py-0.5 rounded">{property.rera || "Verified"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Locality Hub:</span>
                    <Link href={formattedLocalityUrl} className="text-amber-600 font-black hover:underline">{property.location.split(",")[0].trim()}</Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Developer Profile:</span>
                    <Link href={formattedBuilderUrl} className="text-slate-900 font-black hover:underline">{property.developer || "Verified"}</Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Updated Date:</span>
                    <span className="text-slate-900 font-bold">{property.updatedAt ? new Date(property.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 20, 2026"}</span>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${getWhatsappMsg("general")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95 text-sm"
                >
                  <MessageCircle size={20} /> Chat on WhatsApp
                </a>
                
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${getWhatsappMsg("sitevisit")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                >
                  Schedule Free Site Visit
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">EUS Strategic Advisor</h4>
                <p className="text-xs text-slate-500 font-medium">We are MahaRERA registered advisor strategic partner (Registration: <strong className="text-slate-900 font-bold">A041262501741</strong>).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SmartLeadPopup type="property" contextName={property.name} />
    </div>
  );
}
