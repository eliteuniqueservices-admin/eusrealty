'use client';
import { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, Sparkles, ArrowRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    const checkInactivity = setInterval(() => {
      // Only check if popup is not already open
      if (!isOpen && Date.now() - lastActivity >= 15000) { // 15 seconds
        setIsOpen(true);
      }
    }, 1000);

    return () => {
      clearInterval(checkInactivity);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const requests = [
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: "Exit Intent Lead",
            phone: `+91 ${phone}`,
            email: email,
            message: "Lead captured via Exit-Intent Popup.",
            source: "Exit Popup",
            objective: "Get Exclusive Deals"
          })
        })
      ];

      if (email) {
        requests.push(
          fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })
        );
      }

      await Promise.all(requests);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-slate-200 text-slate-500 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">You&apos;re on the list! 🎉</h2>
              <p className="text-slate-500 font-medium max-w-sm">
                Our senior consultant will reach out to you shortly with exclusive off-market deals.
              </p>
              <button onClick={() => setIsOpen(false)} className="mt-8 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors">
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Left visual side */}
              <div className="hidden md:flex flex-col justify-between w-2/5 bg-slate-900 p-6 relative overflow-hidden text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative z-10">
                  <Building2 size={32} className="text-amber-400 mb-4" />
                  <h3 className="text-xl font-black leading-tight tracking-tight mb-2">Wait! Don&apos;t Miss Out.</h3>
                  <p className="text-sm text-slate-300 font-medium">Get access to 0% brokerage luxury deals before they hit the market.</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-400/20 w-fit">
                  <Sparkles size={14} /> VIP Access
                </div>
              </div>

              {/* Right form side */}
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-white relative">
                <div className="md:hidden mb-6 text-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Wait! Don&apos;t Miss Out.</h3>
                  <p className="text-sm text-slate-500">Get access to 0% brokerage luxury deals before they hit the market.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                    <div className="flex relative">
                      <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm font-bold text-slate-600">+91</span>
                      <div className="relative flex-1">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10 digit number"
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all text-sm text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email ID</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all text-sm text-slate-900"
                        required
                      />
                    </div>
                    {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || phone.length < 10}
                    className="w-full py-3.5 bg-slate-950 text-amber-400 font-black text-sm rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? 'Sending...' : 'Get Exclusive Deals'} 
                    {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                    By submitting, you agree to receive property updates. We never spam.
                  </p>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
