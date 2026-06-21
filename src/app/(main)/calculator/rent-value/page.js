// c:\Users\rahul\eusrealty\src\app\(main)\calculator\rent-value\page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Key, Info, MapPin } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";

const LOCALITIES = {
  "baner": { name: "Baner", multiplier: 1.0, propertyAvg: 9500000 },
  "wakad": { name: "Wakad", multiplier: 0.88, propertyAvg: 8000000 },
  "hinjawadi": { name: "Hinjawadi", multiplier: 0.84, propertyAvg: 7500000 },
  "balewadi": { name: "Balewadi", multiplier: 0.96, propertyAvg: 9000000 },
  "tathawade": { name: "Tathawade", multiplier: 0.72, propertyAvg: 6500000 },
  "ravet": { name: "Ravet", multiplier: 0.68, propertyAvg: 6000000 },
  "kothrud": { name: "Kothrud", multiplier: 1.2, propertyAvg: 12000000 },
  "aundh": { name: "Aundh", multiplier: 1.12, propertyAvg: 11000000 },
  "koregaon-park": { name: "Koregaon Park", multiplier: 1.6, propertyAvg: 16000000 }
};

const BHK_CONFIGS = {
  "1bhk": { name: "1 BHK", multiplier: 0.60 },
  "2bhk": { name: "2 BHK", multiplier: 1.00 },
  "3bhk": { name: "3 BHK", multiplier: 1.40 },
  "4bhk": { name: "4 BHK", multiplier: 1.90 }
};

const FURNISHING_FACTORS = {
  "unfurnished": { name: "Unfurnished", factor: 0.90 },
  "semi-furnished": { name: "Semi-Furnished", factor: 1.00 },
  "fully-furnished": { name: "Fully Furnished", factor: 1.15 }
};

export default function RentValueCalculatorPage() {
  const [locality, setLocality] = useState("wakad");
  const [bhk, setBhk] = useState("2bhk");
  const [furnishing, setFurnishing] = useState("semi-furnished");

  const rentResults = useMemo(() => {
    const baseRent = 25000; // Base rate for a 2BHK in Baner (multiplier 1.0)
    const locMult = LOCALITIES[locality]?.multiplier || 1.0;
    const bhkMult = BHK_CONFIGS[bhk]?.multiplier || 1.0;
    const furnishFact = FURNISHING_FACTORS[furnishing]?.factor || 1.0;

    const estimatedRent = baseRent * locMult * bhkMult * furnishFact;
    
    const minRent = estimatedRent * 0.92;
    const maxRent = estimatedRent * 1.08;

    // Estimate property value for this config to calculate yield
    const propBaseValue = LOCALITIES[locality]?.propertyAvg || 8000000;
    const propAdjustedValue = propBaseValue * bhkMult;
    const annualRentalYield = (estimatedRent * 12 / propAdjustedValue) * 100;

    return {
      minRent,
      maxRent,
      avgRent: estimatedRent,
      annualRentalYield,
      estimatedPropValue: propAdjustedValue
    };
  }, [locality, bhk, furnishing]);

  return (
    <main className="min-h-screen bg-[#FCFCFD] font-sans pb-16">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 mb-6">
            <Calculator size={12} className="text-amber-400" />
            Rental Yield Index
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Rent Value Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Estimate the average monthly rent range and annual rental yield percentages for Pune apartments.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input columns (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Locality select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-500" /> Select Locality
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-[#FAFAFB] border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-extrabold text-base outline-none cursor-pointer hover:border-amber-400 focus:border-amber-400 transition-colors"
                >
                  {Object.entries(LOCALITIES).map(([key, loc]) => (
                    <option key={`loc-${key}`} value={key}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK config radio */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">BHK Configuration</label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(BHK_CONFIGS).map(([key, config]) => (
                    <button
                      key={`bhk-${key}`}
                      onClick={() => setBhk(key)}
                      className={`py-3 text-center border font-bold text-xs sm:text-sm rounded-xl transition-all ${bhk === key ? 'bg-amber-500/10 border-amber-500 text-amber-700' : 'bg-[#FAFAFB] border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Furnishing Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(FURNISHING_FACTORS).map(([key, config]) => (
                    <button
                      key={`furnish-${key}`}
                      onClick={() => setFurnishing(key)}
                      className={`py-3 text-center border font-bold text-xs sm:text-sm rounded-xl transition-all ${furnishing === key ? 'bg-amber-500/10 border-amber-500 text-amber-700' : 'bg-[#FAFAFB] border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Output columns (Span 5) */}
            <div className="lg:col-span-5 bg-[#FAFAFB] border border-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="text-center pb-6 border-b border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Rent Range</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1.5">
                  {formatINR(rentResults.minRent).replace("₹", "Rs. ")} - {formatINR(rentResults.maxRent).replace("₹", "Rs. ")} <span className="text-sm text-slate-500 font-medium">/mo</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Estimated Rental Yield</span>
                  <span className="text-emerald-600 font-black">{rentResults.annualRentalYield.toFixed(2)}% p.a.</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Estimated Property Cost</span>
                  <span className="text-slate-800 font-black">{formatINR(rentResults.estimatedPropValue)}</span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Annual Rental Income</span>
                  <span className="text-slate-800 font-black">{formatINR(rentResults.avgRent * 12)}</span>
                </div>
              </div>

              <Link href={`/properties?search=${encodeURIComponent(LOCALITIES[locality].name)}`}>
                <button
                  className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md mt-4"
                >
                  Explore properties in {LOCALITIES[locality].name}
                  <ArrowRight size={16} />
                </button>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* Info Fold */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Key className="text-amber-500" />
            Understanding Rental Yield
          </h2>
          <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
            Rental yield represents the percentage return an asset generates annually relative to its purchase value. In India, residential real estate typically yields between <strong className="text-slate-800">2.5% and 4.0%</strong>. Locations like Hinjawadi and Wakad, which host huge corporate populations and IT campuses, enjoy higher relative yields due to consistent rental demands.
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>Yield Equation</strong>: Rental Yield = (Monthly Rent x 12) / Total Property Value. Furnishing the property (semi or fully furnished) significantly elevates rent rates and yields, though it requires initial capital outlay.
          </div>
        </div>
      </section>

    </main>
  );
}
