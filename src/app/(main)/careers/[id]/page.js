'use client';

import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Handshake,
  ArrowRight,
  Star,
  MessageCircle,
  X,
  Laptop
} from "lucide-react";
import { useState, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function JobDetailPage({ params }) {
  // Safe unwrapping of Next.js 15+ async params
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', experience: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchJobDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/job-posts/${id}`);
      if (!res.ok) throw new Error('Failed to fetch job postings detail');
      const data = await res.json();
      setJob(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

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
          position: job?.title,
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

  // --- Telescoped Frosted Glass Modal ---
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
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">Apply for {job?.title}</h3>
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
                  href={`https://wa.me/917620733613?text=Hi, I am interested in applying for the ${job?.title} role.`} 
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
      <main className="min-h-screen bg-[#030305] text-[#ededf0] py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-white font-sans relative overflow-hidden">
        {/* Subtle Ambient Background Grids & Radial Glows */}
        <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back Button */}
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-400 font-bold mb-10 hover:text-amber-500 transition-colors duration-300 group tracking-wide text-sm"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-500/40 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-white" />
            </div>
            Back to Careers
          </Link>

          {loading ? (
            <div className="text-center py-32 bg-[#07070d] rounded-[2.5rem] border border-white/5 shadow-2xl">
              <p className="text-slate-400 font-light text-lg animate-pulse">Loading posting details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-[#07070d] rounded-[2.5rem] border border-white/5 shadow-2xl">
              <p className="text-red-500 font-light text-lg">Error loading details: {error}</p>
            </div>
          ) : (
            <div className="bg-[#07070d]/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/10 relative">
              {/* Top Gold Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500 rounded-b-full"></div>

              {/* Department */}
              <div className="flex items-center mb-8 mt-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-500 bg-amber-500/5 border border-amber-500/15 px-4.5 py-1.5 rounded-lg">
                  {job.department || job.dept} Department
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-2 mb-10 tracking-tight leading-[1.1]">
                {job.title}
              </h1>

              {/* Job Meta Details */}
              <div className="grid sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-white/10">
                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <MapPin size={20} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-bold text-white text-sm sm:text-base">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <Briefcase size={20} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Employment Type</p>
                    <p className="font-bold text-white text-sm sm:text-base">{job.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <Laptop size={20} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Work Mode</p>
                    <p className="font-bold text-white text-sm sm:text-base">{job.mode || 'On-site'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <Building2 size={20} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Office Hub</p>
                    <p className="font-bold text-white text-sm sm:text-base">Tathawade HQ, Pune</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <Clock size={20} className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Experience Req.</p>
                    <p className="font-bold text-white text-sm sm:text-base">{job.experience || 'Fresher'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-300 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                    <Handshake size={20} className="text-amber-400 group-hover:text-slate-950 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] text-amber-500 font-black uppercase tracking-wider mb-0.5">Compensation Package</p>
                    <p className="font-bold text-amber-400 text-sm sm:text-base">{job.salary || 'Competitive payout + incentives'}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Description content */}
              <div className="space-y-12">
                {/* Overview */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                    Role Description
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-lg font-light">
                    {job.description}
                  </p>
                </div>

                {/* Skills requirements */}
                {job.skills && job.skills.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                      <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                      Target Skills
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {job.skills.map((skill) => (
                        <span key={skill} className="bg-white/5 border border-white/5 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold tracking-wide">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements / Generic Info */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                    Key Requirements
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "Excellent presentation, negotiation, and high-stakes client communication skills.",
                      "Strong foundational drive to achieve and exceed monthly and quarterly sales revenue goals.",
                      "Proven track record of managing schedules, client follow-ups, and developer meetings.",
                      "Comfortable handling high-value real estate transaction details and buyer inquiries."
                    ].map((item, index) => (
                      <li key={index} className="flex gap-4 text-slate-300 font-light text-base sm:text-lg">
                        <CheckCircle2
                          size={22}
                          className="text-amber-500 mt-0.5 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perks */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                    Benefits & Perks
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      "Highly progressive performance incentives",
                      "Exclusive developer training and builder networks",
                      "Opportunity to lead large regional sales divisions",
                      "Continuous flow of pre-qualified inbound CRM leads"
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 text-slate-300 font-light text-base sm:text-lg items-center bg-white/5 p-4.5 rounded-2xl border border-white/5">
                        <Star
                          size={18}
                          className="text-amber-500 shrink-0 fill-amber-500"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-16 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Ready to join the team?</h3>
                  <p className="text-slate-400 font-light text-sm sm:text-base">Quick apply below to fast-track your application profile.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="relative overflow-hidden inline-flex bg-white text-slate-950 px-10 py-5 rounded-2xl font-black group tracking-wide text-center border border-white/15 shadow-xl w-full sm:w-auto items-center justify-center transition-transform hover:scale-102"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300 w-full">
                    Apply Now <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                  </span>
                </button>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* --- RENDER PORTAL FOR MODAL --- */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
