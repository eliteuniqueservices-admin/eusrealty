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
    <footer className="relative bg-[#0A0A0A] text-white pt-24 pb-8 mt-20 overflow-hidden border-t border-gray-900">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
            
            {/* --- COLUMN 1: BRANDING & SOCIAL --- */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 flex items-center gap-1">
                  EUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">REALTY</span>
                </h2>
                <p className="text-gray-400 font-light leading-relaxed text-sm pr-4">
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
                    className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-white/[0.08] hover:border-blue-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* --- COLUMN 2: QUICK LINKS --- */}
            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
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
                      className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-2 transition-all duration-300 group"
                    >
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                      <span className="-ml-6 group-hover:ml-0 transition-all">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- COLUMN 3: CONTACT & OFFICE --- */}
            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-6">Corporate Office</h4>
              <ul className="space-y-5">
                {/* Address */}
                <li className="flex gap-4 group">
                  <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                  <a
                    href="https://maps.app.goo.gl/WoghyaNgYaQ9AZfm7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 leading-relaxed group-hover:text-blue-400 transition-colors"
                  >
                    Office No. 424-427, Vardhamaan Moonstone, <br />
                    Tathawade, Pune - 411033
                  </a>
                </li>
                {/* Phone */}
                <li className="flex items-center gap-4 group">
                  <Phone className="text-blue-500 shrink-0" size={18} />
                  <a href="tel:+917620733613" className="text-sm text-gray-400 font-medium group-hover:text-blue-400 transition-colors">
                    +91 7620733613
                  </a>
                </li>
                {/* Email */}
                <li className="flex items-center gap-4 group">
                  <Mail className="text-blue-500 shrink-0" size={18} />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors break-all"
                  >
                    eliteuniqueservices@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* --- COLUMN 4: NEWSLETTER --- */}
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] shadow-inner">
              <h4 className="text-lg font-bold text-gray-100 mb-2">Stay Informed</h4>
              <p className="text-xs text-gray-400 mb-6 font-light">Get exclusive weekly updates on new West Pune property launches and market trends.</p>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full bg-black/50 border border-gray-800 px-4 py-3.5 rounded-xl text-sm text-white outline-none focus:border-blue-500 focus:bg-gray-900 transition-all placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex justify-center items-center gap-2"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </Reveal>

        {/* --- BOTTOM SECTION: RERA & LEGAL --- */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* QR & RERA Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
            <div className="bg-white p-1 rounded-lg">
               {/* Note: Recommend putting your QR code in the public folder. Use fallback styling here just in case. */}
              <Image
                src="/MahaRERA QR_CODE.png"
                alt="MahaRERA QR Code"
                width={80}
                height={80}
                className="rounded-md object-contain"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 bg-blue-900/30 border border-blue-500/20 px-4 py-2 rounded-full w-fit mx-auto sm:mx-0">
                <ShieldCheck className="text-blue-400" size={16} />
                <span className="text-[11px] font-bold tracking-widest text-blue-200 uppercase">
                  MahaRERA: A041262501741
                </span>
              </div>
              <p className="text-gray-500 text-[11px] max-w-md font-light leading-relaxed">
                <strong className="font-semibold text-gray-400">EusRealty is a registered real estate agent.</strong> Property details are provided by developers and subject to change. Verify RERA numbers before investing.
              </p>
            </div>
          </div>

          {/* Copyright & Scroll to Top */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-gray-500 text-xs font-medium">
              © 2026 EusRealty. All rights reserved.
            </div>
            <button 
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-3.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group shadow-lg"
            >
              <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}