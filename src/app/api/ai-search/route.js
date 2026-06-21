import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { getPropertySlug } from "@/lib/propertyUrls";

export async function POST(req) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Connect to DB and fetch properties
    await dbConnect();
    const dbProperties = await Property.find({}).lean();

    // 2. Prepare inventory summary for AI or Fallback
    const inventory = dbProperties.map((p) => {
      const priceVal = p.configDetails?.[0]?.price || "Call";
      const carpetVal = p.configDetails?.[0]?.carpet || "1500 sqft";
      const bhkVal = p.configDetails?.[0]?.type || "3BHK";
      return {
        name: p.name,
        slug: getPropertySlug(p),
        location: p.location,
        developer: p.developer || "Premium Builder",
        priceRange: priceVal,
        bhkOptions: bhkVal,
        carpetArea: carpetVal,
        status: p.status || "Premium",
        rera: p.rera || "Verified",
        description: p.description || ""
      };
    });

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    let rawMatches = [];
    let adviceText = "";

    let useFallback = !apiKey;

    // 3. Check if Gemini Key is available
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a premium AI Real Estate Advisor representing EUS Realty (https://eusrealty.co.in) in Pune.
Your goal is to help home buyers find their ideal luxury project in Pune using professional, statistics-backed advice.
You are given a list of RERA-registered luxury projects in Pune currently in our inventory, and a user's natural language request.

Our core value proposition:
- 0% Commission/Brokerage fees to buyers.
- Direct-builder pricing and priority desk access.
- 100% verified projects with verified MahaRERA certifications.

Property Inventory:
${JSON.stringify(inventory, null, 2)}

User request: "${query}"

Return a structured JSON response containing:
1. "advice": A professional, helpful response (in markdown) explaining which projects match their request, highlighting yields, connectivity, or features. Mention the 0% commission and direct pricing benefit. Address the user directly in a premium, welcoming advisory tone.
2. "matches": An array of project slugs that directly match their criteria. The slugs must match the exact "slug" field from the inventory list. Maximum 3 matches.

Return ONLY a valid JSON object. Do not wrap in markdown code block markers or any other text.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        // Clean markdown code blocks if the model returned them
        if (responseText.startsWith("```")) {
          responseText = responseText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsed = JSON.parse(responseText);
        adviceText = parsed.advice;
        rawMatches = parsed.matches || [];
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to rule-based engine:", geminiError.message);
        useFallback = true;
      }
    }

    if (useFallback) {
      // 4. Fallback Rule-Based Engine
      console.log("No Gemini API key detected. Initiating EUS Search fallback matching logic.");
      const normalizedQuery = query.toLowerCase();

      // Simple matching
      const localities = ["baner", "wakad", "hinjewadi", "tathawade", "aundh", "balewadi", "pimpri", "chinchwad"];
      let matchedLocality = localities.find(loc => normalizedQuery.includes(loc));

      let matchedBhk = null;
      if (normalizedQuery.includes("2 bhk") || normalizedQuery.includes("2bhk")) matchedBhk = "2";
      if (normalizedQuery.includes("3 bhk") || normalizedQuery.includes("3bhk")) matchedBhk = "3";
      if (normalizedQuery.includes("4 bhk") || normalizedQuery.includes("4bhk")) matchedBhk = "4";

      let filtered = inventory;
      if (matchedLocality) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(matchedLocality));
      }
      if (matchedBhk) {
        filtered = filtered.filter(p => p.bhkOptions.toLowerCase().includes(matchedBhk));
      }

      rawMatches = filtered.slice(0, 3).map(p => p.slug);

      if (rawMatches.length === 0) {
        rawMatches = inventory.slice(0, 2).map(p => p.slug);
        filtered = inventory.slice(0, 2);
      }

      const listNames = filtered.map(p => `**${p.name}** in *${p.location}* (Developer: ${p.developer}, Configuration: ${p.bhkOptions})`).join("\n- ");
      adviceText = `### Recommended Properties for You
Based on your search query "${query}", we have curated the following premium, RERA-approved opportunities in Pune:

- ${listNames}

At EUS Realty, we operate as a **registered MahaRERA channel partner (License No. A041262501741)**. We provide:
1. **0% commission advisory** – saving you lakhs compared to traditional brokers.
2. **Direct-builder pricing** – bypass intermediaries for first-tier pricing and priority desk access.
3. **Verified RERA checks** – complete legal due diligence and documentation guidance.

Would you like to schedule a chauffeured site visit or request direct price matrices for these properties?`;
    }

    // 5. Gather full database documents for matches
    const matchedProperties = [];
    for (const slug of rawMatches) {
      const matchDoc = dbProperties.find(p => getPropertySlug(p) === slug);
      if (matchDoc) {
        const priceVal = matchDoc.configDetails?.[0]?.price || "Call";
        const carpetVal = matchDoc.configDetails?.[0]?.carpet || "1500";
        const areaParsed = parseInt(carpetVal.replace(/[^\d]/g, "")) || 1500;
        const configType = matchDoc.configDetails?.[0]?.type || matchDoc.configurations?.[0] || "3BHK";
        const bhkParsed = parseInt(configType.replace(/[^\d]/g, "")) || 3;
        const imageVal = matchDoc.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

        matchedProperties.push({
          _id: matchDoc._id.toString(),
          name: matchDoc.name,
          location: matchDoc.location,
          price: priceVal,
          bhk: bhkParsed,
          baths: bhkParsed,
          area: areaParsed,
          image: imageVal,
          badge: matchDoc.status || "Premium",
          rera: matchDoc.rera || "Verified",
          slug: slug
        });
      }
    }

    return NextResponse.json({ advice: adviceText, matches: matchedProperties });
  } catch (error) {
    console.error("AI Search API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
