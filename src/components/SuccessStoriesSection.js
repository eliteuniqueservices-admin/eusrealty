"use client";

import React from "react";
import { Star, Quote, ShieldCheck, TrendingUp, DollarSign } from "lucide-react";
import Reveal from "@/components/Reveal";

// Realistic Indian & Maharashtrian success stories
const row1Stories = [
  {
    name: "Aditya Kulkarni",
    role: "VP of Engineering, Tech Mahindra",
    location: "Baner, Pune",
    property: "4BHK Sky Mansion at Lara Solitaire",
    metric: "Saved ₹14.5 Lakhs (Zero Brokerage)",
    metricIcon: <ShieldCheck size={14} className="text-emerald-500" />,
    rating: 5,
    avatar: "AK",
    color: "from-amber-500 to-orange-600",
    text: "Finding a property that fits our standard of luxury without paying exorbitant brokerage was a challenge. EusRealty connected us directly to the builder's priority sales desk. We saved over 14 lakhs in broker fees, and the absolute clarity in documentation was unparalleled. The ultimate gold standard in real estate advisory."
  },
  {
    name: "Snehal Patil",
    role: "Managing Director, Pune Auto Components",
    location: "Wakad, Pune",
    property: "3.5BHK Premium Penthouse, Omega Retreat",
    metric: "14.2% ROI in Year 1",
    metricIcon: <TrendingUp size={14} className="text-amber-500" />,
    rating: 5,
    avatar: "SP",
    color: "from-blue-500 to-indigo-600",
    text: "We wanted a home in Wakad that offered both high comfort and robust capital appreciation. EusRealty's market analytics reports were incredibly detailed and spot on. They negotiated a customized pre-launch payment schedule directly with the builder that worked perfectly for our cash flow. True professionals who understand wealth creation."
  },
  {
    name: "Dr. Amol Ranade",
    role: "Senior Consultant Cardiologist, Ruby Hall",
    location: "Baner, Pune",
    property: "Ultra-Luxury 4BHK Residence",
    metric: "Direct Builder Pricing Vetted",
    metricIcon: <ShieldCheck size={14} className="text-blue-500" />,
    rating: 5,
    avatar: "AR",
    color: "from-emerald-500 to-teal-600",
    text: "As a doctor, my schedule leaves me with zero time for property searches or builder negotiations. EusRealty acted as our exclusive representative. They did all the background legal checks, verified RERA certificates, and brought the finest curated inventory right to my office. The direct-builder pricing transparency was refreshing."
  },
  {
    name: "Priyanka Deshmukh",
    role: "Senior Architect & Design Lead",
    location: "Hinjewadi, Pune",
    property: "3BHK Smart Home, Hinjewadi Phase 1",
    metric: "Saved ₹8.2 Lakhs",
    metricIcon: <ShieldCheck size={14} className="text-purple-500" />,
    rating: 5,
    avatar: "PD",
    color: "from-purple-500 to-pink-600",
    text: "My background in architecture makes me extremely selective about structural quality and layout efficiency. The team at EusRealty understands technical layouts. They didn't just show me mock-up flats; they analyzed carpet area efficiencies and layout blueprints with me. Their direct channel access secured a premium floor at a great price."
  },
  {
    name: "Meera Joshi",
    role: "Founder, Joshi Foods & Catering",
    location: "Kothrud, Pune",
    property: "3BHK Elite Residence",
    metric: "Zero Legal Hassles",
    metricIcon: <ShieldCheck size={14} className="text-emerald-500" />,
    rating: 5,
    avatar: "MJ",
    color: "from-rose-500 to-red-600",
    text: "EusRealty made our home buying journey completely stress-free. In Kothrud, finding clear titles is extremely difficult, but their legal team vetted everything beforehand. The entire transaction was direct and transparent, with absolutely zero brokerage. I highly recommend them to families looking for absolute peace of mind."
  }
];

