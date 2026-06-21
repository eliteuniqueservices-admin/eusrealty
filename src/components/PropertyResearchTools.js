// c:\Users\rahul\eusrealty\src\components\PropertyResearchTools.js

"use client";

import Link from "next/link";
import { ArrowRight, Calculator, CheckSquare, Wallet, Ruler, TrendingUp, Key } from "lucide-react";
import Reveal from "./Reveal";

const TOOLS = [
  {
    title: "EMI Calculator",
    description: "Find your monthly EMI and interest schedule",
    link: "/calculator/emi",
    icon: <Calculator className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <rect x="25" y="15" width="50" height="70" rx="6" stroke="currentColor" strokeWidth="2" />
        <line x1="35" y1="28" x2="65" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="35" y="42" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="47" y="42" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="59" y="42" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="35" y="54" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="47" y="54" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="59" y="54" width="8" height="8" rx="1.5" fill="currentColor" />
        <rect x="35" y="66" width="20" height="8" rx="1.5" fill="currentColor" />
        <rect x="59" y="66" width="8" height="8" rx="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    title: "Eligibility Calculator",
    description: "Find your maximum home loan limit instantly",
    link: "/calculator/eligibility",
    icon: <CheckSquare className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <rect x="25" y="15" width="50" height="70" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="38" cy="30" r="3" fill="currentColor" />
        <line x1="48" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="45" r="3" fill="currentColor" />
        <line x1="48" y1="45" x2="65" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="60" r="3" fill="currentColor" />
        <line x1="48" y1="60" x2="65" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M70 70 L82 82 L76 88 L64 76 Z" fill="currentColor" opacity="0.4" />
      </svg>
    )
  },
  {
    title: "Affordability Calculator",
    description: "Find the best budget matching your home search",
    link: "/calculator/affordability",
    icon: <Wallet className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <path d="M20 30 C20 24 24 20 30 20 L70 20 C76 20 80 24 80 30 L80 70 C80 76 76 80 70 80 L30 80 C24 80 20 76 20 70 Z" stroke="currentColor" strokeWidth="2" />
        <path d="M20 40 L80 40" stroke="currentColor" strokeWidth="2" />
        <circle cx="65" cy="58" r="6" fill="currentColor" />
        <path d="M40 50 L50 50 L50 66 L40 66 Z" fill="currentColor" opacity="0.6" />
      </svg>
    )
  },
  {
    title: "Area Calculator",
    description: "Convert between square feet, square meters, acre & bigha",
    link: "/calculator/square-meter-to-square-feet",
    icon: <Ruler className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <path d="M20 20 L80 20 L80 80 L20 80 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M20 20 L50 20 L50 50 L20 50 Z" fill="currentColor" opacity="0.25" />
        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="1.5" />
        <rect x="42" y="42" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="white" />
      </svg>
    )
  },
  {
    title: "Valuation Calculator",
    description: "Estimate the market value of your property instantly",
    link: "/calculator/valuation",
    icon: <TrendingUp className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <path d="M15 80 L35 55 L55 65 L85 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="85" cy="25" r="4" fill="currentColor" />
        <path d="M25 80 C25 80 40 80 85 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        <rect x="55" y="40" width="12" height="15" fill="currentColor" opacity="0.3" />
      </svg>
    )
  },
  {
    title: "Rent Value Calculator",
    description: "Determine the ideal monthly rental yield for your property",
    link: "/calculator/rent-value",
    icon: <Key className="text-amber-600" size={32} />,
    color: "from-amber-500/10 to-amber-500/0",
    bgIcon: "bg-amber-100/50",
    illustration: (
      <svg className="w-24 h-24 text-amber-500/20 absolute -bottom-2 -right-2 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
        <circle cx="35" cy="35" r="12" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="35" cy="35" r="4" fill="currentColor" />
        <path d="M44 44 L75 75 M55 55 L65 45 M62 62 L72 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M70 70 H80 V80 H70 Z" fill="currentColor" opacity="0.4" />
      </svg>
    )
  }
];

export default function PropertyResearchTools() {
  return (
    <section className="py-20 md:py-28 bg-[#FAFAFA] border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <Reveal>
          <div className="text-center md:text-left mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              User Property Research Tools
            </h2>
            <p className="text-slate-500 font-light mt-3 max-w-2xl text-sm sm:text-base">
              Calculate your borrowing power, convert land area, and understand your real estate financial options in Pune.
            </p>
          </div>
        </Reveal>

        {/* Grid layout - 6 premium cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TOOLS.map((tool, i) => (
            <Reveal key={`tool-${i}`} delay={i * 0.08}>
              <Link href={tool.link} className="block h-full group">
                <div className="relative overflow-hidden bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-card hover:-translate-y-1.5 hover:border-amber-500/30 transition-all duration-500 h-full">
                  
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-transparent group-hover:from-amber-50/30 transition-colors duration-500 z-0" />
                  
                  {/* Icon and title header */}
                  <div className="relative z-10 space-y-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bgIcon} transition-colors group-hover:bg-amber-500/10`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1.5 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Illustration and Swap button wrapper */}
                  <div className="relative z-10 mt-8 flex items-end justify-between min-h-[64px]">
                    {/* Inline SVGs */}
                    {tool.illustration}

                    {/* Circular Action Button */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300">
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
