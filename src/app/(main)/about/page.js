

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useSpring as useSpringFM, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Briefcase, MapPin, Phone, ArrowRight,
  Quote, Home, ChevronDown, Star, Building2, TrendingUp,
  Award, Users, Handshake, CheckCircle2, Play, X, Volume2, VolumeX
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   TEAM DATA
───────────────────────────────────────────── */
const teamMembers = [
  // {
  //   name: 'Rahul Upadhyay',
  //   role: 'Visionary / Founder',
  //   badge: '30+ Yrs Legacy',
  //   tagline: 'The Quiet Empire Builder',
  //   img: 'https://randomuser.me/api/portraits/men/52.jpg',
  //   intro:
  //     `With over three decades of deep-rooted presence in Pune&apos;s real estate landscape, Rahul Upadhyay is the cornerstone of EUS Realty. He built his reputation through ethical advisory, zero-commission integrity, and a developer network that spans every major project in West Pune. His philosophy is simple: put the client first, always.`,
  //   expertise: ['Luxury Projects', 'Developer Relations', 'Market Foresight', 'Strategic Advisory'],
  //   accolade: '10,000+ Families Guided',
  //   wa: '917620733613',
  //   linkedin: 'https://linkedin.com',
  //   email: 'amarpal@eusrealty.com',
  //   color: 'from-amber-500/20 via-yellow-600/10 to-transparent',
  //   glowColor: 'rgba(251,191,36,0.25)',
  // },
  {
    name: 'Kunal Verma',
    role: 'Director',
    badge: 'MBA Graduate',
    tagline: 'Where Data Meets Legacy',
    img: '/uploads/Kunal Sir.jpg',
    intro:
      `Kunal Verma transformed the way EUS Realty operates. Armed with an MBA and a sharp analytical mind, he integrated CRM technology, ROI-based investment frameworks, and digital-first client acquisition into a legacy built on trust. He is the bridge between Pune&apos;s real estate heritage and its digital future.`,
    expertise: ['Prop-Tech Integration', 'ROI Analytics', 'CRM Architecture', 'Digital Strategy'],
    accolade: '100+ Premium Projects Marketed',
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'kunal@eusrealty.com',
    color: 'from-blue-500/20 via-indigo-600/10 to-transparent',
    glowColor: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'Rajesh Jha',
    role: 'Associate Director',
    badge: 'Senior Partner',
    tagline: 'Master of Micro-Markets',
    img: '/uploads/Rajesh Sir.jpeg',
    intro:
      `Rajesh Jha is the man developers call when a deal needs to close. With an encyclopedic knowledge of Hinjewadi, Baner, and Wakad's property corridors, he has been instrumental in negotiating landmark transactions and mentoring EUS Realty's growing sales team. His calm authority commands instant respect.`,
    expertise: ['Deal Negotiation', 'Baner & Hinjewadi Markets', 'Investor Relations', 'Team Leadership'],
    accolade: '500+ Deals Successfully Closed',
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'rajesh@eusrealty.com',
    color: 'from-emerald-500/20 via-teal-600/10 to-transparent',
    glowColor: 'rgba(52,211,153,0.2)',
  },
  {
    name: 'Pravin Chauhan',
    role: 'Research & CRM Expert',
    badge: 'CRM Lead',
    tagline: 'The Client Experience Architect',
    img: '/uploads/Kunal Sir_Pic.jpeg',
    intro:
      'Pravin Chauhan is the person every client remembers long after the deal is done. Managing everything from post-sale documentation to client satisfaction reviews, he has built the operational backbone that turns first-time buyers into lifetime EUS ambassadors. His precision and warmth are unmatched.',
    expertise: ['Client Relationship Management', 'Post-Sale Process', 'Documentation', 'Market Research'],
    accolade: '98% Client Satisfaction Rate',
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'pravin@eusrealty.com',
    color: 'from-rose-500/20 via-pink-600/10 to-transparent',
    glowColor: 'rgba(244,63,94,0.2)',
  },
  {
    name: 'Rahul Upadhyay',
    role: 'Expert Architect & Chief Advisor in Properties',
    badge: 'Tech & AI Automation Expert',
    tagline: 'Architect of Systems & Digital Growth',
    img: '/uploads/Rahul.jpeg',
    intro:
      'Rahul Upadhyay is a software engineer, AI automation architect, and growth marketing specialist who designs the entire technological infrastructure of EUS Realty. From high-scale lead capture systems and custom prop-tech integrations to AI-driven chatbots and automated notification pipelines, he engineers the operational backbone of the platform. He is also the mind behind EUS\'s social media growth, SEO dominance, and digital authority.',
    expertise: ['Software Engineering', 'AI Automation', 'Growth Marketing', 'Systems Architecture'],
    accolade: '10,000+ System Leads Managed',
    wa: '9112229827',
    linkedin: 'https://www.linkedin.com/in/rahulmohanupadhyay/',
    email: 'rahulmohanupadhyay@gmail.com',
    color: 'from-violet-500/20 via-purple-600/10 to-transparent',
    glowColor: 'rgba(139,92,246,0.2)',
  },
  // {
  //   name: 'Vicky Teltumbde',
  //   role: 'Sr. Sales Executive',
  //   badge: 'Top Sales Closer',
  //   tagline: 'The High-Energy Closer',
  //   img: '/uploads/Vicky.png',
  //   intro:
  //     `Vicky Teltumbde is built for the front lines. With a relentless drive and an uncanny ability to understand exactly what a buyer needs, he has consistently ranked as EUS Realty's top performer. Whether it's a first-time homebuyer or a seasoned investor, Vicky turns hesitation into conviction and inquiries into transactions.`,
  //   expertise: ['Consultative Sales', 'Wakad Corridor', 'Investor Pitching', 'Inventory Expertise'],
  //   accolade: '50+ Premium Units Sold Personally',
  //   wa: '917620733613',
  //   linkedin: 'https://linkedin.com',
  //   email: 'vicky@eusrealty.com',
  //   color: 'from-cyan-500/20 via-sky-600/10 to-transparent',
  //   glowColor: 'rgba(34,211,238,0.2)',
  // }
];

