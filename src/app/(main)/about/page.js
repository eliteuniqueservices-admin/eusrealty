// 'use client';

// import Image from 'next/image';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { ShieldCheck, Briefcase, MapPin, Phone, ArrowRight, Quote, Home, ChevronDown, Star, Building2, TrendingUp } from 'lucide-react';
// import { useRef } from 'react';

// export default function AboutClient() {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
//   const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

//   // Luxury Framer Motion Variants
//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
//   };

//   const slowReveal = {
//     hidden: { opacity: 0, filter: "blur(8px)" },
//     visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: "easeOut" } }
//   };

//   const staggerChapter = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
//   };

//   const teamMembers = [
//     { name: "Amarpal Singh", role: "The Visionary / Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop" },
//     { name: "Kunal Verma", role: "The Catalyst / Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
//     { name: "Rajesh Jha", role: "Associate Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop" },
//     { name: "Vicky Teltumbde", role: "Senior Sales Executive", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop" },
//   ];

//   return (
//     <main ref={containerRef} className="bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white overflow-hidden font-sans relative">
      
//       {/* Background Styling */}
//       <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      
//       {/* --- 1. THE PREMIUM HERO --- */}
//       <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 rounded-b-[3rem] md:rounded-b-[4rem] mx-2 md:mx-4 mt-2 shadow-2xl">
//         <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-40">
//           <Image 
//             src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
//             alt="Premium Pune Real Estate Skyline"
//             fill
//             className="object-cover grayscale"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
//         </motion.div>
        
//         {/* Animated Glows */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
        
//         <div className="relative z-10 max-w-5xl px-6 text-center mt-20">
//           <motion.div initial="hidden" animate="visible" variants={staggerChapter} className="space-y-6">
//             <motion.div variants={slowReveal} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-lg mb-4">
//               <Star size={14} className="fill-amber-400 text-amber-400" />
//               <span className="tracking-widest uppercase text-amber-500">Pune's Premier Channel Partner</span>
//             </motion.div>
            
//             <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight">
//               A Legacy of <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
//                 Absolute Trust.
//               </span>
//             </motion.h1>
            
//             <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mt-6">
//               For decades, the highest-value real estate transactions in West Pune were finalized on a simple handshake. Today, we bring that legacy to the digital forefront.
//             </motion.p>
//           </motion.div>
//         </div>

//         <motion.div 
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
//           className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400"
//         >
//           <ChevronDown size={32} />
//         </motion.div>
//       </section>

//       {/* --- 2. THE BRAND STORY --- */}
//       <section className="py-24 md:py-32 relative">
//         <div className="max-w-4xl mx-auto px-6">
          
//           {/* Chapter 1 */}
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-24 md:mb-32">
//             <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
//               <div className="w-8 h-px bg-amber-600"></div> The Foundation
//             </motion.span>
//             <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
//               A Reputation Built in Silence
//             </motion.h2>
//             <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
//               <motion.p variants={fadeUp}>
//                 In an industry obsessed with loud billboards and flashy advertisements, the greatest real estate advisory empire in West Pune was built entirely through word-of-mouth. 
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 For decades, Amarpal Singh operated as the market's most trusted advisor. He had no digital footprint. No aggressive marketing team. But what he possessed was invaluable: an ironclad reputation and an unmatched understanding of Pune's property landscape.
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 When Pune’s top-tier developers needed to market massive luxury ventures—like the legendary <strong>Omega Paradise in Wakad</strong>—they didn't rely solely on ad campaigns. They called Amarpal. As an elite channel partner, he guided thousands of homebuyers and investors to secure, high-ROI assets based purely on uncompromising ethics.
//               </motion.p>
//             </div>
//           </motion.div>

//           {/* Chapter 2 */}
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter} className="mb-24 md:mb-32">
//             <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
//               <div className="w-8 h-px bg-amber-600"></div> The Evolution
//             </motion.span>
//             <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
//               Modern Execution. Traditional Values.
//             </motion.h2>
//             <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
//               <motion.p variants={fadeUp}>
//                 Fast forward to 2025. Enter Kunal Verma. 
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 Armed with an MBA and a vision to disrupt the prop-tech space, Kunal originally drew up plans to build a brand new real estate startup from scratch. He wanted to integrate data analytics, digital sourcing, and modern CRM systems into Pune's booming property market.
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 But before laying the first brick of a new venture, a defining conversation with his grandfather, Amarpal, altered the trajectory of West Pune's real estate advisory forever.
//               </motion.p>
//             </div>
//           </motion.div>

