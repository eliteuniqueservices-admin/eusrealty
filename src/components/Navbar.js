"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, ShieldCheck, Instagram, Linkedin, Facebook, Youtube, X, ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoAnimation from './LogoAnimation';

// ─── Nav links config ──────────────────────────────────────────
const NAV_LINKS = [
  { name: "Home",          href: "/",           emoji: "🏠" },
  { name: "Projects",      href: "/properties",  emoji: "🏙️" },
  { name: "Services",      href: "/services",    emoji: "🛠️" },
  { name: "Careers",       href: "/careers",     emoji: "💼" },
  { name: "About",         href: "/about",       emoji: "⭐" },
  { name: "Contact",       href: "/contact",     emoji: "📞" },
];

const MEGA_MENU_CATEGORIES = [
  {
    title: "Top Localities in Pune",
    links: [
      { name: "Flats in Baner", href: "/localities/baner" },
      { name: "Flats in Wakad", href: "/localities/wakad" },
      { name: "Flats in Hinjawadi", href: "/localities/hinjawadi" },
      { name: "Flats in Tathawade", href: "/localities/tathawade" },
      { name: "Flats in Aundh", href: "/localities/aundh" },
      { name: "Flats in Balewadi", href: "/localities/balewadi" },
      { name: "Flats in Pimpri", href: "/localities/pimpri" },
      { name: "Flats in Chinchwad", href: "/localities/chinchwad" }
    ]
  },
  {
    title: "BHK & Budget Searches",
    links: [
      { name: "2 BHK Flats in Baner", href: "/properties/2-bhk-flats-in-baner-pune" },
      { name: "3 BHK Flats in Wakad", href: "/properties/3-bhk-flats-in-wakad-pune" },
      { name: "Flats under 1 Crore", href: "/properties/flats-under-1-cr-in-hinjawadi" },
      { name: "Luxury Flats in Baner", href: "/properties/luxury-flats-in-baner" },
      { name: "Ready to Move Flats", href: "/properties/ready-to-move-flats-in-pune" },
      { name: "New Launch Projects", href: "/properties/new-launch-projects-in-pune" },
      { name: "RERA Approved Projects", href: "/properties/rera-approved-projects-in-pune" },
      { name: "No Brokerage Flats", href: "/properties/no-brokerage-flats-in-pune" }
    ]
  },
  {
    title: "Top Gated Communities",
    links: [
      { name: "Godrej Woodsville (Hinjewadi)", href: "/properties/godrej-woodsville-hinjewadi-pune" },
      { name: "Supreme Estia (Baner)", href: "/properties/supreme-estia-baner-pune" },
      { name: "VTP Cygnus (Kharadi)", href: "/properties/vtp-cygnus-kharadi-pune" },
      { name: "Lara Solitaire (Baner)", href: "/properties/lara-solitaire-baner-pune" },
      { name: "Pune Real Estate Hub", href: "/pune-real-estate" }
    ]
  },
  {
    title: "Builders & Comparisons",
    links: [
      { name: "Godrej Properties Pune", href: "/builders/godrej-properties-pune" },
      { name: "Kolte Patil Developer", href: "/builders/kolte-patil-pune" },
      { name: "VTP Realty Pune", href: "/builders/vtp-realty-pune" },
      { name: "Baner vs Wakad Investment", href: "/compare/baner-vs-wakad-property-investment" },
      { name: "Tathawade vs Hinjawadi", href: "/compare/tathawade-vs-hinjawadi" },
      { name: "2 BHK vs 3 BHK buying", href: "/compare/2-bhk-vs-3-bhk-in-pune" },
      { name: "Construction vs Ready-to-Move", href: "/compare/under-construction-vs-ready-to-move-pune" }
    ]
  }
];

