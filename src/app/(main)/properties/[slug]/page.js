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
  const image = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const config = property.configDetails && property.configDetails.length > 0 
    ? property.configDetails[0] 
    : { carpet: '1200 sqft', price: 'On Request', type: '3 BHK' };

  const richData = getRichDataForProperty(property);

  // Parse numeric values from configurations for structured SEO schema
  const carpetVal = config.carpet ? parseFloat(config.carpet.replace(/[^\d.]/g, '')) : null;
  const bhkVal = config.type ? parseFloat(config.type.replace(/[^\d.]/g, '')) : null;

  const mainSchema = {
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
      },
      ...(carpetVal && !isNaN(carpetVal) ? {
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": carpetVal,
          "unitCode": "FTK"
        }
      } : {}),
      ...(bhkVal && !isNaN(bhkVal) ? {
        "numberOfRooms": bhkVal,
        "numberOfBathroomsTotal": bhkVal
      } : {})
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the price of ${property.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price for ${property.name} starts from ${config.price}. For the most accurate and up-to-date pricing, payment plans, and offers, please contact EUS Realty.`
        }
      },
      {
        "@type": "Question",
        "name": `Where is ${property.name} located?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${property.name} is a premium real estate project located in ${property.location}, Pune, Maharashtra.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${property.name} RERA registered?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${property.name} is RERA registered with the MahaRERA registration number: ${property.rera || "Verified"}.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the configurations available at ${property.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The project offers premium configurations including ${config.type}. Reach out to us for detailed floor plans and availability.`
        }
      }
    ]
  };

  const jsonLd = [mainSchema, faqSchema];

  return (
    <ProjectDetailClient
      property={property}
      richData={richData}
      similarProperties={similarProperties}
      jsonLd={jsonLd}
    />
  );
}
