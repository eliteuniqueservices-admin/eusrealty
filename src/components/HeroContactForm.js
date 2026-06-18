'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroContactForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: 'Under ₹1 Cr',
  });
  const [formState, setFormState] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid phone number.'); return;
    }

    setFormState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          objective: 'Looking to Buy Residential',
          budget: form.budget,
          message: `Strategy Session request via Homepage. Budget: ${form.budget}`,
          source: 'Homepage Hero Form',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      setFormState('success');
      setForm({ name: '', phone: '', email: '', budget: 'Under ₹1 Cr' });
    } catch (err) {
      setErrorMsg(err.message);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 6000);
    }
  };

  return (
    <div className="bg-white p-7 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100">
      <AnimatePresence mode="wait">
        {formState !== 'success' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5 text-center tracking-tight">
              Book a Strategy Session
            </h3>
            <p className="text-sm text-center text-slate-500 mb-8 font-light">
              100% Free Advisory. No obligations. Response in 2 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              <AnimatePresence>
                {(formState === 'error' || errorMsg) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold"
                  >
                    ⚠️ {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Rahul Upadhyay"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahulUpadhyay@example.com"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm text-slate-700"
                >
                  <option>Under ₹1 Cr</option>
                  <option>₹1 Cr – ₹3 Cr</option>
                  <option>₹3 Cr – ₹5 Cr</option>
                  <option>₹5 Cr – ₹10 Cr</option>
                  <option>Above ₹10 Cr</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className={`relative overflow-hidden w-full font-bold py-4 rounded-2xl group shadow-xl tracking-wide mt-2 transition-all ${
                  formState === 'submitting'
                    ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                    : 'bg-slate-950 text-white'
                }`}
              >
                {formState !== 'submitting' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                )}
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      Claim Free Consultation
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                🔒 Your details are 100% secure. We never share your information.
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"
            >
              <CheckCircle size={32} className="text-emerald-500" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Request Sent! 🎉
              </h3>
              <p className="text-slate-500 text-sm font-light max-w-xs mx-auto">
                Our senior consultant will connect with you within 30 minutes. Check your email for confirmation.
              </p>
            </div>
            <button
              onClick={() => setFormState('idle')}
              className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
            >
              Submit Another Request
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