/* ─────────────────────────────────────────────
   SVG SOCIAL ICONS
───────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER COMPONENT
───────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericValue);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={countRef}>
      {count}
      {value.includes('+') ? '+' : ''}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ULTRA-PREMIUM TEAM MEMBER CARD
   • Magnetic 3-D tilt (Framer motion values)
   • Cursor-tracked radial spotlight
   • Shimmer sweep on hover
   • Per-member colour accent
   • Spring-animated social link hover
   • Animated top-border glow on enter
───────────────────────────────────────────── */

function TeamCard({ member, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  /* ── Framer magnetic tilt ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpringFM(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 22 });
  const rotateY = useSpringFM(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 160, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rawX.set(nx - 0.5);
    rawY.set(ny - 0.5);
    setMousePos({ x: nx * 100, y: ny * 100 });
  };

  const handleMouseLeave = () => {
    rawX.set(0); rawY.set(0);
    setMousePos({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative group overflow-hidden rounded-2xl bg-[#07070d] cursor-pointer"
        animate={hovered
          ? { borderColor: 'rgba(251,191,36,0.3)', boxShadow: '0 30px 70px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.15)' }
          : { borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }
        }
        style={{ border: '1px solid rgba(255,255,255,0.05)', rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* ── Cursor-tracked spotlight ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 320px at ${mousePos.x}% ${mousePos.y}%, ${member.glowColor} 0%, transparent 65%)`,
          }}
        />

        {/* ── Shimmer sweep ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-in-out"
            style={{
              transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
              background: 'linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.05) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* ── Per-member colour tint ── */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${member.color} pointer-events-none z-0 transition-opacity duration-700`}
          style={{ opacity: hovered ? 1 : 0 }}
        />

        {/* ── Animated top-edge amber glow ── */}
        <motion.div
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent origin-left pointer-events-none z-50"
        />

        {/* ── Bottom edge glow ── */}
        <motion.div
          animate={hovered ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none z-50"
        />

        {/* ══ CARD CONTENT ══ */}
        <div className="relative z-10 flex flex-col sm:flex-row">

          {/* LEFT — Photo Panel */}
          <div className="relative flex-shrink-0 w-full sm:w-64 lg:w-72 overflow-hidden bg-[#07070d] flex items-center justify-center min-h-[350px] sm:min-h-[400px]">
            {/* Blurred background image to fill any empty space premium-style */}
            <Image
              src={member.img}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 288px"
              priority={false}
              className="object-cover blur-2xl opacity-20 pointer-events-none"
            />

            {/* Foreground actual image */}
            <Image
              src={member.img}
              alt={`${member.name} – ${member.role}`}
              fill
              sizes="(max-width: 640px) 100vw, 288px"
              priority={false}
              className="z-10 object-cover object-center"
              style={{
                transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.7s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                filter: hovered ? 'brightness(1.15) saturate(1.1)' : 'brightness(1)',
              }}
            />

            {/* Photo gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#07070d] opacity-0 sm:opacity-100 pointer-events-none z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent opacity-80 sm:opacity-0 pointer-events-none z-20" />

            {/* ── Badge ── */}
            <motion.span
              animate={hovered
                ? { scale: 1.05, borderColor: 'rgba(251,191,36,0.7)' }
                : { scale: 1, borderColor: 'rgba(251,191,36,0.45)' }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-3.5 left-3.5 text-[8px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg z-30 text-amber-400"
              style={{
                background: 'rgba(5,5,10,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(251,191,36,0.45)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.8)',
              }}
            >
              {member.badge}
            </motion.span>

            {/* ── Index number ── */}
            <div className="absolute bottom-3.5 left-3.5 sm:hidden text-[10px] font-black text-slate-500 tabular-nums z-30">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          {/* RIGHT — Info Panel */}
          <div className="flex-1 p-6 sm:p-7 lg:p-8 flex flex-col justify-between gap-5">

            {/* Identity */}
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-amber-500 mb-1.5">
                {member.role}
              </p>
              <motion.h3
                animate={hovered ? { color: '#fbbf24' } : { color: '#ffffff' }}
                transition={{ duration: 0.35 }}
                className="text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-1"
              >
                {member.name}
              </motion.h3>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-500 italic">
                &ldquo;{member.tagline}&rdquo;
              </p>
            </div>

            {/* Animated divider */}
            <motion.div
              animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0.4, opacity: 0.4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-px origin-left"
              style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.5), transparent)' }}
            />

            {/* Intro text */}
            <p className="text-slate-300 text-sm leading-[1.78] font-light tracking-wide">
              {member.intro}
            </p>

            {/* Bottom row */}
            <div className="space-y-4">

              {/* ── Expertise tags with stagger ── */}
              <div className="flex flex-wrap gap-1.5">
                {member.expertise.map((tag, ti) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + ti * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2, borderColor: 'rgba(251,191,36,0.4)', color: '#fbbf24' }}
                    className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg cursor-default"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#94a3b8',
                      transition: 'all 0.25s',
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              {/* Accolade + socials */}
              <div className="flex items-center justify-between flex-wrap gap-3">

                {/* Accolade pill */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{
                    background: 'rgba(251,191,36,0.07)',
                    border: '1px solid rgba(251,191,36,0.2)',
                  }}
                >
                  <Award size={11} className="text-amber-500 flex-shrink-0" />
                  <span className="text-[10px] font-black text-amber-400 tracking-wide">{member.accolade}</span>
                </motion.div>

                {/* Social links */}
                <div className="flex items-center gap-2">
                  {[
                    { href: `https://wa.me/${member.wa}`, icon: <WhatsAppIcon />, label: 'WhatsApp', color: 'emerald' },
                    { href: member.linkedin, icon: <LinkedInIcon />, label: 'LinkedIn', color: 'blue', external: true },
                    { href: `mailto:${member.email}`, icon: <GmailIcon />, label: 'Email', color: 'rose' },
                  ].map(({ href, icon, label, color, external }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      title={label}
                      whileHover={{ scale: 1.18, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                      style={{
                        background: `rgba(var(--${color}-rgb, 52, 211, 153), 0.06)`,
                        border: `1px solid rgba(var(--${color}-rgb, 52, 211, 153), 0.18)`,
                        color: color === 'emerald' ? '#34d399' : color === 'blue' ? '#60a5fa' : '#fb7185',
                        transition: 'background 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = color === 'emerald' ? '#10b981' : color === 'blue' ? '#3b82f6' : '#f43f5e';
                        e.currentTarget.style.color = '#030305';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `rgba(var(--${color}-rgb, 52,211,153), 0.06)`;
                        e.currentTarget.style.color = color === 'emerald' ? '#34d399' : color === 'blue' ? '#60a5fa' : '#fb7185';
                      }}
                    >
                      {icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ULTRA-PREMIUM STAT CARD
   • 3-D magnetic tilt
   • Pulsing glow ring on icon
   • Animated number counter on viewport entry
   • Shimmer sweep + hover amber top-border
───────────────────────────────────────────── */
function StatCard({ stat, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpringFM(useTransform(rawY, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 22 });
  const rotateY = useSpringFM(useTransform(rawX, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); setHovered(false); };

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.75, delay: stat.delay, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative p-8 sm:p-10 rounded-3xl overflow-hidden cursor-default"
        animate={hovered
          ? { borderColor: 'rgba(251,191,36,0.3)', boxShadow: `0 30px 60px -10px rgba(0,0,0,0.9), 0 0 40px -5px ${stat.glow}` }
          : { borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }
        }
        style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,15,25,0.6)', backdropFilter: 'blur(20px)', rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Animated top border */}
        <motion.div
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent origin-left z-10"
        />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 transition-transform duration-[800ms] ease-in-out"
            style={{
              transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
              background: 'linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.06) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* Ambient glow blobs */}
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none transition-all duration-500"
          style={{
            background: stat.glow,
            filter: 'blur(30px)',
            opacity: hovered ? 0.8 : 0.3,
          }}
        />

        {/* Icon with pulse ring */}
        <div className="relative mb-6 inline-flex">
          <motion.div
            animate={hovered
              ? { scale: 1.12, backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.35)' }
              : { scale: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md relative z-10"
          >
            {stat.icon}
          </motion.div>
          {/* Pulse ring */}
          {hovered && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl border border-amber-400/40 pointer-events-none"
            />
          )}
        </div>

        {/* Animated counter value */}
        <motion.h4
          animate={hovered ? { color: '#fbbf24' } : { color: '#ffffff' }}
          transition={{ duration: 0.35 }}
          className="text-5xl md:text-6xl font-black mb-2.5 tracking-tight relative z-10"
        >
          <AnimatedCounter value={stat.value} />
        </motion.h4>

        <p className="text-amber-500 font-bold uppercase tracking-widest text-[11px] mb-3 relative z-10">
          {stat.label}
        </p>
        <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed relative z-10">
          {stat.desc}
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM YOUTUBE VIDEO SECTION
   • Custom animated play button overlay
   • YouTube iframe toggles on click
   • Glowing amber border + shimmer on hover
   • Framer Motion entrance animation
───────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────
   YouTube Iframe API Loader helper
────────────────────────────────────────────────────── */
let apiLoaded = false;
let callbacks = [];

function loadYoutubeAPI(callback) {
  if (typeof window === 'undefined') return;

  if (window.YT && window.YT.Player) {
    callback();
    return;
  }

  callbacks.push(callback);

  if (!apiLoaded) {
    apiLoaded = true;

    const existingAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingAPIReady) existingAPIReady();
      callbacks.forEach(cb => cb());
      callbacks = [];
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
  }
}

/* ──────────────────────────────────────────────────────
   Scroll-Autoplay Muted Video Section with Audio Toggle
────────────────────────────────────────────────────── */
function VideoSection() {
  const VIDEO_ID = 'IuetSMPC17Q';
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // Load YouTube API and initialize player
  useEffect(() => {
    let player = null;

    loadYoutubeAPI(() => {
      if (!iframeRef.current) return;

      player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            // Set volume and unmute initially
            event.target.unMute();
            setPlayerReady(true);
          }
        }
      });
    });

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, []);

  // IntersectionObserver to play/pause on scroll
  useEffect(() => {
    if (!playerReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;

        if (entry.isIntersecting) {
          try {
            if (isMuted) {
              player.mute();
            } else {
              player.unMute();
            }
            const playPromise = player.playVideo();
            // Fallback inside promise catch if browser blocks unmuted playback
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {
                player.mute();
                setIsMuted(true);
                player.playVideo();
              });
            }
          } catch (err) {
            console.warn('Scroll autoplay failed, trying muted:', err);
            player.mute();
            setIsMuted(true);
            player.playVideo();
          }
        } else {
          try {
            player.pauseVideo();
          } catch (err) {
            console.warn('Scroll pause failed:', err);
          }
        }
      }, 
      {
        threshold: 0.2, // trigger when 20% of the section is visible
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [playerReady, isMuted]);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player || typeof player.mute !== 'function') return;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full h-[60vh] md:h-[85vh] lg:h-screen relative overflow-hidden bg-black border-y border-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <iframe
          ref={iframeRef}
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-none"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&autoplay=1&mute=0&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&loop=1&playlist=${VIDEO_ID}`}
          title="EUS Realty — Our Story"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

      {/* Volume Controller (Floating Mute Button) */}
      {playerReady && (
        <button
          onClick={toggleMute}
          className="absolute bottom-10 right-10 z-20 bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-amber-500/30 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95"
          title={isMuted ? "Unmute Video" : "Mute Video"}
        >
          {isMuted ? (
            <VolumeX size={24} className="text-amber-500" />
          ) : (
            <Volume2 size={24} className="text-amber-400" />
          )}
        </button>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN CLIENT ABOUT PAGE
───────────────────────────────────────────── */
export default function AboutClient() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Parallax Scroll Bindings for Hero Section
  const { scrollYProgress: heroScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const yBackground = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const opacityHeroText = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const scaleHeroText = useTransform(heroScroll, [0, 0.6], [1, 0.95]);

  // Parallax Scroll for Floating Widgets in Hero
  const yWidgetLeft = useTransform(heroScroll, [0, 1], [0, -180]);
  const yWidgetRight = useTransform(heroScroll, [0, 1], [0, -260]);

  // Timeline Progress Bar Binding
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center']
  });

  const timelineScaleY = useSpring(timelineScroll, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Framer Motion Animation Presets
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerChapter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <>
      <style>{`
        .card-container {
          perspective: 1200px;
          cursor: pointer;
        }

        .card-inner {
          position: relative;
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-container:hover .card-inner,
        .card-container.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front, .card-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1.5rem;
          overflow: hidden;
        }

        .card-front {
          background: #06060a;
          border: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 2;
        }

        .card-back {
          background: linear-gradient(145deg, #06060a, #0f0f18);
          border: 1px solid rgba(251, 191, 36, 0.15);
          transform: rotateY(180deg);
          z-index: 1;
        }
      `}</style>

      <main
        ref={containerRef}
        className="bg-[#030305] text-[#ededf0] selection:bg-amber-500 selection:text-white overflow-hidden font-sans relative"
      >
        {/* Subtle Ambient Background Grids */}
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        {/* ══════════════════════════════════════
            1. CINEMATIC HERO SECTION
        ══════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#040407] rounded-b-[2.5rem] md:rounded-b-[4rem] mx-2 md:mx-4 mt-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-b border-white/5">
          {/* Parallax Background */}
          <motion.div
            style={{ y: yBackground }}
            className="absolute inset-0 w-full h-[130%] -top-[15%] opacity-50 select-none pointer-events-none"
          >
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
              alt="Premium Skyline"
              fill
              sizes="100vw"
              className="object-cover grayscale"
              priority
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/75 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030305]/40 to-[#030305]/90" />
          </motion.div>

          {/* Animated Gold Focus Light */}
          <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

          {/* Floating Luxury Badges (Parallax Scrolling) */}
          <motion.div
            style={{ y: yWidgetLeft }}
            className="absolute left-[8%] top-[55%] hidden xl:flex items-center gap-3.5 px-5 py-4 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs transition-colors hover:border-amber-500/30"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
              <Award size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">RERA Registered</p>
              <p className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase mt-0.5">Authorized Partner</p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yWidgetRight }}
            className="absolute right-[8%] top-[60%] hidden xl:flex items-center gap-3.5 px-5 py-4 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs transition-colors hover:border-amber-500/30"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">Decades of Integrity</p>
              <p className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase mt-0.5">Absolute Trust Model</p>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            style={{ y: heroScroll, opacity: opacityHeroText, scale: scaleHeroText }}
            className="relative z-10 max-w-5xl px-4 sm:px-6 text-center mt-12"
          >
            <div className="space-y-6">
              {/* Top Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <Star size={14} className="fill-amber-400 text-amber-400 m-3" />
                <span className="tracking-widest uppercase text-amber-500 mr-2">Pune&apos;s Premier Real Estate Legacy</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
              >
                A Legacy of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 ">
                  Absolute Trust.
                </span>
              </motion.h1>

              {/* Summary Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mt-6"
              >
                For decades, the highest-value real estate transactions in West Pune were finalized on a simple
                handshake. Today, we bring that legacy to the digital forefront.
              </motion.p>
            </div>
          </motion.div>

          {/* Indicator Chevron */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 z-10 pointer-events-none"
          >
            <ChevronDown size={28} />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            2. PREMIUM VIDEO SHOWCASE (autoplay)
        ══════════════════════════════════════ */}
        <VideoSection />

        {/* ══════════════════════════════════════
            3. INTERACTIVE BRAND STORY TIMELINE
        ══════════════════════════════════════ */}
        <section ref={timelineRef} className="py-24 md:py-36 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

            {/* Horizontal Section Indicator Header */}
            <div className="text-center mb-20 md:mb-28">
              <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                The Heritage Journey
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight">
                Our Timeline of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Success
                </span>
              </h2>
            </div>

            {/* Vertical Scroll Glow Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-48 bottom-48 w-[2px] bg-slate-800/60 pointer-events-none hidden md:block">
              <motion.div
                className="w-full bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600 origin-top h-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                style={{ scaleY: timelineScaleY }}
              />
            </div>

            {/* CHAPTER 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center mb-24 md:mb-40 relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeRight}
                className="order-1 md:order-1 space-y-6"
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-amber-500 uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    Phase I
                  </span>
                  <div className="w-6 h-[1px] bg-amber-500/50" />
                  <span className="text-xs text-slate-400 font-medium">1990s - 2010s</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  A Reputation Built in Silence
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed font-light text-base sm:text-lg">
                  <p>
                    In an industry obsessed with loud billboards and flashy advertisements, the greatest real estate
                    advisory empire in West Pune was built entirely through word-of-mouth.
                  </p>
                  <p>
                    For decades, Rahul Upadhyay operated as the market&apos;s most trusted advisor. He had no digital
                    footprint. No aggressive marketing team. But what he possessed was invaluable: an ironclad
                    reputation and an unmatched understanding of Pune&apos;s property landscape.
                  </p>
                  <p>
                    When Pune&apos;s top-tier developers needed to market massive luxury ventures—like the legendary{' '}
                    <strong className="text-amber-400 font-semibold">Omega Paradise in Wakad</strong>—they didn&apos;t rely solely on ad campaigns. They called
                    Amarpal. As an elite Strategic Partner, he guided thousands of homebuyers and investors based purely on uncompromising ethics.
                  </p>
                </div>
              </motion.div>

              {/* Glass Card Image Container Right */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeLeft}
                className="order-2 md:order-2 relative group"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-slate-900/40">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D   "
                    alt="Legacy Construction & Architecture"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-102 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/70 to-transparent" />
                  {/* Image Badge overlay */}
                  <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-slate-950/80 border border-white/10 p-5 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
                      <Handshake size={18} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Uncompromising Integrity</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Trust established on solid handshake agreements.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CHAPTER 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center mb-24 md:mb-40 relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeRight}
                className="order-2 md:order-1 relative group"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-slate-900/40">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="Data strategy and innovation"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-102 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/70 to-transparent" />
                  {/* Image Badge overlay */}
                  <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-slate-950/80 border border-white/10 p-5 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Prop-Tech & CRM Driven</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Advanced investment projections & market analytics.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeLeft}
                className="order-1 md:order-2 space-y-6"
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-amber-500 uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    Phase II
                  </span>
                  <div className="w-6 h-[1px] bg-amber-500/50" />
                  <span className="text-xs text-slate-400 font-medium">2025 Onwards</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  Modern Execution. Traditional Values.
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed font-light text-base sm:text-lg">
                  <p>Fast forward to 2025. Enter Kunal Verma.</p>
                  <p>
                    Armed with an MBA and a vision to disrupt the prop-tech space, Kunal originally drew up plans to
                    build a brand new real estate startup from scratch. He wanted to integrate data analytics, digital
                    sourcing, and modern CRM systems into Pune&apos;s booming property market.
                  </p>
                  <p>
                    But before laying the first brick of a new venture, a defining conversation with his grandfather,
                    Amarpal, altered the trajectory of West Pune&apos;s real estate advisory forever.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* LUXURY INTERACTIVE QUOTE SECTION */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={scaleIn}
              className="mb-24 md:mb-40 relative group"
            >
              {/* Backglow panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-600/15 rounded-[2.5rem] md:rounded-[3.5rem] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
              <div className="absolute inset-0 bg-[#07070d]/90 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] -z-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />

              <div className="p-8 sm:p-14 md:p-20 text-center relative overflow-hidden">
                {/* Visual quote indicator */}
                <Quote className="text-amber-500/20 w-16 h-16 md:w-24 md:h-24 mb-6 md:mb-8 mx-auto transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                <blockquote className="text-xl sm:text-2xl md:text-4xl font-serif italic text-white leading-snug tracking-tight max-w-4xl mx-auto">
                  &quot;You want to build a kingdom from scratch,&quot;{' '}
                  <span className="text-amber-500 text-lg sm:text-xl md:text-2xl block mt-4 font-sans font-light not-italic tracking-wide">
                    Amarpal told his grandson,
                  </span>
                  <span className="block mt-4 text-slate-200">
                    &quot;But you are already standing in the courtyard of a quiet empire. Take the handover. Turn on the
                    lights. Show them what we&apos;ve built.&quot;
                  </span>
                </blockquote>
              </div>
            </motion.div>

            {/* CHAPTER 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeRight}
                className="order-1 md:order-1 space-y-6"
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-amber-500 uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    The Present
                  </span>
                  <div className="w-6 h-[1px] bg-amber-500/50" />
                  <span className="text-xs text-slate-400 font-medium">EUS Realty Today</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  EUS Realty: The Premier Partner
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed font-light text-base sm:text-lg">
                  <p>
                    Kunal didn&apos;t start a new company; he modernized a legacy. Together, the veteran visionary and the
                    modern strategist officially launched{' '}
                    <strong className="text-amber-400 font-semibold">Elite Unique Services (EUS Realty)</strong> as a RERA-registered authorized strategic
                    partner.
                  </p>
                  <p>
                    It was the perfect storm. Amarpal provided the unshakeable foundation—decades of developer
                    goodwill and deep market foresight. Kunal brought the execution—digital portfolio management,
                    transparent ROI analytics, and a seamless zero-brokerage model for buyers.
                  </p>
                  <p>
                    Today, the fusion of traditional trust and modern technology has resulted in the successful
                    marketing of over 100+ premium projects. EUS Realty proudly continues to guide thousands of
                    families and investors into high-appreciating assets across Hinjewadi, Baner, Tathawade, and
                    Wakad.
                  </p>
                  <p className="text-amber-500 font-extrabold pt-4 text-lg sm:text-xl tracking-wide flex items-center gap-2.5">
                    <CheckCircle2 size={22} className="text-amber-400 flex-shrink-0" />
                    The secret is out. We are just getting started.
                  </p>
                </div>
              </motion.div>

              {/* Glass Card Image Container Left */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeLeft}
                className="order-2 md:order-2 relative group"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-slate-900/40">
                  <Image
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                    alt="Premium EUS Realty Highrise Portfolio"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-102 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/70 to-transparent" />
                  {/* Image Badge overlay */}
                  <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-slate-950/80 border border-white/10 p-5 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">100+ Luxury Projects</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Strong builder associations in Pune&apos;s high-growth zones.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            3. HIGH-IMPACT ANIMATED STATS
        ══════════════════════════════════════ */}
        <section className="py-24 bg-[#050508] border-y border-white/5 rounded-[2.5rem] md:rounded-[4rem] mx-2 md:mx-4 shadow-2xl relative overflow-hidden">
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          {/* Ambient radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
              {[
                {
                  icon: <Home className="text-amber-500" size={30} />,
                  value: '15000+',
                  label: 'Families Placed',
                  desc: 'Advising home buyers with integrity & zero brokerage.',
                  delay: 0,
                  glow: 'rgba(251,191,36,0.15)',
                },
                {
                  icon: <Building2 className="text-amber-500" size={30} />,
                  value: '100+',
                  label: 'Premium Projects',
                  desc: "Unlocking inventory of Pune&apos;s highest-value developer ventures.",
                  delay: 0.12,
                  glow: 'rgba(251,191,36,0.12)',
                },
                {
                  icon: <ShieldCheck className="text-amber-500" size={30} />,
                  value: '30+',
                  label: 'Years of Trust',
                  desc: 'Built silently through performance and client loyalty.',
                  delay: 0.24,
                  glow: 'rgba(251,191,36,0.10)',
                },
              ].map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. PREMIUM TEAM & 3D TILT SHOWCASE
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          {/* Subtle amber ambient on dark bg */}
          <div className="absolute inset-0 bg-[#06060c] rounded-[2.5rem] md:rounded-[4rem] mx-2 md:mx-4 pointer-events-none -z-10"
            style={{ boxShadow: 'inset 0 0 120px rgba(251,191,36,0.06)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] rounded-[2.5rem] md:rounded-[4rem] mx-2 md:mx-4 pointer-events-none -z-10" />

          {/* Ambient glows */}
          <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full pointer-events-none -z-10 opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChapter}
              className="text-center mb-20 md:mb-28"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2.5 text-amber-500 font-extrabold tracking-widest uppercase text-xs mb-4"
              >
                <div className="w-6 h-px bg-amber-500" />
                The Architects of EUS
                <div className="w-6 h-px bg-amber-500" />
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
              >
                Meet the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Leadership
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 font-light text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Hover or tap each card to discover the minds driving West Pune&apos;s real estate evolution.
              </motion.p>
            </motion.div>

            {/* Stacked horizontal profile cards */}
            <div className="flex flex-col gap-5 max-w-5xl mx-auto">
              {teamMembers.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. CTA FINALE WITH MESH EFFECT
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

            <div className="bg-slate-950/80 rounded-[2.5rem] md:rounded-[4rem] p-8 sm:p-14 md:p-20 lg:p-28 text-center text-white overflow-hidden relative shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] border border-white/10 backdrop-blur-2xl">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-500/10 blur-[130px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-slate-700/30 blur-[130px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />
              {/* SVG Abstract Line Grid */}
              <div className="absolute inset-0 opacity-15 select-none pointer-events-none">
                <svg width="100%" height="100%">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChapter}
                className="relative z-10"
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight text-balance tracking-tight"
                >
                  Become part of the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                    history.
                  </span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 md:mb-12 font-light max-w-2xl mx-auto leading-relaxed"
                >
                  Don&apos;t just buy a property. Partner with the legacy that built West Pune. Let EUS Realty navigate
                  your next real estate triumph with zero brokerage.
                </motion.p>

                {/* Interaction CTA buttons */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-4.5 justify-center items-center"
                >
                  <Link
                    href="/properties"
                    className="relative overflow-hidden inline-flex items-center justify-center bg-white text-slate-950 px-8 sm:px-11 py-4 sm:py-4.5 rounded-2xl md:rounded-full font-bold group shadow-2xl tracking-wide w-full sm:w-auto text-sm sm:text-base transition-transform duration-300 hover:scale-102"
                  >
                    <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                    <span className="relative z-10 flex items-center gap-2.5 group-hover:text-slate-950 transition-colors duration-300">
                      Explore Inventory <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                    </span>
                  </Link>

                  <a
                    href="https://wa.me/917620733613"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden inline-flex items-center justify-center bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 sm:px-11 py-4 sm:py-4.5 rounded-2xl md:rounded-full font-bold group tracking-wide w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:scale-102"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                      <Phone size={18} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                      Talk to an Expert
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

