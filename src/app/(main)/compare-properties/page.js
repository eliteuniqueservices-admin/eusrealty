import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { getPropertySlug } from "@/lib/propertyUrls";
import ComparePropertiesClient from "@/components/ComparePropertiesClient";

export const revalidate = 3600; // Cache static page and revalidate every hour

export const metadata = {
  title: "Property Comparison Hub | EUS Realty",
  description: "Compare up to 3 residential and commercial properties side-by-side. Analyze pricing, RERA status, location connectivity, layouts, and suitability metrics.",
  alternates: {
    canonical: "https://eusrealty.co.in/compare-properties",
  }
};

export default async function ComparePropertiesPage() {
  let inventory = [];

  try {
    await dbConnect();
    const dbProperties = await Property.find({}).lean();
    
    inventory = dbProperties.map((p) => {
      const priceVal = p.configDetails?.[0]?.price || "Call for Price";
      const carpetVal = p.configDetails?.[0]?.carpet || "N/A";
      const bhkVal = p.configDetails?.[0]?.type || "N/A";
      const imageVal = p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

      return {
        _id: p._id.toString(),
        name: p.name,
        slug: getPropertySlug(p),
        location: p.location,
        developer: p.developer || "Premium Builder",
        priceRange: priceVal,
        bhkOptions: bhkVal,
        carpetArea: carpetVal,
        status: p.status || "Premium",
        rera: p.rera || "Verified/Process",
        image: imageVal,
        description: p.description || "",
        usp: p.usp || "",
        amenities: p.amenities || "",
        landParcel: p.landParcel || "N/A",
        openSpace: p.openSpace || "N/A",
        possession: p.possession || "N/A",
        totalFloors: p.totalFloors || "N/A",
        floorBreakdown: p.floorBreakdown || "N/A",
        configurations: p.configurations || [],
        configDetails: p.configDetails || [],
        propertyType: p.propertyType || "Apartment"
      };
    });
  } catch (err) {
    console.error("Failed to fetch inventory for comparison hub:", err.message);
  }

  return <ComparePropertiesClient inventory={inventory} />;
}
