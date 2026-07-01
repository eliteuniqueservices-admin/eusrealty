import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { localityMetrics } from "@/lib/seoData";
import { Landmark, ShieldCheck, MapPin, TrendingUp, Info, HelpCircle, Star } from "lucide-react";

export const revalidate = 3600; // Cache city hub page for 1 hour

export async function generateMetadata() {
  return {
    title: "Pune Real Estate Hub | Market Trends, Localities & RERA Checklist | EUS Realty",
    description: "Your complete Pune real estate data hub. Explore market overview, locality price comparison tables, top verified projects, RERA checklists, and FAQs.",
    alternates: {
      canonical: "https://eusrealty.co.in/pune-real-estate"
    }
  };
}

export default async function PuneRealEstateHub() {
  await dbConnect();

  // Fetch featured / top projects to showcase
  let topProjects = [];
  try {
    const dbProjects = await Property.find({ isFeatured: true }).limit(3).lean();
    topProjects = dbProjects.map(p => {
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
    console.error("Failed to load top projects for city hub:", err);
  }

  const localities = Object.entries(localityMetrics);

  const cityFaqs = [
    { q: "Is Pune real estate a safe investment for NRI buyers?", a: "Yes, Pune's stable IT corridors, high rental yields (3.5% - 4.5%), and strict MahaRERA compliance make it one of the top choices for NRIs." },
    { q: "Which areas in Pune have the highest property growth rates?", a: "Hinjawadi, Balewadi, and Baner have recorded the highest yearly price growths ranging from 8.4% to 9.1% driven by upcoming Metro Line 3." },
    { q: "What is a RERA carpet area vs super built-up area?", a: "RERA carpet area is the actual usable net floor space inside the walls. Super built-up area includes common lobbies, elevators, and staircase partitions." }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-20">
      
      {/* ─────────────────────────────────────────────────────────────
          HERO & MARKET OVERVIEW
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 md:px-8 bg-slate-950 border-b border-slate-900 overflow-hidden text-center">
        {/* Immersive background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Fine-grain dot matrix grid texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Subtle glowing color gradients (Indigo, Purple, Cyan) */}
          <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-gradient-radial from-indigo-500/20 via-purple-500/5 to-transparent rounded-full blur-[130px] -translate-y-1/4 pointer-events-none" />
          
          {/* Floating dynamic orbs with drift animations */}
          <div className="hero-orb absolute top-1/4 left-[12%] w-64 h-64 bg-indigo-500/20 animate-drift" style={{ animationDelay: '0s' }} />
          <div className="hero-orb absolute top-1/3 right-[10%] w-72 h-72 bg-purple-500/15 animate-drift" style={{ animationDelay: '-5s' }} />
          <div className="hero-orb absolute bottom-1/4 left-1/3 w-56 h-56 bg-cyan-500/15 animate-drift" style={{ animationDelay: '-10s' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Landmark size={12} />
              Pune City Data Hub
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 max-w-4xl">
              Pune Real Estate Market Analytics
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-3xl font-light leading-relaxed mb-8">
              A comprehensive overview of Pune&apos;s real estate ecosystem. Compare micro-markets, track property prices, review legal buying checklists, and browse RERA-registered developments with EUS Realty advisory.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LOCALITY METRICS MATRIX TABLE
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal>
          <div className="bg-slate-900/40 p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <TrendingUp size={22} className="text-amber-500" />
                Locality Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Cross-compare average pricing, appreciation trends, and ratings</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-widest text-slate-500 font-black bg-slate-900/60">
                    <th className="px-4 py-4">Locality</th>
                    <th className="px-4 py-4">Avg Price Rate</th>
                    <th className="px-4 py-4">Rating</th>
                    <th className="px-4 py-4">1-Yr Growth</th>
                    <th className="px-4 py-4">Rental Yield</th>
                    <th className="px-4 py-4">Metro Connections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {localities.map(([slug, item]) => (
                    <tr key={slug} className="hover:bg-slate-900/20">
                      <td className="px-4 py-4 font-black">
                        <Link href={`/localities/${slug}`} className="text-white hover:text-amber-400 block font-bold text-sm">
                          {item.name}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{item.region}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-300 font-medium">{item.avgPrice}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-400">
                          <Star size={11} className="fill-emerald-400" /> {item.rating}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-emerald-400 font-bold">{item.yearlyGrowth}</td>
                      <td className="px-4 py-4 text-slate-400">{item.rentalYield}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs">{item.metro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TOP VERIFIED PROJECTS
      ───────────────────────────────────────────────────────────── */}
      {topProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck size={22} className="text-amber-500" />
              Featured RERA-Verified Projects
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Direct developer strategic pricing with zero buyer brokerage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topProjects.map(p => (
              <Reveal key={p.id}>
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-2 h-full">
                  <PropertyCard {...p} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          RERA BUYING CHECKLIST
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <Reveal>
          <div className="bg-slate-900/40 p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck size={22} className="text-emerald-500" />
                RERA Home Buyer Compliance Checklist
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Verify legal checklist parameters before signing booking agreements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {[
                { title: "MahaRERA Registration", desc: "Confirm the developer's 11-digit MahaRERA project code is valid on the official registry website." },
                { title: "Carpet Area Audit", desc: "Check the net usable carpet area details instead of super built-up space. Carpet area must match the layout plans." },
                { title: "Title Search & Deeds", desc: "Inspect clear land title deeds, encumbrance clearances, non-agricultural (NA) orders, and local authority sanctions." },
                { title: "Bank Approvals", desc: "Verify if top nationalized banks have pre-approved the project. This guarantees construction safety and loan releases." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MARKET FAQS ACCORDION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-900">
        <Reveal>
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <HelpCircle size={22} className="text-amber-500" />
              Frequently Asked Questions (Pune Real Estate)
            </h2>

            <div className="space-y-4">
              {cityFaqs.map((faq, i) => (
                <div key={i} className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-2">
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
        </Reveal>
      </section>

    </main>
  );
}
