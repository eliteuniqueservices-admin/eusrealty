'use client';

import Reveal from '@/components/Reveal';
import SectionWrapper from "@/components/SectionWrapper";
import { 
  Briefcase, Users, ArrowRight, Star, 
  Rocket, Zap, Heart, MapPin, Search, 
  ClipboardCheck, UserPlus, Coffee, Trophy, MessageCircle, X,
  Award, ShieldCheck, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { formatINR } from '@/lib/formatCurrency';


/* ─────────────────────────────────────────────
   INTERACTIVE COMMISSION CALCULATOR
   • Custom sliders for Deals and Average Property Value
   • Dynamic slab rates based on deals closed
   • Sleek glassmorphic card design
───────────────────────────────────────────── */
function InteractiveCalculator() {
  const [deals, setDeals] = useState(2);
  const [avgValue, setAvgValue] = useState(15000000); // Default: 1.5 Cr

  // Calculate incentive based on slab rates:
  // 1 deal = 1.5%, 2-3 deals = 1.8%, 4+ deals = 2.2% commission rate
  const rate = deals >= 4 ? 0.022 : deals >= 2 ? 0.018 : 0.015;
  const totalSales = deals * avgValue;
  const monthlyIncentive = totalSales * rate;
  const annualIncentive = monthlyIncentive * 12;


  return (
    <div className="bg-[#0b0b12]/85 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Sliders Block */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Deals Closed / Month</span>
              <span className="text-3xl font-black text-amber-400 tabular-nums">{deals}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={deals} 
              onChange={(e) => setDeals(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
              <span>1 Deal</span>
              <span>5 Deals</span>
              <span>10 Deals</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Average Property Value</span>
              <span className="text-3xl font-black text-white tabular-nums">{formatINR(avgValue)}</span>
            </div>
            <input 
              type="range" 
              min="5000000" // 50 Lakhs
              max="50000000" // 5 Crores
              step="1000000" // 10 Lakhs step
              value={avgValue} 
              onChange={(e) => setAvgValue(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
              <span>₹50 Lakhs</span>
              <span>₹2.5 Cr</span>
              <span>₹5.0 Cr</span>
            </div>
          </div>

          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              * Projections combine EUS's tier-based commission payouts (ranging from <span className="text-amber-400 font-semibold">1.5% to 2.2%</span> of total closed volume) alongside standard base compensation metrics.
            </p>
          </div>
        </div>

        {/* Display Block */}
        <div className="lg:col-span-5 bg-[#07070d] border border-white/5 p-8 rounded-3xl flex flex-col justify-center gap-6 relative shadow-inner">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Commission Slab Rate</span>
            <span className="text-2xl font-black text-amber-500">{(rate * 100).toFixed(1)}% Payout</span>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Projected Monthly Earnings</span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
              {formatINR(monthlyIncentive)}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Projected Annual Earnings</span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 tracking-tight tabular-nums">
              {formatINR(annualIncentive)}
            </div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block mt-2">
              Includes High-Performance Bonusses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3-D MAGNETIC TILT CARD
   • Magnetic tilt using Framer motion springs
   • Mouse-tracked dynamic spotlight radial gradient
───────────────────────────────────────────── */
function CareerCard3D({ title, desc, icon, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rawX.set(nx - 0.5);
    rawY.set(ny - 0.5);
    setMousePos({ x: nx * 100, y: ny * 100 });
  };

  const handleMouseLeave = () => {
    rawX.set(0); rawY.set(0);
    setMousePos({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', border: '1px solid rgba(255,255,255,0.05)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative p-8 sm:p-10 rounded-[2.5rem] bg-[#07070d] cursor-pointer overflow-hidden"
        animate={hovered
          ? { borderColor: 'rgba(251,191,36,0.3)', boxShadow: '0 30px 60px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.15)' }
          : { borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }
        }
      >
        {/* Spotlight cursor tracking */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(251,191,36,0.2) 0%, transparent 65%)`,
          }}
        />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-in-out"
            style={{
              transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
              background: 'linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.05) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* Animated top-edge amber glow */}
        <motion.div
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent origin-left pointer-events-none z-10"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
            {icon}
          </div>
          <div className="space-y-2.5">
            <h4 className="text-xl font-bold text-white tracking-tight">{title}</h4>
            <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-base">{desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN CAREERS PAGE COMPONENT
───────────────────────────────────────────── */
export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', experience: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Parallax Scroll bindings for hero styling
  const { scrollYProgress: heroScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const yBackground = useTransform(heroScroll, [0, 1], ['0%', '20%']);
  const opacityHeroText = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const scaleHeroText = useTransform(heroScroll, [0, 0.6], [1, 0.95]);

  // Floating Widgets Parallax
  const yWidgetLeft = useTransform(heroScroll, [0, 1], [0, -180]);
  const yWidgetRight = useTransform(heroScroll, [0, 1], [0, -250]);

  // Timeline Scroll progress
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center']
  });

  const timelineScaleY = useSpring(timelineScroll, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/job-posts');
      if (!res.ok) throw new Error('Failed to fetch job postings');
      const data = await res.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const title = job.title || '';
      const department = job.department || job.dept || '';
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'All' || department.toLowerCase() === filterDept.toLowerCase();
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, filterDept, jobs]);

  const departmentsList = useMemo(() => {
    const depts = new Set(jobs.map(j => j.department || j.dept).filter(Boolean));
    return ['All', ...Array.from(depts)];
  }, [jobs]);

  const handleQuickApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      let resumeUrl = '';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload resume');
        const uploadData = await uploadRes.json();
        resumeUrl = uploadData.url;
      }
      
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applyForm.name,
          email: applyForm.email,
          phone: applyForm.phone,
          position: selectedJob?.title,
          experience: applyForm.experience || 'Fresher',
          resumeUrl: `${window.location.origin}${resumeUrl}`
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit application');
      }
      
      alert('Application submitted successfully!');
      setApplyForm({ name: '', email: '', phone: '', experience: '' });
      setSelectedFile(null);
      setShowApplyModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // --- Telescoped Glassmorphic Modal ---
  const modalContent = (
    <AnimatePresence>
      {showApplyModal && (
        <motion.div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#0b0b12]/95 p-8 md:p-10 rounded-[2.5rem] max-w-md w-full shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative border border-white/10 text-white"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button 
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white/5 text-slate-400 rounded-full hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-8 pr-8">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1.5 block">Quick Application</span>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">Apply for {selectedJob?.title}</h3>
            </div>

            <form 
              className="space-y-4"
              onSubmit={handleSubmitApplication}
            >
              <div>
                <label className="text-[10px] font-black text-slate-400 mb-1.5 block tracking-wider uppercase">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Rahul Upadhyay" 
                  value={applyForm.name} 
                  onChange={e => setApplyForm({ ...applyForm, name: e.target.value })} 
                  className="w-full bg-[#12121a] rounded-xl px-4 py-3.5 text-white font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-[#161622] transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 mb-1.5 block tracking-wider uppercase">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="rahulUpadhyay@example.com" 
                  value={applyForm.email} 
                  onChange={e => setApplyForm({ ...applyForm, email: e.target.value })} 
                  className="w-full bg-[#12121a] rounded-xl px-4 py-3.5 text-white font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-[#161622] transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 mb-1.5 block tracking-wider uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+91" 
                  value={applyForm.phone} 
                  onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })} 
                  className="w-full bg-[#12121a] rounded-xl px-4 py-3.5 text-white font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-[#161622] transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 mb-1.5 block tracking-wider uppercase">Experience (e.g. Fresher, 2 Years)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Fresher" 
                  value={applyForm.experience} 
                  onChange={e => setApplyForm({ ...applyForm, experience: e.target.value })} 
                  className="w-full bg-[#12121a] rounded-xl px-4 py-3.5 text-white font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-[#161622] transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 mb-1.5 block tracking-wider uppercase">Resume (PDF)</label>
                <input 
                  type="file" 
                  required 
                  accept=".pdf,.doc,.docx" 
                  onChange={e => setSelectedFile(e.target.files[0])} 
                  className="w-full bg-[#12121a] rounded-xl px-4 py-3 text-sm text-slate-400 border border-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 transition-all cursor-pointer" 
                />
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="relative overflow-hidden flex-1 bg-white text-slate-950 px-6 py-4 rounded-xl font-bold group tracking-wide text-center border border-white/15 disabled:opacity-50"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </span>
                </button>

                <a 
                  href={`https://wa.me/917620733613?text=Hi, I am interested in applying for the ${selectedJob?.title} role.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-colors tracking-wide"
                >
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
      <main 
        ref={containerRef}
        className="bg-[#030305] text-[#ededf0] selection:bg-amber-500 selection:text-white overflow-hidden font-sans relative"
      >
        {/* Subtle Ambient Background Grids & Radial Glows */}
        <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        {/* ══════════════════════════════════════
            1. HERO SECTION
        ══════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#040407] rounded-b-[2.5rem] md:rounded-b-[4rem] mx-2 md:mx-4 mt-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-b border-white/5">
          {/* Parallax Skyline Background */}
          <motion.div
            style={{ y: yBackground }}
            className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-25 select-none pointer-events-none"
          >
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
              alt="Premium Skyline Work Env"
              fill
              className="object-cover grayscale"
              priority
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/75 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030305]/40 to-[#030305]/90" />
          </motion.div>

          {/* Animated Gold Focus Light */}
          <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

          {/* Floating Luxury Badges (Parallax Scrolling) */}
          <motion.div 
            style={{ y: yWidgetLeft }}
            className="absolute left-[8%] top-[65%] hidden xl:flex items-center gap-3.5 px-5 py-4 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs transition-colors hover:border-amber-500/30"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
              <Trophy size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">₹100Cr+ Closed</p>
              <p className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase mt-0.5">Top-Tier Performance</p>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: yWidgetRight }}
            className="absolute right-[8%] top-[70%] hidden xl:flex items-center gap-3.5 px-5 py-4 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs transition-colors hover:border-amber-500/30"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/30 flex-shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">Aggressive Incentives</p>
              <p className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase mt-0.5">₹10L – ₹30L+ Career</p>
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
            <motion.div
              style={{ y: heroScroll, opacity: opacityHeroText, scale: scaleHeroText }}
              className="text-center space-y-6 w-full flex flex-col items-center"
            >
              {/* Top Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-4"
              >
                <Star size={14} className="fill-amber-400 text-amber-400 animate-pulse" />
                <span className="tracking-widest uppercase text-amber-500 font-extrabold">Join Pune's Elite Real Estate Force</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
              >
                Close ₹1Cr+ Deals in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                  West Pune's IT Hub.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed mt-6"
              >
                Work with top developers like Godrej, VTP, and Rohan in Baner, Wakad, and Hinjewadi. Build a ₹10L–₹30L+ career with Pune's most aggressive incentives.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4.5 pt-6 w-full sm:w-auto"
              >
                <a 
                  href="#roles" 
                  className="relative overflow-hidden inline-flex items-center justify-center bg-white text-slate-950 px-8 sm:px-11 py-4 sm:py-4.5 rounded-2xl md:rounded-full font-bold group shadow-2xl tracking-wide w-full sm:w-auto text-sm sm:text-base transition-transform duration-300 hover:scale-102"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                    Explore Inventory <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                  </span>
                </a>
                
                <div className="w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold px-8 py-4 sm:py-4.5 bg-white/5 backdrop-blur-md rounded-2xl md:rounded-full border border-white/10 shadow-sm">
                  <Trophy className="text-amber-500" size={20} />
                  <span>₹100Cr+ Sales Closed</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Indicator Chevron */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 z-10 pointer-events-none"
          >
            <ChevronDown size={28} />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            2. WHY CHOOSE EUS (3D TILT CARDS)
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20 md:mb-28">
              <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                The Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight">
                Why Top Performers{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  Choose EUS Realty?
                </span>
              </h2>
            </div>

            {/* 3D Tilt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Direct Builder Mandates", 
                  desc: "Work with Grade-A builders in Pune (VTP, Godrej, Rohan) with exclusive inventory you won't find anywhere else.", 
                  icon: <Star size={24} /> 
                },
                { 
                  title: "Highest Incentive Ratios", 
                  desc: "Earn ₹10L–₹30L+ annually with our aggressive payouts. Your hard work reflects directly in your bank account.", 
                  icon: <Zap size={24} /> 
                },
                { 
                  title: "Tech-First Sourcing", 
                  desc: "Say goodbye to cold calling. We provide high-quality, pre-qualified leads through our proprietary CRM.", 
                  icon: <Rocket size={24} /> 
                },
              ].map((item, i) => (
                <CareerCard3D 
                  key={item.title} 
                  title={item.title} 
                  desc={item.desc} 
                  icon={item.icon} 
                  index={i} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            3. COMMISSION CALCULATOR SECTION
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 bg-[#050508] border-y border-white/5 relative overflow-hidden">
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                Earnings Estimator
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Project Your Success
              </h2>
              <p className="text-slate-400 font-light text-base sm:text-lg">
                Drag the sliders to see how your closed transactions translate directly to your monthly and annual payouts.
              </p>
            </div>

            {/* Interactive sliders component */}
            <InteractiveCalculator />
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. DAY IN THE LIFE
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                  Daily Operations
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                  A Day in the Life
                </h2>
                <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light">
                  Fast-paced, highly rewarding, and never boring. Here is what your typical day looks like.
                </p>
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
                  <motion.div 
                    key={item.time} 
                    variants={fadeUpItem} 
                    className="bg-[#07070d] border border-white/5 p-10 rounded-[2.5rem] text-center hover:border-amber-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/35 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Coffee size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">{item.time}</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-base">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. CAREER GROWTH ROADMAP (SCROLL TIMELINE)
        ══════════════════════════════════════ */}
        <section ref={timelineRef} className="py-24 md:py-36 relative overflow-hidden bg-[#050508] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">          
            
            {/* Header */}
            <div className="text-center mb-20 md:mb-28 relative z-10">
              <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                Roadmap
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Your Career Roadmap
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light">
                At EUS Realty, you don't just stay in sales — you grow into a real estate leader. Reach ₹50L+ as a Team Leader.
              </p>
            </div>

            {/* Vertical Scroll Glow Line */}
            <div className="absolute left-6 md:left-10 top-60 bottom-24 w-[2px] bg-slate-800/60 pointer-events-none">
              <motion.div
                className="w-full bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600 origin-top h-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                style={{ scaleY: timelineScaleY }}
              />
            </div>

            {/* Timeline Milestones */}
            <div className="relative space-y-12 md:space-y-16 z-10">
              {[
                { level: "Trainee Associate", time: "0 – 6 Months", reward: "Learn Pune’s micro-markets, property fundamentals, and sales processes." },
                { level: "Sales Executive", time: "6 Months – 2 Years", reward: "Handle site visits, assist senior members, and close your first deals." },
                { level: "Senior Executive", time: "2 – 4 Years", reward: "Manage multiple projects, handle serious buyers, and close high-value transactions." },
                { level: "Team Leader", time: "4 – 5 Years", reward: "Lead a small team of executives and mentor new associates." },
                { level: "Sales Manager", time: "5+ Years", reward: "Oversee strategy for multiple projects and manage large sales divisions." }
              ].map((step, i) => (
                <div key={step.level} className="relative pl-12 md:pl-20 group">
                  {/* Glowing Node */}
                  <div className="absolute left-[19px] md:left-[35px] top-2.5 w-3 h-3 rounded-full bg-slate-900 ring-2 ring-slate-800 group-hover:bg-amber-400 transition-colors duration-500 shadow-[0_0_15px_rgba(245,158,11,0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] z-10" />
                  
                  <span className="text-amber-500 font-bold text-xs sm:text-sm uppercase tracking-widest block mb-1.5">{step.time}</span>
                  <h4 className="text-2xl md:text-3xl font-black text-white mb-2.5 tracking-tight group-hover:text-amber-400 transition-colors duration-300">{step.level}</h4>
                  <p className="text-slate-400 leading-relaxed max-w-xl font-light text-sm sm:text-base">{step.reward}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            6. OPEN POSITIONS WITH SEARCH
        ══════════════════════════════════════ */}
        <section id="roles" className="py-24 md:py-36 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                Active Listings
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Current Openings
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-light mt-2">
                Join the West Pune Growth Story.
              </p>
            </div>
            <div className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider">
              <Briefcase size={16} className="mr-2 text-amber-500" />
              {filteredJobs.length} Active Positions
            </div>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 bg-[#07070d]/60 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search job titles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-transparent pl-14 pr-4 py-3.5 text-white placeholder-slate-500 font-medium focus:outline-none rounded-2xl transition-all" 
              />
            </div>
            <div className="w-px bg-slate-800 hidden sm:block"></div>
            <select 
              value={filterDept} 
              onChange={(e) => setFilterDept(e.target.value)} 
              className="sm:w-64 bg-[#0f0f18] px-5 py-3 text-white font-medium border border-white/10 focus:outline-none focus:border-amber-500 rounded-2xl cursor-pointer"
            >
              {departmentsList.map(dept => (
                <option key={dept} value={dept} className="bg-[#0f0f18]">{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>

          {/* Job List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-24 bg-[#07070d] rounded-[2.5rem] border border-white/5 shadow-sm">
                <p className="text-slate-400 font-light text-lg animate-pulse">Loading active job openings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 bg-[#07070d] rounded-[2.5rem] border border-white/5 shadow-sm">
                <p className="text-red-400 font-light text-lg">Error loading job postings: {error}</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => {
                const tags = job.skills || job.tags || [];
                return (
                  <Reveal key={job._id || job.id} delay={index * 0.05}>
                    <div className="group bg-[#07070d] border border-white/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between hover:border-amber-500/30 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-all duration-500">
                      <div className="space-y-4">
                        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/5 border border-amber-500/15 px-4.5 py-1.5 rounded-lg">
                          {job.department || job.dept}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tight">{job.title}</h3>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-400">
                          <span className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> {job.location}</span>
                          <span className="flex items-center gap-2"><Briefcase size={16} className="text-slate-500" /> {job.type}</span>
                          <span className="flex items-center gap-2 text-amber-400 font-black bg-amber-500/5 border border-amber-500/10 px-3.5 py-1 rounded-lg">
                            💰 {job.salary}
                          </span>
                        </div>
                        
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map((tag) => (
                              <span key={tag} className="bg-white/5 border border-white/5 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 md:shrink-0 relative z-10">
                        <a 
                          href={`/careers/${job._id || job.id}`}
                          className="relative overflow-hidden flex items-center justify-center bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold group/btn tracking-wide shadow-sm hover:border-white/20 transition-all text-center text-sm no-underline"
                        >
                          <span className="absolute inset-0 w-full h-full bg-white origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
                          <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-slate-950 transition-colors duration-300">
                            Details <ArrowRight size={18} className="text-slate-400 group-hover/btn:text-slate-950 group-hover/btn:translate-x-1 transition-all" />
                          </span>
                        </a>

                        <button 
                          type="button"
                          onClick={() => handleQuickApply(job)} 
                          className="relative overflow-hidden bg-white text-slate-950 px-8 py-4 rounded-xl font-bold group/btn shadow-md tracking-wide text-center border border-white/15"
                        >
                          <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
                          <span className="relative z-10 block group-hover/btn:text-slate-950 transition-colors duration-300">
                            Quick Apply
                          </span>
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            ) : (
              <div className="text-center py-24 bg-[#07070d] rounded-[2.5rem] border border-white/5 shadow-sm">
                <p className="text-slate-400 font-light text-lg">No positions found matching your search.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterDept('All'); }}
                  className="mt-4 text-amber-500 font-bold hover:text-amber-400 transition-colors tracking-wide text-sm uppercase"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            7. OFFICE HUB DIRECTIONS (MAP)
        ══════════════════════════════════════ */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/10 grid lg:grid-cols-5 relative backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="p-10 md:p-16 lg:col-span-2 flex flex-col justify-center text-white relative z-10">
                <span className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3 block">
                  Location
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Visit our Hub</h2>
                <p className="text-slate-400 text-base leading-relaxed mb-10 font-light">Located in the heart of Pune's massive growth corridor. Drop by for a coffee and let's discuss your future.</p>
                
                <div className="space-y-6 mb-12">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="text-amber-500" size={20} />
                    </div>
                    <p className="font-semibold leading-relaxed text-slate-300 mt-1 text-sm md:text-base">Office No. 424-427, Vardhamaan Moonstone, Tathawade, Pune - 411033</p>
                  </div>
                </div>
                
                <a 
                  href="https://maps.google.com/?q=Elite+Unique+Services" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-5 rounded-2xl md:rounded-full font-black w-full sm:w-auto text-center group tracking-wide transition-transform duration-300 hover:scale-102"
                >
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
          </div>
        </section>
      </main>

      {/* --- Teleport Modal content directly to Body --- */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}