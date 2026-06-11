"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, ShieldCheck, Instagram, Linkedin, Facebook, Youtube, X, ArrowUpRight, Building2, Sparkles, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Nav links config ──────────────────────────────────────────
const NAV_LINKS = [
  { name: "Home",          href: "/",           emoji: "🏠" },
  { name: "Projects",   href: "/properties",  emoji: "🏙️" },
  { name: "ROI Calc",     href: "/calculator",  emoji: "📈" },
  { name: "Careers",      href: "/careers",     emoji: "💼" },
  { name: "About",        href: "/about",       emoji: "⭐" },
  { name: "Contact",      href: "/contact",     emoji: "📞" },
];

const SOCIALS = [
  { icon: Facebook,   href: "https://www.facebook.com/share/1C4Vt5oHLD/",                               label: "Facebook",  color: "#1877f2" },
  { icon: Instagram,  href: "https://www.instagram.com/eus.pune?igsh=MXE5dHh4cHl4N2g4eQ==",             label: "Instagram", color: "#e1306c" },
  { icon: Linkedin,   href: "https://www.linkedin.com/company/elite-unique-services/",                  label: "LinkedIn",  color: "#0077b5" },
  { icon: Youtube,    href: "https://www.youtube.com/@Elite_Unique_Services",                            label: "YouTube",   color: "#ff0000" },
];

const PHONE      = "+917620733613";
const PHONE_DISP = "+91 76207 33613";

