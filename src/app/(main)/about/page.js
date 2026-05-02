'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck, Briefcase, Landmark, MapPin, Phone, ArrowRight, Quote, Home, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

export default function AboutClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Cinematic Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  const slowReveal = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.5, ease: "easeOut" } }
  };

  const staggerChapter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const teamMembers = [
    { name: "Amarpal Singh", role: "The Visionary / Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop" },
    { name: "Kunal Verma", role: "The Catalyst / Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
    { name: "Rajesh Jha", role: "Associate Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop" },
    { name: "Vicky Teltumbde", role: "Senior Sales Executive", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop" },
  ];

  return (
    <main ref={containerRef} className="bg-[#0a0f1c] text-slate-300 selection:bg-amber-500 selection:text-indigo-950 overflow-hidden font-sans">
      
      {/* --- 1. THE MOVIE POSTER (HERO) --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-50">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="Dark Pune Skyline"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 max-w-5xl px-6 text-center mt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerChapter} className="space-y-6">
            <motion.p variants={slowReveal} className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-4">
              Based on a True Legacy
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
              The Sleeping Giant <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200">of West Pune.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mt-6">
              For decades, the biggest deals in real estate were done in the shadows. Then, a new generation turned on the lights.
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* --- 2. THE CINEMATIC STORY --- */}
      <section className="py-32 relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Chapter 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-32">
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block">Chapter I</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              The Master in the Shadows
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                In an industry obsessed with loud billboards and flashy advertisements, the greatest empire in West Pune was built in absolute silence. 
              </motion.p>
              <motion.p variants={fadeUp}>
                For decades, Amarpal Singh operated as the real estate market's "silent killer." He had no digital footprint. No marketing team. But what he possessed was far more lethal: an ironclad reputation and a handshake that meant more than any signed contract.
              </motion.p>
              <motion.p variants={fadeUp}>
                When Pune’s top developers needed to quietly and ruthlessly sell out massive ventures—like the legendary <strong>Omega Paradise in Wakad</strong>—they didn't run an ad campaign. They called Amarpal. As a strategic channel partner, he guided thousands of buyers to their dream homes, entirely through the power of his word.
              </motion.p>
            </div>
          </motion.div>

          {/* Chapter 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-32">
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block">Chapter II</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              The Heir's Ambition
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                Fast forward to the year 2025. Enter Kunal Verma. 
              </motion.p>
              <motion.p variants={fadeUp}>
                Freshly armed with his MBA, in his early 20s, and burning with entrepreneurial fire, Kunal was ready to conquer the business world. Like any ambitious graduate, he drew up plans to build a brand new startup from scratch. He wanted to make noise. He wanted to build an empire.
              </motion.p>
              <motion.p variants={fadeUp}>
                But before he could lay the first brick of his new venture, he sat down with his grandfather, Amarpal. That conversation would alter the skyline of West Pune forever.
              </motion.p>
            </div>
          </motion.div>

          {/* The Climax (Quote) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32 relative">
            <div className="absolute -inset-10 bg-gradient-to-r from-amber-900/20 via-indigo-900/20 to-amber-900/20 blur-3xl -z-10 rounded-full" />
            <Quote className="text-amber-500/50 w-20 h-20 mb-8 mx-auto" />
            <blockquote className="text-2xl md:text-4xl text-center font-serif italic text-white leading-snug">
              "You want to build a kingdom from scratch," <span className="text-slate-400 text-xl md:text-2xl block mt-4">Amarpal told his grandson,</span> <br/>
              "But you are already standing in the courtyard of a quiet empire. Take the handover. Turn on the lights. Show them what we've built."
            </blockquote>
          </motion.div>

          {/* Chapter 3 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter}>
            <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block">Chapter III</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              The Giant Awakens
            </motion.h2>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
              <motion.p variants={fadeUp}>
                Kunal didn't start a new company. He accepted the torch. Together, the veteran in his 70s and the visionary in his 20s officially registered their partnership: <strong>Elite Unique Services (EUS Realty)</strong>.
              </motion.p>
              <motion.p variants={fadeUp}>
                It was the perfect storm. Amarpal provided the unshakeable foundation—decades of developer goodwill and deep market secrets. Kunal brought the fire—digital marketing, aggressive brand building, tech-driven sourcing, and a modern website that brought their services to the masses.
              </motion.p>
              <motion.p variants={fadeUp}>
                The "silent killer" was no longer silent. EUS Realty exploded onto the digital landscape. Today, the fusion of traditional trust and modern execution has resulted in the successful marketing of over 100+ mega-projects, guiding more than 15,000 happy families into their dream homes across Hinjewadi, Baner, and Wakad.
              </motion.p>
              <motion.p variants={fadeUp} className="text-amber-500 font-medium pt-8">
                The secret is out. And we are just getting started.
              </motion.p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- 3. THE IMPACT (Cinematic Stats) --- */}
      <section className="py-24 bg-black border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div variants={fadeUp}>
              <div className="flex justify-center mb-6"><Home className="text-amber-500" size={48} strokeWidth={1} /></div>
              <h4 className="text-6xl font-black text-white mb-2">15k+</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Families Placed</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="flex justify-center mb-6"><Briefcase className="text-amber-500" size={48} strokeWidth={1} /></div>
              <h4 className="text-6xl font-black text-white mb-2">100+</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Projects Marketed</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="flex justify-center mb-6"><ShieldCheck className="text-amber-500" size={48} strokeWidth={1} /></div>
              <h4 className="text-6xl font-black text-white mb-2">30+</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Years of Legacy</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 4. THE CAST (The Team) --- */}
      <section className="py-32 bg-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-4">The Architects of the Empire</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-slate-500">The minds driving Pune's real estate evolution.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div key={i} variants={fadeUp} className="group relative">
                <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] mb-6 shadow-2xl shadow-black">
                  <div className="absolute inset-0 bg-indigo-950/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <Image 
                    src={member.img} 
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent opacity-80" />
                </div>
                <div className="px-2 text-center">
                  <h4 className="text-2xl font-black text-white mb-1">{member.name}</h4>
                  <p className="text-amber-600 font-bold text-xs tracking-widest uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 5. THE FINALE (Call to Action) --- */}
      <section className="py-32 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter}>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white mb-8 text-balance">
              Become part of the history.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-slate-400 mb-12 font-light">
              Don't just buy a property. Partner with the legacy that built West Pune. Let EUS Realty navigate your next real estate triumph.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/contact" className="w-full sm:w-auto px-10 py-5 bg-amber-600 text-white text-lg font-black rounded-full hover:bg-amber-500 hover:scale-105 transition-all shadow-[0_0_40px_rgba(217,119,6,0.4)]">
                Start Your Journey
              </a>
              <a href="https://wa.me/7620733613" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Phone size={20} /> Talk to an Expert
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <motion.a 
        href="https://wa.me/7620733613" 
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-110 transition-transform z-50 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <Phone size={28} />
      </motion.a>
    </main>
  );
}