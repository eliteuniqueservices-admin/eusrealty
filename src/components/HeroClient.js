"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const heroTexts = [
  "luxury apartments",
  "premium villas",
  "exclusive penthouses",
  "pre-launch projects",
];

export default function HeroClient() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Animated Trust Badge with spinning conic border */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group relative inline-flex items-center justify-center mb-8 md:mb-10 p-[2px] rounded-full overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform duration-300"
      >
        {/* Spinning conic gradient border */}
        <div
          className="absolute w-[300%] h-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, #f59e0b 30%, transparent 50%)",
            animation: "spin 3s linear infinite",
          }}
        />

        {/* Inner pill */}
        <div className="relative inline-flex items-center gap-2.5 bg-white/96 backdrop-blur-xl text-slate-800 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors duration-300">
          <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-amber-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Star size={10} className="fill-white" />
          </span>
          <span className="tracking-wide">Authorized Channel Partner</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline font-bold text-amber-600">RERA Registered</span>
          <ChevronRight size={15} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>

      {/* Animated rotating keyword (typewriter style) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-4 h-8 flex items-center justify-center"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
          <div className="flex gap-1 items-end h-5">
            <span className="wave-bar" style={{ height: '60%' }} />
            <span className="wave-bar" style={{ height: '80%' }} />
            <span className="wave-bar" style={{ height: '40%' }} />
            <span className="wave-bar" style={{ height: '90%' }} />
            <span className="wave-bar" style={{ height: '70%' }} />
          </div>
          <span>Now featuring</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-amber-600"
            >
              {heroTexts[currentText]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