// ─── Mobile full-screen menu overlay ──────────────────────────
function MobileMenu({ open, onClose, activeLink }) {
  const menuVariants = {
    hidden: { clipPath: "circle(0% at calc(100% - 36px) 36px)", opacity: 0 },
    visible: {
      clipPath: "circle(170% at calc(100% - 36px) 36px)",
      opacity: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      clipPath: "circle(0% at calc(100% - 36px) 36px)",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
    hidden: {},
  };
  const item = {
    hidden:  { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] lg:hidden overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a0a1a 0%, #0f172a 40%, #1a0f05 100%)",
          }}
        >
          {/* Ambient orbs inside menu */}
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[10%] left-[-15%] w-[50vw] h-[50vw] rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)" }} />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md"
            aria-label="Close menu"
          >
            <X size={20} />
          </motion.button>

          {/* Logo inside menu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-5 left-5"
          >
            <Link href="/" onClick={onClose} className="flex items-center gap-3">
              <div className="relative w-9 h-9">
                <Image src="/logo.svg" alt="EusRealty" fill className="object-contain" />
              </div>
              <div className="leading-none">
                <span className="text-white font-black text-base tracking-tight">EUS<span className="text-amber-400">REALTY</span></span>
                <p className="text-[8px] text-amber-400/60 font-bold tracking-[0.18em] uppercase mt-0.5">Pune&apos;s Finest</p>
              </div>
            </Link>
          </motion.div>

          {/* Nav links — large display */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 pt-20 pb-40">
            <motion.nav variants={stagger} initial="hidden" animate="visible">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeLink === link.href;
                return (
                  <motion.div key={link.name} variants={item}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between py-4 border-b border-white/8 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{link.emoji}</span>
                        <span className={`text-[2.2rem] xs:text-[2.6rem] font-black tracking-tight leading-none transition-colors duration-300 ${
                          isActive ? "text-amber-400" : "text-white/80 group-hover:text-white"
                        }`}>
                          {link.name}
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                            : "border-white/10 bg-white/5 text-white/40 group-hover:border-white/30 group-hover:text-white"
                        }`}
                      >
                        <ArrowUpRight size={16} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </div>

          {/* Bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <a href={`tel:${PHONE}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                  <Phone size={14} className="text-amber-400" />
                </div>
                <div className="leading-none">
                  <p className="text-[9px] text-amber-400/60 font-bold uppercase tracking-wider">Free Consultation</p>
                  <p className="text-sm font-bold text-white mt-0.5">{PHONE_DISP}</p>
                </div>
              </a>

              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span className="text-[9px] text-white/30 font-medium uppercase tracking-widest">MahaRERA: A041262501741 · © 2026 EusRealty</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Animated link with underline runner ───────────────────────
// NOTE: We use a wrapping <span> with relative positioning because <Link> renders
// as an inline <a> element — absolutely-positioned children inside an inline element
// don't size/position correctly. The outer span acts as the positioned block container.
function NavLink({ link, isActive, isHovered, onEnter, onLeave }) {
  return (
    <span
      className="relative inline-block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Hover background pill — positioned relative to the outer span */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            layoutId="navHoverBubble"
            className="absolute inset-0 rounded-xl bg-slate-100"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          />
        )}
      </AnimatePresence>

      {/* Active amber underline runner */}
      {isActive && (
        <motion.span
          layoutId="activeUnderline"
          className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
          style={{ zIndex: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <Link
        href={link.href}
        className={`relative inline-block px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200 select-none leading-none ${
          isActive ? "text-slate-950 font-bold" : "text-slate-500 hover:text-slate-800"
        }`}
        style={{ zIndex: 2 }}
      >
        {link.name}
      </Link>
    </span>
  );
}

// ─── $10M Consultation CTA Button ─────────────────────────────
function ConsultationCTA() {
  const [ripples, setRipples] = useState([]);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleClick = (e) => {
    // Fire the visual ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const id   = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    // Navigate after brief ripple delay so animation is visible
    setTimeout(() => router.push('/contact'), 120);
  };

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95, y: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="relative overflow-hidden flex items-center gap-2.5 px-6 py-[11px] rounded-full font-bold text-[12px] uppercase tracking-[0.18em] cursor-pointer select-none"
        style={{
          background: hovered
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 55%, #b45309 100%)'
            : 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          color: hovered ? '#0a0a0a' : '#ffffff',
          boxShadow: hovered
            ? '0 0 0 1.5px rgba(251,191,36,0.6), 0 0 35px rgba(251,191,36,0.5), 0 10px 28px rgba(0,0,0,0.22)'
            : '0 0 0 1px rgba(251,191,36,0.3), 0 4px 16px rgba(0,0,0,0.22)',
          transition: 'background 0.3s ease, color 0.2s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Perpetual gold shimmer sweep */}
        <motion.span
          animate={{ x: ['-120%', '240%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
          className="absolute inset-0 w-[38%] pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
        />

        {/* Ambient outer glow — pulses gently, intensifies on hover */}
        <motion.span
          animate={{ opacity: hovered ? [0.7, 1, 0.7] : [0.12, 0.25, 0.12] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{
            inset: '-6px',
            borderRadius: '9999px',
            background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.6) 0%, transparent 68%)',
            filter: 'blur(12px)',
            zIndex: -1,
          }}
        />

        {/* Click ripples — radiate from exact cursor point */}
        {ripples.map(({ id, x, y }) => (
          <motion.span
            key={id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: x, top: y,
              translateX: '-50%', translateY: '-50%',
              background: hovered ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.45)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 160, height: 160, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        ))}

        {/* Icon: bounces + rotates on hover */}
        <motion.span
          animate={{ rotate: hovered ? 18 : 0, scale: hovered ? 1.25 : 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 12 }}
          className="relative z-20 shrink-0"
        >
          <Sparkles size={13} strokeWidth={2.5} />
        </motion.span>

        {/* Label: subtle letter-spacing expand on hover */}
        <motion.span
          animate={{ letterSpacing: hovered ? '0.24em' : '0.18em' }}
          transition={{ duration: 0.28 }}
          className="relative z-20"
        >
          Consultation
        </motion.span>
      </motion.button>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const lastScrollY   = useRef(0);
  const scrolledRef   = useRef(false);

  const pathname = usePathname();

  // rAF-gated scroll listener — only re-renders when scrolled state actually flips
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const y = window.scrollY;
        const nowScrolled = y > 20;
        if (nowScrolled !== scrolledRef.current) {
          scrolledRef.current = nowScrolled;
          setScrolled(nowScrolled);
        }
        lastScrollY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Full-screen mobile overlay ── */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeLink={pathname} />

      {/* ── Header container: will-change promotes to GPU layer for zero-lag scroll ── */}
      <header
        className={`sticky top-0 z-[100] w-full relative transition-shadow duration-300 ${
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.07)]" : ""
        }`}
        style={{ willChange: 'transform' }}
      >

        {/* ── Main Nav Bar ── */}
        <div className={`w-full transition-colors duration-200 ${
          scrolled
            ? "bg-white border-b border-slate-200/80"
            : "bg-white/85 backdrop-blur-md border-b border-slate-100/40"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                className="relative w-9 h-9 sm:w-10 sm:h-10"
                whileHover={{ scale: 1.06, rotate: -3 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Image src="/logo.svg" alt="EusRealty Logo" fill className="object-contain" priority />
              </motion.div>
              <div className="leading-none">
                <span className="text-base sm:text-lg font-black tracking-tighter text-slate-950">
                  EUS<span className="text-amber-500">REALTY</span>
                </span>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5 hidden sm:block">
                  Pune&apos;s Finest
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav
              className="hidden lg:flex items-center"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {NAV_LINKS.map((link, i) => (
                <NavLink
                  key={link.name}
                  link={link}
                  isActive={pathname === link.href}
                  isHovered={hoveredIdx === i}
                  onEnter={() => setHoveredIdx(i)}
                  onLeave={() => {}}
                />
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* RERA trust pill */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <ShieldCheck size={11} className="text-emerald-500" />
                RERA Vetted
              </div>

              {/* Phone quick-dial */}
              <a href={`tel:${PHONE}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-200 text-slate-700 hover:text-amber-700 transition-all duration-300 text-[12px] font-bold"
              >
                <Phone size={13} />
                <span className="hidden xl:inline">{PHONE_DISP}</span>
              </a>

              {/* Primary CTA */}
              <ConsultationCTA />
            </div>

            {/* ── Mobile Hamburger ── */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.88 }}
              className="lg:hidden relative w-11 h-11 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-[5px] shadow-sm z-[210]"
              aria-label="Toggle navigation"
            >
              {/* Three bars morphing into X on open */}
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-[2px] bg-slate-700 rounded-full origin-center"
                  animate={
                    menuOpen
                      ? i === 0
                        ? { width: "18px", rotate: 45, y: 7 }
                        : i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : { width: "18px", rotate: -45, y: -7 }
                      : { width: i === 1 ? "12px" : "18px", rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </motion.button>
          </div>

          {/* ── Subtle amber accent line at bottom of nav ── */}
          <div className="h-[1.5px] w-full">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>
        </div>
      </header>
    </>
  );
}