"use client";

import { useState } from "react";
import StatsCounter from "./StatsCounter";

export default function HoverStatCard({ stat }) {
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <div
      onMouseEnter={() => setHoverKey(prev => prev + 1)}
      className="group relative bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-5 md:p-6 text-center hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] transition-all duration-500 overflow-hidden cursor-pointer h-full"
    >
      {/* Premium Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-transparent group-hover:from-amber-100/50 transition-colors duration-500 rounded-2xl z-0" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-amber-500 flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-950 group-hover:text-amber-400 group-hover:border-slate-800 transition-all duration-500 group-hover:scale-110 shadow-sm group-hover:shadow-amber-500/20">
          {stat.icon}
        </div>
        <StatsCounter 
          playTrigger={hoverKey} 
          value={stat.value} 
          suffix={stat.suffix} 
          prefix={stat.prefix} 
          duration={1.2} 
        />
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 group-hover:text-slate-700 transition-colors">{stat.label}</p>
      </div>
      
      {/* Bottom accent border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-amber-400 transition-colors duration-500" />
    </div>
  );
}
