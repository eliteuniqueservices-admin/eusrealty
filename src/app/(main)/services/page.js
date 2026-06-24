'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  ArrowRight, Sparkles, Calculator, TrendingUp, PiggyBank,
  BookOpen, Home, BarChart3, FileText, Lightbulb,
  Shield, Star, Zap, ChevronRight, ArrowUpRight,
  CheckCircle2, Phone
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SERVICES DATA — mirrors SERVICES_MENU_CATEGORIES
───────────────────────────────────────────── */
const SERVICES = [
  {
    category: "EUS Edge",
    tagline: "Premium solutions powered by industry expertise and direct builder relationships.",
    icon: <Sparkles size={22} strokeWidth={2} />,
    accent: "amber",
    spotlight: "rgba(251,191,36,0.12)",
    items: [
      {
        name: "Home Loans",
        href: "/home-loans",
        description: "Compare rates from 20+ banks. Get pre-approved in 48 hours with our direct lender partnerships and zero processing hassle.",
        icon: <Home size={22} />,
        badge: "Most Popular",
        color: "#f59e0b",
        stats: "20+ Partner Banks",
      },
      {
        name: "Pune Real Estate Hub",
        href: "/pune-real-estate",
        description: "Your single destination for Pune's complete property ecosystem — market data, locality deep-dives, and investment intelligence.",
        icon: <BarChart3 size={22} />,
        badge: "Comprehensive",
        color: "#f59e0b",
        stats: "50+ Localities Covered",
      },
    ],
  },
  {
    category: "Calculators & Tools",
    tagline: "Make data-driven property decisions with our precision-engineered calculators.",
    icon: <Calculator size={22} strokeWidth={2} />,
    accent: "blue",
    spotlight: "rgba(59,130,246,0.12)",
    items: [
      {
        name: "ROI Calculator",
        href: "/calculator",
        description: "Forecast returns on any Pune property with our proprietary algorithm factoring appreciation, rental yield, and tax benefits.",
        icon: <TrendingUp size={22} />,
        badge: "Smart Analytics",
        color: "#3b82f6",
        stats: "Live Market Data",
      },
      {
        name: "EMI Calculator",
        href: "/calculator/emi",
        description: "Instantly calculate your monthly payments across different loan tenures, interest rates, and down payment scenarios.",
        icon: <PiggyBank size={22} />,
        badge: "Instant Results",
        color: "#3b82f6",
        stats: "All Banks Supported",
      },
      {
        name: "Valuation Index",
        href: "/calculator/valuation",
        description: "Get real-time property valuations powered by comparable sales data, locality trends, and market momentum indicators.",
        icon: <BarChart3 size={22} />,
        badge: "AI-Powered",
        color: "#3b82f6",
        stats: "Real-Time Pricing",
      },
    ],
  },
  {
    category: "Insights & Resources",
    tagline: "Expert knowledge and market intelligence to guide every property decision.",
    icon: <BookOpen size={22} strokeWidth={2} />,
    accent: "emerald",
    spotlight: "rgba(16,185,129,0.12)",
    items: [
      {
        name: "Blog & Market Insights",
        href: "/blog",
        description: "Weekly analysis of Pune's real estate trends, RERA updates, price movements, and exclusive developer launch previews.",
        icon: <FileText size={22} />,
        badge: "Updated Weekly",
        color: "#10b981",
        stats: "100+ Articles",
      },
      {
        name: "Tathawade vs Wakad",
        href: "/blog/tathawade-vs-wakad",
        description: "Our most-read comparison — detailed investment analysis covering appreciation rates, infrastructure, and lifestyle factors.",
        icon: <Lightbulb size={22} />,
        badge: "Top Read",
        color: "#10b981",
        stats: "10K+ Reads",
      },
      {
        name: "First-Time Buyer Guide",
        href: "/blog/first-time-home-buyer-guide",
        description: "The definitive 2025 handbook for first-time buyers in Pune — from RERA verification to loan sanctioning to registration.",
        icon: <BookOpen size={22} />,
        badge: "Essential",
        color: "#10b981",
        stats: "Complete Guide",
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   FLOATING ORB (ambient background)
───────────────────────────────────────────── */
function FloatingOrb({ style, duration = 8, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -25, 0], x: [0, 8, 0], scale: [1, 1.06, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─────────────────────────────────────────────
   SERVICE CARD — light theme with cursor spotlight
───────────────────────────────────────────── */
function ServiceCard({ item, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mouse-x', `${x}%`);
    ref.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <Link href={item.href} className="block h-full">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, boxShadow: '0 28px 60px -12px rgba(15,23,42,0.1)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="group relative h-full p-6 sm:p-7 rounded-[2rem] bg-white border border-slate-100 overflow-hidden transition-all duration-300 hover:border-amber-400/30"
      >
        {/* Cursor-tracked spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.color}12 0%, transparent 70%)`,
          }}
        />

        {/* Animated bottom accent */}
        <motion.div
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full origin-left"
          style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
        />

        <div className="relative z-10 flex flex-col h-full gap-4">
          {/* Top: icon + badge */}
          <div className="flex items-start justify-between">
            <motion.div
              animate={hovered
                ? { scale: 1.08, backgroundColor: item.color + '1a', borderColor: item.color + '40' }
                : { scale: 1, backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
              }
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center border"
              style={{ color: hovered ? item.color : '#475569' }}
            >
              {item.icon}
            </motion.div>

            {item.badge && (
              <span
                className="text-[8px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg border"
                style={{
                  background: item.color + '0d',
                  borderColor: item.color + '25',
                  color: item.color,
                }}
              >
                {item.badge}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-slate-950 transition-colors">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed font-light flex-1">
            {item.description}
          </p>

          {/* Bottom: stat + CTA */}
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {item.stats}
            </span>
            <motion.div
              animate={hovered ? { x: 4 } : { x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5"
            >
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore
              </span>
              <ArrowUpRight size={14} className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   TRUST / WHY EUS SECTION DATA
───────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: <Shield size={20} />, title: "100% RERA Verified", desc: "Every project we list is fully registered and legally verified under MahaRERA.", color: "#f59e0b" },
  { icon: <Star size={20} />, title: "Zero Brokerage", desc: "Direct builder pricing with absolutely no commission or hidden charges.", color: "#3b82f6" },
  { icon: <Zap size={20} />, title: "48hr Loan Approval", desc: "Pre-approved home loans through our direct banking partnerships.", color: "#10b981" },
  { icon: <CheckCircle2 size={20} />, title: "5,000+ Families", desc: "Trusted by thousands of homebuyers across West Pune.", color: "#f43f5e" },
];

/* ─────────────────────────────────────────────
   ANIMATION PRESETS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

/* ─────────────────────────────────────────────
   MAIN SERVICES PAGE
───────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white font-sans overflow-x-hidden relative">

      {/* ═══ Ambient Background ═══ */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-[-15%] right-[-8%] w-[800px] h-[800px] bg-amber-100/50 rounded-full blur-[160px]" />
        <div className="absolute top-[15%] left-[-12%] w-[600px] h-[600px] bg-slate-200/60 rounded-full blur-[140px]" />
        <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] bg-blue-100/25 rounded-full blur-[120px]" />

        {[
          { style: { width: 10, height: 10, top: '18%', left: '12%', background: 'rgba(251,191,36,0.45)', filter: 'blur(2px)' }, duration: 8.5, delay: 0 },
          { style: { width: 8, height: 8, top: '55%', left: '78%', background: 'rgba(251,191,36,0.35)', filter: 'blur(1px)' }, duration: 10, delay: 1.5 },
          { style: { width: 14, height: 14, top: '30%', left: '60%', background: 'rgba(251,191,36,0.25)', filter: 'blur(3px)' }, duration: 7.8, delay: 0.8 },
          { style: { width: 6, height: 6, top: '70%', left: '28%', background: 'rgba(251,191,36,0.4)', filter: 'blur(1px)' }, duration: 9.2, delay: 2 },
        ].map(({ style, duration, delay }, i) => (
          <FloatingOrb key={i} style={style} duration={duration} delay={delay} />
        ))}
      </div>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-24 pb-10 sm:pb-16 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
          {/* Eyebrow badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm mb-7"
          >
            <Sparkles size={14} className="text-amber-500 fill-amber-200" />
            Our Services
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.2rem,7vw,4.5rem)] font-black text-slate-950 leading-[1.06] tracking-tight mb-6"
          >
            Everything you need,{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
                under one roof.
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-light"
          >
            From home loan comparisons to AI-powered valuations and market intelligence — 
            EusRealty equips you with every tool to make confident property decisions in Pune.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES SECTIONS
      ═══════════════════════════════════════════ */}
      {SERVICES.map((section, sectionIdx) => (
        <section key={section.category} className="relative px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-8 mb-10 sm:mb-14">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{
                      background: section.spotlight,
                      borderColor: section.accent === 'amber' ? '#fbbf2425' : section.accent === 'blue' ? '#3b82f625' : '#10b98125',
                      color: section.accent === 'amber' ? '#f59e0b' : section.accent === 'blue' ? '#3b82f6' : '#10b981',
                    }}
                  >
                    {section.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">
                    {String(sectionIdx + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 leading-tight"
                >
                  {section.category}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light"
                >
                  {section.tagline}
                </motion.p>
              </div>

              {/* Divider line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden sm:block flex-1 h-px origin-left"
                style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.06), transparent)' }}
              />
            </div>

            {/* Service cards grid */}
            <div className={`grid grid-cols-1 ${section.items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-5 sm:gap-6`}>
              {section.items.map((item, idx) => (
                <ServiceCard key={item.name} item={item} index={idx} />
              ))}
            </div>
          </div>

          {/* Section separator */}
          {sectionIdx < SERVICES.length - 1 && (
            <div className="max-w-7xl mx-auto mt-10 sm:mt-16">
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)' }} />
            </div>
          )}
        </section>
      ))}

      {/* ═══════════════════════════════════════════
          WHY EUS TRUST STRIP
      ═══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24">
        {/* Light ambient blob */}
        <div className="absolute top-[20%] left-[45%] -translate-x-1/2 w-[50vw] h-[25vw] rounded-full opacity-[0.35] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm mb-5">
              <Shield size={13} className="text-amber-500" />
              Why EusRealty
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Built on Trust, Powered by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
                Expertise
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {TRUST_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(15,23,42,0.08)' }}
                className="group text-center p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 transition-all duration-300 hover:border-amber-400/25"
              >
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-5 border group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: item.color + '0d',
                    borderColor: item.color + '25',
                    color: item.color,
                    width: '52px',
                    height: '52px',
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — CONSULTATION BANNER
      ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 md:p-16"
          style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #020617 60%, #0f172a 100%)',
            boxShadow: '0 40px 80px -20px rgba(15,23,42,0.25)',
          }}
        >
          {/* Glow orbs */}
          <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-20%] left-[-8%] w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)" }} />

          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl mx-auto mb-7 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(217,119,6,0.1))',
                border: '1px solid rgba(251,191,36,0.35)',
                boxShadow: '0 0 30px rgba(251,191,36,0.15)',
              }}
            >
              <Sparkles size={24} className="text-amber-400" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              Ready to Make Your Move?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mb-9 max-w-lg mx-auto leading-relaxed font-light">
              Connect with our senior advisors for a free, no-obligation consultation. 
              Zero brokerage, zero hidden charges — just honest guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.18em] transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  color: '#0a0a0a',
                  boxShadow: '0 0 0 1.5px rgba(251,191,36,0.5), 0 12px 35px rgba(251,191,36,0.25)',
                }}
              >
                {/* Shimmer */}
                <motion.span
                  animate={{ x: ['-120%', '240%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  className="absolute inset-0 w-[35%] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={14} />
                  Free Consultation
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <a
                href="tel:+917620733613"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full text-[12px] font-bold uppercase tracking-[0.15em] text-white/80 border border-white/15 hover:border-amber-400/40 hover:text-white transition-all duration-300"
              >
                <Phone size={14} />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