//           {/* The Climax (Quote) */}
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24 md:mb-32 relative">
//             <div className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-[3rem] -z-10 shadow-sm" />
//             <div className="p-10 md:p-16 text-center">
//               <Quote className="text-amber-500/40 w-16 h-16 md:w-20 md:h-20 mb-8 mx-auto" />
//               <blockquote className="text-2xl md:text-4xl font-serif italic text-slate-900 leading-snug tracking-tight">
//                 "You want to build a kingdom from scratch," <span className="text-slate-500 text-xl md:text-2xl block mt-4 font-sans font-light not-italic">Amarpal told his grandson,</span> <br/>
//                 "But you are already standing in the courtyard of a quiet empire. Take the handover. Turn on the lights. Show them what we've built."
//               </blockquote>
//             </div>
//           </motion.div>

//           {/* Chapter 3 */}
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerChapter}>
//             <motion.span variants={fadeUp} className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
//               <div className="w-8 h-px bg-amber-600"></div> The Present
//             </motion.span>
//             <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight">
//               EUS Realty: The Premier Partner
//             </motion.h2>
//             <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
//               <motion.p variants={fadeUp}>
//                 Kunal didn't start a new company; he modernized a legacy. Together, the veteran visionary and the modern strategist officially launched <strong>Elite Unique Services (EUS Realty)</strong> as a RERA-registered authorized channel partner.
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 It was the perfect storm. Amarpal provided the unshakeable foundation—decades of developer goodwill and deep market foresight. Kunal brought the execution—digital portfolio management, transparent ROI analytics, and a seamless zero-brokerage model for buyers.
//               </motion.p>
//               <motion.p variants={fadeUp}>
//                 Today, the fusion of traditional trust and modern technology has resulted in the successful marketing of over 100+ premium projects. EUS Realty proudly continues to guide thousands of families and investors into high-appreciating assets across Hinjewadi, Baner, Tathawade, and Wakad.
//               </motion.p>
//               <motion.p variants={fadeUp} className="text-amber-600 font-bold pt-4 text-xl tracking-wide">
//                 The secret is out. And we are just getting started.
//               </motion.p>
//             </div>
//           </motion.div>

//         </div>
//       </section>

//       {/* --- 3. THE IMPACT (SEO Stats) --- */}
//       <section className="py-24 bg-slate-950 rounded-[3rem] md:rounded-[4rem] mx-4 shadow-2xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
//         <div className="max-w-7xl mx-auto px-6 relative z-10">
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid md:grid-cols-3 gap-12 text-center">
//             <motion.div variants={fadeUp} className="p-8">
//               <div className="flex justify-center mb-6">
//                 <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                   <Home className="text-amber-500" size={40} />
//                 </div>
//               </div>
//               <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">15k+</h4>
//               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Families Placed</p>
//             </motion.div>
//             <motion.div variants={fadeUp} className="p-8">
//               <div className="flex justify-center mb-6">
//                 <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                   <Building2 className="text-amber-500" size={40} />
//                 </div>
//               </div>
//               <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">100+</h4>
//               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Projects Marketed</p>
//             </motion.div>
//             <motion.div variants={fadeUp} className="p-8">
//               <div className="flex justify-center mb-6">
//                 <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                   <ShieldCheck className="text-amber-500" size={40} />
//                 </div>
//               </div>
//               <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">30+</h4>
//               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Years of Trust</p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* --- 4. THE LEADERSHIP (The Team) --- */}
//       <section className="py-24 md:py-32">
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="text-center mb-20">
//             <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">The Architects of EUS</motion.h2>
//             <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 font-light">The strategic minds driving Pune's real estate evolution.</motion.p>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {teamMembers.map((member, i) => (
//               <motion.div key={i} variants={fadeUp} className="group relative">
//                 <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] mb-6 shadow-md border border-slate-100 bg-slate-100">
//                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
//                   <Image 
//                     src={member.img} 
//                     alt={`${member.name} - ${member.role} at EUS Realty`}
//                     fill
//                     className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
//                 </div>
//                 <div className="px-2 text-center">
//                   <h4 className="text-2xl font-black text-slate-900 mb-1">{member.name}</h4>
//                   <p className="text-amber-600 font-bold text-xs tracking-widest uppercase">{member.role}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* --- 5. THE FINALE (Call to Action) --- */}
//       <section className="py-24 md:py-32 relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
//           <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white overflow-hidden relative shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-slate-800">
            
