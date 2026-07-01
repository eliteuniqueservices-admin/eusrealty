import dbConnect from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { comparisonPages, localityMetrics } from "@/lib/seoData";
import { ArrowLeftRight, Check, X, ShieldAlert, Star, TrendingUp } from "lucide-react";

export const revalidate = 86400; // Cache comparison pages for 24 hours

export async function generateStaticParams() {
  return Object.keys(comparisonPages).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const compare = comparisonPages[slug.toLowerCase()];

  if (!compare) {
    return { title: "Comparison | EUS Realty" };
  }

  return {
    title: `${compare.title} | EUS Realty`,
    description: compare.summary,
    alternates: {
      canonical: `https://eusrealty.co.in/compare/${slug.toLowerCase()}`
    }
  };
}

export default async function ComparisonPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const compare = comparisonPages[slug.toLowerCase()];

  if (!compare) {
    notFound();
  }

  // Check if it is a locality-to-locality comparison
  const isLocalityCompare = compare.left && compare.right;
  const leftLoc = isLocalityCompare ? localityMetrics[compare.left] : null;
  const rightLoc = isLocalityCompare ? localityMetrics[compare.right] : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-20">
      {/* Header Banner */}
      <section className="relative py-16 px-4 md:px-8 bg-slate-950 border-b border-slate-900 overflow-hidden text-center">
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
              <ArrowLeftRight size={12} />
              Real Estate Investment Analysis
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none mb-4 max-w-4xl">
              {compare.h1}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-3xl font-light leading-relaxed mb-6">
              {compare.summary}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLocalityCompare && leftLoc && rightLoc ? (
          /* Locality Side-by-Side comparison table */
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Locality */}
              <Reveal>
                <div className="bg-slate-900/50 p-6 sm:p-8 rounded-[2rem] border border-slate-800 space-y-4">
                  <h3 className="text-2xl font-black text-amber-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    {leftLoc.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Premium location in the {leftLoc.region} region. Perfect for lifestyle-oriented buyers seeking high capital appreciation and top infrastructure.
                  </p>
                  <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Avg Price per Sq.Ft</span>
                      <span className="text-white font-black">{leftLoc.avgPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">1-Yr Capital Growth</span>
                      <span className="text-emerald-400 font-black">{leftLoc.yearlyGrowth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Average Rental Yield</span>
                      <span className="text-white font-black">{leftLoc.rentalYield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Transit Status</span>
                      <span className="text-white font-semibold text-right max-w-[180px]">{leftLoc.metro}</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Right Locality */}
              <Reveal delay={0.1}>
                <div className="bg-slate-900/50 p-6 sm:p-8 rounded-[2rem] border border-slate-800 space-y-4">
                  <h3 className="text-2xl font-black text-amber-500 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    {rightLoc.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Fast growing residential micro-market in the {rightLoc.region} region. Excellent rental yields driven by commercial IT park corridors.
                  </p>
                  <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Avg Price per Sq.Ft</span>
                      <span className="text-white font-black">{rightLoc.avgPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">1-Yr Capital Growth</span>
                      <span className="text-emerald-400 font-black">{rightLoc.yearlyGrowth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Average Rental Yield</span>
                      <span className="text-white font-black">{rightLoc.rentalYield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase">Transit Status</span>
                      <span className="text-white font-semibold text-right max-w-[180px]">{rightLoc.metro}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Structured Table */}
            <Reveal>
              <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-black text-white mb-6">Local Investment Comparison Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase tracking-widest text-slate-500 font-black bg-slate-900/60">
                        <th className="px-4 py-3">Metrics</th>
                        <th className="px-4 py-3">{leftLoc.name}</th>
                        <th className="px-4 py-3">{rightLoc.name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr className="hover:bg-slate-900/10">
                        <td className="px-4 py-4 font-bold text-slate-500">Average Rate</td>
                        <td className="px-4 py-4 font-bold text-white">{leftLoc.avgPrice}</td>
                        <td className="px-4 py-4 font-bold text-white">{rightLoc.avgPrice}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/10">
                        <td className="px-4 py-4 font-bold text-slate-500">1-Year Appr.</td>
                        <td className="px-4 py-4 font-bold text-emerald-400">{leftLoc.yearlyGrowth}</td>
                        <td className="px-4 py-4 font-bold text-emerald-400">{rightLoc.yearlyGrowth}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/10">
                        <td className="px-4 py-4 font-bold text-slate-500">Rental Yields</td>
                        <td className="px-4 py-4 text-slate-300">{leftLoc.rentalYield}</td>
                        <td className="px-4 py-4 text-slate-300">{rightLoc.rentalYield}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/10">
                        <td className="px-4 py-4 font-bold text-slate-500">Target Buyer</td>
                        <td className="px-4 py-4 text-slate-300">{leftLoc.buyerProfile}</td>
                        <td className="px-4 py-4 text-slate-300">{rightLoc.buyerProfile}</td>
                      </tr>
                      <tr className="hover:bg-slate-900/10">
                        <td className="px-4 py-4 font-bold text-slate-500">IT Park Near</td>
                        <td className="px-4 py-4 text-slate-300">{leftLoc.nearbyIT}</td>
                        <td className="px-4 py-4 text-slate-300">{rightLoc.nearbyIT}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          /* General comparison structure (BHK or Construction Status) */
          <Reveal>
            <div className="bg-slate-900/50 p-6 sm:p-8 rounded-[2rem] border border-slate-800 space-y-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-black text-amber-400">Comparison Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" /> Options Profile A
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    Lower capital entry rates, highly manageable EMI options, stable short term gains, and excellent liquidity for entry-level buyers.
                  </p>
                </div>
                <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" /> Options Profile B
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    Higher absolute capital growth, better long-term residency comfort, higher premium resale assets, and superior layout options.
                  </p>
                </div>
              </div>

              <div className="pt-6 text-center">
                <p className="text-slate-400 text-xs">Need a detailed structural prospectus or local project matching list?</p>
                <Link href="/contact" className="inline-block mt-4 px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors">
                  Talk to Investment Advisor
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
