'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Briefcase, MapPin, Phone, ArrowRight, Quote, Home, ChevronDown, Star, Building2, TrendingUp } from 'lucide-react';
import { useRef } from 'react';

export default function AboutClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Luxury Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const slowReveal = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: "easeOut" } }
  };

  const staggerChapter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const teamMembers = [
    { name: "Amarpal Singh", role: "The Visionary / Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop" },
    { name: "Kunal Verma", role: "The Catalyst / Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
    { name: "Rajesh Jha", role: "Associate Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop" },
    { name: "Vicky Teltumbde", role: "Senior Sales Executive", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop" },
  ];

  return (
    <main ref={containerRef} className="bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white overflow-hidden font-sans relative">
      
      {/* Background Styling */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      
      {/* --- 1. THE PREMIUM HERO --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 rounded-b-[3rem] md:rounded-b-[4rem] mx-2 md:mx-4 mt-2 shadow-2xl">
        <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-40">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="Premium Pune Real Estate Skyline"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </motion.div>
        
        {/* Animated Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
        
        <div className="relative z-10 max-w-5xl px-6 text-center mt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerChapter} className="space-y-6">
            <motion.div variants={slowReveal} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-lg mb-4">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="tracking-widest uppercase text-amber-500">Pune's Premier Channel Partner</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight">
              A Legacy of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                Absolute Trust.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mt-6">
              For decades, the highest-value real estate transactions in West Pune were finalized on a simple handshake. Today, we bring that legacy to the digital forefront.
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* --- 2. THE BRAND STORY --- */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Chapter 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-24 md:mb-32">
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
              <div className="w-8 h-px bg-amber-600"></div> The Foundation
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
              A Reputation Built in Silence
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                In an industry obsessed with loud billboards and flashy advertisements, the greatest real estate advisory empire in West Pune was built entirely through word-of-mouth. 
              </motion.p>
              <motion.p variants={fadeUp}>
                For decades, Amarpal Singh operated as the market's most trusted advisor. He had no digital footprint. No aggressive marketing team. But what he possessed was invaluable: an ironclad reputation and an unmatched understanding of Pune's property landscape.
              </motion.p>
              <motion.p variants={fadeUp}>
                When Pune’s top-tier developers needed to market massive luxury ventures—like the legendary <strong>Omega Paradise in Wakad</strong>—they didn't rely solely on ad campaigns. They called Amarpal. As an elite channel partner, he guided thousands of homebuyers and investors to secure, high-ROI assets based purely on uncompromising ethics.
              </motion.p>
            </div>
          </motion.div>

          {/* Chapter 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-24 md:mb-32">
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
              <div className="w-8 h-px bg-amber-600"></div> The Evolution
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
              Modern Execution. Traditional Values.
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                Fast forward to 2025. Enter Kunal Verma. 
              </motion.p>
              <motion.p variants={fadeUp}>
                Armed with an MBA and a vision to disrupt the prop-tech space, Kunal originally drew up plans to build a brand new real estate startup from scratch. He wanted to integrate data analytics, digital sourcing, and modern CRM systems into Pune's booming property market.
              </motion.p>
              <motion.p variants={fadeUp}>
                But before laying the first brick of a new venture, a defining conversation with his grandfather, Amarpal, altered the trajectory of West Pune's real estate advisory forever.
              </motion.p>
            </div>
          </motion.div>

          {/* The Climax (Quote) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24 md:mb-32 relative">
            <div className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-[3rem] -z-10 shadow-sm" />
            <div className="p-10 md:p-16 text-center">
              <Quote className="text-amber-500/40 w-16 h-16 md:w-20 md:h-20 mb-8 mx-auto" />
              <blockquote className="text-2xl md:text-4xl font-serif italic text-slate-900 leading-snug tracking-tight">
                "You want to build a kingdom from scratch," <span className="text-slate-500 text-xl md:text-2xl block mt-4 font-sans font-light not-italic">Amarpal told his grandson,</span> <br/>
                "But you are already standing in the courtyard of a quiet empire. Take the handover. Turn on the lights. Show them what we've built."
              </blockquote>
            </div>
          </motion.div>

          {/* Chapter 3 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter}>
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
              <div className="w-8 h-px bg-amber-600"></div> The Present
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
              EUS Realty: The Premier Partner
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                Kunal didn't start a new company; he modernized a legacy. Together, the veteran visionary and the modern strategist officially launched <strong>Elite Unique Services (EUS Realty)</strong> as a RERA-registered authorized channel partner.
              </motion.p>
              <motion.p variants={fadeUp}>
                It was the perfect storm. Amarpal provided the unshakeable foundation—decades of developer goodwill and deep market foresight. Kunal brought the execution—digital portfolio management, transparent ROI analytics, and a seamless zero-brokerage model for buyers.
              </motion.p>
              <motion.p variants={fadeUp}>
                Today, the fusion of traditional trust and modern technology has resulted in the successful marketing of over 100+ premium projects. EUS Realty proudly continues to guide thousands of families and investors into high-appreciating assets across Hinjewadi, Baner, Tathawade, and Wakad.
              </motion.p>
              <motion.p variants={fadeUp} className="text-amber-600 font-bold pt-4 text-xl tracking-wide">
                The secret is out. And we are just getting started.
              </motion.p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- 3. THE IMPACT (SEO Stats) --- */}
      <section className="py-24 bg-slate-950 rounded-[3rem] md:rounded-[4rem] mx-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div variants={fadeUp} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Home className="text-amber-500" size={40} />
                </div>
              </div>
              <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">15k+</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Families Placed</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Building2 className="text-amber-500" size={40} />
                </div>
              </div>
              <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">100+</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Projects Marketed</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <ShieldCheck className="text-amber-500" size={40} />
                </div>
              </div>
              <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">30+</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Years of Trust</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 4. THE LEADERSHIP (The Team) --- */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">The Architects of EUS</motion.h2>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 font-light">The strategic minds driving Pune's real estate evolution.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div key={i} variants={fadeUp} className="group relative">
                <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] mb-6 shadow-md border border-slate-100 bg-slate-100">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <Image 
                    src={member.img} 
                    alt={`${member.name} - ${member.role} at EUS Realty`}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                </div>
                <div className="px-2 text-center">
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{member.name}</h4>
                  <p className="text-amber-600 font-bold text-xs tracking-widest uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 5. THE FINALE (Call to Action) --- */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white overflow-hidden relative shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-slate-800">
            
            {/* Ambient Blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-700/40 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="relative z-10">
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 text-balance tracking-tight">
                Become part of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">history.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                Don't just buy a property. Partner with the legacy that built West Pune. Let EUS Realty navigate your next real estate triumph with zero brokerage.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* PRIMARY CTA: "Building Rise" */}
                <a href="/properties" className="relative overflow-hidden inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-2xl md:rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                    Explore Inventory <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                  </span>
                </a>
                
                {/* SECONDARY CTA: "Door Slide" */}
                <a href="https://wa.me/917620733613" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden inline-flex items-center justify-center bg-white/5 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl md:rounded-full font-bold group tracking-wide w-full sm:w-auto">
                  <span className="absolute inset-0 w-full h-full bg-white origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                    <Phone size={18} className="text-amber-500 group-hover:text-slate-950 transition-colors" /> 
                    Talk to an Expert
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}