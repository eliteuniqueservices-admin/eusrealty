"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, X, Phone, User, CheckCircle, Sparkles, Building2 } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';

export default function FloatingShortlistBar() {
  const { favorites, isLoaded, clearFavorites } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const prevCountRef = useRef(0);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Re-show bar whenever a NEW favorite is added after it was hidden
  useEffect(() => {
    if (!isLoaded) return;
    const current = favorites.length;
    const prev = prevCountRef.current;
    // Only reappear if user actively ADDED a new item (count went up)
    if (current > prev && isHidden) {
      setIsHidden(false);
      setIsExpanded(false);
      setStatus('idle');
      setForm({ name: '', phone: '' });
    }
    prevCountRef.current = current;
  }, [favorites.length, isLoaded, isHidden]);

  if (!isLoaded || favorites.length === 0 || isHidden) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    // Validate 10-digit phone
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');

    setStatus('loading');
    try {
      const propertyNames = favorites.map(p => p.title).join(', ');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          objective: 'Property Shortlist Consultation',
          message: `Shortlisted properties: ${propertyNames}`,
          source: 'Floating Shortlist Bar',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      // Clear the entire shortlist
      clearFavorites();
      // Auto-hide the entire bar after 3 seconds
      setTimeout(() => setIsHidden(true), 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9000] w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {/* ── COLLAPSED BAR ── */}
        {!isExpanded && (
          <motion.div
            key="bar"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto"
          >
            <div
              className="relative flex items-center justify-between rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                border: '1px solid rgba(251,191,36,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Amber glow strip */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)' }}
              />

              <div className="flex items-center gap-3 px-4 py-3.5" onClick={() => setIsExpanded(true)}>
                {/* Heart badge */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))', border: '1px solid rgba(251,191,36,0.25)' }}
                  >
                    <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <motion.span
                    key={favorites.length}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-slate-900"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
                  >
                    {favorites.length}
                  </motion.span>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-bold tracking-tight">
                      {favorites.length} {favorites.length === 1 ? 'Property' : 'Properties'} Shortlisted
                    </span>
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium truncate">
                    {favorites.slice(0, 2).map(p => p.title).join(', ')}{favorites.length > 2 ? ` +${favorites.length - 2} more` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 pr-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', boxShadow: '0 4px 15px rgba(245,158,11,0.45)', letterSpacing: '-0.01em' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Consult Now
                </motion.button>
                <button
                  onClick={() => setIsHidden(true)}
                  className="p-2 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EXPANDED FORM PANEL ── */}
        {isExpanded && (
          <motion.div
            key="panel"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(160deg, #0f172a, #1e293b)',
              border: '1px solid rgba(251,191,36,0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Top amber strip */}
            <div
              className="h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)' }}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Expert Consultation</span>
                  </div>
                  <h3 className="text-white font-bold text-base leading-tight">
                    Get Expert Advice on Your Shortlist
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} · Zero brokerage · Response in 30 min
                  </p>
                </div>
                <button onClick={() => setIsExpanded(false)} className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg ml-2 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shortlisted property chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {favorites.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}
                  >
                    <Heart className="w-2.5 h-2.5 fill-current" />
                    {p.title?.length > 20 ? p.title.slice(0, 20) + '…' : p.title}
                  </div>
                ))}
              </div>

              {/* Success State */}
              <AnimatePresence>
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-4 text-center"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}>
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">You&apos;re all set!</p>
                      <p className="text-slate-400 text-xs mt-1">Our expert will call you within 30 minutes.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          aria-label="Your Name"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          required
                          className="w-full pl-8 pr-3 py-2.5 text-sm text-white placeholder-slate-500 rounded-xl outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="tel"
                          aria-label="10-digit Mobile Number"
                          placeholder="10-digit Mobile No."
                          value={form.phone}
                          maxLength={10}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setForm(f => ({ ...f, phone: val }));
                            if (phoneError) setPhoneError('');
                          }}
                          required
                          className="w-full pl-8 pr-3 py-2.5 text-sm text-white placeholder-slate-500 rounded-xl outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${phoneError ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}` }}
                          onFocus={e => { if (!phoneError) e.target.style.borderColor = 'rgba(245,158,11,0.5)'; }}
                          onBlur={e => { if (!phoneError) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-red-400 text-[11px] -mt-1">{phoneError}</p>
                    )}

                    {status === 'error' && (
                      <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl text-sm font-bold text-slate-900 flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
                    >
                      {status === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      ) : (
                        <>
                          <Phone className="w-4 h-4" />
                          Request Expert Callback
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                    <p className="text-slate-500 text-[10px] text-center">0% Brokerage · Verified listings · Free advisory</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
