"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close the menu when a link is clicked on mobile
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "ROI Calculator", href: "/calculator" },
    { name: "Careers", href: "/careers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-4">
        
        {/* Logo and Branding */}
        <Link href="/" className="flex items-center gap-3 group z-50" onClick={closeMenu}>
          {/* Fallback div if image isn't loaded, replace src with your actual path */}
          <div className="relative w-10 h-10">
             { <Image src="/logo.svg" alt="Eus Logo" fill className="object-contain" /> }
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">
            EUS<span className="text-blue-600">REALTY</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-semibold text-sm text-gray-600">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="hover:text-blue-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Action Buttons Group (Desktop) */}
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">        
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-gray-900 hover:text-blue-600 font-bold transition-all py-2 px-4 rounded-xl hover:bg-blue-50"
            >
              <UserCircle size={20} />
              <span>Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
          isMobileMenuOpen ? "opacity-100 scale-y-100 h-[calc(100vh-80px)]" : "opacity-0 scale-y-0 h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-8 space-y-6 h-full overflow-y-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={closeMenu}
              className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors border-b border-gray-50 pb-4"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 mt-auto pb-10">
            <Link 
              href="/login" 
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white hover:bg-blue-600 transition-colors py-4 px-6 rounded-2xl font-bold text-lg shadow-lg"
            >
              <UserCircle size={24} />
              <span>Login to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}