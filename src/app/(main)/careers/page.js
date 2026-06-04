'use client';

import Reveal from '@/components/Reveal';
import SectionWrapper from "@/components/SectionWrapper";
import { 
  Briefcase, Users, ArrowRight, Star, 
  Rocket, Zap, Heart, MapPin, Search, 
  ClipboardCheck, UserPlus, Coffee, Trophy, MessageCircle, X
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <-- NEW: Import createPortal

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [mounted, setMounted] = useState(false); // <-- NEW: State to check if client has loaded

  const jobs = [
    { id: 1, title: "Relationship Manager", dept: "Sales", type: "Full-time", location: "Baner/Wakad", salary: "₹8L Base + 20% Commission", link: "/careers/relationship-manager", tags: ["High Commission", "Fast Growth"] },
    { id: 2, title: "Digital Marketing Executive", dept: "Growth", type: "Full-time", location: "Tathawade", salary: "₹6L Fixed + Performance", link: "/careers/digital-marketing-executive", tags: ["Fresher Friendly", "Tech-Driven"] },
    { id: 3, title: "Sourcing Manager", dept: "Inventory", type: "Full-time", location: "West Pune", salary: "₹10L + High Incentives", link: "/careers/sourcing-manager", tags: ["High Commission", "Leadership"] },
    { id: 4, title: "Customer Success Associate", dept: "CRM", type: "Full-time", location: "Pune", salary: "₹5L Fixed", link: "/careers/customer-success-associate", tags: ["Stable", "Growth"] }
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDept === 'All' || job.dept === filterDept)
    );
  }, [searchTerm, filterDept]);

  const handleQuickApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // --- Ensure the portal only renders on the client side to prevent Next.js errors ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Lock background scrolling when modal is open ---
  useEffect(() => {
    if (showApplyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showApplyModal]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // --- Define the Modal separately so we can teleport it via Portal ---
  const modalContent = (
    <AnimatePresence>
      {showApplyModal && (
        <motion.div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl relative border border-slate-100"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button 
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-8 pr-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">Quick Application</span>
              <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Apply for {selectedJob?.title}</h3>
            </div>

            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Application Simulated (Hook this up to your API later!)');
                setShowApplyModal(false);
              }}
            >
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide">Full Name</label>
                <input type="text" required placeholder="John Doe" className="w-full bg-slate-50 rounded-xl px-4 py-3.5 text-slate-900 font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide">Phone Number</label>
                <input type="tel" required placeholder="+91" className="w-full bg-slate-50 rounded-xl px-4 py-3.5 text-slate-900 font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide">Resume (PDF)</label>
                <input type="file" required accept=".pdf,.doc,.docx" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600 border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-950 file:text-white hover:file:bg-slate-800 transition-all cursor-pointer" />
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="relative overflow-hidden flex-1 bg-slate-950 text-white px-6 py-4 rounded-xl font-bold group tracking-wide text-center border border-slate-800">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    Submit
                  </span>
                </button>

                <a href={`https://wa.me/917620733613?text=Hi, I am interested in applying for the ${selectedJob?.title} role.`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors tracking-wide">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <main className="min-h-screen bg-[#FDFDFD] pb-32 relative selection:bg-amber-500 selection:text-white font-sans text-slate-900">
        
        {/* 1. HERO SECTION */}
        <SectionWrapper className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FA] via-white to-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-slate-200/40 rounded-full blur-[100px] mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-amber-100/40 rounded-full blur-[100px] mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

          <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 text-center relative z-10">
            <Reveal>
              <div className="group relative inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200 text-slate-800 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold mb-8 shadow-sm hover:bg-white transition-all duration-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-inner">
                  <Star size={10} className="fill-white" />
                </span>
                <span className="tracking-wide uppercase">Join Pune's Elite Real Estate Force</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 mb-8 leading-[1.05] tracking-tight text-balance mx-auto">
                Close ₹1Cr+ Deals in <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900">
                  West Pune's IT Hub.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light text-balance mb-12">
                Work with top developers like Godrej, VTP, and Rohan in Baner, Wakad, and Hinjewadi. Build a ₹10L–₹30L+ career with Pune's most aggressive incentives.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#roles" className="relative overflow-hidden bg-slate-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto text-center border border-slate-800">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    View High-Income Roles
                  </span>
                </a>
                
                <div className="w-full sm:w-auto flex items-center justify-center gap-3 text-slate-900 font-bold px-8 py-4 md:py-5 bg-white/60 backdrop-blur-md rounded-full border border-slate-200 shadow-sm transition-colors">
                  <Trophy className="text-amber-500" size={24} strokeWidth={2.5} />
                  ₹100Cr+ Sales Closed
                </div>
              </div>
            </Reveal>
          </section>
        </SectionWrapper>

        {/* 2. WORK WITH US */}
        <SectionWrapper className="relative border-t border-slate-100">
          <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <Reveal>
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-10 text-balance tracking-tight">Why Top Performers Choose EUS Realty?</h2>
                <div className="space-y-6">
                  {[
                    { title: "Direct Builder Mandates", desc: "Work with Grade-A builders in Pune (VTP, Godrej, Rohan) with exclusive inventory you won't find anywhere else.", icon: <Star /> },
                    { title: "Highest Incentive Ratios", desc: "Earn ₹10L–₹30L+ annually with our aggressive payouts. Your hard work reflects directly in your bank account.", icon: <Zap /> },
                    { title: "Tech-First Sourcing", desc: "Say goodbye to cold calling. We provide high-quality, pre-qualified leads through our proprietary CRM.", icon: <Rocket /> },
                  ].map((item, i) => (
                    <motion.div key={i} className="flex gap-6 group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-amber-500/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] transition-all duration-500">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-500">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
              
              <Reveal className="relative hidden lg:block">
                 <div className="aspect-[4/5] rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl relative border border-slate-200">
                   <Image src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80" alt="Closing a deal" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                 </div>
                 <motion.div 
                   className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.2)] border border-slate-100 z-10"
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <p className="text-6xl font-black text-slate-950 mb-1">₹0</p>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Brokerage to Clients</p>
                    <div className="w-full h-1 bg-amber-500 mt-3 rounded-full"></div>
                    <p className="text-xs text-slate-500 mt-3 font-medium">100% Transparency Policy</p>
                 </motion.div>
              </Reveal>
            </div>
          </section>
        </SectionWrapper>

        {/* 3. DAY IN THE LIFE */}
        <SectionWrapper className="bg-[#F8F9FA] border-y border-slate-100">
          <section className="max-w-7xl mx-auto px-6 py-24">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">A Day in the Life</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">Fast-paced, highly rewarding, and never boring. Here is what your typical day looks like as a Sales Executive.</p>
              </div>
              
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-3 gap-8"
              >
                {[
                  { time: "Morning Focus", desc: "Start with site visits in Hinjewadi or Balewadi, meeting high-value clients and showcasing premium properties." },
                  { time: "Afternoon Hustle", desc: "Close deals over coffee in Tathawade. Utilize our proprietary CRM to follow up with hot leads." },
                  { time: "Evening Review", desc: "Team huddles, mentorship sessions at the office, and planning the attack for tomorrow." }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] text-center border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] transition-shadow duration-300">
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{item.time}</h3>
                    <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Reveal>
          </section>
        </SectionWrapper>

        {/* 4. CAREER GROWTH PATH */}
        <SectionWrapper>
          <section className="max-w-5xl mx-auto px-6 py-24">          
            <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 text-white shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800/50 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-900/20 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
              
              <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-xs font-bold border border-white/10 shadow-lg text-amber-400 mb-6">
                  <Star size={12} className="fill-amber-400" />
                  <span className="tracking-widest uppercase">Performance Rewarded</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Your Career Roadmap</h2>
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                  At EUS Realty, you don't just stay in sales — you grow into a real estate leader. Reach ₹50L+ as a Team Leader.
                </p>
              </div>

              <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-12 md:space-y-16 z-10">
                {[
                  { level: "Trainee Associate", time: "0 – 6 Months", reward: "Learn Pune’s micro-markets, property fundamentals, and sales processes." },
                  { level: "Sales Executive", time: "6 Months – 2 Years", reward: "Handle site visits, assist senior members, and close your first deals." },
                  { level: "Senior Executive", time: "2 – 4 Years", reward: "Manage multiple projects, handle serious buyers, and close high-value transactions." },
                  { level: "Team Leader", time: "4 – 5 Years", reward: "Lead a small team of executives and mentor new associates." },
                  { level: "Sales Manager", time: "5+ Years", reward: "Oversee strategy for multiple projects and manage large sales divisions." }
                ].map((step, i) => (
                  <div key={i} className="relative pl-10 md:pl-16 group">
                    <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-slate-800 ring-4 ring-slate-950 group-hover:bg-amber-400 transition-colors duration-500 shadow-[0_0_15px_rgba(245,158,11,0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-widest block mb-2">{step.time}</span>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">{step.level}</h4>
                    <p className="text-slate-400 leading-relaxed max-w-xl font-light">{step.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* 5. OPEN POSITIONS */}
        <SectionWrapper className="bg-[#F8F9FA] border-t border-slate-100">
          <section id="roles" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Current Openings</h2>
                <p className="text-slate-500 text-lg font-light">Join the West Pune Growth Story.</p>
              </div>
              <div className="inline-flex items-center justify-center bg-slate-950 text-white px-6 py-3 rounded-full font-bold text-sm shadow-md">
                <Briefcase size={16} className="mr-2 text-amber-500" />
                {filteredJobs.length} Active Positions
              </div>
            </div>

            {/* Filters */}
            <div className="mb-10 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.05)]">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search job titles..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full bg-transparent pl-14 pr-4 py-3 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 rounded-2xl transition-all" 
                />
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <select 
                value={filterDept} 
                onChange={(e) => setFilterDept(e.target.value)} 
                className="sm:w-64 bg-slate-50 px-5 py-3 text-slate-900 font-medium border border-slate-200 focus:outline-none focus:border-amber-500 rounded-2xl cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Growth">Growth</option>
                <option value="Inventory">Inventory</option>
                <option value="CRM">CRM</option>
              </select>
            </div>

            {/* Job List */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <Reveal key={job.id} delay={index * 0.05}>
                    <div className="group bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between hover:border-amber-500/40 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] transition-all duration-500">
                      <div className="space-y-4">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-800 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full">
                          {job.dept}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">{job.title}</h3>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                          <span className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> {job.location}</span>
                          <span className="flex items-center gap-2"><Briefcase size={16} className="text-slate-400" /> {job.type}</span>
                          <span className="flex items-center gap-2 text-slate-900 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                            💰 {job.salary}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {job.tags.map((tag, i) => (
                            <span key={i} className="bg-slate-50 border border-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 md:shrink-0">
                        <a 
                          href={job.link} 
                          className="relative overflow-hidden flex items-center justify-center bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold group/btn tracking-wide shadow-sm"
                        >
                          <span className="absolute inset-0 w-full h-full bg-slate-50 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
                          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                            Details <ArrowRight size={18} className="text-slate-400 group-hover/btn:text-amber-500 group-hover/btn:translate-x-1 transition-all" />
                          </span>
                        </a>

                        <button 
                          type="button"
                          onClick={() => handleQuickApply(job)} 
                          className="relative overflow-hidden bg-slate-950 text-white px-8 py-4 rounded-xl font-bold group/btn shadow-md tracking-wide text-center border border-slate-800 z-10"
                        >
                          <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
                          <span className="relative z-10 block group-hover/btn:text-slate-950 transition-colors duration-300">
                            Quick Apply
                          </span>
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <p className="text-slate-500 font-light text-lg">No positions found matching your search.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setFilterDept('All'); }}
                    className="mt-4 text-amber-600 font-bold hover:text-amber-500 transition-colors tracking-wide"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </SectionWrapper>

        {/* 6. OFFICE LOCATION */}
        <SectionWrapper>
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-slate-800 grid lg:grid-cols-5 relative">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="p-10 md:p-16 lg:col-span-2 flex flex-col justify-center text-white relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Visit our Hub</h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">Located in the heart of Pune's massive growth corridor. Drop by for a coffee and let's discuss your future.</p>
                
                <div className="space-y-6 mb-12">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="text-amber-500" size={20} />
                    </div>
                    <p className="font-medium leading-relaxed text-slate-300 mt-1">Office No. 424-427, Vardhamaan Moonstone, Tathawade, Pune - 411033</p>
                  </div>
                </div>
                
                <a href="https://maps.google.com/?q=Elite+Unique+Services" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-5 rounded-full font-black w-full sm:w-auto text-center group tracking-wide">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                    Get Directions <ArrowRight size={20} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                  </span>
                </a>
              </div>
              
              <div className="h-72 lg:h-auto lg:col-span-3 relative grayscale hover:grayscale-0 transition-all duration-700">
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2988.3826013811286!2d73.74371297393837!3d18.618266666185157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb00424ee25d%3A0x591d30ed72160c8f!2sElite%20Unique%20Services!5e1!3m2!1sen!2sin!4v1780557910866!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Elite Unique Services Location"
                  />
              </div>
            </div>
          </section>
        </SectionWrapper>
      </main>

      {/* --- RENDER PORTAL FOR MODAL --- */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}