import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import PropertiesPageClient from '@/components/PropertiesPageClient';

// Cache page for 1 hour, support on-demand purge via revalidatePath
export const revalidate = 3600;

export default async function PropertiesPage() {
  await dbConnect();
  
  let properties = [];
  try {
    const dbProperties = await Property.find({}).sort({ createdAt: -1 }).lean();
    
    // Map database fields to the structure expected by the client UI
    properties = dbProperties.map(dbProp => {
      let priceVal = 0;
      let priceStr = "On Request";
      let area = "N/A";
      let bhk = "3"; // Default BHK number fallback

      if (dbProp.configDetails && dbProp.configDetails.length > 0) {
        priceStr = dbProp.configDetails[0].price || priceStr;
        area = dbProp.configDetails[0].carpet || area;
        const configType = dbProp.configDetails[0].type || "";
        bhk = String(configType).replace(/[^0-9]/g, '') || "3";

        // Extract numeric value from price string (e.g. "1.5 Cr", "85 L")
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
        baths: "N/A", // Not stored in DB currently
        area: area,
        type: dbProp.propertyType || "Apartments",
        status: dbProp.status,
        possession: dbProp.possession || "Immediate",
        image: dbProp.images?.[0] || null
      };
    });
  } catch (error) {
    console.error('Failed to load properties on server:', error);
  }

  return <PropertiesPageClient initialProperties={properties} />;
}