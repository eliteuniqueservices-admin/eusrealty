'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-white pt-16 pb-8 overflow-hidden border-t border-slate-900">
      {/* Subtle Luxury Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-800/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Expanded Max-Width to push elements to the edges */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-12 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            
            {/* --- COLUMN 1: BRANDING & SOCIAL --- */}
            <div className="space-y-8 lg:pr-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 flex items-center gap-1">
                  EUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">REALTY</span>
                </h2>
                <p className="text-slate-400 font-light leading-relaxed text-sm">
                  Your trusted authorized channel partner for West Pune. Revolutionizing real estate through transparency and direct builder-to-buyer connections.
                </p>
              </div>
              
              <div className="flex gap-3">
                {[
                  { icon: <Facebook size={18} />, link: "https://www.facebook.com/share/1C4Vt5oHLD/", label: "Facebook" },
                  { icon: <Instagram size={18} />, link: "https://www.instagram.com/eus.pune?igsh=MXE5dHh4cHl4N2g4eQ==", label: "Instagram" },
                  { icon: <Linkedin size={18} />, link: "https://www.linkedin.com/company/elite-unique-services/", label: "LinkedIn" },
                  { icon: <Youtube size={18} />, link: "https://www.youtube.com/@Elite_Unique_Services", label: "YouTube" },
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 border border-white/[0.05] hover:border-amber-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* --- COLUMN 2: QUICK LINKS --- */}
            <div className="lg:pl-8">
              <h4 className="text-lg font-bold text-slate-100 mb-6 tracking-wide">
                Quick Navigation
              </h4>
              <ul className="space-y-3 font-medium">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Premium Properties', href: '/properties' },
                  { name: 'About Us', href: '/about' },
                  { name: 'ROI Calculator', href: '/calculator' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Contact Us', href: '/contact' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-amber-400 text-sm flex items-center gap-2 transition-all duration-300 group"
                    >
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-500" />
                      <span className="-ml-6 group-hover:ml-0 transition-all">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- COLUMN 3: CONTACT & OFFICE --- */}
            <div className="lg:pl-4">
              <h4 className="text-lg font-bold text-slate-100 mb-6 tracking-wide">Corporate Office</h4>
              <ul className="space-y-5">
                {/* Address */}
                <li className="flex gap-4 group items-start">
                  <MapPin className="text-amber-500 shrink-0 mt-1" size={18} />
                  <a
                    href="https://maps.app.goo.gl/WoghyaNgYaQ9AZfm7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-slate-400 leading-relaxed font-light transform origin-left transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400"
                  >
                    Office No. 424-427, Vardhamaan Moonstone, <br />
                    Tathawade, Pune - 411033
                  </a>
                </li>
                {/* Phone */}
                <li className="flex items-center gap-4 group">
                  <Phone className="text-amber-500 shrink-0" size={18} />
                  <a 
                    href="tel:+917620733613" 
                    className="inline-block text-sm text-slate-400 font-medium transform origin-left transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400"
                  >
                    +91 7620733613
                  </a>
                </li>
                {/* Email */}
                <li className="flex items-center gap-4 group">
                  <Mail className="text-amber-500 shrink-0" size={18} />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-slate-400 font-light break-all transform origin-left transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400"
                  >
                    eliteuniqueservices@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* --- COLUMN 4: NEWSLETTER --- */}
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-inner lg:ml-auto w-full max-w-sm">
              <h4 className="text-lg font-bold text-slate-100 mb-2 tracking-wide">Stay Informed</h4>
              <p className="text-xs text-slate-400 mb-6 font-light">Get exclusive weekly updates on new West Pune property launches and market trends.</p>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-3.5 rounded-xl text-sm text-white outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-900/20 active:scale-95 flex justify-center items-center gap-2"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </Reveal>

        {/* --- BOTTOM SECTION: RERA & LEGAL --- */}
        <div className="pt-8 border-t border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* QR & RERA Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
            <div className="bg-white p-1 rounded-lg shrink-0">
              <Image
                src="/MahaRERA QR_CODE.png"
                alt="MahaRERA QR Code"
                width={80}
                height={80}
                className="rounded-md object-contain"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full w-fit mx-auto sm:mx-0">
                <ShieldCheck className="text-amber-500" size={16} />
                <span className="text-[11px] font-bold tracking-widest text-amber-500/90 uppercase">
                  MahaRERA: A041262501741
                </span>
              </div>
              <p className="text-slate-500 text-[11px] max-w-md font-light leading-relaxed">
                <strong className="font-semibold text-slate-400">EusRealty is a registered real estate agent.</strong> Property details are provided by developers and subject to change. Verify RERA numbers before investing.
              </p>
            </div>
          </div>

          {/* Copyright & Scroll to Top */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-slate-500 text-xs font-medium">
              © 2026 EusRealty. All rights reserved.
            </div>
            <button 
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-3.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-300 group shadow-lg"
            >
              <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}