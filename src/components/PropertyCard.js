"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Shield,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/propertyUrls";

const MotionLink = motion.create(Link);

/* ─────────────────────────────────────────────────────────────
   ANIMATED NUMBER COUNTER (counts up from 0 to value on mount)
───────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 1.4, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;

    const step = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * numeric));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

const PARTICLE_SEEDS = Object.freeze(
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    delay: Math.random() * 0.6,
    size: 2 + Math.random() * 3,
    duration: 1.2 + Math.random() * 0.8,
  }))
);

/* ─────────────────────────────────────────────────────────────
   FLOATING PARTICLES (gold sparkle dots that drift upward)
───────────────────────────────────────────────────────────── */
function Particles({ active }) {
  return (
    <AnimatePresence>
      {active &&
        PARTICLE_SEEDS.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0, y: 0, x: `${p.x}%`, scale: 0 }}
            animate={{ opacity: [0, 1, 0], y: -60, scale: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fbbf24, #f59e0b)",
              boxShadow: "0 0 6px 2px rgba(251,191,36,0.6)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
        ))}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PROPERTY CARD
───────────────────────────────────────────────────────────── */
export default function PropertyCard({
  title,
  location,
  price,
  beds,
  bhk,
  baths,
  area,
  image,
  badge = "Premium",
  roi = "14.2",
  views = "2.4k",
  isNew = false,
  id,
  type,
  status,
  rera,
  possession,
  updatedAt,
  developer,
  sqFtRate,
  priority = false,
}) {
  const displayBeds = beds || bhk;
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState(false);
  const router = useRouter();

  const isMongoId = id && /^[a-f\d]{24}$/i.test(id);
  const slug = isMongoId ? slugify(`${title} ${location} pune`) : id;
  const cardLink = `/properties/${slug}`;

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    router.push(cardLink);
  };

  /* ── 3-D Magnetic Tilt via Framer Motion Values ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 200,
    damping: 22,
  });

  /* ── Shine / Specular highlight position ── */
  const shineX = useSpring(useTransform(rawX, [-0.5, 0.5], [-50, 150]), {
    stiffness: 180,
    damping: 20,
  });
  const shineY = useSpring(useTransform(rawY, [-0.5, 0.5], [-50, 150]), {
    stiffness: 180,
    damping: 20,
  });

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

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => !p);
    if (!liked) {
      setParticles(true);
      setTimeout(() => setParticles(false), 1500);
    }
  };

  return (
    <div style={{ perspective: "1200px" }} className="relative h-full">
      {/* ── OUTER GLOW RING (animates on hover) ── */}
      <motion.div
        animate={hovered ? { opacity: 1, scale: 1.03 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.35) 0%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: -1,
        }}
      />

      {/* ── CARD WRAPPER (3D tilt host) ── */}
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className="relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 h-full cursor-pointer select-none"
        whileHover={{ boxShadow: "0 40px 80px -20px rgba(15,23,42,0.2), 0 0 0 1px rgba(251,191,36,0.2)" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── SPECULAR SHINE LAYER ── */}
        <motion.div
          style={{
            background: useTransform(
              [shineX, shineY],
              ([sx, sy]) =>
                `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.18) 0%, transparent 55%)`
            ),
            pointerEvents: "none",
            zIndex: 40,
          }}
          className="absolute inset-0 rounded-[2rem]"
        />

        {/* ════════════════════════════════════════
            IMAGE AREA
        ════════════════════════════════════════ */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 flex-shrink-0">
          {/* Property image with parallax-zoom */}
          <motion.div
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            <Image
              src={
                image ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              }
              alt={title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <motion.div
            animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"
          />

          {/* ── BADGES TOP-LEFT ── */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
            {badge && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xl border border-white/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md"
              >
                <Sparkles size={10} className="fill-amber-400" />
                {badge}
              </motion.div>
            )}

            {type && type !== badge && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 text-[10px] font-extrabold rounded-full shadow-sm tracking-wide"
              >
                {type}
              </motion.div>
            )}

            {status && status !== badge && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full shadow-sm backdrop-blur-md tracking-wide border ${
                  status === "Ready to Move"
                    ? "bg-slate-950/90 text-amber-400 border-slate-800/50"
                    : "bg-white/95 text-slate-900 border-slate-200"
                }`}
              >
                {status}
              </motion.div>
            )}
          </div>

          {/* ── NEW badge ── */}
          {isNew && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
              className="absolute top-4 left-[calc(50%-20px)] bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
            >
              NEW
            </motion.div>
          )}

          {/* ── LIKE & SHARE BUTTONS (top-right) ── */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <a 
              href={`https://wa.me/917620733613?text=${encodeURIComponent(`Hi! I'm interested in: ${title} in ${location}. Please share the floor plan and brochure. Link: https://eusrealty.co.in/properties/${slug || id}`)}`}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-lg text-white transition-all animate-pulse"
              title="Share via WhatsApp"
            >
              <Share2 size={14} className="text-white" />
            </a>
            
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-lg"
              >
                <Heart
                  size={16}
                  className={liked ? "fill-red-500 text-red-500" : "text-white"}
                  style={{ transition: "all 0.3s" }}
                />
              </motion.button>
              {/* Particles burst from like button */}
              <Particles active={particles} />
            </div>
          </div>

          {/* ── QUICK-STATS STRIP (slides up on hover) ── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                <Eye size={11} />
                {views} views
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                <TrendingUp size={11} />
                {roi}% ROI
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              <Shield size={11} />
              RERA ✓
            </div>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            CONTENT AREA
        ════════════════════════════════════════ */}
        <div className="px-6 sm:px-7 pt-6 pb-7 flex flex-col flex-1 relative">
          {/* Subtle inner grid texture */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* ── LOCATION ── */}
          <motion.div
            animate={hovered ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 text-slate-500 mb-2 font-medium"
          >
            <MapPin size={13} className="text-amber-500 shrink-0" />
            <span className="text-xs tracking-wide truncate">{location}</span>
          </motion.div>

          {/* ── TITLE ── */}
          <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight tracking-tight relative z-10">
            <motion.span
              animate={hovered ? { color: "#d97706" } : { color: "#0f172a" }}
              transition={{ duration: 0.3 }}
              style={{ display: "block" }}
            >
              {title}
            </motion.span>
          </h3>

          {/* Developer & RERA banner */}
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 relative z-10">
            <span className="truncate max-w-[140px] text-slate-700 font-extrabold">{developer || "Premium Builder"}</span>
            <a
              href="https://maharerait.mahaonline.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-black hover:underline hover:text-emerald-700 transition-colors"
            >
              {rera ? `RERA: ${rera}` : "RERA Verified"}
            </a>
          </div>

          {/* ── SPECS GRID ── */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-4 relative z-10">
            {[
              {
                icon: <BedDouble size={17} />,
                value: displayBeds,
                label: "BHK",
              },
              {
                icon: <Bath size={17} />,
                value: baths,
                label: "Bath",
              },
              {
                icon: <Maximize size={17} />,
                value: area,
                label: "sq.ft",
              },
            ].map((spec, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={`flex flex-col items-center justify-center gap-1 py-1 ${
                  i < 2 ? "border-r border-slate-100" : ""
                }`}
              >
                <motion.div
                  animate={hovered ? { color: "#f59e0b" } : { color: "#94a3b8" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  {spec.icon}
                </motion.div>
                <span className="font-black text-slate-900 text-sm">
                  {spec.value}{" "}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {spec.label}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>

          {/* Timeline and Updated date */}
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mb-5 relative z-10">
            <span>Possession: <strong className="text-slate-700 font-black">{possession || "Immediate"}</strong></span>
            <span>Updated: <strong className="text-slate-700 font-black">{updatedAt || "Jun 20, 2026"}</strong></span>
          </div>

          {/* ── PRICE + CTA ROW ── */}
          <div className="flex items-end justify-between mt-auto relative z-10">
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-widest">
                Starting From
              </p>
              <motion.p
                animate={hovered ? { scale: 1.04 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-2xl font-black text-slate-900 leading-none"
                style={{ transformOrigin: "left center" }}
              >
                <motion.span
                  animate={hovered ? { color: "#d97706" } : { color: "#0f172a" }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{price}
                </motion.span>
              </motion.p>
              {sqFtRate && sqFtRate !== "On Request" && (
                <p className="text-[10px] font-bold text-amber-600 mt-1">
                  {sqFtRate}
                </p>
              )}
            </div>

            {/* ── MAGNETIC CTA BUTTON ── */}
            <MotionLink
              href={cardLink}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden group/btn bg-slate-950 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-lg"
            >
              {/* fill sweep */}
              <motion.span
                initial={false}
                animate={hovered ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 bg-amber-500 origin-bottom"
              />
              <motion.span
                animate={hovered ? { color: "#0f172a" } : { color: "#fff" }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex items-center gap-1.5"
              >
                Details
                <motion.span
                  animate={hovered ? { rotate: -45, x: 2, y: -2 } : { rotate: 0, x: 0, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ArrowUpRight size={16} />
                </motion.span>
              </motion.span>
            </MotionLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}