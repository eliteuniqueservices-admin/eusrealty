import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { getPropertySlug } from "@/lib/propertyUrls";
import PropertyMatcherClient from "@/components/PropertyMatcherClient";

export const revalidate = 3600; // Cache static pages and revalidate every hour

export const metadata = {
  title: "AI Property Matcher | EUS Realty",
  description: "Find your ideal home or investment property in Pune in under 60 seconds with our smart AI compatibility profiler.",
  alternates: {
    canonical: "https://eusrealty.co.in/property-matcher",
  }
};

export default async function PropertyMatcherPage() {
  let inventory = [];

  try {
    await dbConnect();
    const dbProperties = await Property.find({}).lean();
    
    inventory = dbProperties.map((p) => {
      const priceVal = p.configDetails?.[0]?.price || "Call";
      const carpetVal = p.configDetails?.[0]?.carpet || "1500 sqft";
      const bhkVal = p.configDetails?.[0]?.type || "3BHK";
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
        rera: p.rera || "Verified",
        image: imageVal,
        description: p.description || ""
      };
    });
  } catch (err) {
    console.error("Failed to fetch inventory for property matcher:", err.message);
  }

  return <PropertyMatcherClient inventory={inventory} />;
}
