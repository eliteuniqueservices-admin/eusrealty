"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

const miniStories = [
  {
    text: "Aditya Kulkarni saved ₹14.5 Lakhs in Baner",
    detail: "4BHK Sky Mansion • Zero Brokerage",
    rating: 5,
  },
  {
    text: "Dr. Amol Ranade secured Direct Builder Pricing",
    detail: "Baner Luxury • 100% RERA Vetted",
    rating: 5,
  },
  {
    text: "Snehal Patil achieved 14.2% ROI in Year 1",
    detail: "Wakad Penthouse • Pre-Launch Deal",
    rating: 5,
  },
  {
    text: "Vikram Malhotra (NRI Dubai) bought 5BHK Villa",
    detail: "Koregaon Park • 18.9% Capital Gain",
    rating: 5,
  },
  {
    text: "Meera Joshi purchased stress-free 3BHK",
    detail: "Kothrud • Vetted Titles & Zero Brokerage",
    rating: 5,
  }
];

export default function HeroSuccessStories() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % miniStories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex justify-center mt-8 mb-4">
      <div className="relative bg-slate-900/5 hover:bg-slate-900/8 backdrop-blur-md border border-slate-200/50 rounded-full px-4 sm:px-6 py-2.5 max-w-xl shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Animated pulsing success indicator */}
          <div className="relative flex-shrink-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase hidden xs:inline">
              Success
            </span>
          </div>

          <span className="h-4 w-px bg-slate-200" />

          {/* Animating story container */}
          <div className="h-9 flex flex-col justify-center overflow-hidden min-w-[200px] sm:min-w-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-left"
              >
                <p className="text-xs sm:text-[13px] font-extrabold text-slate-800 tracking-tight leading-tight">
                  {miniStories[index].text}
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5 leading-none">
                  {miniStories[index].detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
