import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertiesPageClient from "@/components/PropertiesPageClient";
import { notFound } from "next/navigation";

export const revalidate = 86400; // Cache status listings for 24 hours

const STATUSES = {
  "new-launch": "New Launch",
  "under-construction": "Under Construction",
  "ready-to-move": "Ready to Move",
  "pre-launch": "Pre-Launch"
};

export async function generateStaticParams() {
  return Object.keys(STATUSES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const statusName = STATUSES[slug.toLowerCase()];

  if (!statusName) {
    return {
      title: "Status Not Found | EUS Realty",
      description: "The requested property status could not be found."
    };
  }

  return {
    title: `${statusName} Projects in Pune | EUS Realty`,
    description: `Explore verified direct-builder ${statusName.toLowerCase()} properties and flats in Pune with direct developer pricing and zero brokerage.`,
    alternates: {
      canonical: `https://eusrealty.co.in/properties/status/${slug}`
    },
    openGraph: {
      title: `${statusName} Properties in Pune | EUS Realty`,
      description: `Explore verified direct-builder ${statusName.toLowerCase()} properties in Pune.`,
      url: `https://eusrealty.co.in/properties/status/${slug}`,
      type: "website"
    }
  };
}

export default async function StatusPropertiesPage({ params }) {
  const { slug } = await params;
  const statusKey = slug.toLowerCase();
  const statusName = STATUSES[statusKey];

  if (!statusName) {
    notFound();
  }

  await dbConnect();

  let properties = [];
  try {
    // Search for properties whose status matches the statusName exactly
    const dbProperties = await Property.find({
      status: statusName
    }).sort({ createdAt: -1 }).lean();

    properties = dbProperties.map(dbProp => {
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
        image: dbProp.images?.[0] || null
      };
    });
  } catch (error) {
    console.error(`Failed to load properties for status ${statusName}:`, error.message);
  }

  // Localized Headings
  const customTitle = (
    <>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{statusName}</span> Projects in Pune
    </>
  );

  const customDescription = `Browse ${properties.length} verified ${statusName.toLowerCase()} premium assets across Pune, with zero extra brokerage commissions and expert advisory.`;

  // ItemList Schema Markup
  const jsonLdBlob = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${statusName} Properties in Pune | EUS Realty`,
    "description": `List of verified ${statusName.toLowerCase()} properties for sale in Pune`,
    "numberOfItems": properties.length,
    "itemListElement": properties.map((prop, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://eusrealty.co.in/properties/${prop.id}`,
      "name": prop.title
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlob) }}
      />
      <PropertiesPageClient
        initialProperties={properties}
        customTitle={customTitle}
        customDescription={customDescription}
      />
    </>
  );
}
