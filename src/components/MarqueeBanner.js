"use client";

import { ShieldCheck, Award, Star, CheckCircle2, Building2, Users, Zap, TrendingUp } from "lucide-react";

const badges = [
  { icon: <ShieldCheck size={15} />, text: "RERA Registered" },
  { icon: <Award size={15} />, text: "ISO 9001 Certified" },
  { icon: <Star size={15} className="fill-current" />, text: "4.9★ Google Rated" },
  { icon: <CheckCircle2 size={15} />, text: "Zero Brokerage" },
  { icon: <Building2 size={15} />, text: "500+ Projects" },
  { icon: <Users size={15} />, text: "10,000+ Happy Clients" },
  { icon: <Zap size={15} className="fill-current" />, text: "Pre-Launch Access" },
  { icon: <TrendingUp size={15} />, text: "Best ROI Guaranteed" },
  { icon: <ShieldCheck size={15} />, text: "Legal Vetting Included" },
  { icon: <Award size={15} />, text: "Builder of the Year" },
];

// Duplicate for seamless infinite scroll
const marqueeItems = [...badges, ...badges];

export default function MarqueeBanner() {
  return (
    <div className="py-5 bg-slate-950 border-y border-slate-800 overflow-hidden relative">
      {/* Left gradient fade */}
      <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      {/* Right gradient fade */}
      <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex">
        <div className="animate-marquee flex items-center gap-0 flex-shrink-0">
          {marqueeItems.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-semibold px-6 md:px-8 border-r border-slate-800 whitespace-nowrap"
            >
              <span className="text-amber-400 flex-shrink-0">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="animate-marquee flex items-center gap-0 flex-shrink-0" aria-hidden="true">
          {marqueeItems.map((badge, i) => (
            <div
              key={`dup-${i}`}
              className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-semibold px-6 md:px-8 border-r border-slate-800 whitespace-nowrap"
            >
              <span className="text-amber-400 flex-shrink-0">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
