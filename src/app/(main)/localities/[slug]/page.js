import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 86400; // Cache guides for 24 hours
import {
  MapPin, Building2, TrendingUp, Train, GraduationCap,
  Briefcase, Star, ArrowRight, ShieldCheck, Heart
} from "lucide-react";

// static local data for premium localities in West Pune
const localityData = {
  baner: {
    title: "Luxury Properties & Investment Guide in Baner, Pune",
    name: "Baner",
    tagline: "Pune's Premier Luxury High-Street Hub",
    description: "Baner is the crown jewel of West Pune, offering an unmatched mix of premium residential projects, vibrant commercial spaces, high-street retail, and top-tier dining.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      avgPrice: "₹8,500 - ₹12,500 / sqft",
      growth: "+8.4% YoY",
      profile: "Premium & Luxury HNWIs",
      transit: "Metro Line 3 (Upcoming) & NH48 Highway"
    },
    sections: {
      overview: "Baner has evolved from a quiet suburb into West Pune's most active premium hub. Nestled close to the Hinjawadi IT corridor, Baner features expansive green zones, premium multi-specialty hospitals, high-end schools, and a bustling high street filled with elite retail brands and gourmet restaurants. It is highly favored by IT executives and high-net-worth individuals.",
      infrastructure: "Excellent physical and social infrastructure. Key educational institutions include the Orchid School, Vibgyor High, and Aditya Birla National Hospital nearby. Baner Road directly connects to the Pune-Bangalore Highway, facilitating rapid transit to Wakad, Hinjawadi, and central Pune.",
      investment: "Baner consistently leads West Pune in residential rental yields and asset appreciation. The upcoming Hinjawadi-Shivajinagar Metro line will further enhance connectivity, driving property values upwards. Perfect for both self-use luxury buyers and investors seeking passive income."
    },
    faqs: [
      {
        q: "What is the average property rate in Baner, Pune?",
        a: "Property rates in Baner generally range between ₹8,500 and ₹12,500 per sqft depending on the developer, project configuration, and specific micro-location."
      },
      {
        q: "How far is Baner from Hinjawadi IT park?",
        a: "Baner is approximately 8-10 km from Rajiv Gandhi Infotech Park in Hinjawadi, making it a 15-20 minute commute via the highway."
      },
      {
        q: "Which are the top schools in Baner?",
        a: "The Orchid School, Vibgyor High School, and CM International School are among the top-rated educational institutes in Baner."
      }
    ]
  },
  wakad: {
    title: "Premium Properties & Investment Guide in Wakad, Pune",
    name: "Wakad",
    tagline: "The Fast-Growing Residential Epicenter",
    description: "Wakad is West Pune's fastest-growing residential hub, offering excellent transit infrastructure, multi-specialty hospitals, and premium high-rise townships.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      avgPrice: "₹7,000 - ₹9,500 / sqft",
      growth: "+7.9% YoY",
      profile: "IT Professionals & Families",
      transit: "Phoenix Mall Metro & Highway Access"
    },
    sections: {
      overview: "Wakad has witnessed a massive transformation over the past decade. It boasts superb connectivity to the Hinjawadi Tech Park and Mumbai-Pune Expressway. With wide roads, retail hubs like Phoenix Marketcity (Wakad), and abundant modern housing, it is the top choice for young professionals and families.",
      infrastructure: "Features excellent social infrastructure including EuroSchool Wakad, Indira College, and Lifepoint Multispecialty Hospital. The proximity to D-Mart, retail complexes, and fitness centers makes day-to-day living highly convenient.",
      investment: "With the recent launch of massive commercial spaces and malls in Wakad, commercial and residential appreciation rates have soared. The locality offers stable rental demand from tech employees working in Hinjawadi, ensuring high occupancy and robust yields."
    },
    faqs: [
      {
        q: "Why is Wakad popular among home buyers?",
        a: "Wakad is popular due to its proximity to the Hinjawadi IT park, direct access to the Mumbai-Pune Expressway, and relatively affordable premium housing options."
      },
      {
        q: "What are the average property rates in Wakad?",
        a: "Property rates in Wakad range from ₹7,000 to ₹9,500 per sqft, offering excellent value for premium gated communities."
      },
      {
        q: "Does EUS Realty charge brokerage for property purchases in Wakad?",
        a: "No, EUS Realty is an official channel partner with Pune's top builders and charges zero brokerage fee to buyers."
      }
    ]
  },
  hinjawadi: {
    title: "Gated Townships & IT Guide in Hinjawadi, Pune",
    name: "Hinjawadi",
    tagline: "India's Premier Tech Corridor",
    description: "Hinjawadi is the powerhouse of Pune's IT revolution, hosting the Rajiv Gandhi Infotech Park and offering high rental demand and modern township living.",
    heroImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      avgPrice: "₹6,800 - ₹8,800 / sqft",
      growth: "+9.1% YoY",
      profile: "Tech Professionals & Corporate Executives",
      transit: "Metro Line 3 (Hinjawadi to Shivajinagar)"
    },
    sections: {
      overview: "Hinjawadi is a global tech hub housing hundreds of multinational corporations including Infosys, Wipro, and TCS. Divided into Phase 1, 2, and 3, the locality features self-sustained mega-townships with school, retail, and entertainment zones built directly inside, creating a complete walk-to-work culture.",
      infrastructure: "Equipped with world-class tech park infrastructure, prestigious schools like Symbiosis International, and healthcare institutions like Ruby Hall Clinic. It has excellent public transport connectivity and dedicated tech bus lines.",
      investment: "Hinjawadi offers the highest rental yield in West Pune due to the massive influx of tech professionals. The upcoming Metro Line 3 (Hinjawadi-Shivajinagar) will connect the tech park directly to Pune city center, ensuring stellar capital appreciation."
    },
    faqs: [
      {
        q: "Is Hinjawadi a good option for investment?",
        a: "Yes, Hinjawadi is one of the best locations for rental income in Pune, with continuous demand from IT professionals ensuring high rental yields and low vacancy rates."
      },
      {
        q: "What is the RERA status of properties in Hinjawadi listed by EUS?",
        a: "All properties listed on EUS Realty are 100% RERA-registered. EUS Realty is a registered RERA agent (MahaRERA: A041262501741)."
      },
      {
        q: "What are the key connectivity updates in Hinjawadi?",
        a: "The upcoming Metro Line 3 is the largest connectivity upgrade, running right through Phase 1, 2, and 3 of Hinjawadi to central Pune."
      }
    ]
  },
  tathawade: {
    title: "Educational Hub & Residential Guide in Tathawade, Pune",
    name: "Tathawade",
    tagline: "The Premium Academic & Expressway Hub",
    description: "Tathawade is West Pune's premier educational corridor, offering prime highway access, green landscapes, and fast-appreciating residential projects.",
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      avgPrice: "₹6,500 - ₹8,500 / sqft",
      growth: "+8.1% YoY",
      profile: "Academicians, Students & Highway Commuters",
      transit: "Mumbai-Pune Highway & BRTS Corridor"
    },
    sections: {
      overview: "Tathawade is strategically located along the Mumbai-Pune Highway, sharing borders with Wakad and Ravet. Known as an educational hub, it is home to top universities and colleges, making it highly attractive to student rentals and faculty, as well as professionals seeking easy highway connectivity.",
      infrastructure: "Excellent social infrastructure with JSPM College, D.Y. Patil University, and Blossom Public School. The locality has quick access to Aditya Birla Hospital and various shopping hubs in Wakad.",
      investment: "Tathawade offers high appreciation potential as a bridge between Wakad and the PCMC industrial zone. Property prices are competitive compared to Baner or Wakad, attracting first-time home buyers and smart investors."
    },
    faqs: [
      {
        q: "What makes Tathawade unique?",
        a: "Tathawade combines high-quality educational institutes with excellent proximity to both Hinjawadi IT Park and the Mumbai-Pune Expressway."
      },
      {
        q: "What is the average pricing of a 2BHK or 3BHK in Tathawade?",
        a: "Average property rates range between ₹6,500 and ₹8,500 per sqft. A premium 2BHK starts around ₹65-80 Lakhs, and a 3BHK ranges between ₹90 Lakhs and ₹1.2 Cr."
      }
    ]
  },
  aundh: {
    title: "Heritage Homes & Luxury Guide in Aundh, Pune",
    name: "Aundh",
    tagline: "Pune's Upscale Heritage Neighborhood",
    description: "Aundh is an established, high-end residential neighborhood in Pune, offering leafy green avenues, boutique shops, and a prestigious residential community.",
    heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      avgPrice: "₹10,500 - ₹14,500 / sqft",
      growth: "+6.8% YoY",
      profile: "HNWIs, Business Owners & Retired Officers",
      transit: "University Circle, Aundh-Ravet BRTS"
    },
    sections: {
      overview: "Aundh is one of Pune's most affluent suburban areas. Historically a quiet neighborhood, it has transformed into a prestigious locality featuring green tree-lined streets, premium boutique stores, and organic cafes. It represents the perfect balance of classic Pune heritage and modern sophistication.",
      infrastructure: "Aundh has mature physical and social infrastructure with prestigious institutes like the University of Pune nearby, top-tier schools like DAV Public School, and Medipoint Hospital. It is highly accessible from the university circle and Baner.",
      investment: "Due to limited land availability for new developments, Aundh properties are highly exclusive. Residential projects here retain premium values, and resale properties fetch high capital returns. It is highly valued by families seeking long-term security and a premium neighborhood environment."
    },
    faqs: [
      {
        q: "Is Aundh considered a luxury neighborhood?",
        a: "Yes, Aundh is widely regarded as one of Pune's premier upscale residential markets, characterized by premium pricing and HNWIs."
      },
      {
        q: "How is the connectivity of Aundh to other parts of Pune?",
        a: "Aundh has direct connectivity to Pune University, Shivajinagar, Baner, and the old Pune-Mumbai highway, offering quick travel times to central Pune."
      }
    ]
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = localityData[slug.toLowerCase()];
  if (!data) return { title: "Locality Guide | EUS Realty" };
  return {
    title: `${data.name} Real Estate & Property Investment Guide | EUS Realty`,
    description: data.description,
    alternates: {
      canonical: `https://eusrealty.co.in/localities/${slug.toLowerCase()}`,
    }
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'baner' },
    { slug: 'wakad' },
    { slug: 'hinjawadi' },
    { slug: 'tathawade' },
    { slug: 'aundh' }
  ];
}

