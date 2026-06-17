import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertiesPageClient from "@/components/PropertiesPageClient";
import { notFound } from "next/navigation";

export const revalidate = 86400; // Cache locality listings for 24 hours

const LOCALITIES = {
  baner: "Baner",
  wakad: "Wakad",
  hinjawadi: "Hinjawadi",
  tathawade: "Tathawade",
  aundh: "Aundh",
  balewadi: "Balewadi",
  pimpri: "Pimpri",
  chinchwad: "Chinchwad"
};

export async function generateStaticParams() {
  return Object.keys(LOCALITIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const localityName = LOCALITIES[slug.toLowerCase()];

  if (!localityName) {
    return {
      title: "Location Not Found | EUS Realty",
      description: "The requested property location could not be found."
    };
  }

  return {
    title: `Premium Flats & Properties in ${localityName}, Pune | EUS Realty`,
    description: `Explore verified direct-builder properties, 2 & 3 BHK flats, and upcoming projects in ${localityName}, Pune with direct developer pricing and zero brokerage.`,
    alternates: {
      canonical: `https://eusrealty.co.in/properties/location/${slug}`
    },
    openGraph: {
      title: `Properties in ${localityName}, Pune | EUS Realty`,
      description: `Explore verified direct-builder properties, 2 & 3 BHK flats, and upcoming projects in ${localityName}, Pune.`,
      url: `https://eusrealty.co.in/properties/location/${slug}`,
      type: "website"
    }
  };
}

export default async function LocalityPropertiesPage({ params }) {
  const { slug } = await params;
  const localityKey = slug.toLowerCase();
  const localityName = LOCALITIES[localityKey];

  if (!localityName) {
    notFound();
  }

  await dbConnect();

  let properties = [];
  try {
    // Search for properties whose location contains the locality name (case insensitive)
    const dbProperties = await Property.find({
      location: { $regex: new RegExp(localityName, 'i') }
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
    console.error(`Failed to load properties for locality ${localityName}:`, error.message);
  }

  // Localized Headings
  const customTitle = (
    <>
      Prime living in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{localityName}</span>
    </>
  );

  const customDescription = `Your trusted local experts. Browse ${properties.length} verified builder-direct premium assets across ${localityName}, Pune, with zero extra brokerage commissions.`;

  // ItemList Schema Markup
  const jsonLdBlob = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Properties in ${localityName}, Pune | EUS Realty`,
    "description": `List of verified direct-builder flats and commercial properties for sale in ${localityName}, Pune`,
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
