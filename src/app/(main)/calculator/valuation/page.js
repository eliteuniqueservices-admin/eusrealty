// c:\Users\rahul\eusrealty\src\app\(main)\calculator\valuation\page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Home, Info, MapPin } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";

const LOCALITY_RATES = {
  "baner": { name: "Baner", rate: 9800 },
  "wakad": { name: "Wakad", rate: 8200 },
  "hinjawadi": { name: "Hinjawadi", rate: 7400 },
  "balewadi": { name: "Balewadi", rate: 9200 },
  "tathawade": { name: "Tathawade", rate: 6800 },
  "ravet": { name: "Ravet", rate: 6500 },
  "kothrud": { name: "Kothrud", rate: 14500 },
  "aundh": { name: "Aundh", rate: 11200 },
  "koregaon-park": { name: "Koregaon Park", rate: 17500 }
};

const AGE_FACTORS = {
  "under-construction": { name: "Under Construction / Brand New", factor: 0.10 },
  "1-3-years": { name: "1 - 3 Years Old", factor: 0.05 },
  "3-7-years": { name: "3 - 7 Years Old", factor: 0.00 },
  "7-12-years": { name: "7 - 12 Years Old", factor: -0.10 },
  "12-years-plus": { name: "12+ Years Old", factor: -0.20 }
};

const TYPE_FACTORS = {
  "apartment": { name: "Apartment / Flat", factor: 1.00 },
  "villa": { name: "Villa / Row House", factor: 1.25 },
  "plot": { name: "Independent Land Plot", factor: 0.90 }
};

export default function ValuationCalculatorPage() {
  const [locality, setLocality] = useState("wakad");
  const [carpetArea, setCarpetArea] = useState(1000); // 1000 sq ft default
  const [propertyAge, setPropertyAge] = useState("1-3-years");
  const [propertyType, setPropertyType] = useState("apartment");

  const valuationResults = useMemo(() => {
    const baseRate = LOCALITY_RATES[locality]?.rate || 8000;
    const ageFactor = AGE_FACTORS[propertyAge]?.factor || 0;
    const typeFactor = TYPE_FACTORS[propertyType]?.factor || 1;

    const adjustedRate = baseRate * (1 + ageFactor) * typeFactor;
    const estimatedValue = carpetArea * adjustedRate;

    // Output range: +/- 6% for market standard variance
    const minVal = estimatedValue * 0.94;
    const maxVal = estimatedValue * 1.06;

    return {
      minVal,
      maxVal,
      avgVal: estimatedValue,
      ratePerSqft: adjustedRate
    };
  }, [locality, carpetArea, propertyAge, propertyType]);

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
            Property Value Analytics
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Property Valuation Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Get an instant automated valuation estimation for residential properties and plots in Pune.
          </p>
        </div>
      </section>

      {/* Main calculator section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input columns (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Locality select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-500" /> Select Locality in Pune
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-[#FAFAFB] border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-extrabold text-base outline-none cursor-pointer hover:border-amber-400/80 focus:border-amber-400 transition-colors appearance-none"
                >
                  {Object.entries(LOCALITY_RATES).map(([key, loc]) => (
                    <option key={`loc-${key}`} value={key} className="text-slate-800 font-semibold">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property size input slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Size (Carpet Area in Sq Ft)</label>
                  <span className="text-base font-black text-slate-900">{carpetArea} sq ft</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="6000" 
                  step="50"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                  <span>200 sq ft</span>
                  <span>6,000 sq ft</span>
                </div>
              </div>

              {/* Property Type radio grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Property Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(TYPE_FACTORS).map(([key, type]) => (
                    <button
                      key={`type-${key}`}
                      onClick={() => setPropertyType(key)}
                      className={`py-3 text-center border font-bold text-xs sm:text-sm rounded-xl transition-all ${propertyType === key ? 'bg-amber-500/10 border-amber-500 text-amber-700' : 'bg-[#FAFAFB] border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {type.name.split(" / ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Age select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Age of Property</label>
                <select
                  value={propertyAge}
                  onChange={(e) => setPropertyAge(e.target.value)}
                  className="w-full bg-[#FAFAFB] border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-bold text-sm outline-none cursor-pointer hover:border-amber-400 focus:border-amber-400 transition-colors"
                >
                  {Object.entries(AGE_FACTORS).map(([key, age]) => (
                    <option key={`age-${key}`} value={key}>
                      {age.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Output columns (Span 5) */}
            <div className="lg:col-span-5 bg-[#FAFAFB] border border-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="text-center pb-6 border-b border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Valuation Range</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1.5">
                  {formatINR(valuationResults.minVal)} - {formatINR(valuationResults.maxVal)}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Average Rate per Sq Ft</span>
                  <span className="text-slate-800 font-black">{formatINR(valuationResults.ratePerSqft.toFixed(0))} / sq ft</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Locality Base Index</span>
                  <span className="text-slate-800 font-black">{formatINR(LOCALITY_RATES[locality].rate)} / sq ft</span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Age adjustment</span>
                  <span className="text-slate-800 font-black">{(AGE_FACTORS[propertyAge].factor * 100).toFixed(0)}%</span>
                </div>
              </div>

              <Link href={`/properties?search=${encodeURIComponent(LOCALITY_RATES[locality].name)}`}>
                <button
                  className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md mt-4"
                >
                  View Listings in {LOCALITY_RATES[locality].name}
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
            <Home className="text-amber-500" />
            Automated Property Valuation (AVM)
          </h2>
          <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
            Automated Valuation Models (AVMs) calculate estimated values by processing locality transactional listings, registry circle rates, infrastructural modifiers (upcoming metro nodes, flyovers), and asset depreciation. These calculations provide a solid baseline for secondary markets, builder negotiations, and home financing applications.
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>Disclaimer</strong>: This estimation represents an algorithmic forecast using regional averages. Actual property rates vary significantly based on developer repute, road facing, exact floor rise premiums, interior furnishings, and building amenities.
          </div>
        </div>
      </section>

    </main>
  );
}
