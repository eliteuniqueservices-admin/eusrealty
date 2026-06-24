'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60vw] h-[50vw] rounded-full opacity-[0.25] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto py-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative w-10 h-10">
              <Image src="/logo.svg" alt="EusRealty" fill className="object-contain" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-950">
              EUS<span className="text-amber-500">REALTY</span>
            </span>
          </Link>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-300 select-none">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="-mt-6 space-y-3"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            This page doesn&apos;t exist
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
            The property you&apos;re looking for may have been moved or sold. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.15em] transition-all duration-300 text-slate-950"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              boxShadow: '0 0 0 1px rgba(251,191,36,0.4), 0 8px 25px rgba(251,191,36,0.2)',
            }}
          >
            <Home size={14} />
            <span>Go Home</span>
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.15em] border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all duration-300"
          >
            <Search size={14} />
            <span>Browse Properties</span>
          </Link>

          <a
            href="tel:+917620733613"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.15em] border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
          >
            <Phone size={14} />
            <span>Call Us</span>
          </a>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400"
        >
          <Link href="/about" className="hover:text-amber-600 transition-colors font-medium">About</Link>
          <span className="text-slate-200">·</span>
          <Link href="/services" className="hover:text-amber-600 transition-colors font-medium">Services</Link>
          <span className="text-slate-200">·</span>
          <Link href="/blog" className="hover:text-amber-600 transition-colors font-medium">Blog</Link>
          <span className="text-slate-200">·</span>
          <Link href="/contact" className="hover:text-amber-600 transition-colors font-medium">Contact</Link>
          <span className="text-slate-200">·</span>
          <Link href="/calculator" className="hover:text-amber-600 transition-colors font-medium">Calculators</Link>
        </motion.div>
      </div>
    </main>
  );
}
