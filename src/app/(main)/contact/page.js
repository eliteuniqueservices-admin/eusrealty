'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const [formState, setFormState] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 5000); // Reset after 5s
    }, 1500);
  };

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-300 selection:bg-amber-500 selection:text-indigo-950 font-sans overflow-hidden">
      
      {/* --- HERO BACKGROUND & GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10">
        <div className="absolute inset-0 bg-indigo-950/20" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-16 items-start"
        >
          
          {/* --- LEFT COLUMN: INFO & MAP --- */}
          <div className="lg:col-span-7 space-y-16">
            
            <header className="space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-sm">
                <MessageSquare size={14} />
                Connect With The Masters
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Let's secure your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">legacy.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-xl text-indigo-200 leading-relaxed max-w-lg font-medium">
                Skip the noise. Connect directly with West Pune's premier real estate consultants for an exclusive, transparent property experience.
              </motion.p>
            </header>

            {/* Contact Cards Grid */}
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Phone size={24} />, label: "Direct Line", val: "+91 76207 33613", desc: "Priority support for buyers", action: "tel:+917620733613" },
                { icon: <Mail size={24} />, label: "Email Desk", val: "hello@eusrealty.com", desc: "For detailed inquiries", action: "mailto:hello@eusrealty.com" },
                { icon: <MapPin size={24} />, label: "Headquarters", val: "Tathawade, Pune", desc: "Vardhamaan Moonstone, #424", action: "#map" },
                { icon: <Clock size={24} />, label: "Operating Hours", val: "9:00 AM - 8:00 PM", desc: "Monday to Saturday", action: null },
              ].map((item, i) => (
                <motion.a 
                  key={i} variants={fadeUp} href={item.action}
                  whileHover={{ y: -5 }}
                  className={`group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-md ${!item.action && 'cursor-default'}`}
                >
                  <div className="w-14 h-14 bg-indigo-900/50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-indigo-950 transition-colors duration-300 shadow-lg">
                    {item.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-xl font-bold text-white mb-1">{item.val}</p>
                  <p className="text-sm text-indigo-300/70">{item.desc}</p>
                </motion.a>
              ))}
            </motion.div>

            {/* Interactive Map Section */}
            <motion.div variants={fadeUp} id="map" className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative h-80 group">
              <div className="absolute inset-0 bg-indigo-950/40 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10" />
              <iframe 
                 src="https://maps.google.com/maps?q=Vardhamaan%20Moonstone,%20Tathawade,%20Pune&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, filter: "grayscale(80%) contrast(1.2)" }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 className="group-hover:filter-none transition-all duration-1000"
              ></iframe>
              <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f1c]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 z-20 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">EUS Realty HQ</p>
                  <p className="text-sm text-slate-400">Office 424-427, Vardhamaan Moonstone</p>
                </div>
                <a href="https://maps.google.com/?q=Vardhamaan+Moonstone+Tathawade+Pune" target="_blank" rel="noreferrer" className="w-10 h-10 bg-amber-500 text-indigo-950 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>

          </div>

          {/* --- RIGHT COLUMN: PREMIUM FORM --- */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-10 z-20">
            <motion.div variants={fadeUp} className="relative group">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-indigo-600/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative bg-[#0d142b]/90 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-white mb-2">Request an Invite</h3>
                  <p className="text-indigo-200 text-sm">Our senior consultants will reach out within 2 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium" 
                      placeholder="e.g. Rajesh Kumar" 
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium" 
                        placeholder="+91" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium" 
                        placeholder="you@email.com" 
                      />
                    </div>
                  </div>

                  {/* Intent Dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">My Objective</label>
                    <div className="relative">
                      {/* Added defaultValue="" to the select tag */}
                      <select required defaultValue="" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none appearance-none font-medium cursor-pointer">
                        {/* Removed the 'selected' attribute from the option tag */}
                        <option value="" disabled className="text-slate-600 bg-[#0d142b]">Select an option...</option>
                        <option value="Looking to Buy Residential" className="bg-[#0d142b]">Looking to Buy Residential</option>
                        <option value="Looking for Investment" className="bg-[#0d142b]">Looking for Investment</option>
                        <option value="I am a Builder/Developer" className="bg-[#0d142b]">I am a Builder/Developer</option>
                        <option value="Career Inquiry" className="bg-[#0d142b]">Career Inquiry</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Details (Optional)</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none h-28 resize-none placeholder:text-slate-600 font-medium" 
                      placeholder="Budget, preferred location, timeline..."
                    ></textarea>
                  </div>

                  {/* Dynamic Submit Button */}
                  <button 
                    disabled={formState !== 'idle'}
                    className={`relative overflow-hidden w-full font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${
                      formState === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-indigo-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                    }`}
                  >
                    {formState === 'idle' && (
                      <span className="flex items-center gap-2">Initiate Contact <Send size={18} /></span>
                    )}
                    {formState === 'submitting' && (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Encrypting...
                      </span>
                    )}
                    {formState === 'success' && (
                      <span className="flex items-center gap-2"><CheckCircle size={20} /> Request Received</span>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 mt-6">
                    By submitting, you agree to our privacy policy. Your data is strictly confidential.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* --- WHAT HAPPENS NEXT STRIP --- */}
      <div className="border-t border-white/5 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12">
            <motion.div variants={fadeUp} className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-amber-500 flex items-center justify-center font-black text-xl mx-auto mb-6">1</div>
              <h4 className="text-xl font-bold text-white mb-2">Discovery Call</h4>
              <p className="text-slate-400 text-sm">We analyze your exact requirements, budget, and investment goals over a brief priority call.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="text-center relative">
              <div className="hidden md:block absolute top-6 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-amber-500 flex items-center justify-center font-black text-xl mx-auto mb-6 relative z-10">2</div>
              <h4 className="text-xl font-bold text-white mb-2">Curated Shortlist</h4>
              <p className="text-slate-400 text-sm">You receive a highly filtered list of premium Grade-A properties that match your criteria exactly.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="text-center relative">
               <div className="hidden md:block absolute top-6 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-amber-500 flex items-center justify-center font-black text-xl mx-auto mb-6 relative z-10">3</div>
              <h4 className="text-xl font-bold text-white mb-2">VIP Site Visit</h4>
              <p className="text-slate-400 text-sm">We organize an escorted tour of the properties, handle negotiations, and secure the best builder price.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}