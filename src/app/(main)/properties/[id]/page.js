import React from 'react';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, BedDouble, Bath, Maximize, Calendar, 
  ShieldCheck, Share2, MessageCircle, Eye, FireExtinguisher, Flame, Zap
} from 'lucide-react';

import mongoose from 'mongoose';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
    return { title: 'Property Not Found' };
  }

  const property = await Property.findById(resolvedParams.id).lean();

  if (!property) return { title: 'Property Not Found' };

  return {
    title: `${property.name} - Luxury Property in ${property.location} | EUS Realty`,
    description: property.description || `Explore ${property.name} in ${property.location}. Find premium 0% brokerage properties in Pune.`,
    alternates: {
      canonical: `https://eusrealty.co.in/properties/${resolvedParams.id}`,
    },
    openGraph: {
      title: `${property.name} - Luxury Property in ${property.location} | EUS Realty`,
      description: property.description || `Explore premium properties in Pune with EUS Realty.`,
      images: property.images && property.images.length > 0 ? [{ url: property.images[0] }] : [],
      url: `https://eusrealty.co.in/properties/${resolvedParams.id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.name} - Luxury Property in ${property.location} | EUS Realty`,
      description: property.description || `Explore premium properties in Pune with EUS Realty.`,
      images: property.images && property.images.length > 0 ? [property.images[0]] : [],
    }
  };
}

export default async function PropertyDetailPage({ params }) {
  const resolvedParams = await params;
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
    return notFound();
  }

  let property;
  try {
    property = await Property.findById(resolvedParams.id).lean();
  } catch (error) {
    return notFound();
  }

  if (!property) {
    return notFound();
  }

  // Fallback defaults if DB is missing info
  const image = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const config = property.configDetails && property.configDetails.length > 0 
    ? property.configDetails[0] 
    : { carpet: '1200 sq.ft', price: 'On Request', type: '2 BHK' };

  // Simulated live viewers for Social Proof
  const liveViewers = (resolvedParams.id.charCodeAt(resolvedParams.id.length - 1) % 5) + 2; 

  // Parse BHK config for search engine semantic parsing
  const bhkMatch = config.type ? config.type.match(/\d+/) : null;
  const numberOfRooms = bhkMatch ? parseInt(bhkMatch[0]) : 3;

  // Parse floor size
  const areaMatch = config.carpet ? config.carpet.replace(/[^\d]/g, "") : "1500";
  const floorSizeVal = parseInt(areaMatch) || 1500;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": `${property.name} in ${property.location}`,
    "description": property.description || `Discover ${property.name} in ${property.location}, Pune. Premium luxury development with direct builder pricing and 0% brokerage fees.`,
    "image": image,
    "url": `https://eusrealty.co.in/properties/${resolvedParams.id}`,
    "datePosted": property.createdAt || new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": config.price,
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": config.price,
        "priceCurrency": "INR",
        "valueAddedTaxIncluded": true
      },
      "availability": "https://schema.org/InStock",
      "url": `https://eusrealty.co.in/properties/${resolvedParams.id}`
    },
    "itemOffered": {
      "@type": "Apartment",
      "name": property.name,
      "numberOfRooms": numberOfRooms,
      "numberOfBedrooms": numberOfRooms,
      "numberOfBathroomsTotal": numberOfRooms,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": floorSizeVal,
        "unitCode": "FTK"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.location,
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "brand": {
        "@type": "Brand",
        "name": property.developer || "Premium Pune Builder"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "MahaRERA Number",
          "value": property.rera || "Verified"
        },
        {
          "@type": "PropertyValue",
          "name": "Possession Date",
          "value": property.possession || "Ready to Move"
        },
        {
          "@type": "PropertyValue",
          "name": "Brokerage",
          "value": "0% Zero Brokerage"
        }
      ]
    }
  };

  const whatsappMessage = encodeURIComponent(`Hi! I'm interested in ${property.name} located at ${property.location}. Can you share more details? Link: https://eusrealty.com/properties/${property._id}`);
  const whatsappNumber = "917620733613";

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Image Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900">
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
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">
                  {property.status || 'Premium'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-red-400/50 shadow-lg animate-pulse">
                  <Flame size={14} /> {liveViewers} people viewing now
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight leading-tight">
                {property.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-200 font-medium text-lg">
                <MapPin size={20} className="text-amber-400" />
                {property.location}, Pune
              </div>
            </div>

            {/* Quick Actions Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this property: https://eusrealty.com/properties/${property._id}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-lg"
                title="Share via WhatsApp"
              >
                <Share2 size={20} />
              </a>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
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
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Developer & RERA */}
            <div className="flex flex-wrap gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Developer</p>
                <p className="text-lg font-black text-slate-900">{property.developer || 'Premium Developer'}</p>
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

            {/* Description */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6">About this Property</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {property.description || "An exclusive collection of premium residences designed for those who appreciate the finer things in life. Featuring state-of-the-art amenities, breathtaking views, and uncompromising quality."}
              </p>
              <div className="mt-8 flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <Zap size={24} className="text-amber-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800">0% Brokerage & Direct Builder Pricing available exclusively through EUS Realty.</p>
              </div>
            </div>

            {/* Configurations */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Configurations</h2>
              <div className="space-y-4">
                {property.configDetails && property.configDetails.length > 0 ? (
                  property.configDetails.map((conf, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition-colors">
                      <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Type</p>
                          <p className="text-lg font-black text-slate-900">{conf.type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Carpet Area</p>
                          <p className="text-lg font-black text-slate-900">{conf.carpet || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-black text-slate-900">₹{conf.price || 'On Request'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">{config.type}</p>
                      <p className="text-sm text-slate-500">{config.carpet}</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900">₹{config.price}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)]">
              <div className="text-center mb-8">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2">Starting From</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">₹{config.price}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-100 py-1.5 px-3 rounded-full inline-block">No Hidden Charges • Direct Builder Price</p>
              </div>

              <div className="space-y-3">
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                  <MessageCircle size={20} /> Chat on WhatsApp
                </a>
                
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Hey, check out this property in ${property.location}: https://eusrealty.com/properties/${property._id}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Share2 size={18} /> Share Property
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">EUS Verified</h4>
                <p className="text-sm text-slate-500 font-medium">This property has been legally verified and physically inspected by our team.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(`Check out this property: https://eusrealty.com/properties/${property._id}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-900 rounded-xl"
        >
          <Share2 size={24} />
        </a>
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 h-14 bg-[#25D366] text-white font-black rounded-xl flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
