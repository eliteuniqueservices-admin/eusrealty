'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Reveal from '@/components/Reveal';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

// Magnetic button wrapper using framer-motion
function MagneticSocial({ children, link, label }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    const { clientX, clientY } = e;
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    // Limit translation distance
    x.set(dx * 0.35);
    y.set(dy * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.a
      ref={ref}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="w-11 h-11 rounded-full bg-white/[0.02] flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-colors duration-300 border border-white/[0.05] hover:border-amber-500 shadow-md shadow-black/30"
    >
      <motion.div>{children}</motion.div>
    </motion.a>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const rectRef = useRef(null);

  // States for interactive components
  const [isHovered, setIsHovered] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (footerRef.current) {
      rectRef.current = footerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current && footerRef.current) {
      rectRef.current = footerRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footerRef.current.style.setProperty('--spotlight-x', `${x}px`);
    footerRef.current.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
  };

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    const email = 'eliteuniqueservices@gmail.com';

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers or non-secure HTTP contexts
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error("Failed to copy email: ", err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubscribed(true);
        setEmailInput('');
        if (typeof window !== 'undefined') {
          localStorage.setItem('eus_lead_submitted', 'true');
        }
      } else {
        alert(data.error || 'Subscription failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative bg-slate-950 text-white pt-24 pb-12 overflow-hidden border-t border-slate-900 select-none"
    >
      {/* Dynamic Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle 500px at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(245, 158, 11, 0.06) 0%, transparent 60%)',
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Decorative Branding Backdrop */}
      <div className="absolute bottom-[-1%] left-1/2 -translate-x-1/2 select-none pointer-events-none text-[clamp(4rem,10vw,12rem)] font-black text-white/[0.015] tracking-[-0.03em] uppercase text-center font-sans z-0 font-outfit">
        EusRealty
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-20">

            {/* ── COLUMN 1: BRANDING & SOCIAL (Span 3) ── */}
            <div className="lg:col-span-3 space-y-8 lg:pr-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 flex items-center gap-1 font-outfit">
                  EUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">REALTY</span>
                </h2>
                <p className="text-slate-400 font-light leading-relaxed text-[13px]">
                  Your trusted authorized Strategic Partner for West Pune. Revolutionizing real estate through direct builder-to-buyer connections, 100% verified legal clarity, and transparent advisory.
                </p>
              </div>

              {/* Magnetic Social Icons */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: <Facebook size={19} />, link: "https://www.facebook.com/share/1C4Vt5oHLD/", label: "Facebook" },
                  { icon: <Instagram size={19} />, link: "https://www.instagram.com/eus.pune?igsh=MXE5dHh4cHl4N2g4eQ==", label: "Instagram" },
                  { icon: <Linkedin size={19} />, link: "https://www.linkedin.com/company/elite-unique-services/", label: "LinkedIn" },
                  { icon: <Youtube size={19} />, link: "https://www.youtube.com/@Elite_Unique_Services", label: "YouTube" },
                ].map((social, i) => (
                  <MagneticSocial key={i} link={social.link} label={social.label}>
                    {social.icon}
                  </MagneticSocial>
                ))}
              </div>
            </div>

            {/* ── COLUMN 2: QUICK NAVIGATION (Span 2) ── */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-black text-amber-500 mb-6 uppercase tracking-[0.2em] font-outfit">
                Navigation
              </h4>
              <ul className="space-y-4 font-semibold">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'About Us', href: '/about' },
                  { name: 'ROI Calculator', href: '/calculator' },
                  { name: 'Area Converter', href: '/calculator/square-meter-to-square-feet' },
                  { name: 'Loan Eligibility', href: '/home-loans' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Contact Us', href: '/contact' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-amber-400 text-sm flex items-center gap-2.5 transition-all duration-300 group"
                    >
                      <ArrowRight size={13} className="opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-500" />
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COLUMN 3: TOP SEARCHES (Span 2) ── */}
            <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black text-amber-500 mb-6 uppercase tracking-[0.2em] font-outfit">
                Top Searches
              </h4>
              <ul className="space-y-3.5 font-semibold">
                {[
                  { name: 'Flats in Baner', href: '/properties/location/baner' },
                  { name: 'Flats in Wakad', href: '/properties/location/wakad' },
                  { name: 'Flats in Hinjewadi', href: '/properties/location/hinjawadi' },
                  { name: 'Godrej Properties', href: '/builders/godrej-properties-pune' },
                  { name: 'Lodha Group Pune', href: '/builders/lodha-group-pune' },
                  { name: 'VTP Realty Pune', href: '/builders/vtp-realty-pune' },
                  { name: 'Kohinoor Group', href: '/builders/kohinoor-group-pune' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-amber-400 text-[13px] flex items-center gap-2 transition-all duration-300 group"
                    >
                      <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-500" />
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COLUMN 4: HEADQUARTERS (Span 2) ── */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-black text-amber-500 mb-6 uppercase tracking-[0.2em] font-outfit">
                Headquarters
              </h4>
              <ul className="space-y-6">
                {/* Location */}
                <li className="flex gap-4 group items-start">
                  <div className="w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <a
                    href="https://maps.app.goo.gl/WoghyaNgYaQ9AZfm7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 leading-relaxed font-light hover:text-white transition-colors pt-1"
                  >
                    Office 424-427, Vardhamaan Moonstone, <br />
                    Tathawade, Pune - 411033
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-amber-500/80 uppercase tracking-widest mt-1.5 block group-hover:text-amber-400">
                      View on Maps <ExternalLink size={8} />
                    </span>
                  </a>
                </li>

                {/* Telephone */}
                <li className="flex gap-4 group items-center">
                  <div className="w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                    <Phone size={16} />
                  </div>
                  <a
                    href="tel:+917620733613"
                    className="text-sm text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    +91 7620733613  ,  +91 9112229809
                  </a>
                </li>

                {/* Copiable Email Address */}
                <li className="flex gap-4 group items-center relative">
                  <div className="w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col">
                    <a
                      href="#"
                      onClick={handleCopyEmail}
                      className="text-sm text-slate-400 font-light hover:text-white transition-colors truncate max-w-[190px] xs:max-w-none flex items-center gap-1.5"
                    >
                      eliteuniqueservices@gmail.com
                      <Copy size={12} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                    </a>
                    <span className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wide">
                      Click to copy email
                    </span>
                  </div>

                  {/* Copy Alert Tag */}
                  {copiedEmail && (
                    <div className="absolute top-[-30px] left-14 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                      Email Copied!
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* ── COLUMN 5: NEWSLETTER / TRUST (Span 3) ── */}
            <div className="lg:col-span-3 self-start">
              <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.06] shadow-xl relative overflow-hidden flex flex-col gap-2">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-xl rounded-full" />

                <div>
                  <h4 className="text-base font-black text-slate-100 mb-1.5 tracking-wide font-outfit">Stay Vetted</h4>
                  <p className="text-[11px] text-slate-400 mb-4 font-light leading-relaxed">Join our private list to receive early pre-launch property notifications in West Pune.</p>
                </div>

                {isSubscribed ? (
                  <div className="flex flex-col items-center text-center p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
                    <CheckCircle2 size={24} className="text-amber-500 mb-2" />
                    <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Subscription Confirmed</h5>
                    <p className="text-[10px] text-slate-400 font-light mt-1">Check your inbox for exclusive updates.</p>
                  </div>
                ) : (
                  <form className="flex flex-col gap-2.5" onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full bg-slate-950 border border-white/5 px-4 py-3 rounded-xl text-xs text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-700 font-medium"
                    />
                    <button
                      type="submit"
                      className="relative overflow-hidden w-full bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-[11px] uppercase tracking-widest shadow-lg transition-transform active:scale-[0.97] group/sub"
                    >
                      <span className="absolute inset-0 bg-white origin-bottom scale-y-0 group-hover/sub:scale-y-100 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-2 group-hover/sub:text-slate-950 transition-colors">
                        Subscribe
                        <ArrowRight size={13} className="group-hover/sub:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </Reveal>

        {/* ── BOTTOM ROW: RERA & LEGALS ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 z-10 relative">

          {/* RERA Scanning Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
            {/* Glass QR Container with Animated Laser scan line */}
            <div className="relative overflow-hidden w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center border border-white/10 shadow-lg">
              <Image
                src="/MahaRERA QR_CODE.png"
                alt="MahaRERA QR Code"
                width={72}
                height={72}
                loading="eager"
                className="rounded-md object-contain"
              />
              {/* Scan Line Laser */}
              <div className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_#34d399] animate-scan pointer-events-none" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 bg-slate-900 border border-white/5 px-5 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
                <ShieldCheck className="text-amber-500 animate-pulse" size={15} />
                <span className="text-[11px] font-black tracking-widest text-amber-500 uppercase">
                  MahaRERA: A041262501741
                </span>
              </div>
              <p className="text-slate-500 text-[11px] max-w-lg font-light leading-relaxed">
                <strong className="font-bold text-slate-400">EusRealty is an authorized Strategic Partner.</strong> Property descriptions, prices, and layouts are verified directly against developer database filings. MahaRERA registration is required before any financial transaction.
              </p>
            </div>
          </div>

          {/* Legal and Top Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-slate-500 text-xs font-semibold text-center sm:text-right">
              <div>© 2026 EusRealty. All rights reserved.</div>
              <div className="text-[10px] text-slate-600 mt-1 font-light tracking-wide">
                Developed by{' '}
                <a
                  href="mailto:rahulmohanupadhyay@gmail.com"
                  className="hover:text-amber-500 transition-colors duration-300 font-semibold underline underline-offset-2 decoration-slate-700 hover:decoration-amber-500"
                >
                  Rahul Upadhyay
                </a>
              </div>
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
              className="p-3.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-colors shadow-lg shadow-black/30 group"
            >
              <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>

        </div>
      </div>
    </footer>
  );
}