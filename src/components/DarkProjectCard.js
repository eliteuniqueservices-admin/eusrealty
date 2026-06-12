"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

const MotionLink = motion(Link);

export default function DarkProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  /* ── 3-D tilt ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 20 });
  const shineX = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const shineY = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  const price = project.configDetails?.[0]?.price;

  return (
    <div style={{ perspective: "900px" }}>
      {/* Outer amber glow */}
      <motion.div
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.25) 0%, transparent 70%)",
          filter: "blur(24px)",
          zIndex: -1,
        }}
      />

      <MotionLink
        ref={cardRef}
        href={`/properties/${project._id?.toString() || 'dummy'}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={hovered
          ? { borderColor: "rgba(251,191,36,0.5)", backgroundColor: "rgba(255,255,255,0.04)" }
          : { borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }
        }
        transition={{ duration: 0.35 }}
        className="relative p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border cursor-pointer overflow-hidden"
      >

        {/* Specular shine */}
        <motion.div
          style={{
            background: useTransform(
              [shineX, shineY],
              ([sx, sy]) => `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.08) 0%, transparent 55%)`
            ),
            pointerEvents: "none",
            zIndex: 40,
          }}
          className="absolute inset-0 rounded-[2rem]"
        />

        {/* Animated amber border glow sweep */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent origin-left"
              style={{ zIndex: 50 }}
            />
          )}
        </AnimatePresence>

        {/* Image area */}
        <div className="h-40 md:h-48 bg-slate-900 rounded-xl md:rounded-2xl mb-4 md:mb-5 overflow-hidden relative border border-slate-800">
          {project.images?.[0] ? (
            <motion.img
              src={project.images[0]}
              alt={project.name}
              animate={hovered ? { scale: 1.09 } : { scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              animate={hovered ? { scale: 1.09 } : { scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"
            />
          )}

          {/* Dark overlay */}
          <motion.div
            animate={hovered ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
          />

          {/* Play circle */}
          <motion.div
            initial={false}
            animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/40">
              <Play size={18} className="ml-1" fill="currentColor" />
            </div>
          </motion.div>

          {/* Index badge */}
          <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-slate-950/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
            <Star size={10} className="fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-1 relative z-10">
          <motion.h4
            animate={hovered ? { color: "#fbbf24" } : { color: "#fff" }}
            transition={{ duration: 0.3 }}
            className="text-base md:text-lg font-black mb-1 leading-tight"
          >
            {project.name}
          </motion.h4>
          <p className="text-slate-400 text-xs mb-3">{project.location}</p>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <p className="text-slate-300 font-medium text-sm">
              {price ? (
                <>From <span className="text-amber-400 font-black">{price}</span></>
              ) : (
                <span className="text-amber-400 font-black">Contact for Price</span>
              )}
            </p>

            <motion.div
              animate={hovered ? { rotate: -45, color: "#fbbf24" } : { rotate: 0, color: "#64748b" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArrowUpRight size={16} />
            </motion.div>
          </div>
        </div>
      </MotionLink>
    </div>
  );
}
