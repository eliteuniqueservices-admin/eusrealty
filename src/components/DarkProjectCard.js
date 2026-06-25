"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, TrendingUp, Star, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

const MotionLink = motion.create(Link);

export default function DarkProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  /* ── 3-D tilt ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });
  const shineX = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const shineY = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  const rectRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current && cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
    rectRef.current = null;
  };

  const price = project.configDetails?.[0]?.price;
  const configType = project.configDetails?.[0]?.type || project.configurations?.[0] || "Premium";

  return (
    <div style={{ perspective: "1200px" }} className="h-full">
      {/* Outer ambient gold glow */}
      <motion.div
        animate={hovered ? { opacity: 1, scale: 1.05 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, transparent 60%)",
          filter: "blur(30px)",
          zIndex: -1,
        }}
      />

      <MotionLink
        ref={cardRef}
        href={`/properties/${project._id?.toString() || 'dummy'}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", display: 'flex', flexDirection: 'column' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={hovered
          ? { borderColor: "rgba(251,191,36,0.4)", backgroundColor: "rgba(20,20,25,0.9)", boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 20px rgba(251,191,36,0.1) inset" }
          : { borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(10,10,15,0.7)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 0 rgba(251,191,36,0) inset" }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative p-4 md:p-5 rounded-[2.5rem] border backdrop-blur-xl h-full overflow-hidden group"
      >

        {/* Specular fluid shine */}
        <motion.div
          style={{
            background: useTransform(
              [shineX, shineY],
              ([sx, sy]) => `radial-gradient(circle 250px at ${sx}% ${sy}%, rgba(255,255,255,0.07) 0%, transparent 100%)`
            ),
            pointerEvents: "none",
            zIndex: 40,
          }}
          className="absolute inset-0 rounded-[2.5rem]"
        />

        {/* Animated amber laser sweep */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0, x: "-50%" }}
              animate={{ opacity: 1, scaleX: 1, x: "0%" }}
              exit={{ opacity: 0, scaleX: 0, x: "50%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              style={{ zIndex: 50 }}
            />
          )}
        </AnimatePresence>

        {/* Cinematic Image Container */}
        <div 
          className="h-48 md:h-56 bg-[#030305] rounded-3xl mb-5 overflow-hidden relative border border-white/5 shadow-inner"
          style={{ transform: "translateZ(30px)" }}
        >
          {project.images?.[0] ? (
            <motion.img
              src={project.images[0]}
              alt={project.name}
              animate={hovered ? { scale: 1.1, filter: "brightness(1.1) contrast(1.1)" } : { scale: 1, filter: "brightness(0.8) contrast(1)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              animate={hovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"
            />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Verification Badge */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-3 py-1 flex items-center gap-1.5 shadow-lg">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="text-[9px] font-black tracking-widest uppercase text-emerald-400">Verified</span>
          </div>

          {/* Floating ROI Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-[0_5px_15px_rgba(245,158,11,0.4)]">
            <TrendingUp size={12} className="text-slate-950" />
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-950">High Yield</span>
          </div>

          {/* View Details Pill Reveal */}
          <motion.div
            initial={false}
            animate={hovered ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 text-white shadow-2xl transition-transform hover:scale-105">
              <span className="text-[10px] font-black tracking-widest uppercase drop-shadow-md">View Details</span>
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="px-2 pb-2 relative z-10 flex-1 flex flex-col" style={{ transform: "translateZ(40px)" }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {configType}
                </span>
              </div>
              <motion.h4
                animate={hovered ? { color: "#fbbf24" } : { color: "#ffffff" }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-black leading-tight tracking-tight drop-shadow-sm"
              >
                {project.name}
              </motion.h4>
            </div>
            
            {/* Arrow Corner */}
            <motion.div
              animate={hovered ? { rotate: 45, backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" } : { rotate: 0, backgroundColor: "rgba(255,255,255,0.03)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.05)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-sm shrink-0"
            >
              <ArrowUpRight size={18} />
            </motion.div>
          </div>

          <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-5 font-light">
            <MapPin size={12} className="text-slate-500" />
            {project.location}
          </p>

          <div className="mt-auto border-t border-white/[0.08] pt-4 flex items-end justify-between group-hover:border-amber-500/20 transition-colors duration-500">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Starting From</p>
              <p className="text-slate-200 font-medium text-base">
                {price ? (
                  <span className="text-amber-400 font-black text-xl drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{price}</span>
                ) : (
                  <span className="text-amber-400 font-black">Call for Price</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Expected ROI</p>
              <p className="text-emerald-400 font-black text-lg">12-15%</p>
            </div>
          </div>
        </div>
      </MotionLink>
    </div>
  );
}
