"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle shadow when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to close the menu when a link is clicked on mobile
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "ROI Calculator", href: "/calculator" },
    { name: "Careers", href: "/careers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
        : "bg-white border-b border-slate-100"
    }`}>
      {/* Widened from max-w-7xl to max-w-[95rem] to push the logo further left */}
      <div className="max-w-[95rem] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">
        
        {/* Logo and Branding */}
        <Link href="/" className="flex items-center gap-3 group z-50" onClick={closeMenu}>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 transform group-hover:scale-105 transition-transform duration-300">
             <Image src="/logo.svg" alt="Eus Logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-950">
            EUS<span className="text-amber-500">REALTY</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 font-semibold text-sm text-slate-600">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              // Added hover:scale-110 and inline-block for the smooth enlarge effect
              className="relative inline-block text-slate-600 hover:text-slate-950 hover:scale-110 transition-all duration-300 py-2 font-medium tracking-wide group origin-center"
            >
              {link.name}
              {/* Premium Underline Hover Effect */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* Action Buttons Group (Desktop) */}
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">        
            {/* Primary Button: "Building Rise" Animation */}
            <Link 
              href="/login" 
              className="relative overflow-hidden flex items-center gap-2 bg-slate-950 text-white font-bold transition-all py-2.5 px-6 rounded-full tracking-wide group shadow-md hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                <UserCircle size={18} />
                {/* Renamed to Login */}
                <span>Login</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:text-amber-500 transition-colors z-50 bg-slate-50 hover:bg-amber-50 rounded-full border border-slate-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl transition-all duration-500 origin-top overflow-hidden ${
          isMobileMenuOpen ? "opacity-100 scale-y-100 h-[calc(100vh-73px)]" : "opacity-0 scale-y-0 h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-10 space-y-2 h-full overflow-y-auto bg-gradient-to-b from-white to-slate-50">
          {navLinks.map((link, index) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={closeMenu}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={`text-2xl font-black text-slate-800 hover:text-amber-500 hover:scale-[1.02] origin-left transition-all duration-300 border-b border-slate-100 py-4 tracking-tight flex justify-between items-center group ${
                isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              {link.name}
              <ChevronRight size={24} className="text-amber-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          ))}
          
          <div className="pt-8 mt-auto pb-12">
            <Link 
              href="/login" 
              onClick={closeMenu}
              className={`relative overflow-hidden flex items-center justify-center gap-3 w-full bg-slate-950 text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-xl group transition-all duration-500 delay-300 ${
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                <UserCircle size={22} />
                {/* Renamed to Login */}
                <span>Login</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}