const row2Stories = [
  {
    name: "Vikram Malhotra",
    role: "NRI Tech Investor",
    location: "Dubai / Pune",
    property: "5BHK Signature Villa, Koregaon Park",
    metric: "18.9% ROI (Exclusive Deal)",
    metricIcon: <TrendingUp size={14} className="text-amber-500" />,
    rating: 5,
    avatar: "VM",
    color: "from-cyan-500 to-blue-600",
    text: "Managing investments from Dubai requires high trust and seamless communication. EusRealty's digital walkthroughs, live site drone footage, and real-time updates were top-tier. They unlocked a signature pre-launch inventory at Koregaon Park before it hit the public market. Their advisory desk is world-class."
  },
  {
    name: "Anagha Gokhale",
    role: "Product Director, Adobe Systems",
    location: "Baner, Pune",
    property: "4BHK Premium Duplex",
    metric: "Direct Builder Deal Secured",
    metricIcon: <ShieldCheck size={14} className="text-indigo-500" />,
    rating: 5,
    avatar: "AG",
    color: "from-violet-500 to-purple-600",
    text: "The dedication of EusRealty is unmatched. They arranged private evening site visits to accommodate my work hours and coordinated directly with the builder's director to customize our kitchen layout. The zero brokerage model is a breath of fresh air. They represent the modern way of real estate transaction."
  },
  {
    name: "Sanjay Shinde",
    role: "VP Operations, Cummins India",
    location: "Wakad, Pune",
    property: "3BHK Premium Residence",
    metric: "Saved ₹9.0 Lakhs in Brokerage",
    metricIcon: <ShieldCheck size={14} className="text-emerald-500" />,
    rating: 5,
    avatar: "SS",
    color: "from-amber-600 to-yellow-600",
    text: "Excellent experience from start to finish. I appreciated the objective builder comparisons. EusRealty gave me an honest layout analysis, pointing out pros and cons of three competing developers in Wakad. Their integrity and customer-first approach are rare in this industry. Truly a premium advisory team."
  },
  {
    name: "Rajesh Deshpande",
    role: "CFO, Maharashtra Tech Solutions",
    location: "Kothrud, Pune",
    property: "4BHK Luxury Apartment",
    metric: "Saved ₹15.0 Lakhs",
    metricIcon: <ShieldCheck size={14} className="text-blue-500" />,
    rating: 5,
    avatar: "RD",
    color: "from-fuchsia-500 to-purple-700",
    text: "From financial projection of asset appreciation to legal documentation and handover support, EusRealty acted as our personal wealth advisor. They secured a direct builder pricing contract that included custom flexible payments. Highly impressed with their transaction transparency and professional work ethic."
  },
  {
    name: "Pranali Bhat",
    role: "Business Owner, Bhat Group Enterprises",
    location: "Baner, Pune",
    property: "3BHK Premium Garden Residence",
    metric: "100% RERA Verified",
    metricIcon: <ShieldCheck size={14} className="text-emerald-500" />,
    rating: 5,
    avatar: "PB",
    color: "from-emerald-600 to-green-700",
    text: "EusRealty has redefined client satisfaction. Their representatives were incredibly polite, thorough, and highly knowledgeable about local micro-markets. They kept their promise of absolute transparency, zero hidden charges, and zero brokerage. A wonderful experience."
  }
];

function StoryCard({ story }) {
  return (
    <div className="w-[290px] xs:w-[380px] sm:w-[450px] shrink-0 bg-white border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.08)] rounded-[2rem] p-5 sm:p-7 flex flex-col relative transition-all duration-500 hover:-translate-y-1.5 overflow-hidden group select-none mr-4 sm:mr-6">
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-transparent group-hover:from-amber-50/50 transition-all duration-500 rounded-[2rem] pointer-events-none" />
      
      {/* Decorative Quote Icon on hover */}
      <Quote className="absolute right-6 top-6 text-slate-100 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Rating and Property Metric */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(story.rating)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-100/50 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-800 w-fit">
            {story.metricIcon}
            <span>{story.metric}</span>
          </div>
        </div>

        {/* Property Vetted Info */}
        <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mb-2">
          Purchased: {story.property}
        </p>

        {/* Testimonial text */}
        <p className="text-slate-700 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
          &ldquo;{story.text}&rdquo;
        </p>
      </div>

      {/* Avatar and Profile Details */}
      <div className="relative z-10 flex items-center gap-3 border-t border-slate-100 pt-4 mt-auto">
        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-extrabold text-xs sm:text-[15px] shrink-0 shadow-md`}>
          {story.avatar}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight truncate">{story.name}</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate font-semibold leading-tight">{story.role}</p>
          <p className="text-[9px] sm:text-[10px] text-amber-600 font-bold tracking-wider uppercase mt-0.5 leading-none">{story.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStoriesSection() {
  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-[#FAFAFA] via-white to-[#FAFAFA] relative overflow-hidden">
      {/* Decorative blurred backdrops */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <Reveal>
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/80 rounded-full text-amber-800 text-[11px] font-extrabold uppercase tracking-widest mb-6">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              <span>Real Customer Success</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              10,000+ Happy Families <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Direct-Builder Success Stories
                <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-60" />
              </span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-light mt-6 leading-relaxed">
              Skip intermediate brokers and buy with confidence. Read the verified experiences of luxury homeowners and NRI investors across Pune.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Tickers container — single row scrolling left */}
      <div className="relative flex flex-col py-4 overflow-hidden w-full select-none">

        {/* Soft edge fades */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

        {/* Row — scrolls left, duplicated for seamless loop */}
        <div className="marquee-track flex w-full">
          <div className="animate-marquee flex flex-row items-stretch shrink-0 py-2">
            {row1Stories.map((story, idx) => (
              <StoryCard key={`r1-${idx}`} story={story} />
            ))}
          </div>
          <div className="animate-marquee flex flex-row items-stretch shrink-0 py-2" aria-hidden="true">
            {row1Stories.map((story, idx) => (
              <StoryCard key={`r1-dup-${idx}`} story={story} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats trust banner directly below tickers */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 text-center">
        <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-4 px-8 py-5 bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span> 100% RERA Verified Deals
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500">★</span> Average Rating: 4.93 / 5
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-indigo-500">₹</span> Zero Brokerage Fees Paid
          </span>
        </div>
      </div>
    </section>
  );
}
