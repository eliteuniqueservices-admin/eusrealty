'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Home, Wallet, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroContactForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    propertyType: '3 BHK',
    budget: 'Under ₹1 Cr',
    name: '',
    phone: '',
    email: '',
  });
  const [formState, setFormState] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const propertyTypes = ['2 BHK', '3 BHK', '4 BHK+', 'Villas', 'Commercial'];
  const budgets = ['Under ₹1 Cr', '₹1 Cr – ₹2 Cr', '₹2 Cr – ₹5 Cr', '₹5 Cr – ₹10 Cr', 'Above ₹10 Cr'];

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (form.phone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.'); return;
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
          propertyType: form.propertyType,
          message: `Gamified Hero Form. Type: ${form.propertyType}, Budget: ${form.budget}`,
          source: 'Homepage Hero Form',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      setFormState('success');
      if (typeof window !== 'undefined') {
        localStorage.setItem('eus_lead_submitted', 'true');
      }
      setForm({ name: '', phone: '', email: '', budget: 'Under ₹1 Cr', propertyType: '3 BHK' });
      setStep(1);
    } catch (err) {
      setErrorMsg(err.message);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 6000);
    }
  };

  return (
    <div className="bg-white p-7 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden relative min-h-[480px] flex flex-col">
      {/* Progress Bar */}
      {formState !== 'success' && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {formState !== 'success' ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-2 mb-2">
                {step === 1 && <Home size={18} className="text-amber-500" />}
                {step === 2 && <Wallet size={18} className="text-amber-500" />}
                {step === 3 && <User size={18} className="text-amber-500" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                  Step {step} of 3
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {step === 1 ? 'What are you looking for?' : step === 2 ? 'What is your budget?' : 'Where should we send details?'}
              </h3>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="flex-1 flex flex-col space-y-4">
              
              {/* Error Message */}
              <AnimatePresence>
                {(formState === 'error' || errorMsg) && step === 3 && (
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

              {/* Step 1: Property Type */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, propertyType: type })}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${form.propertyType === type ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Budget */}
              {step === 2 && (
                <div className="flex flex-col gap-3 flex-1">
                  {budgets.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setForm({ ...form, budget: b })}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${form.budget === b ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div className="space-y-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Rahul Upadhyay" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 text-sm font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="9876543210" maxLength={10} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 text-sm font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email (Optional)</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@email.com" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 text-sm font-medium" />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center gap-3 mt-auto">
                {step > 1 && (
                  <button type="button" onClick={handlePrevStep} className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className={`relative overflow-hidden flex-1 font-bold py-4 rounded-2xl group shadow-xl tracking-wide transition-all flex items-center justify-center gap-2 ${
                    formState === 'submitting' ? 'bg-slate-400 text-slate-200 cursor-not-allowed' : 'bg-slate-950 text-white hover:shadow-2xl'
                  }`}
                >
                  {formState !== 'submitting' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                    {formState === 'submitting' ? (
                      <><Loader2 size={20} className="animate-spin" /> Processing...</>
                    ) : step < 3 ? (
                      <>Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <>Claim Free Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </span>
                </button>
              </div>

              {step === 3 && (
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  🔒 Your details are 100% secure. We never share your information.
                </p>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 gap-5 h-full my-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-24 h-24 mb-2"
            >
              <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                <CheckCircle size={44} className="text-white drop-shadow-md" />
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                You&apos;re on the Priority List!
              </h4>
              <p className="text-slate-600 text-base max-w-sm mx-auto leading-relaxed font-medium">
                Thank you, <span className="text-amber-600 font-bold">{form.name || 'friend'}</span>. We&apos;ve received your request beautifully. 
                <br/><br/>
                Our property strategist will connect with you within <span className="text-slate-900 font-bold">30 minutes</span>.
              </p>
            </div>

            <button
              onClick={() => { setFormState('idle'); setStep(1); }}
              className="mt-6 px-8 py-3 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
