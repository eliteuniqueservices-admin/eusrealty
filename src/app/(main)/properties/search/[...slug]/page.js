import React from 'react';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { notFound } from 'next/navigation';
import PropertiesPageClient from '@/components/PropertiesPageClient';
import { parseSeoSlug } from '@/lib/parseSeoSlug';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600; // Cache these search pages for an hour

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSeoSlug(slug);

  return {
    title: `${parsed.title} | EUS Realty Pune`,
    description: `Discover the best ${parsed.title}. Browse our exclusive 0% brokerage inventory of premium RERA verified projects in Pune.`,
    alternates: {
      canonical: `https://eusrealty.co.in/properties/search/${parsed.originalSlug}`,
    }
  };
}

export default async function ProgrammaticSearchPage({ params }) {
  const { slug } = await params;
  const parsed = parseSeoSlug(slug);

  await dbConnect();

  const query = {};

  // Build MongoDB query based on parsed slug
  if (parsed.locality) {
    query.location = { $regex: new RegExp(parsed.locality, 'i') };
  }
  
  if (parsed.status) {
    query.status = parsed.status;
  }
  
  if (parsed.bhk) {
    query.$or = [
      { configurations: { $regex: new RegExp(parsed.bhk, 'i') } },
      { "configDetails.type": { $regex: new RegExp(parsed.bhk, 'i') } }
    ];
  }
  
  if (parsed.type) {
    // Some flexibility since DB might just have "Residential" or "Apartments"
    if (parsed.type === 'Villas') query.propertyType = { $regex: /villa/i };
    if (parsed.type === 'Plots') query.propertyType = { $regex: /plot/i };
  }

  const getCachedProperties = unstable_cache(
    async (parsedQuery) => {
      await dbConnect();
      return await Property.find(parsedQuery).sort({ createdAt: -1 }).lean();
    },
    [`pseo-properties-${JSON.stringify(query)}`],
    { revalidate: 3600, tags: ['properties'] }
  );

  let dbProperties = [];
  try {
    dbProperties = await getCachedProperties(query);
  } catch (e) {
    console.error("pSEO DB Error:", e);
    return notFound();
  }

  // Filter budget in memory
  if (parsed.budget) {
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
      // If price is 0, we assume it's "On Request" so we might include or exclude it. We'll exclude to be strict on budget searches.
      return priceVal > 0 && priceVal <= parsed.budget;
    });
  }

  if (dbProperties.length === 0) {
    // Optional: Return a highly customized "Not Found" or empty state page
    // But for pSEO, returning 404 for zero inventory is sometimes better to avoid Soft 404s in Google
    // Or we render the page with an empty state. Let's render empty state so user can browse other.
  }

  // Map to client format
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
      baths: bhk, // using bhk as proxy
      area: area,
      type: dbProp.propertyType || "Apartments",
      status: dbProp.status,
      possession: dbProp.possession || "Immediate",
      image: dbProp.images?.[0] || null,
      rera: dbProp.rera || "Verified",
      developer: dbProp.developer || "Premium Builder",
      updatedAt: dbProp.updatedAt ? new Date(dbProp.updatedAt).toLocaleDateString('en-US') : "Jun 20, 2026",
      sqFtRate: sqFtRate
    };
  });

  const customTitle = (
    <span>
      {parsed.title.replace('Pune', '')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Pune</span>
    </span>
  );

  return (
    <PropertiesPageClient
      initialProperties={mappedProperties}
      customTitle={customTitle}
      customDescription={`Explore our curated selection of ${parsed.title}. ${mappedProperties.length} verified listings available.`}
    />
  );
}