//             {/* Ambient Blurs */}
//             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
//             <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-700/40 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />
            
//             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChapter} className="relative z-10">
//               <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 text-balance tracking-tight">
//                 Become part of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">history.</span>
//               </motion.h2>
//               <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
//                 Don't just buy a property. Partner with the legacy that built West Pune. Let EUS Realty navigate your next real estate triumph with zero brokerage.
//               </motion.p>
              
//               <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                 {/* PRIMARY CTA: "Building Rise" */}
//                 <a href="/properties" className="relative overflow-hidden inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-2xl md:rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto">
//                   <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
//                   <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
//                     Explore Inventory <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
//                   </span>
//                 </a>
                
//                 {/* SECONDARY CTA: "Door Slide" */}
//                 <a href="https://wa.me/917620733613" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden inline-flex items-center justify-center bg-white/5 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl md:rounded-full font-bold group tracking-wide w-full sm:w-auto">
//                   <span className="absolute inset-0 w-full h-full bg-white origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
//                   <span className="relative z-10 flex items-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
//                     <Phone size={18} className="text-amber-500 group-hover:text-slate-950 transition-colors" /> 
//                     Talk to an Expert
//                   </span>
//                 </a>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }


'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, Briefcase, MapPin, Phone, ArrowRight,
  Quote, Home, ChevronDown, Star, Building2, TrendingUp
} from 'lucide-react';
import { useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   TEAM DATA  — swap images & contact details
───────────────────────────────────────────── */
const teamMembers = [
  {
    name: 'Amarpal Singh',
    role: 'Visionary / Founder',
    badge: '30+ Yrs',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&q=80',
    summary:
      'The quiet empire builder. Decades of unmatched developer goodwill and ethical advisory across West Pune.',
    expertise: ['Luxury Projects', 'Developer Relations', 'Market Foresight'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'amarpal@eusrealty.com',
  },
  {
    name: 'Kunal Verma',
    role: 'Catalyst / Director',
    badge: 'MBA',
    img: '/uploads/Kunal Sir.jpg',
    summary:
      'Modern strategist. Fused MBA-grade analytics with legacy trust to redefine channel partnering in Pune.',
    expertise: ['Prop-Tech', 'ROI Analytics', 'CRM Systems'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'kunal@eusrealty.com',
  },
  {
    name: 'Rajesh Jha',
    role: 'Associate Director',
    badge: 'Senior',
    img: '/uploads/Rajesh Sir.jpeg',
    summary:
      'Master negotiator with deep expertise in Hinjewadi and Baner micro-markets. Trusted by developers and buyers alike.',
    expertise: ['Negotiation', 'Baner Belt', 'Hinjewadi'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'rajesh@eusrealty.com',
  },
 
  {
    name: 'Pravin Chauhan',
    role: 'RESEARCH EXPERT',
    badge: 'CRM Lead',
    img: '/uploads/Kunal Sir_Pic.jpeg',
    summary:
      'The voice clients call first. Orchestrates every post-sale experience with precision and genuine warmth.',
    expertise: ['Client Care', 'Post-Sale', 'Documentation'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'priya@eusrealty.com',
  },
  {
    name: 'Rahul Upadhyay',
    role: 'IT & MARKETING HEAD',
    badge: 'Growth',
    img: '/uploads/Rahul.jpeg',
    summary:
      'The digital backbone. Drives lead pipelines, digital marketing campaigns, and the EUS online presence.',
    expertise: ['Digital Marketing', 'Lead Gen', 'PropTech'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'marketing@eusrealty.com',
  }, {
    name: 'Vicky Teltumbde',
    role: 'Sr. Sales Executive',
    badge: 'Top Sales',
    img: '/uploads/Vicky.png',
    summary:
      'High-energy closer with a proven record across 50+ premium inventory units in Wakad and Tathawade.',
    expertise: ['Closing Deals', 'Wakad', 'Investor Pitch'],
    wa: '917620733613',
    linkedin: 'https://linkedin.com',
    email: 'vicky@eusrealty.com',
  }
];

/* ─────────────────────────────────────────────
   SVG SOCIAL ICONS
───────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FLIP CARD COMPONENT
───────────────────────────────────────────── */
function TeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      style={{ perspective: '1200px' }}
    >
      {/* Pulsing "Click Me" bubble */}
      {/* <div
        className="absolute -top-3 -right-3 z-20 w-12 h-12 rounded-full flex items-center justify-center text-center cursor-pointer select-none"
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #d97706)',
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#1a1100',
          lineHeight: 1.2,
          animation: 'bubblePulse 2.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(251,191,36,0.5)',
        }}
        onClick={() => setFlipped(!flipped)}
        aria-hidden="true"
      >
        Click<br />Me
      </div> */}

      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #d97706, #fbbf24)',
          padding: '2px',
          borderRadius: '1.6rem',
          filter: 'blur(1px)',
        }}
      />
      {/* Ambient halo */}
      <div
        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20 pointer-events-none"
        style={{
          inset: '-16px',
          borderRadius: '2rem',
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Flip container */}
      <div
        className="relative w-full cursor-pointer"
        style={{
          aspectRatio: '3 / 4.2',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: '1.5rem',
        }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        aria-label={`Flip card for ${member.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setFlipped(!flipped);
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '1.5rem',
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="relative w-full" style={{ height: '72%' }}>
            <Image
              src={member.img}
              alt={`${member.name} – ${member.role} at EUS Realty`}
              fill
              className="object-cover transition-all duration-700"
              style={{ filter: flipped ? 'grayscale(0%)' : 'grayscale(15%)' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(17,17,24,0.9) 0%, rgba(17,17,24,0.2) 50%, transparent 100%)',
              }}
            />
            {/* Badge */}
            <span
              className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(251,191,36,0.3)',
                color: '#fbbf24',
              }}
            >
              {member.badge}
            </span>
          </div>
          <div className="px-4 pt-3 pb-4" style={{ background: 'linear-gradient(180deg,#111118,#0d0d14)' }}>
            <p className="text-white font-black text-lg leading-tight mb-1 tracking-tight">{member.name}</p>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#d97706' }}>
              {member.role}
            </p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 py-5 gap-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '1.5rem',
            background: 'linear-gradient(145deg, #0f0f1a, #151520)',
            border: '1px solid rgba(251,191,36,0.2)',
          }}
        >
          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden mb-3 flex-shrink-0"
            style={{ border: '2px solid #d97706', boxShadow: '0 0 20px rgba(217,119,6,0.45)' }}>
            <Image src={member.img} alt={member.name} fill className="object-cover" sizes="56px" />
          </div>

          <p className="text-white font-black text-base text-center leading-tight mb-0.5">{member.name}</p>
          <p className="text-[9px] font-bold tracking-widest uppercase text-center mb-3" style={{ color: '#d97706' }}>
            {member.role}
          </p>

          {/* Divider */}
          <div className="w-10 h-px mb-3 flex-shrink-0"
            style={{ background: 'linear-gradient(90deg,transparent,#d97706,transparent)' }} />

          {/* Summary */}
          <p className="text-[11px] text-center leading-relaxed mb-3 font-light"
            style={{ color: '#9ca3af' }}>
            {member.summary}
          </p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {member.expertise.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.22)',
                  color: '#fbbf24',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Contact icons */}
          <div className="flex gap-2.5 items-center">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${member.wa}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(37,211,102,0.1)',
                border: '1px solid rgba(37,211,102,0.3)',
                color: '#25d366',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <WhatsAppIcon />
            </a>
            {/* LinkedIn */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(10,102,194,0.1)',
                border: '1px solid rgba(10,102,194,0.3)',
                color: '#0a66c2',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkedInIcon />
            </a>
            {/* Gmail */}
            <a
              href={`mailto:${member.email}`}
              title="Email"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(234,67,53,0.1)',
                border: '1px solid rgba(234,67,53,0.3)',
                color: '#ea4335',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <GmailIcon />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AboutClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const slowReveal = {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: 'easeOut' } },
  };

  const staggerChapter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <>
      {/* Bubble pulse keyframe — injected once */}
      <style>{`
        @keyframes bubblePulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,191,36,0.5); }
          50%      { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
      `}</style>

      <main
        ref={containerRef}
        className="bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white overflow-hidden font-sans relative"
      >
        {/* Background grid */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

        {/* ══════════════════════════════════════
            1. PREMIUM HERO
        ══════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[4rem] mx-2 md:mx-4 mt-2 shadow-2xl">
          <motion.div
            style={{ y: yParallax }}
            className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-40"
          >
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
              alt="Premium Pune Real Estate Skyline"
              fill
              className="object-cover grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          </motion.div>

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />

          <div className="relative z-10 max-w-5xl px-4 sm:px-6 text-center mt-20">
            <motion.div initial="hidden" animate="visible" variants={staggerChapter} className="space-y-6">
              <motion.div
                variants={slowReveal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-lg mb-4"
              >
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="tracking-widest uppercase text-amber-500">Pune's Premier Channel Partner</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
              >
                A Legacy of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Absolute Trust.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mt-6"
              >
                For decades, the highest-value real estate transactions in West Pune were finalized on a simple
                handshake. Today, we bring that legacy to the digital forefront.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            2. BRAND STORY
        ══════════════════════════════════════ */}
        <section className="py-20 md:py-28 lg:py-32 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            {/* Chapter 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerChapter}
              className="mb-20 md:mb-28"
            >
              <motion.span
                variants={fadeUp}
                className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 flex items-center gap-2"
              >
                <div className="w-8 h-px bg-amber-600" /> The Foundation
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight"
              >
                A Reputation Built in Silence
              </motion.h2>
              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                <motion.p variants={fadeUp}>
                  In an industry obsessed with loud billboards and flashy advertisements, the greatest real estate
                  advisory empire in West Pune was built entirely through word-of-mouth.
                </motion.p>
                <motion.p variants={fadeUp}>
                  For decades, Amarpal Singh operated as the market's most trusted advisor. He had no digital
                  footprint. No aggressive marketing team. But what he possessed was invaluable: an ironclad
                  reputation and an unmatched understanding of Pune's property landscape.
                </motion.p>
                <motion.p variants={fadeUp}>
                  When Pune's top-tier developers needed to market massive luxury ventures—like the legendary{' '}
                  <strong>Omega Paradise in Wakad</strong>—they didn't rely solely on ad campaigns. They called
                  Amarpal. As an elite channel partner, he guided thousands of homebuyers and investors to secure,
                  high-ROI assets based purely on uncompromising ethics.
                </motion.p>
              </div>
            </motion.div>

            {/* Chapter 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerChapter}
              className="mb-20 md:mb-28"
            >
              <motion.span
                variants={fadeUp}
                className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 flex items-center gap-2"
              >
                <div className="w-8 h-px bg-amber-600" /> The Evolution
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight"
              >
                Modern Execution. Traditional Values.
              </motion.h2>
              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                <motion.p variants={fadeUp}>Fast forward to 2025. Enter Kunal Verma.</motion.p>
                <motion.p variants={fadeUp}>
                  Armed with an MBA and a vision to disrupt the prop-tech space, Kunal originally drew up plans to
                  build a brand new real estate startup from scratch. He wanted to integrate data analytics, digital
                  sourcing, and modern CRM systems into Pune's booming property market.
                </motion.p>
                <motion.p variants={fadeUp}>
                  But before laying the first brick of a new venture, a defining conversation with his grandfather,
                  Amarpal, altered the trajectory of West Pune's real estate advisory forever.
                </motion.p>
              </div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUp}
              className="mb-20 md:mb-28 relative"
            >
              <div className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[3rem] -z-10 shadow-sm" />
              <div className="p-8 sm:p-10 md:p-16 text-center">
                <Quote className="text-amber-500/40 w-14 h-14 md:w-20 md:h-20 mb-6 mx-auto" />
                <blockquote className="text-xl sm:text-2xl md:text-4xl font-serif italic text-slate-900 leading-snug tracking-tight">
                  "You want to build a kingdom from scratch,"{' '}
                  <span className="text-slate-500 text-lg sm:text-xl md:text-2xl block mt-4 font-sans font-light not-italic">
                    Amarpal told his grandson,
                  </span>
                  <br />
                  "But you are already standing in the courtyard of a quiet empire. Take the handover. Turn on the
                  lights. Show them what we've built."
                </blockquote>
              </div>
            </motion.div>

            {/* Chapter 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerChapter}
            >
              <motion.span
                variants={fadeUp}
                className="text-amber-600 font-black tracking-widest uppercase text-xs mb-4 flex items-center gap-2"
              >
                <div className="w-8 h-px bg-amber-600" /> The Present
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-tight tracking-tight"
              >
                EUS Realty: The Premier Partner
              </motion.h2>
              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                <motion.p variants={fadeUp}>
                  Kunal didn't start a new company; he modernized a legacy. Together, the veteran visionary and the
                  modern strategist officially launched{' '}
                  <strong>Elite Unique Services (EUS Realty)</strong> as a RERA-registered authorized channel
                  partner.
                </motion.p>
                <motion.p variants={fadeUp}>
                  It was the perfect storm. Amarpal provided the unshakeable foundation—decades of developer
                  goodwill and deep market foresight. Kunal brought the execution—digital portfolio management,
                  transparent ROI analytics, and a seamless zero-brokerage model for buyers.
                </motion.p>
                <motion.p variants={fadeUp}>
                  Today, the fusion of traditional trust and modern technology has resulted in the successful
                  marketing of over 100+ premium projects. EUS Realty proudly continues to guide thousands of
                  families and investors into high-appreciating assets across Hinjewadi, Baner, Tathawade, and
                  Wakad.
                </motion.p>
                <motion.p variants={fadeUp} className="text-amber-600 font-bold pt-4 text-lg sm:text-xl tracking-wide">
                  The secret is out. And we are just getting started.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            3. IMPACT STATS
        ══════════════════════════════════════ */}
        <section className="py-20 md:py-24 bg-slate-950 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] mx-3 md:mx-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChapter}
              className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center"
            >
              {[
                { icon: <Home className="text-amber-500" size={40} />, value: '15k+', label: 'Families Placed' },
                { icon: <Building2 className="text-amber-500" size={40} />, value: '100+', label: 'Projects Marketed' },
                { icon: <ShieldCheck className="text-amber-500" size={40} />, value: '30+', label: 'Years of Trust' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="p-6 sm:p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      {stat.icon}
                    </div>
                  </div>
                  <h4 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">{stat.value}</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. TEAM — FLIP CARDS
        ══════════════════════════════════════ */}
        <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
          {/* Subtle amber ambient on dark bg */}
          <div className="absolute inset-0 bg-slate-950 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] mx-3 md:mx-4 pointer-events-none -z-10"
            style={{ boxShadow: 'inset 0 0 120px rgba(251,191,36,0.04)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] mx-3 md:mx-4 pointer-events-none -z-10" />

          {/* Ambient glows */}
          <div className="absolute top-1/3 left-10 w-80 h-80 rounded-full pointer-events-none -z-10 opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/3 right-10 w-64 h-64 rounded-full pointer-events-none -z-10 opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChapter}
              className="text-center mb-16 md:mb-20"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 text-amber-500 font-black tracking-widest uppercase text-xs mb-5"
              >
                <div className="w-8 h-px bg-amber-500" />
                The Architects of EUS
                <div className="w-8 h-px bg-amber-500" />
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
              >
                Meet the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Leadership
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 font-light text-base sm:text-lg max-w-xl mx-auto">
                Hover or tap each card to discover the minds behind Pune's most trusted real estate firm.
              </motion.p>
            </motion.div>

            {/* 6-card responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
              {teamMembers.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. CTA FINALE
        ══════════════════════════════════════ */}
        <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] p-8 sm:p-12 md:p-16 lg:p-24 text-center text-white overflow-hidden relative shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-700/40 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChapter}
                className="relative z-10"
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 text-balance tracking-tight"
                >
                  Become part of the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                    history.
                  </span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 md:mb-12 font-light max-w-2xl mx-auto leading-relaxed"
                >
                  Don't just buy a property. Partner with the legacy that built West Pune. Let EUS Realty navigate
                  your next real estate triumph with zero brokerage.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <a
                    href="/properties"
                    className="relative overflow-hidden inline-flex items-center justify-center bg-white text-slate-950 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl md:rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto text-sm sm:text-base"
                  >
                    <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                      Explore Inventory <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                    </span>
                  </a>

                  <a
                    href="https://wa.me/917620733613"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden inline-flex items-center justify-center bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl md:rounded-full font-bold group tracking-wide w-full sm:w-auto text-sm sm:text-base"
                  >
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
    </>
  );
}

