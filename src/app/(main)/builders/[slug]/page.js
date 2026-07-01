import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { builderPages } from "@/lib/seoData";
import { Building2, Award, Calendar, CheckCircle } from "lucide-react";

export const revalidate = 86400; // Cache builder pages for 24 hours

export async function generateStaticParams() {
  return Object.keys(builderPages).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const builder = builderPages[slug.toLowerCase()];

  if (!builder) {
    return { title: "Builder Not Found | EUS Realty" };
  }

  return {
    title: `${builder.title} | EUS Realty`,
    description: builder.description,
    alternates: {
      canonical: `https://eusrealty.co.in/builders/${slug.toLowerCase()}`
    }
  };
}

export default async function BuilderPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const builder = builderPages[slug.toLowerCase()];

  if (!builder) {
    notFound();
  }

  await dbConnect();

  let properties = [];
  try {
    const dbProperties = await Property.find({
      developer: { $regex: new RegExp(builder.search, "i") }
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
        baths: bhk,
        area: area,
        type: dbProp.propertyType || "Apartments",
        status: dbProp.status,
        possession: dbProp.possession || "Immediate",
        image: dbProp.images?.[0] || null,
        rera: dbProp.rera || "Verified",
        developer: dbProp.developer || "Premium Builder",
        updatedAt: dbProp.updatedAt ? new Date(dbProp.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 20, 2026",
        sqFtRate: sqFtRate
      };
    });
  } catch (error) {
    console.error(`Failed to load projects for builder ${builder.name}:`, error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative py-20 px-4 md:px-8 bg-slate-950 border-b border-slate-900 overflow-hidden">
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
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Award size={12} />
              Strategic Developer Partner
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4 max-w-4xl">
              {builder.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Projects in Pune</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10">
              Explore RERA-verified residential gated communities, smart homes, and luxury developments built by {builder.name} in Pune with direct builder pricing and zero brokerage.
            </p>
          </Reveal>

          {/* Quick stats board */}
          <Reveal delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md max-w-3xl w-full">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Developer</span>
                <span className="font-black text-white text-base truncate block px-2">{builder.name}</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Active Projects</span>
                <span className="font-black text-white text-base">{properties.length} Active</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Brokerage Fee</span>
                <span className="font-black text-amber-500 text-base">0% Commission</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Partnership</span>
                <span className="font-black text-emerald-400 text-base flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> Official
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 size={22} className="text-amber-500" />
              Active Listings
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Browse {properties.length} RERA-registered projects</p>
          </div>
          <Link href="/contact" className="px-6 py-2.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
            Get early launch access
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(p => (
              <Reveal key={p.id}>
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-2 hover:border-amber-500/30 transition-colors h-full">
                  <PropertyCard {...p} />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-900 max-w-xl mx-auto">
            <Building2 size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white">No active listings found</h3>
            <p className="text-slate-500 text-sm font-light mt-2 max-w-sm mx-auto">We do not have active listings from {builder.name} indexed at this moment. Contact our desk for offline inventory access.</p>
            <Link href="/contact" className="inline-block mt-6 px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors">
              Contact Advisor desk
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
