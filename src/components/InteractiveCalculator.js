"use client";

import { useState } from 'react';
import { formatINR } from '@/lib/formatCurrency';

export default function InteractiveCalculator() {
  const [deals, setDeals] = useState(2);
  const [avgValue, setAvgValue] = useState(15000000); // Default: 1.5 Cr

  // Calculate incentive based on slab rates:
  // 1 deal = 1.5%, 2-3 deals = 1.8%, 4+ deals = 2.2% commission rate
  const rate = deals >= 4 ? 0.022 : deals >= 2 ? 0.018 : 0.015;
  const totalSales = deals * avgValue;
  const monthlyIncentive = totalSales * rate;
  const annualIncentive = monthlyIncentive * 12;

  return (
    <div className="bg-[#0b0b12]/85 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Sliders Block */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deals Closed / Month</span>
              <span className="text-3xl font-black text-amber-400 tabular-nums">{deals}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={deals} 
              onChange={(e) => setDeals(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
              <span>1 Deal</span>
              <span>5 Deals</span>
              <span>10 Deals</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Average Property Value</span>
              <span className="text-3xl font-black text-white tabular-nums">{formatINR(avgValue)}</span>
            </div>
            <input 
              type="range" 
              min="5000000" // 50 Lakhs
              max="50000000" // 5 Crores
              step="1000000" // 10 Lakhs step
              value={avgValue} 
              onChange={(e) => setAvgValue(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
              <span>₹50 Lakhs</span>
              <span>₹2.5 Cr</span>
              <span>₹5.0 Cr</span>
            </div>
          </div>

          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              * Projections combine EUS&apos;s tier-based commission payouts (ranging from <span className="text-amber-400 font-semibold">1.5% to 2.2%</span> of total closed volume) alongside standard base compensation metrics.
            </p>
          </div>
        </div>

        {/* Display Block */}
        <div className="lg:col-span-5 bg-[#07070d] border border-white/5 p-8 rounded-3xl flex flex-col justify-center gap-6 relative shadow-inner">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Commission Slab Rate</span>
            <span className="text-2xl font-black text-amber-500">{(rate * 100).toFixed(1)}% Payout</span>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Projected Monthly Earnings</span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
              {formatINR(monthlyIncentive)}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Projected Annual Earnings</span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 tracking-tight tabular-nums">
              {formatINR(annualIncentive)}
            </div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block mt-2">
              Includes High-Performance Bonusses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