export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const data = localityData[normalizedSlug];

  if (!data) {
    notFound();
  }

  // Fetch properties belonging to this locality
  let properties = [];
  try {
    await dbConnect();
    // Search location string for the locality name
    properties = await Property.find({
      location: { $regex: new RegExp(data.name, "i") }
    }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Database fetch failed for locality properties:", error);
  }

  // Prepare custom schemas for AEO (AI Search Engine Optimization)
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "EUS Realty",
    "image": "https://eusrealty.co.in/icon.png",
    "telephone": "+91 76207 33613",
    "url": "https://eusrealty.co.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No. 101, First Floor, Lara Solitaire, Baner Road",
      "addressLocality": "Baner, Pune",
      "postalCode": "411045",
      "addressCountry": "IN"
    },
    "priceRange": "$$$$",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `West Pune, ${data.name}`
    },
    "customIdentifier": "MahaRERA Agent Number: A041262501741"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pt-24 pb-20">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header Section */}
      <section className="relative py-20 px-4 md:px-8 border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src={data.heroImage}
            alt={`${data.name} background`}
            fill
            priority
            className="object-cover blur-md scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MapPin size={12} />
              West Pune Corridor
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4 max-w-4xl">
              {data.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Real Estate Guide</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-amber-500 text-lg sm:text-xl md:text-2xl font-bold italic tracking-wide mb-6">
              &ldquo;{data.tagline}&rdquo;
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10">
              {data.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Guide Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Guide Panel (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
              {[
                { icon: <TrendingUp size={20} className="text-amber-500" />, label: "Avg Property Rate", val: data.metrics.avgPrice },
                { icon: <Building2 size={20} className="text-amber-500" />, label: "Appreciation", val: data.metrics.growth },
                { icon: <Star size={20} className="text-amber-500" />, label: "Buyer Profile", val: data.metrics.profile },
                { icon: <Train size={20} className="text-amber-500" />, label: "Key Transit", val: data.metrics.transit }
              ].map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {m.icon}
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{m.label}</span>
                  </div>
                  <p className="text-sm sm:text-base font-black text-white">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Locality Detailed Content */}
            <div className="space-y-8">
              <Reveal>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-amber-500 rounded-full" />
                    Overview
                  </h2>
                  <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                    {data.sections.overview}
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-amber-500 rounded-full" />
                    Infrastructure & Social Amenities
                  </h2>
                  <div className="bg-slate-900/40 p-6 border border-slate-900 rounded-2xl space-y-4">
                    <div className="flex gap-4 items-start text-slate-300">
                      <GraduationCap size={24} className="text-amber-400 flex-shrink-0 mt-1" />
                      <p className="text-sm sm:text-base font-light">
                        {data.sections.infrastructure}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-amber-500 rounded-full" />
                    Investment Outlook & Connectivity
                  </h2>
                  <div className="bg-slate-900/40 p-6 border border-slate-900 rounded-2xl space-y-4">
                    <div className="flex gap-4 items-start text-slate-300">
                      <Briefcase size={24} className="text-amber-400 flex-shrink-0 mt-1" />
                      <p className="text-sm sm:text-base font-light">
                        {data.sections.investment}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Q&A / FAQs Section for AI Search Engine Optimization (AEO) */}
            <div className="border-t border-slate-900 pt-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-6">
                Locality FAQs
              </h2>
              <div className="space-y-6">
                {data.faqs.map((faq, fi) => (
                  <div key={fi} className="p-6 bg-slate-900/30 border border-slate-900/80 rounded-2xl space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-amber-400 flex items-start gap-2">
                      <span className="text-xs uppercase bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-black mt-1">Q</span>
                      {faq.q}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base font-light pl-7 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Advisor MahaRERA Section */}
            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col md:flex-row items-center gap-6">
              <ShieldCheck className="text-amber-400 w-12 h-12 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">MahaRERA Registered Advisor Partner</h4>
                <p className="text-slate-400 text-xs sm:text-sm font-light">
                  EUS Realty is an official RERA-authorized channel partner in Pune. Agent Registration Number: <strong className="text-amber-400 font-bold">A041262501741</strong>. We guarantee verified project information and direct builder-side pre-launch inventory pricing with zero brokerage.
                </p>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Properties Section (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 bg-slate-900/40 p-6 border border-slate-900 rounded-3xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Properties in {data.name}
                </h3>
                <p className="text-slate-500 text-xs font-light mt-1">
                  Browse {properties.length} RERA-verified options matching this location.
                </p>
              </div>

              <div className="space-y-4">
                {properties.length > 0 ? (
                  properties.map((p, i) => {
                    const priceVal = p.configDetails?.[0]?.price || "Call";
                    const carpetVal = p.configDetails?.[0]?.carpet || "1500";
                    const areaParsed = parseInt(carpetVal.replace(/[^\d]/g, "")) || 1500;
                    const configType = p.configDetails?.[0]?.type || p.configurations?.[0] || "3BHK";
                    const bhkParsed = parseInt(configType.replace(/[^\d]/g, "")) || 3;
                    const imageVal = p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

                    return (
                      <div key={p._id ? p._id.toString() : i} className="scale-95 origin-center hover:scale-100 transition-transform duration-300">
                        <PropertyCard
                          id={p._id?.toString() || "dummy"}
                          title={p.name}
                          location={p.location}
                          price={priceVal}
                          bhk={bhkParsed}
                          baths={bhkParsed}
                          area={areaParsed}
                          image={imageVal}
                          badge={p.status || "Premium"}
                          isNew={p.status === "New Launch" || p.status === "Pre-Launch"}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-900">
                    <p className="text-slate-500 text-sm font-light">
                      No active listings found in {data.name} currently.
                    </p>
                    <Link href="/contact" className="inline-block mt-4 text-xs font-bold text-amber-500 hover:underline">
                      Request Pre-Launch Details →
                    </Link>
                  </div>
                )}
              </div>

              {/* Call to action card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/15 text-center space-y-4">
                <Heart size={24} className="text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-white">Need a curated inventory shortlist?</h4>
                <p className="text-slate-400 text-xs font-light">
                  Get a personalized, builder-direct pricing prospectus with comparison matrices.
                </p>
                <Link href="/contact" className="block w-full bg-amber-500 text-slate-950 text-xs font-black py-3 rounded-xl hover:bg-amber-400 transition-colors">
                  Contact Local Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
