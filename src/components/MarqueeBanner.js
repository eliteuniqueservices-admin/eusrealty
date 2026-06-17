'use client';

import { ShieldCheck, Award, Star, CheckCircle2, Building2, Users, Zap, TrendingUp } from 'lucide-react';

const badges = [
  { icon: <ShieldCheck size={16} />, text: 'RERA Registered' },
  { icon: <Award size={16} />, text: 'ISO 9001 Certified' },
  { icon: <Star size={16} className="fill-current" />, text: '4.9★ Google Rated' },
  { icon: <CheckCircle2 size={16} />, text: 'Zero Brokerage' },
  { icon: <Building2 size={16} />, text: '500+ Projects' },
  { icon: <Users size={16} />, text: '10,000+ Happy Clients' },
  { icon: <Zap size={16} className="fill-current" />, text: 'Pre-Launch Access' },
  { icon: <TrendingUp size={16} />, text: 'Best ROI Guaranteed' },
  { icon: <ShieldCheck size={16} />, text: 'Legal Vetting Included' },
  { icon: <Award size={16} />, text: 'Builder of the Year' },
];

// Duplicate for seamless infinite scroll
const marqueeItems = [...badges, ...badges];

export default function MarqueeBanner() {
  return (
    <div className="py-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-white/[0.06] overflow-hidden relative select-none">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_1px] pointer-events-none z-0" />
      
      {/* Left/Right luxury fading gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex relative z-10">
        <div className="animate-marquee flex items-center gap-6 flex-shrink-0 pr-6">
          {marqueeItems.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/[0.02] hover:bg-amber-500/[0.04] border border-white/[0.06] hover:border-amber-500/30 px-6 py-3 rounded-2xl transition-all duration-500 whitespace-nowrap group cursor-pointer shadow-lg shadow-black/20"
            >
              <div className="text-amber-500 bg-slate-950 border border-white/[0.08] p-2 rounded-xl group-hover:text-amber-400 group-hover:bg-amber-500/10 group-hover:scale-110 group-hover:border-amber-500/30 transition-all duration-500 shrink-0">
                {badge.icon}
              </div>
              <span className="text-slate-300 group-hover:text-white font-black tracking-wider uppercase text-[10px] sm:text-xs transition-colors duration-500 font-sans">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="animate-marquee flex items-center gap-6 flex-shrink-0 pr-6" aria-hidden="true">
          {marqueeItems.map((badge, i) => (
            <div
              key={`dup-${i}`}
              className="flex items-center gap-3 bg-white/[0.02] hover:bg-amber-500/[0.04] border border-white/[0.06] hover:border-amber-500/30 px-6 py-3 rounded-2xl transition-all duration-500 whitespace-nowrap group cursor-pointer shadow-lg shadow-black/20"
            >
              <div className="text-amber-500 bg-slate-950 border border-white/[0.08] p-2 rounded-xl group-hover:text-amber-400 group-hover:bg-amber-500/10 group-hover:scale-110 group-hover:border-amber-500/30 transition-all duration-500 shrink-0">
                {badge.icon}
              </div>
              <span className="text-slate-300 group-hover:text-white font-black tracking-wider uppercase text-[10px] sm:text-xs transition-colors duration-500 font-sans">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