const SERVICES_MENU_CATEGORIES = [
  {
    title: "EUS Edge",
    links: [
      { name: "Home Loans", href: "/home-loans" },
      { name: "Pune Real Estate Hub", href: "/pune-real-estate" },
    ]
  },
  {
    title: "Calculators & Tools",
    links: [
      { name: "ROI Calculator", href: "/calculator" },
      { name: "EMI Calculator", href: "/calculator/emi" },
      { name: "Valuation Index", href: "/calculator/valuation" },
    ]
  },
  {
    title: "Insights & Resources",
    links: [
      { name: "Blog & Market Insights", href: "/blog" },
      { name: "Tathawade vs Wakad", href: "/blog/tathawade-vs-wakad" },
      { name: "First-Time Buyer Guide", href: "/blog/first-time-home-buyer-guide" }
    ]
  }
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
  const [mobileProjectsExpanded, setMobileProjectsExpanded] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);

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
    visible: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
    hidden: {},
  };
  const item = {
    hidden:  { opacity: 0, x: -20, filter: "blur(6px)" },
    visible: { opacity: 1, x: 0,   filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };
  const bottomItem = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] lg:hidden"
          style={{
            background: "linear-gradient(160deg, #020617 0%, #0f172a 50%, #1c1007 100%)",
          }}
        >
          {/* ── Ambient glow orbs ── */}
          <div className="absolute top-[-8%] right-[-8%] w-[50vw] h-[50vw] rounded-full opacity-[0.15] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[15%] left-[-12%] w-[40vw] h-[40vw] rounded-full opacity-[0.08] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)" }} />

          {/* ── Subtle grid texture ── */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

          {/* ── Flex container: fills entire viewport ── */}
          <div className="flex flex-col h-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>

            {/* ── Top bar: logo + close ── */}
            <div className="flex items-center justify-between px-5 sm:px-8 pt-4 pb-2 shrink-0">
              <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                <div className="relative w-9 h-9">
                  <Image src="/logo.svg" alt="EusRealty" fill className="object-contain" />
                </div>
                <div className="leading-none">
                  <span className="text-white font-black text-[15px] tracking-tight">EUS<span className="text-amber-400">REALTY</span></span>
                  <p className="text-[7.5px] text-amber-400/50 font-bold tracking-[0.2em] uppercase mt-0.5">Pune&apos;s Finest</p>
                </div>
              </Link>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-11 h-11 rounded-full bg-white/[0.07] border border-white/[0.12] flex items-center justify-center text-white/70 backdrop-blur-md hover:bg-white/[0.12] hover:text-white transition-colors duration-200"
                aria-label="Close menu"
              >
                <X size={18} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* ── Divider ── */}
            <div className="mx-5 sm:mx-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0" />

            {/* ── Nav links — scrollable center section ── */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-4 min-h-0">
              <motion.nav variants={stagger} initial="hidden" animate="visible" className="space-y-0.5">
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeLink === link.href;

                  if (link.name === "Projects") {
                    return (
                      <motion.div key={link.name} variants={item} className="space-y-1">
                        <button
                          onClick={() => setMobileProjectsExpanded(prev => !prev)}
                          className={`w-full group flex items-center gap-4 py-[13px] sm:py-[15px] px-3 rounded-2xl transition-all duration-200 text-left ${
                            mobileProjectsExpanded
                              ? "bg-amber-400/[0.08]"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          {/* Numbered index indicator */}
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors duration-200 ${
                            mobileProjectsExpanded
                              ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                              : "bg-white/[0.06] text-white/30 border border-white/[0.08] group-hover:text-white/50 group-hover:border-white/[0.15]"
                          }`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>

                          {/* Link name */}
                          <span className={`text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight leading-none transition-colors duration-200 ${
                            mobileProjectsExpanded ? "text-amber-400" : "text-white/75 group-hover:text-white"
                          }`}>
                            {link.name}
                          </span>

                          {/* Chevron toggler */}
                          <div className="ml-auto shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              mobileProjectsExpanded
                                ? "bg-amber-400/15 text-amber-400 border border-amber-400/25 rotate-180"
                                : "bg-transparent text-white/15 border border-transparent group-hover:bg-white/[0.06] group-hover:text-white/40 group-hover:border-white/[0.1]"
                            }`}>
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {mobileProjectsExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-8 pr-2 space-y-4 py-2 border-l border-white/5 ml-7 overflow-hidden text-left"
                            >
                              <Link href="/properties" onClick={onClose} className="block text-amber-400 text-xs font-bold uppercase tracking-wider hover:underline py-1">
                                View All Projects →
                              </Link>
                              
                              {MEGA_MENU_CATEGORIES.map((cat) => (
                                <div key={cat.title} className="space-y-1.5">
                                  <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">{cat.title}</span>
                                  <div className="grid grid-cols-1 gap-1">
                                    {cat.links.map((sublink) => (
                                      <Link
                                        key={sublink.name}
                                        href={sublink.href}
                                        onClick={onClose}
                                        className="text-xs text-white/60 hover:text-amber-400 transition-colors py-1 block truncate"
                                      >
                                        {sublink.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  if (link.name === "Services") {
                    return (
                      <motion.div key={link.name} variants={item} className="space-y-1">
                        <button
                          onClick={() => setMobileServicesExpanded(prev => !prev)}
                          className={`w-full group flex items-center gap-4 py-[13px] sm:py-[15px] px-3 rounded-2xl transition-all duration-200 text-left ${
                            mobileServicesExpanded
                              ? "bg-amber-400/[0.08]"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          {/* Numbered index indicator */}
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors duration-200 ${
                            mobileServicesExpanded
                              ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                              : "bg-white/[0.06] text-white/30 border border-white/[0.08] group-hover:text-white/50 group-hover:border-white/[0.15]"
                          }`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>

                          {/* Link name */}
                          <span className={`text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight leading-none transition-colors duration-200 ${
                            mobileServicesExpanded ? "text-amber-400" : "text-white/75 group-hover:text-white"
                          }`}>
                            {link.name}
                          </span>

                          {/* Chevron toggler */}
                          <div className="ml-auto shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              mobileServicesExpanded
                                ? "bg-amber-400/15 text-amber-400 border border-amber-400/25 rotate-180"
                                : "bg-transparent text-white/15 border border-transparent group-hover:bg-white/[0.06] group-hover:text-white/40 group-hover:border-white/[0.1]"
                            }`}>
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {mobileServicesExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-8 pr-2 space-y-4 py-2 border-l border-white/5 ml-7 overflow-hidden text-left"
                            >
                              {SERVICES_MENU_CATEGORIES.map((cat) => (
                                <div key={cat.title} className="space-y-1.5">
                                  <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">{cat.title}</span>
                                  <div className="grid grid-cols-1 gap-1">
                                    {cat.links.map((sublink) => (
                                      <Link
                                        key={sublink.name}
                                        href={sublink.href}
                                        onClick={onClose}
                                        className="text-xs text-white/60 hover:text-amber-400 transition-colors py-1 block truncate"
                                      >
                                        {sublink.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={link.name} variants={item}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`group flex items-center gap-4 py-[13px] sm:py-[15px] px-3 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? "bg-amber-400/[0.08]"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Numbered index indicator */}
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors duration-200 ${
                          isActive
                            ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                            : "bg-white/[0.06] text-white/30 border border-white/[0.08] group-hover:text-white/50 group-hover:border-white/[0.15]"
                        }`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        {/* Link name */}
                        <span className={`text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight leading-none transition-colors duration-200 ${
                          isActive ? "text-amber-400" : "text-white/75 group-hover:text-white"
                        }`}>
                          {link.name}
                        </span>

                        {/* Arrow indicator (pushed to far right) */}
                        <div className="ml-auto shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? "bg-amber-400/15 text-amber-400 border border-amber-400/25"
                              : "bg-transparent text-white/15 border border-transparent group-hover:bg-white/[0.06] group-hover:text-white/40 group-hover:border-white/[0.1]"
                          }`}>
                            <ArrowUpRight size={14} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
            </div>

            {/* ── Bottom strip — always pinned to bottom ── */}
            <motion.div
              variants={bottomItem}
              initial="hidden"
              animate="visible"
              className="shrink-0 border-t border-white/[0.07] bg-black/30 backdrop-blur-sm"
            >
              {/* CTA + Socials row */}
              <div className="px-5 sm:px-8 pt-4 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <a href={`tel:${PHONE}`} className="flex items-center gap-3 group min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/25 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-amber-400" />
                    </div>
                    <div className="leading-none min-w-0">
                      <p className="text-[8px] text-amber-400/50 font-bold uppercase tracking-[0.15em]">Free Consultation</p>
                      <p className="text-[13px] font-bold text-white mt-0.5 truncate">{PHONE_DISP}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-2 shrink-0">
                    {SOCIALS.map(({ icon: Icon, href, label }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-200"
                        aria-label={label}
                      >
                        <Icon size={13} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* RERA badge */}
              <div className="px-5 sm:px-8 pb-4 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-emerald-400/70 shrink-0" />
                  <span className="text-[8px] text-white/25 font-medium uppercase tracking-[0.15em]">MahaRERA: A041262501741 · © 2026 EusRealty</span>
                </div>
              </div>
            </motion.div>
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
  const [animationActive, setAnimationActive] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null); // null | "projects"
  const closeTimeoutRef = useRef(null);

  const handleDropdownMouseEnter = (menuName) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menuName);
    if (menuName === "projects") setHoveredIdx(1);
    else if (menuName === "services") setHoveredIdx(2);
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredIdx(null);
    }, 150);
  };
  const [animationTheme, setAnimationTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const override = params.get('logo-anim');
      if (override && ['snow', 'rain', 'confetti'].includes(override)) {
        return override;
      }
    }

    const month = new Date().getMonth();
    // Winter: Nov, Dec, Jan, Feb
    if ([10, 11, 0, 1].includes(month)) {
      return 'snow';
    }
    // Rainy/Monsoon: Jun, Jul, Aug, Sep
    else if ([5, 6, 7, 8].includes(month)) {
      return 'rain';
    }
    // Default / Confetti: Mar, Apr, May, Oct
    else {
      return 'confetti';
    }
  });
  const [showDemoPanel, setShowDemoPanel] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('demo') === 'true';
    }
    return false;
  });
  const [weatherText, setWeatherText] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('logo-anim')) {
        return 'URL override active';
      }
    }
    return 'Detecting...';
  });
  const lastScrollY   = useRef(0);
  const scrolledRef   = useRef(false);

  const pathname = usePathname();

  // Fetch real-time weather on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('logo-anim')) {
        return;
      }

      // Check session cache first
      try {
        const cached = sessionStorage.getItem('eus_weather_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.theme && parsed.text) {
            setAnimationTheme(parsed.theme);
            setWeatherText(parsed.text);
            return;
          }
        }
      } catch (cacheErr) {
        console.debug('Failed to read weather cache from sessionStorage', cacheErr);
      }
    }

    const fetchWeather = async () => {
      let lat = 18.5204; // Default to Pune coordinates
      let lon = 73.8567;
      let city = 'Pune';

      // Step 1: Geolocate user silently by IP (no popup)
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
            lat = ipData.latitude;
            lon = ipData.longitude;
            city = ipData.city || 'Local';
          }
        }
      } catch (ipErr) {
        // Silent catch: adblockers commonly block IP APIs. Default to Pune.
        console.debug('IP Geolocation blocked/failed, defaulting to Pune.', ipErr);
      }

      // Step 2: Query Open-Meteo for temperature and WMO weather code
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          const current = weatherData.current_weather;
          if (current) {
            const temp = current.temperature;
            const code = current.weathercode;
            
            // Map WMO codes
            const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
            const snowCodes = [71, 73, 75, 77, 85, 86];

            let theme = 'confetti';
            let text = `Sunny/Clear (${temp}°C in ${city})`;

            if (snowCodes.includes(code) || temp < 6) {
              theme = 'snow';
              text = `Snowy (${temp}°C in ${city})`;
            } else if (rainCodes.includes(code)) {
              theme = 'rain';
              text = `Rainy (${temp}°C in ${city})`;
            }

            setAnimationTheme(theme);
            setWeatherText(text);

            // Cache result in sessionStorage
            try {
              sessionStorage.setItem('eus_weather_data', JSON.stringify({ theme, text }));
            } catch (sErr) {}
            return; // Successful fetch!
          }
        }
        throw new Error('Weather API returned invalid response');
      } catch (weatherErr) {
        // Silent fallback: print a clean console message instead of a loud warning with stack trace
        console.log('Weather API offline/blocked. Using seasonal fallback.');
        
        // Fallback to month-based seasonal detection
        const month = new Date().getMonth();
        let theme = 'confetti';
        let text = 'Sunny Fallback';

        if ([10, 11, 0, 1].includes(month)) {
          theme = 'snow';
          text = 'Winter Fallback';
        } else if ([5, 6, 7, 8].includes(month)) {
          theme = 'rain';
          text = 'Rainy Fallback';
        }

        setAnimationTheme(theme);
        setWeatherText(text);

        // Cache the fallback so we don't spam requests in this session
        try {
          sessionStorage.setItem('eus_weather_data', JSON.stringify({ theme, text }));
        } catch (sErr) {}
      }
    };

    fetchWeather();
  }, []);

  const triggerAnimationDirectly = (theme) => {
    setAnimationTheme(theme);
    setAnimationActive(false);
    setTimeout(() => {
      setAnimationActive(true);
    }, 50);
  };

  const handleLogoClick = () => {
    if (typeof window !== 'undefined') {
      const played = sessionStorage.getItem('eus_logo_anim_played');
      if (!played) {
        sessionStorage.setItem('eus_logo_anim_played', 'true');
        setAnimationActive(true);
        console.log(
          '%c[EusRealty] Logo animation triggered! Theme: ' + animationTheme + ' (Weather: ' + weatherText + ').\nTo replay, run `sessionStorage.clear()` in your console or open a new session/tab.',
          'color: #f59e0b; font-weight: bold; font-size: 11px;'
        );
      }
    }
  };

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

  useEffect(() => { setTimeout(() => setMenuOpen(false), 0); }, [pathname]);

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
        onMouseLeave={handleDropdownMouseLeave}
      >

        {/* ── Main Nav Bar ── */}
        <div className={`w-full transition-colors duration-200 ${
          scrolled
            ? "bg-white border-b border-slate-200/80"
            : "bg-white/85 backdrop-blur-md border-b border-slate-100/40"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] sm:h-16 flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link
              href="/"
              onClick={handleLogoClick}
              onMouseEnter={() => {
                setActiveDropdown(null);
                setHoveredIdx(null);
              }}
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
            >
              <motion.div
                className="relative w-8 h-8 sm:w-10 sm:h-10"
                whileHover={{ scale: 1.06, rotate: -3 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Image src="/logo.svg" alt="EusRealty Logo" fill className="object-contain" priority />
              </motion.div>
              <div className="leading-none">
                <span className="text-[15px] sm:text-lg font-black tracking-tighter text-slate-950">
                  EUS<span className="text-amber-500">REALTY</span>
                </span>
                <p className="text-[7.5px] sm:text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5 hidden sm:block">
                  Pune&apos;s Finest
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav
              className="hidden lg:flex items-center"
              onMouseLeave={() => {
                if (activeDropdown !== "projects" && activeDropdown !== "services") {
                  setHoveredIdx(null);
                }
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <NavLink
                  key={link.name}
                  link={link}
                  isActive={pathname === link.href}
                  isHovered={hoveredIdx === i}
                  onEnter={() => {
                    setHoveredIdx(i);
                    if (link.name === "Projects") {
                      handleDropdownMouseEnter("projects");
                    } else if (link.name === "Services") {
                      handleDropdownMouseEnter("services");
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                  onLeave={null}
                />
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div
              className="hidden lg:flex items-center gap-3 shrink-0"
              onMouseEnter={() => {
                setActiveDropdown(null);
                setHoveredIdx(null);
              }}
            >
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
              className="lg:hidden relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-[5px] shadow-sm z-[210]"
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
                        ? { width: "16px", rotate: 45, y: 7 }
                        : i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : { width: "16px", rotate: -45, y: -7 }
                      : { width: i === 1 ? "12px" : "16px", rotate: 0, y: 0, opacity: 1, scaleX: 1 }
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

        {/* Mega Menu Dropdown Panel */}
        <AnimatePresence>
          {activeDropdown === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => handleDropdownMouseEnter("projects")}
              onMouseLeave={handleDropdownMouseLeave}
              className="absolute left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 pointer-events-auto"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {MEGA_MENU_CATEGORIES.map((category) => (
                  <div key={category.title} className="space-y-4 text-left">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      {category.title}
                    </h4>
                    <ul className="space-y-2">
                      {category.links.map((sublink) => (
                        <li key={sublink.name}>
                          <Link 
                            href={sublink.href}
                            className="text-slate-600 hover:text-amber-600 transition-all font-semibold text-xs hover:pl-1 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {sublink.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Dropdown Panel */}
        <AnimatePresence>
          {activeDropdown === "services" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => handleDropdownMouseEnter("services")}
              onMouseLeave={handleDropdownMouseLeave}
              className="absolute left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 pointer-events-auto"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {SERVICES_MENU_CATEGORIES.map((category) => (
                  <div key={category.title} className="space-y-4 text-left">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      {category.title}
                    </h4>
                    <ul className="space-y-2">
                      {category.links.map((sublink) => (
                        <li key={sublink.name}>
                          <Link 
                            href={sublink.href}
                            className="text-slate-600 hover:text-amber-600 transition-all font-semibold text-xs hover:pl-1 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {sublink.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
      {animationActive && (
        <LogoAnimation
          theme={animationTheme}
          onClose={() => setAnimationActive(false)}
        />
      )}

      {showDemoPanel && (
        <div className="fixed bottom-5 right-5 z-[10000] max-w-sm w-72 bg-white/85 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-black text-[10px] uppercase tracking-wider">EusRealty</span>
              <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Demo Controller</span>
            </div>
            <button
              onClick={() => setShowDemoPanel(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Close demo panel"
            >
              <X size={14} />
            </button>
          </div>
          
          <div>
            <h4 className="text-[12px] font-bold text-slate-800">Animation Style Selector</h4>
            <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">
              Trigger any full-viewport logo click animation style instantly.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 mt-0.5">
            <button
              onClick={() => triggerAnimationDirectly('rain')}
              className="flex items-center justify-between px-3 py-2 text-[11px] font-bold rounded-xl bg-slate-50 hover:bg-amber-500 hover:text-white border border-slate-200 transition-all text-left group"
            >
              <span className="text-slate-700 group-hover:text-white">🌧️ Monsoon Rain</span>
              <span className="text-[9px] text-slate-400 group-hover:text-amber-100 font-medium text-right">Streak Parallax + Splash Drops</span>
            </button>
            <button
              onClick={() => triggerAnimationDirectly('snow')}
              className="flex items-center justify-between px-3 py-2 text-[11px] font-bold rounded-xl bg-slate-50 hover:bg-amber-500 hover:text-white border border-slate-200 transition-all text-left group"
            >
              <span className="text-slate-700 group-hover:text-white">❄️ Winter Snow</span>
              <span className="text-[9px] text-slate-400 group-hover:text-amber-100 font-medium text-right">Soft Fluffy Radial Glow</span>
            </button>
            <button
              onClick={() => triggerAnimationDirectly('confetti')}
              className="flex items-center justify-between px-3 py-2 text-[11px] font-bold rounded-xl bg-slate-50 hover:bg-amber-500 hover:text-white border border-slate-200 transition-all text-left group"
            >
              <span className="text-slate-700 group-hover:text-white">🎉 Spring/Summer Confetti</span>
              <span className="text-[9px] text-slate-400 group-hover:text-amber-100 font-medium text-right">3D Tumbling + Twinkle Sparkle</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-100 pt-2 mt-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('eus_logo_anim_played');
                    alert('Session limit cleared! You can now test clicking the logo normally.');
                  }
                }}
                className="text-[9px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider"
              >
                Clear Session Limit
              </button>
              <span className="text-[8.5px] text-slate-400 italic">Theme: <span className="font-semibold">{animationTheme}</span></span>
            </div>
            <div className="text-[8px] text-slate-400 italic text-right mt-0.5">
              Live Weather: <span className="font-semibold text-slate-500">{weatherText}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}