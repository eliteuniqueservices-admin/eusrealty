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
import { useState, useMemo } from 'react';

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    { id: 1, title: "Relationship Manager", dept: "Sales", type: "Full-time", location: "Baner/Wakad", salary: "₹8L Base + 20% Commission", link: "/careers/relationship-manager", tags: ["High Commission", "Fast Growth"] },
    { id: 2, title: "Digital Marketing Executive", dept: "Growth", type: "Full-time", location: "Tathawade", salary: "₹6L Fixed + Performance", link: "/careers/digital-marketing-executive", tags: ["Fresher Friendly", "Tech-Driven"] },
    { id: 3, title: "Sourcing Manager", dept: "Inventory", type: "Full-time", location: "West Pune", salary: "₹10L + High Incentives", link: "/careers/sourcing-manager", tags: ["High Commission", "Leadership"] },
    { id: 4, title: "Customer Success Associate", dept: "CRM", type: "Full-time", location: "Pune", salary: "₹5L Fixed", link: "/careers/customer-success-associate", tags: ["Stable", "Growth"] }
  ];

  // Optimize filtering with useMemo
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

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-white pb-32 relative selection:bg-indigo-900 selection:text-white">
      
      {/* Sticky Floating CTA */}
      <motion.a 
        href="#roles"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-indigo-950 text-white px-6 py-4 rounded-2xl font-black shadow-[0_10px_40px_-10px_rgba(30,27,75,0.8)] cursor-pointer hover:scale-105 transition-transform duration-300 inline-block text-sm md:text-base"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        Apply Now – Limited Spots
      </motion.a>

      {/* 1. HERO SECTION */}
      <SectionWrapper className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-900 font-bold text-xs uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Join Pune's Elite Real Estate Force
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight text-balance mx-auto">
              Close ₹1Cr+ Deals in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">West Pune's IT Hub.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium text-balance mb-12">
              Work with top developers like Godrej, VTP, and Rohan in Baner, Wakad, and Hinjewadi. Build a ₹10L–₹30L+ career with Pune's most aggressive incentives.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#roles" className="w-full sm:w-auto bg-indigo-950 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-900 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-indigo-950/20">
                View High-Income Roles
              </a>
              <div className="w-full sm:w-auto flex items-center justify-center gap-3 text-gray-900 font-bold px-6 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                <Trophy className="text-amber-500" size={24} strokeWidth={2.5} />
                ₹100Cr+ Sales Closed
              </div>
            </div>
          </Reveal>
        </section>
      </SectionWrapper>

      {/* 2. WORK WITH US */}
      <SectionWrapper className="relative border-t border-gray-100">
        <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 text-balance">Why Top Performers Choose EUS Realty?</h2>
              <div className="space-y-6">
                {[
                  { title: "Direct Builder Mandates", desc: "Work with Grade-A builders in Pune (VTP, Godrej, Rohan) with exclusive inventory you won't find anywhere else.", icon: <Star /> },
                  { title: "Highest Incentive Ratios", desc: "Earn ₹10L–₹30L+ annually with our aggressive payouts. Your hard work reflects directly in your bank account.", icon: <Zap /> },
                  { title: "Tech-First Sourcing", desc: "Say goodbye to cold calling. We provide high-quality, pre-qualified leads through our proprietary CRM.", icon: <Rocket /> },
                ].map((item, i) => (
                  <motion.div key={i} className="flex gap-6 group bg-white p-6 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            
            <Reveal className="relative hidden md:block">
               <div className="aspect-[4/5] rounded-[3rem] bg-gray-100 overflow-hidden shadow-2xl relative">
                 <Image src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80" alt="Closing a deal" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
               </div>
               <motion.div 
                 className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 z-10"
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                  <p className="text-6xl font-black text-indigo-950 mb-1">₹0</p>
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">Brokerage to Clients</p>
                  <div className="w-full h-1 bg-amber-500 mt-3 rounded-full"></div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">100% Transparency Policy</p>
               </motion.div>
            </Reveal>
          </div>
        </section>
      </SectionWrapper>

      {/* 3. DAY IN THE LIFE */}
      <SectionWrapper className="bg-slate-50 border-y border-gray-200">
        <section className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">A Day in the Life</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Fast-paced, highly rewarding, and never boring. Here is what your typical day looks like as a Sales Executive.</p>
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
                <motion.div key={i} variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] text-center border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-black text-indigo-950 mb-4">{item.time}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        </section>
      </SectionWrapper>

      {/* 4. CAREER GROWTH PATH (Timeline) */}
      <SectionWrapper>
        <section className="max-w-5xl mx-auto px-6 py-24">          
          <div className="bg-indigo-950 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 text-white shadow-2xl relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800/30 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
            
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Your Career Roadmap</h2>
              <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto">
                At EUS Realty, you don't just stay in sales — you grow into a real estate leader. Reach ₹50L+ as a Team Leader.
              </p>
            </div>

            <div className="relative border-l-2 border-indigo-800/50 ml-4 md:ml-8 space-y-12 md:space-y-16 z-10">
              {[
                { level: "Trainee Associate", time: "0 – 6 Months", reward: "Learn Pune’s micro-markets, property fundamentals, and sales processes." },
                { level: "Sales Executive", time: "6 Months – 2 Years", reward: "Handle site visits, assist senior members, and close your first deals." },
                { level: "Senior Executive", time: "2 – 4 Years", reward: "Manage multiple projects, handle serious buyers, and close high-value transactions." },
                { level: "Team Leader", time: "4 – 5 Years", reward: "Lead a small team of executives and mentor new associates." },
                { level: "Sales Manager", time: "5+ Years", reward: "Oversee strategy for multiple projects and manage large sales divisions." }
              ].map((step, i) => (
                <div key={i} className="relative pl-10 md:pl-16 group">
                  {/* Glowing Dot */}
                  <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-indigo-950 group-hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  
                  <span className="text-amber-500 font-bold text-sm uppercase tracking-widest block mb-2">{step.time}</span>
                  <h4 className="text-2xl md:text-3xl font-black text-white mb-3">{step.level}</h4>
                  <p className="text-indigo-200 leading-relaxed max-w-xl">{step.reward}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* 5. OPEN POSITIONS (Jobs Board) */}
      <SectionWrapper className="bg-slate-50 border-t border-gray-200">
        <section id="roles" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Current Openings</h2>
              <p className="text-gray-600 text-lg">Join the West Pune Growth Story.</p>
            </div>
            <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 px-6 py-3 rounded-full font-bold text-sm">
              <Briefcase size={16} className="mr-2" />
              {filteredJobs.length} Active Positions
            </div>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search job titles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-transparent pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-2xl transition-all" 
              />
            </div>
            <div className="w-px bg-gray-200 hidden sm:block"></div>
            <select 
              value={filterDept} 
              onChange={(e) => setFilterDept(e.target.value)} 
              className="sm:w-64 bg-gray-50 px-4 py-3 text-gray-900 border border-gray-200 focus:outline-none focus:border-indigo-500 rounded-2xl cursor-pointer"
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
                  <div className="group bg-white border border-gray-200 p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300">
                    <div className="space-y-4">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full">
                        {job.dept}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-indigo-950 transition-colors">{job.title}</h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {job.location}</span>
                        <span className="flex items-center gap-2"><Briefcase size={16} className="text-gray-400" /> {job.type}</span>
                        <span className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                          💰 {job.salary}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {job.tags.map((tag, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-3 md:shrink-0">
                      <button 
                        onClick={() => handleQuickApply(job)} 
                        className="bg-indigo-950 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-900 transition-colors text-center"
                      >
                        Quick Apply
                      </button>
                      <a 
                        href={job.link} 
                        className="bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        Details <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-200">
                <p className="text-gray-500 font-medium">No positions found matching your search.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterDept('All'); }}
                  className="mt-4 text-indigo-600 font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </SectionWrapper>

      {/* Quick Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <button 
                onClick={() => setShowApplyModal(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="mb-8 pr-8">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">Quick Application</span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">Apply for {selectedJob?.title}</h3>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number</label>
                  <input type="tel" placeholder="+91" className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Resume (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-1 bg-indigo-950 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-900 transition-colors text-center">
                    Submit Application
                  </button>
                  <a href={`https://wa.me/917620733613?text=Hi, I am interested in applying for the ${selectedJob?.title} role.`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. OFFICE LOCATION */}
      <SectionWrapper>
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-200 grid lg:grid-cols-5">
            <div className="p-10 md:p-16 lg:col-span-2 flex flex-col justify-center bg-indigo-950 text-white">
              <h2 className="text-4xl font-black mb-6">Visit our Hub</h2>
              <p className="text-indigo-200 text-lg mb-10 leading-relaxed">Located in the heart of Pune's massive growth corridor. Drop by for a coffee and let's discuss your future.</p>
              
              <div className="space-y-6 mb-12">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="text-amber-500" size={20} />
                  </div>
                  <p className="font-medium leading-relaxed">Office No. 424-427, Vardhamaan Moonstone, Tathawade, Pune - 411033</p>
                </div>
              </div>
              
              <a href="https://maps.google.com/?q=Vardhamaan+Moonstone+Tathawade+Pune" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-indigo-950 px-8 py-4 rounded-xl font-black hover:bg-amber-400 transition-colors w-full sm:w-auto text-center">
                Get Directions <ArrowRight size={20} />
              </a>
            </div>
            <div className="h-64 lg:h-auto lg:col-span-3 relative grayscale hover:grayscale-0 transition-all duration-700">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.39655517316!2d73.7486807!3d18.6012487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b90044b1c11d%3A0x6b63c9b781df57!2sVardhaman%20Moonstone!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="EUS Realty Office Location"
               ></iframe>
            </div>
          </div>
        </section>
      </SectionWrapper>

    </main>
  );
}