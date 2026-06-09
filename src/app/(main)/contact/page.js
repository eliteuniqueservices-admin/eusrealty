'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight, Star, AlertCircle, MessageCircle, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    objective: '',
    position: '',
    message: '',
  });
  const [formState, setFormState] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [isObjectiveOpen, setIsObjectiveOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsObjectiveOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.objective) {
      setErrorMsg('Please select your objective.');
      return;
    }

    if (form.objective === 'Career Inquiry' && !form.position) {
      setErrorMsg('Please select the position you are applying for.');
      return;
    }

    setFormState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setFormState('success');
      setForm({ name: '', phone: '', email: '', objective: '', position: '', message: '' });
      // Auto-reset after 8 seconds
      setTimeout(() => setFormState('idle'), 8000);
    } catch (err) {
      setErrorMsg(err.message);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 6000);
    }
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

  const whatsappNumber = '917620733613';
  const whatsappText = encodeURIComponent('Hello EUS Realty! I would like to know more about your properties.');

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white font-sans overflow-hidden">
      
      {/* --- HERO BACKGROUND & GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-slate-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          
          {/* --- LEFT COLUMN: INFO & MAP --- */}
          <div className="lg:col-span-7 space-y-12 lg:space-y-16">
            
            <header className="space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                Connect With The Masters
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-950 leading-[1.1] tracking-tight">
                Let's secure your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">legacy.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-light">
                Skip the noise. Connect directly with Pune's premier real estate consultants for an exclusive, transparent property experience.
              </motion.p>
            </header>

            {/* Contact Cards Grid */}
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: <Phone size={24} />, label: "Direct Line", val: "+91 76207 33613", desc: "Priority support for buyers", action: "tel:+917620733613" },
                { icon: <Mail size={24} />, label: "Email Desk", val: "hello@eusrealty.com", desc: "For detailed inquiries", action: "mailto:hello@eusrealty.com" },
                { icon: <MapPin size={24} />, label: "Headquarters", val: "Tathawade, Pune", desc: "Vardhamaan Moonstone Buzz, Office No: 424", action: "#map" },
                { icon: <Clock size={24} />, label: "Operating Hours", val: "9:00 AM - 8:00 PM", desc: "Tuesday to Sunday", action: null },
              ].map((item, i) => (
                <motion.a 
                  key={i} variants={fadeUp} href={item.action}
                  whileHover={{ y: -4 }}
                  className={`group p-6 md:p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-amber-500/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] transition-all duration-500 ${!item.action && 'cursor-default'}`}
                >
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-500">
                    {item.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-lg md:text-xl font-bold text-slate-900 mb-1">{item.val}</p>
                  <p className="text-sm text-slate-500 font-light">{item.desc}</p>
                </motion.a>
              ))}
            </motion.div>

            {/* WhatsApp Quick Contact Banner */}
            <motion.a
              variants={fadeUp}
              href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3 }}
              className="group flex items-center gap-5 p-6 md:p-8 rounded-[2rem] bg-[#128C7E]/5 border border-[#128C7E]/20 hover:bg-[#128C7E]/10 hover:border-[#128C7E]/40 hover:shadow-[0_20px_40px_-15px_rgba(18,140,126,0.15)] transition-all duration-500 cursor-pointer"
            >
              <div className="w-14 h-14 shrink-0 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={26} className="text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg mb-0.5">Chat on WhatsApp</p>
                <p className="text-sm text-slate-500 font-light">Instant replies · Mon – Sun, 9 AM – 8 PM</p>
              </div>
              <ArrowRight size={20} className="text-[#25D366] group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.a>

            {/* Interactive Map Section */}
            <motion.div variants={fadeUp} id="map" className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl relative h-80 group">
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10" />
              <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2988.3826013811286!2d73.74371297393837!3d18.618266666185157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb00424ee25d%3A0x591d30ed72160c8f!2sElite%20Unique%20Services!5e1!3m2!1sen!2sin!4v1780557910866!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, filter: "grayscale(100%) contrast(1.1) opacity(0.8)" }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 className="group-hover:filter-none transition-all duration-1000"
              ></iframe>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 z-20 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-slate-900 font-bold">EUS Realty HQ</p>
                  <p className="text-sm text-slate-500 font-medium">Office 424-427, Vardhamaan Moonstone</p>
                </div>
                <a href="https://maps.google.com/?q=Vardhamaan+Moonstone+Tathawade+Pune" target="_blank" rel="noreferrer" className="relative overflow-hidden w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center group/btn shadow-md">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
                  <span className="relative z-10 group-hover/btn:text-slate-950 transition-colors duration-300">
                    <ArrowRight size={20} />
                  </span>
                </a>
              </div>
            </motion.div>

          </div>

          {/* --- RIGHT COLUMN: PREMIUM FORM --- */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-10 z-20">
            <motion.div variants={fadeUp} className="relative group">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-slate-600/20 rounded-[3rem] blur-xl opacity-50 transition duration-1000"></div>
              
              <div className="relative bg-slate-950 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)]">
                
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Request an Invite</h2>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">Our senior consultants will reach out within 2 hours to curate your exclusive portfolio.</p>
                </div>

                <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center text-center py-12 gap-5"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle size={40} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white mb-2">Message Received!</h3>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                          We've notified our team by email and WhatsApp. Expect a callback within 2 hours.
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#25D366]/30 hover:brightness-110 transition-all"
                      >
                        <MessageCircle size={18} className="fill-white" />
                        Also chat on WhatsApp
                      </a>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      
                      {/* Error Banner */}
                      <AnimatePresence>
                        {formState === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
                          >
                            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300 font-medium">{errorMsg}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium"
                          placeholder="e.g. Rajesh Kumar"
                        />
                      </div>

                      {/* Phone & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium"
                            placeholder="+91"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none placeholder:text-slate-600 font-medium"
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>

                      {/* Objective */}
                      <div className="space-y-1.5 relative z-10" ref={dropdownRef}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">My Objective</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsObjectiveOpen(!isObjectiveOpen)}
                            className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all outline-none font-medium ${isObjectiveOpen ? 'bg-white/10 border-amber-500 ring-1 ring-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'}`}
                          >
                            {form.objective || <span className="text-slate-500">Select an option...</span>}
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`transition-transform duration-300 ${isObjectiveOpen ? 'rotate-180 text-amber-500' : 'text-slate-500'}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                          
                          <AnimatePresence>
                            {isObjectiveOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl"
                              >
                                {['Looking to Buy Residential', 'Looking for Investment', 'I am a Builder/Developer', 'Career Inquiry'].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setForm(prev => ({ ...prev, objective: option }));
                                      setIsObjectiveOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between ${form.objective === option ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                  >
                                    {option}
                                    {form.objective === option && (
                                      <CheckCircle size={16} className="text-amber-500" />
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Message */}
                      {form.objective === 'Career Inquiry' && (
                        <div className="space-y-1.5 relative">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Applying for Position</label>
                          <div className="relative">
                            <select
                              name="position"
                              value={form.position}
                              onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                              required
                              className="w-full p-4 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none cursor-pointer font-medium appearance-none"
                            >
                              <option value="" disabled className="bg-slate-900 text-slate-400">Select a position...</option>
                              <option value="Relationship Manager" className="bg-slate-900 text-white">Relationship Manager</option>
                              <option value="Digital Marketing Executive" className="bg-slate-900 text-white">Digital Marketing Executive</option>
                              <option value="Sourcing Manager" className="bg-slate-900 text-white">Sourcing Manager</option>
                              <option value="Customer Success Associate" className="bg-slate-900 text-white">Customer Success Associate</option>
                              <option value="General Inquiry" className="bg-slate-900 text-white">General Inquiry / Other</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Details (Optional)</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none h-28 resize-none placeholder:text-slate-600 font-medium"
                          placeholder="Budget, preferred location, timeline..."
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className={`relative overflow-hidden w-full font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 tracking-wide ${
                          formState === 'submitting'
                            ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-slate-950 shadow-xl group/submit active:scale-[0.98]'
                        }`}
                      >
                        {formState !== 'submitting' && (
                          <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/submit:scale-y-100" />
                        )}

                        {formState === 'submitting' ? (
                          <span className="relative z-10 flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="relative z-10 flex items-center gap-2 group-hover/submit:text-slate-950 transition-colors">
                            Send Message <Send size={18} />
                          </span>
                        )}
                      </button>

                      {/* Notification indicators
                      <div className="flex items-center justify-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail size={12} className="text-amber-500" />
                          <span>2 email recipients</span>
                        </div>
                        <span className="text-slate-700">·</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MessageCircle size={12} className="text-[#25D366]" />
                          <span>WhatsApp alert</span>
                        </div>
                      </div> */}

                      <p className="text-center text-xs text-slate-600 font-light">
                        By submitting, you agree to our privacy policy. Your data is strictly confidential.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* --- WHAT HAPPENS NEXT STRIP --- */}
      <div className="border-t border-slate-100 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12">
            
            <motion.div variants={fadeUp} className="text-center">
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-sm">1</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Discovery Call</h4>
              <p className="text-slate-500 text-sm font-light leading-relaxed px-4">We analyze your exact requirements, budget, and investment goals over a brief priority call.</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="text-center relative">
              <div className="hidden md:block absolute top-7 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center font-black text-xl mx-auto mb-6 relative z-10 shadow-sm">2</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Curated Shortlist</h4>
              <p className="text-slate-500 text-sm font-light leading-relaxed px-4">You receive a highly filtered list of premium Grade-A properties that match your criteria exactly.</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="text-center relative">
               <div className="hidden md:block absolute top-7 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-xl mx-auto mb-6 relative z-10 shadow-sm">3</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">VIP Site Visit</h4>
              <p className="text-slate-500 text-sm font-light leading-relaxed px-4">We organize an escorted tour of the properties, handle negotiations, and secure the best builder price.</p>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </main>
  );
}