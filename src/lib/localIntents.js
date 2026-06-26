/**
 * EUS REALTY — LOCAL FALLBACK INTENT MATCHING ENGINE
 * Maps user keywords to high-quality, pre-written senior consultant answers.
 * This guarantees instant replies to common questions even when the Gemini API is rate-limited or offline.
 */

export function getLocalFallbackReply(message, inventory = []) {
  const lower = message.toLowerCase().trim();

  // 1. Greet
  if (["hi", "hello", "hey", "namaste", "hii", "helo", "howdy", "good morning", "good evening", "good afternoon", "start"].some(kw => lower.includes(kw))) {
    return {
      reply: "Namaste! 🙏 Welcome to EusRealty. I'm Vision, your Senior Property Advisor.\n\nOver my 25 years of helping families settle in Pune, I've learned that finding a home is about trust and long-term security. I am here to help you navigate our verified, zero-brokerage properties with absolute transparency.\n\nTell me, are you looking for your dream home or a high-yield investment?",
      chips: ["🏠 Looking for a home", "💰 What's the pricing?", "🗓️ Book site visit", "📋 Request callback"],
      matches: []
    };
  }

  // 2. Price / Cost
  if (["price", "cost", "rate", "budget", "affordable", "cheap", "expensive", "₹", "lakh", "crore", "how much", "pricing", "cost of"].some(kw => lower.includes(kw))) {
    return {
      reply: "💰 Over my 25 years in the Pune real estate market, I've observed that standard pricing depends heavily on the locality and builder quality. Currently, our verified developer portfolio offers options for every profile:\n\n• **2 BHK Apartments**: ₹85 Lakhs – ₹1.8 Cr\n• **3 BHK Luxury Flats**: ₹1.8 Cr – ₹4.5 Cr\n• **Villas & Row Houses**: ₹4.5 Cr – ₹8.9 Cr\n• **Commercial Units**: ₹45 Lakhs onwards\n\nI can also assist you with builder payment plans and bank subvention options. What budget range are you comfortable with?",
      chips: ["📋 Get price sheet", "🏦 Home loan help", "🗓️ Book site visit"],
      matches: []
    };
  }

  // 3. Projects / Listings
  if (["project", "property", "flat", "apartment", "villa", "house", "bhk", "studio", "listing", "new launch", "available", "show me", "properties", "looking for a home"].some(kw => lower.includes(kw))) {
    // Dynamically find up to 3 projects from the inventory
    const projectSlugs = inventory.slice(0, 3).map(p => p.slug);
    return {
      reply: "🏢 We have hand-picked some of the finest RERA-registered projects directly from developers in Pune's major micro-markets:\n\n" + 
             (inventory.length > 0 
               ? inventory.slice(0, 4).map(p => `• **${p.name}** — ${p.location} (${p.bhkOptions || '2/3 BHK'})`).join('\n')
               : "• **Eus Heights** — Tathawade\n• **Skyline Villas** — Balewadi\n• **Juhu Oasis** — Baner\n• **Green Valley** — Hinjewadi") +
             "\n\nAll properties come with direct developer pricing and zero brokerage. Would you like details on a specific project?",
      chips: ["💰 Check prices", "🗓️ Book a visit", "📋 Get full catalog"],
      matches: projectSlugs
    };
  }

  // 4. Brokerage
  if (["brokerage", "commission", "fee", "zero brokerage", "0%", "no charge", "middleman", "charges", "hidden"].some(kw => lower.includes(kw))) {
    return {
      reply: "🤝 EusRealty is built on a strict **0% brokerage** foundation. \n\nHaving spent more than two decades in this business, I strongly believe buyers shouldn't pay brokers to find their homes. We connect you directly with builders, which saves you ₹2 Lakhs to ₹10 Lakhs in commission fees—funds that are better spent on your new home's interiors or registry.",
      chips: ["🏢 Explore projects", "📋 Talk to our team", "💰 View pricing"],
      matches: []
    };
  }

  // 5. Loan
  if (["loan", "emi", "finance", "bank", "mortgage", "home loan", "interest rate", "down payment", "subsidy", "pmay", "financing"].some(kw => lower.includes(kw))) {
    return {
      reply: "🏦 Navigating home finance can be overwhelming. Over the years, I've established strong relationships with 15+ major banks & NBFCs (including SBI, HDFC, ICICI) to provide support:\n\n• **Pre-approvals** within 24 hours\n• **Attractive interest rates** starting at current market lows\n• **PMAY subsidy benefits** up to ₹2.67 Lakhs\n• **Up to 90% financing** options on select projects\n\nWould you like me to connect you with our bank relationship officers for a free eligibility check?",
      chips: ["📋 Get loan help", "💰 Property pricing", "🗓️ Book site visit"],
      matches: []
    };
  }

  // 6. Visit
  if (["visit", "site visit", "tour", "show flat", "schedule", "appointment", "demo", "book", "viewing", "come", "see"].some(kw => lower.includes(kw))) {
    return {
      reply: "🗓️ I always say: *'A site visit is 80% of the decision.'* Seeing the structure, location, and ventilation first-hand is irreplaceable.\n\nWe would be honored to arrange a complimentary chauffeured site visit (with pickup and drop service) for you and your family, 7 days a week.\n\nWhich day fits your schedule best — this coming Saturday or Sunday?",
      chips: ["📅 Schedule on WhatsApp", "📋 Request callback"],
      matches: []
    };
  }

  // 7. Location
  if (["location", "area", "where", "pune", "hinjewadi", "baner", "balewadi", "tathawade", "wakad", "pimple", "sus", "kothrud", "nibm", "hadapsar", "near"].some(kw => lower.includes(kw))) {
    // If they specified a location in the message, let's filter properties matching that location!
    const matchedProjs = inventory.filter(p => {
      const loc = (p.location || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return lower.includes(loc) || lower.includes(name);
    });

    let reply = "📍 Pune has several excellent micro-markets that suit different needs. Based on my experience:\n\n• **IT Corridor (Hinjewadi, Wakad)**: Best for professionals seeking rental yields (6-8%) and short commutes. Options start at ₹85L.\n• **Premium West (Baner, Balewadi, Sus)**: Ideal for a premium lifestyle and families wanting proximity to top schools. Options start at ₹1.2 Cr.\n• **Value Zones (Tathawade, Punawale)**: Fastest growing infrastructure with maximum appreciation. Options start at ₹75L.";
    
    if (matchedProjs.length > 0) {
      reply += `\n\nI found the following direct builder project(s) matching your inquiry: \n` + 
               matchedProjs.map(p => `• **${p.name}** in ${p.location} (Price: ${p.priceRange || 'Call'}, RERA: ${p.rera || 'Verified'})`).join('\n');
    }

    return {
      reply,
      chips: ["🏢 See properties", "💰 Compare prices", "🗓️ Book site visit"],
      matches: matchedProjs.slice(0, 3).map(p => p.slug)
    };
  }

  // 8. Invest / Investment
  if (["invest", "investment", "roi", "rental", "return", "yield", "appreciation", "commercial"].some(kw => lower.includes(kw))) {
    return {
      reply: "📈 Real estate in Pune is highly resilient. If your focus is wealth creation:\n\n• **Commercial spaces (Retail/Office)**: Deliver strong yields between **6% to 9%**.\n• **Residential properties**: Offer steady **4% to 6%** rental yield, combined with **8% to 12%** annual capital appreciation.\n• **Pre-launch opportunities**: Yield maximum capital appreciation (up to 30-40% from launch to completion).\n\nLet me know if you prefer regular rental income or capital growth so I can suggest options.",
      chips: ["📋 Get investment advice", "🏢 Commercial properties", "💰 Pre-launch projects"],
      matches: []
    };
  }

  // 9. Ready to Move
  if (["ready to move", "possession", "delivery", "immediate", "move in", "occupancy", "ready"].some(kw => lower.includes(kw))) {
    return {
      reply: "🏠 Both ready-to-move and under-construction properties have distinct advantages:\n\n• **Ready-to-Move**: Immediate possession, zero delay risk, and **no GST payable** (saving you 5% upfront).\n• **Under-Construction**: Typically **15% to 20% cheaper** than ready homes, with flexible, slab-wise payment structures and higher capital appreciation potential.\n\nAre you looking to move in immediately, or is a 1 to 2-year possession timeline workable for you?",
      chips: ["🏢 Show ready-to-move", "💰 Compare prices", "🗓️ Book site visit"],
      matches: []
    };
  }

  // 10. Legal / RERA
  if (["rera", "legal", "document", "agreement", "registration", "stamp duty", "safe", "trust", "verified", "fraud", "genuine"].some(kw => lower.includes(kw))) {
    return {
      reply: "⚖️ MahaRERA implementation in 2017 is the best thing that happened for buyer protection in Maharashtra. We *only* deal with RERA-registered, legally verified projects.\n\nMy team will guide you through title deeds, encumbrance certificates, draft agreements, stamp duty benefits, and registration. Your investment is completely safe with us.",
      chips: ["📋 Speak to legal desk", "🏢 View verified projects"],
      matches: []
    };
  }

  // 11. Thanks
  if (["thank", "thanks", "thankyou", "great", "awesome", "nice", "perfect", "wonderful", "brilliant", "good"].some(kw => lower.includes(kw))) {
    return {
      reply: "It is my absolute pleasure! 🙏 I believe in offering genuine guidance first. Please feel free to ask me anything else about Pune's properties, configurations, or legal processes.",
      chips: ["🏢 View listings", "📋 Get callback", "📞 Contact our team"],
      matches: []
    };
  }

  // 12. Bye
  if (["bye", "goodbye", "see you", "later", "done"].some(kw => lower.includes(kw))) {
    return {
      reply: "Thank you for your valuable time today! 👋 Have a wonderful and blessed day ahead. Should you need any advice in the future, my desk is always open for you.\n\n📞 +91 7620733613",
      chips: ["🏠 Show properties", "📋 Request callback"],
      matches: []
    };
  }

  return null;
}
