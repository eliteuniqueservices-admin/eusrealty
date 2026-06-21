'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Download, AlertCircle, FileText } from 'lucide-react';

export default function SmartLeadPopup({ type = 'property', contextName = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    // Check if user already dismissed or submitted in the last 30 days
    const popupState = localStorage.getItem('eus_exit_popup');
    if (popupState) {
      const parsed = JSON.parse(popupState);
      const now = new Date().getTime();
      // If within 30 days, do not trigger
      if (now - parsed.timestamp < 30 * 24 * 60 * 60 * 1000) {
        setHasTriggered(true);
        return;
      }
    }

    const handleMouseLeave = (e) => {
      // Trigger if mouse leaves the top of the viewport (exit intent)
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    const handleScroll = () => {
      if (hasTriggered) return;
      const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      // Trigger at 60% scroll for mobile users who don't have mouseleave
      if (scrollDepth > 0.6) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered]);

  const handleClose = () => {
    setIsVisible(false);
    // Save to local storage to prevent annoyance
    localStorage.setItem('eus_exit_popup', JSON.stringify({ timestamp: new Date().getTime(), status: 'dismissed' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          source: 'exit_popup',
          objective: type === 'property' ? `Requested Price Sheet for ${contextName}` : `Requested Yield Report for ${contextName}`,
          propertyType: type === 'property' ? 'Project Details' : 'Market Report',
        })
      });

      if (!response.ok) throw new Error('Submission failed');

      setStatus('success');
      localStorage.setItem('eus_exit_popup', JSON.stringify({ timestamp: new Date().getTime(), status: 'submitted' }));
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
    } catch (err) {
      console.error('Popup lead error:', err);
      setStatus('error');
    }
  };

  // Ensure AnimatePresence wraps the conditionally rendered div correctly
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <div className="mx-auto w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                {type === 'property' ? <Download size={28} /> : <FileText size={28} />}
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Wait! Before you leave...</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                {type === 'property' 
                  ? `Download the exclusive builder-direct pricing sheet and floor plans for ${contextName}.`
                  : `Get the exclusive 2026 Investment Yield & Market Report for ${contextName}.`}
              </p>
            </div>

            <div className="p-8">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Details Sent!</h4>
                  <p className="text-sm text-slate-500 font-medium">Our strategic advisor will share the requested details on WhatsApp shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                      <AlertCircle size={16} /> Something went wrong. Please try again.
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                      placeholder="+91"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-sm py-4 rounded-xl transition-all shadow-[0_8px_16px_-6px_rgba(15,23,42,0.3)] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {status === 'loading' ? 'Processing...' : type === 'property' ? 'Download Pricing Sheet' : 'Get The Report'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" /> 100% Secure & Spam-Free
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
