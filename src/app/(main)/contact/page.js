'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight,
  Star, AlertCircle, MessageCircle, ChevronDown, Sparkles, Home,
  Facebook, Instagram, Linkedin, Youtube, ArrowUpRight
} from 'lucide-react';
import { speakCongratulation, cancelSpeech } from '@/lib/elevenLabsTTS';

/* ──────────────────────────────────────────────────────────
   FLOATING AMBIENT PARTICLE (background decoration)
────────────────────────────────────────────────────────── */
function FloatingOrb({ style, duration = 8, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -30, 0], x: [0, 10, 0], scale: [1, 1.08, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ──────────────────────────────────────────────────────────
   CANVAS CONFETTI BURST
────────────────────────────────────────────────────────── */
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#fbbf24', '#f59e0b', '#fde68a', '#ffffff', '#fcd34d', '#d97706', '#c2410c', '#fb923c'];
    const shapes = ['circle', 'star', 'diamond'];
    const count = 180;

    particlesRef.current = Array.from({ length: count }, () => {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 8;
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 10,
        opacity: 1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        gravity: 0.15 + Math.random() * 0.1,
      };
    });

    const drawStar = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particlesRef.current.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.opacity -= 0.013;
        p.rotation += p.rotSpeed;

        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();

        if (p.shape === 'circle') {
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === 'diamond') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 3, 0);
          ctx.lineTo(0, p.size / 2);
          ctx.lineTo(-p.size / 3, 0);
          ctx.closePath();
          ctx.restore();
        } else {
          drawStar(ctx, p.x, p.y, p.size / 2, p.rotation);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      if (alive) animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

/* ──────────────────────────────────────────────────────────
   VOICE: Using ElevenLabs Anika voice (imported from @/lib/elevenLabsTTS)
────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────
   SUCCESS / CELEBRATION POPUP
────────────────────────────────────────────────────────── */
function CelebrationPopup({ name, onClose }) {
  const firstName = name?.trim().split(' ')[0] || 'Friend';
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => {
      setPhase(2);
      setTimeout(onClose, 600);
    }, 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onClose]);

  if (!mounted) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/75 backdrop-blur-md"
      style={{ backdropFilter: 'blur(16px)' }}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6 md:p-8">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.1 }}
          className="relative w-full max-w-lg my-auto"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-[3rem] pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, rgba(251,191,36,0), rgba(251,191,36,0.6), rgba(251,191,36,0), rgba(251,191,36,0.3), rgba(251,191,36,0))',
              filter: 'blur(12px)',
            }}
          />

          <div
            className="relative rounded-[2.5rem] overflow-hidden text-center"
            style={{
              background: 'linear-gradient(145deg, #0d0d1a 0%, #07070f 60%, #0d0d1a 100%)',
              border: '1px solid rgba(251,191,36,0.3)',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -10px rgba(251,191,36,0.2)',
            }}
          >
            <ConfettiCanvas active />

            <div className="relative z-20 p-6 sm:p-10 md:p-14">
              <div className="relative flex items-center justify-center mb-6 sm:mb-8 [--sparkle-translate:-52px] sm:[--sparkle-translate:-68px]">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-24 sm:w-28 h-24 sm:h-28 rounded-full border border-amber-400/40"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="absolute w-32 sm:w-36 h-32 sm:h-36 rounded-full border border-amber-400/20"
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.3 }}
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.15))',
                    border: '2px solid rgba(251,191,36,0.5)',
                    boxShadow: '0 0 40px rgba(251,191,36,0.3), inset 0 0 20px rgba(251,191,36,0.05)',
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-4xl sm:text-5xl select-none"
                  >🏡</motion.span>
                </motion.div>

                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                      className="absolute text-amber-400"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateY(var(--sparkle-translate))`,
                        fontSize: '12px',
                      }}
                    >✦</motion.div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {phase >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.p
                      className="text-xs font-black tracking-[0.25em] uppercase text-amber-500 mb-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    >
                      ✦ Congratulations ✦
                    </motion.p>

                    <motion.h2
                      className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3 tracking-tight"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    >
                      Hello,{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                        {firstName}! 🎉
                      </span>
                    </motion.h2>

                    <motion.p
                      className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-2"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    >
                      You are <span className="text-amber-400 font-bold">one step closer</span>
                      <br />to your dream home.
                    </motion.p>

                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
                      className="h-px w-24 mx-auto my-6"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }}
                    />

                    <motion.p
                      className="text-sm text-slate-400 font-light leading-relaxed mb-8"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    >
                      Your dream home journey has begun. Our senior consultants will reach out to you personally within{' '}
                      <span className="text-white font-semibold">2 hours.</span>
                    </motion.p>

                    <motion.div
                      className="flex flex-wrap items-center justify-center gap-3 mb-8"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                    >
                      {[
                        { icon: '✅', text: 'Request Received' },
                        { icon: '📧', text: 'Team Notified' },
                        { icon: '📞', text: 'Call Incoming' },
                      ].map(({ icon, text }, i) => (
                        <motion.div
                          key={text}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.1 + i * 0.15 }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                          style={{
                            background: 'rgba(251,191,36,0.07)',
                            border: '1px solid rgba(251,191,36,0.2)',
                            color: '#fbbf24',
                          }}
                        >
                          <span>{icon}</span> {text}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.button
                      onClick={() => { setPhase(2); setTimeout(onClose, 500); }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, type: 'spring', stiffness: 300 }}
                      className="relative overflow-hidden w-full py-4 rounded-2xl font-black text-slate-950 text-sm tracking-widest uppercase shadow-lg shadow-amber-500/20"
                      style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                        className="absolute inset-0 opacity-30"
                        style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '40%' }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Home size={16} /> Explore Our Portfolio
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

/* ──────────────────────────────────────────────────────────
   ANIMATED INPUT FIELD
────────────────────────────────────────────────────────── */
function AnimatedInput({ label, icon, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
        {icon && <span className="text-amber-500">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <motion.div
          animate={focused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent origin-left rounded-full"
        />
        {props.type === 'textarea' ? (
          <textarea
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full p-4 rounded-2xl bg-white/5 border text-white transition-all outline-none h-28 resize-none placeholder:text-slate-600 font-medium ${
              focused ? 'border-amber-500/60 bg-white/10 ring-1 ring-amber-500/30' : 'border-white/10 hover:border-white/20'
            }`}
          />
        ) : (
          <input
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full p-4 rounded-2xl bg-white/5 border text-white transition-all outline-none placeholder:text-slate-600 font-medium ${
              focused ? 'border-amber-500/60 bg-white/10 ring-1 ring-amber-500/30' : 'border-white/10 hover:border-white/20'
            }`}
          />
        )}
        {hasValue && !focused && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <CheckCircle size={16} className="text-emerald-400" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAGNETIC CONTACT CARD (using optimized CSS variables)
────────────────────────────────────────────────────────── */
function ContactCard({ item, i, fadeUp }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mouse-x', `${x}%`);
    ref.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.a
      ref={ref}
      key={i} variants={fadeUp}
      href={item.action || undefined}
      whileHover={{ y: -5, boxShadow: '0 24px 50px -10px rgba(15,23,42,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group p-6 md:p-7 rounded-[2rem] bg-white border border-slate-100 relative overflow-hidden transition-all duration-300 hover:border-amber-500/30 ${!item.action && 'cursor-default'}`}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.color}18 0%, transparent 70%)`,
        }}
      />

      <motion.div
        animate={hovered ? { scale: 1.1, backgroundColor: item.color + '1a', borderColor: item.color + '40' } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 relative z-10 animate-transition"
        style={hovered ? { color: item.color } : { color: '#334155' }}
      >
        {item.icon}
      </motion.div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 relative z-10">{item.label}</p>
      <p className="text-lg font-bold text-slate-900 mb-1 relative z-10 leading-tight">{item.val}</p>
      <p className="text-sm text-slate-500 font-light relative z-10">{item.desc}</p>

      <motion.div
        animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left"
        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
      />
    </motion.a>
  );
}

/* ──────────────────────────────────────────────────────────
   INTERACTIVE SOCIAL CHANNEL CARD (using optimized CSS variables)
────────────────────────────────────────────────────────── */
function SocialChannelCard({ item, i, fadeUp }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mouse-x', `${x}%`);
    ref.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.a
      ref={ref}
      key={i} variants={fadeUp}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5, boxShadow: '0 24px 50px -10px rgba(15,23,42,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group p-6 rounded-[2rem] bg-white border border-slate-100 relative overflow-hidden transition-all duration-300 ${item.hoverColor}`}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.spotlight} 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <motion.div
          animate={hovered ? { scale: 1.1, backgroundColor: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)' } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center relative z-10"
        >
          {item.icon}
        </motion.div>
        
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md group-hover:text-amber-600 group-hover:border-amber-200 group-hover:bg-amber-50/50 transition-all">
          {item.badge}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">{item.name}</p>
      <p className="text-base font-black text-slate-900 mb-1.5 relative z-10 leading-tight flex items-center gap-1">
        {item.handle}
        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-amber-500" />
      </p>
      <p className="text-[11px] text-slate-500 font-light relative z-10 leading-relaxed">{item.desc}</p>

      <motion.div
        animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left"
        style={{ background: `linear-gradient(90deg, ${item.spotlight.replace('0.18', '0.6')}, transparent)` }}
      />
    </motion.a>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN CONTACT PAGE
────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', objective: '', position: '', message: '' });
  const [formState, setFormState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isObjectiveOpen, setIsObjectiveOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
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

  // Voice preloading no longer needed — using ElevenLabs API

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.objective) { setErrorMsg('Please select your objective.'); return; }
    if (form.objective === 'Career Inquiry' && !form.position) { setErrorMsg('Please select the position you are applying for.'); return; }

    // No silent utterance needed — ElevenLabs uses Audio API, not SpeechSynthesis

    setFormState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      const name = form.name;
      setSubmittedName(name);
      setFormState('success');
      setForm({ name: '', phone: '', email: '', objective: '', position: '', message: '' });

      setShowCelebration(true);
      setTimeout(() => speakCongratulation(name), 600);

    } catch (err) {
      setErrorMsg(err.message);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 6000);
    }
  };

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setFormState('idle');
    cancelSpeech();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const whatsappNumber = '917620733613';
  const whatsappText = encodeURIComponent('Hello EUS Realty! I would like to know more about your properties.');

  const contactCards = [
    { icon: <Phone size={22} />, label: 'Direct Line', val: '+91 76207 33613', desc: 'Priority support for buyers', action: 'tel:+917620733613', color: '#fbbf24' },
    { icon: <Mail size={22} />, label: 'Email Desk', val: 'hello@eusrealty.com', desc: 'For detailed inquiries', action: 'mailto:hello@eusrealty.com', color: '#60a5fa' },
    { icon: <MapPin size={22} />, label: 'Headquarters', val: 'Tathawade, Pune', desc: 'Vardhamaan Moonstone, Office 424', action: '#map', color: '#f472b6' },
    { icon: <Clock size={22} />, label: 'Hours', val: '9:00 AM – 8:00 PM', desc: 'Tuesday to Sunday', action: null, color: '#34d399' },
  ];

  const socialChannels = [
    {
      name: "Instagram",
      handle: "@eus.pune",
      desc: "Daily luxury property tours, reels & virtual walkthroughs in West Pune.",
      link: "https://www.instagram.com/eus.pune?igsh=MXE5dHh4cHl4N2g4eQ==",
      icon: <Instagram size={22} className="text-pink-500" />,
      hoverColor: "hover:border-pink-500/40",
      badge: "Follow Feed",
      spotlight: "rgba(236,72,153,0.18)"
    },
    {
      name: "LinkedIn",
      handle: "Elite Unique Services",
      desc: "Official builder mandates, corporate briefs & career opportunities.",
      link: "https://www.linkedin.com/company/elite-unique-services/",
      icon: <Linkedin size={22} className="text-blue-500" />,
      hoverColor: "hover:border-blue-500/40",
      badge: "Connect Profile",
      spotlight: "rgba(59,130,246,0.18)"
    },
    {
      name: "YouTube",
      handle: "@Elite_Unique_Services",
      desc: "HD property video walkthroughs, market analyses & client reviews.",
      link: "https://www.youtube.com/@Elite_Unique_Services",
      icon: <Youtube size={22} className="text-red-500" />,
      hoverColor: "hover:border-red-500/40",
      badge: "Subscribe Channel",
      spotlight: "rgba(239,68,68,0.18)"
    },
    {
      name: "Facebook",
      handle: "@eusrealty",
      desc: "Local community updates, property listings & real estate events.",
      link: "https://www.facebook.com/share/1C4Vt5oHLD/",
      icon: <Facebook size={22} className="text-blue-600" />,
      hoverColor: "hover:border-blue-600/40",
      badge: "Like Page",
      spotlight: "rgba(29,78,216,0.18)"
    }
  ];

  return (
    <>
      <AnimatePresence>
        {showCelebration && (
          <CelebrationPopup name={submittedName} onClose={closeCelebration} />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-amber-500 selection:text-white font-sans overflow-x-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] bg-slate-200/50 rounded-full blur-[150px]" />
          <div className="absolute top-[10%] left-[-15%] w-[700px] h-[700px] bg-amber-100/60 rounded-full blur-[150px]" />
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-[120px]" />

          {[
            { style: { width: 12, height: 12, top: '20%', left: '15%', background: 'rgba(251,191,36,0.5)', filter: 'blur(2px)' }, duration: 8.2, delay: 0 },
            { style: { width: 8,  height: 8,  top: '60%', left: '80%', background: 'rgba(251,191,36,0.4)', filter: 'blur(1px)' }, duration: 10.4, delay: 1.2 },
            { style: { width: 16, height: 16, top: '35%', left: '65%', background: 'rgba(251,191,36,0.3)', filter: 'blur(3px)' }, duration: 7.6, delay: 0.6 },
            { style: { width: 6,  height: 6,  top: '75%', left: '25%', background: 'rgba(251,191,36,0.5)', filter: 'blur(1px)' }, duration: 9.0, delay: 2.1 },
            { style: { width: 10, height: 10, top: '10%', left: '55%', background: 'rgba(251,191,36,0.35)',filter: 'blur(2px)' }, duration: 11.0, delay: 0.9 },
          ].map(({ style, duration, delay }, i) => (
            <FloatingOrb key={i} style={style} duration={duration} delay={delay} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-24 pb-16 sm:pb-24 md:pb-32">
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start"
          >
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-12 lg:space-y-16">
              <header className="space-y-6">
                <motion.div
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
                >
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  Connect With The Masters
                </motion.div>
 
                <motion.h1 variants={fadeUp} className="text-[clamp(2.1rem,7vw,4.5rem)] font-black text-slate-950 leading-[1.06] tracking-tight">
                  Let&apos;s secure your{' '}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">legacy.</span>
                    <motion.span
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full origin-left"
                    />
                  </span>
                </motion.h1>

                <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-light">
                  Skip the noise. Connect directly with Pune&apos;s premier real estate consultants for an exclusive, transparent property experience.
                </motion.p>
              </header>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {contactCards.map((item, i) => (
                  <ContactCard key={i} item={item} i={i} fadeUp={fadeUp} />
                ))}
              </motion.div>

              <motion.a
                variants={fadeUp}
                href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                target="_blank" rel="noreferrer"
                whileHover={{ y: -4, boxShadow: '0 24px 50px -10px rgba(18,140,126,0.25)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-[#128C7E]/5 border border-[#128C7E]/20 hover:bg-[#128C7E]/10 hover:border-[#128C7E]/40 transition-all duration-500 cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/30"
                >
                  <MessageCircle className="text-white fill-white w-5 h-5 sm:w-7 sm:h-7" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm sm:text-base md:text-lg mb-0.5">Chat on WhatsApp</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-light line-clamp-1">Instant replies · Mon – Sun, 9 AM – 8 PM</p>
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="shrink-0"
                >
                  <ArrowRight size={18} className="text-[#25D366]" />
                </motion.div>
              </motion.a>

              <div className="space-y-4">
                <motion.p
                  variants={fadeUp}
                  className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1"
                >
                  Digital Footprint & Socials
                </motion.p>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4"
                >
                  {socialChannels.map((item, i) => (
                    <SocialChannelCard key={i} item={item} i={i} fadeUp={fadeUp} />
                  ))}
                </motion.div>
              </div>

              <motion.div
                variants={fadeUp}
                id="map"
                className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl relative h-56 sm:h-72 md:h-80 group"
                whileHover={{ boxShadow: '0 30px 60px -15px rgba(15,23,42,0.12)' }}
              >
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2988.3826013811286!2d73.74371297393837!3d18.618266666185157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb00424ee25d%3A0x591d30ed72160c8f!2sElite%20Unique%20Services!5e1!3m2!1sen!2sin!4v1780557910866!5m2!1sen!2sin"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) contrast(1.1) opacity(0.8)' }}
                  allowFullScreen="" loading="lazy"
                  className="group-hover:filter-none transition-all duration-1000"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-100 z-20 flex items-center justify-between shadow-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-slate-900 font-bold text-sm sm:text-base truncate">EUS Realty HQ</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">Office 424-427, Vardhamaan Moonstone</p>
                  </div>
                  <a href="https://maps.google.com/?q=Vardhamaan+Moonstone+Tathawade+Pune" target="_blank" rel="noreferrer"
                    className="relative overflow-hidden w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-slate-950 text-white rounded-full flex items-center justify-center group/btn shadow-md"
                  >
                    <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
                    <span className="relative z-10 group-hover/btn:text-slate-950 transition-colors duration-300">
                      <ArrowRight size={18} />
                    </span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right Column (Form) */}
            <div className="lg:col-span-5 relative lg:sticky lg:top-24 z-20">
              <motion.div variants={fadeUp} className="relative group">
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 bg-gradient-to-br from-amber-500/25 to-slate-600/25 rounded-[2rem] sm:rounded-[3rem] blur-xl"
                />

                <div className="relative bg-slate-950 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-800 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-[3rem]" />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

                  <div className="relative z-10 mb-8">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: '3rem' }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full mb-5"
                    />
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Request an Invite</h2>
                    <p className="text-slate-400 text-sm font-light leading-relaxed">
                      Our senior consultants will reach out within 2 hours to curate your exclusive portfolio.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {formState !== 'success' ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit}
                        className="space-y-5 relative z-10"
                      >
                        <AnimatePresence>
                          {(formState === 'error' || errorMsg) && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
                            >
                              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-red-300 font-medium">{errorMsg}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatedInput label="Full Name" name="name" type="text" value={form.name}
                          onChange={handleChange} required placeholder="e.g. Rahul Upadhyay" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AnimatedInput label="Phone" name="phone" type="tel" value={form.phone}
                            onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                          <AnimatedInput label="Email" name="email" type="email" value={form.email}
                            onChange={handleChange} required placeholder="rahulupadhyay@email.com" />
                        </div>

                        <div className="space-y-1.5 relative z-10" ref={dropdownRef}>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">My Objective</label>
                          <div className="relative">
                            <motion.button
                              type="button"
                              onClick={() => setIsObjectiveOpen(!isObjectiveOpen)}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all outline-none font-medium ${isObjectiveOpen
                                ? 'bg-white/10 border-amber-500 ring-1 ring-amber-500/30 text-white'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20'}`}
                            >
                              {form.objective || <span className="text-slate-500">Select an option...</span>}
                              <motion.div
                                animate={{ rotate: isObjectiveOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown size={16} className={isObjectiveOpen ? 'text-amber-500' : 'text-slate-500'} />
                              </motion.div>
                            </motion.button>

                            <AnimatePresence>
                              {isObjectiveOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                  className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                                >
                                  {['Looking to Buy Residential', 'Looking for Investment', 'I am a Builder/Developer', 'Career Inquiry'].map((option, oi) => (
                                    <motion.button
                                      key={option}
                                      type="button"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: oi * 0.05 }}
                                      onClick={() => { setForm(prev => ({ ...prev, objective: option })); setIsObjectiveOpen(false); }}
                                      className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between ${form.objective === option ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                    >
                                      {option}
                                      {form.objective === option && <CheckCircle size={16} className="text-amber-500" />}
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {form.objective === 'Career Inquiry' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5 relative"
                          >
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Applying for Position</label>
                            <div className="relative">
                              <select
                                name="position" value={form.position}
                                onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                                required
                                className="w-full p-4 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none cursor-pointer font-medium appearance-none"
                              >
                                <option value="" disabled className="bg-slate-900">Select a position...</option>
                                <option value="Relationship Manager" className="bg-slate-900">Relationship Manager</option>
                                <option value="Digital Marketing Executive" className="bg-slate-900">Digital Marketing Executive</option>
                                <option value="Sourcing Manager" className="bg-slate-900">Sourcing Manager</option>
                                <option value="Customer Success Associate" className="bg-slate-900">Customer Success Associate</option>
                                <option value="General Inquiry" className="bg-slate-900">General Inquiry / Other</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                          </motion.div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Details (Optional)</label>
                          <div className="relative">
                            <textarea
                              name="message" value={form.message} onChange={handleChange}
                              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none h-28 resize-none placeholder:text-slate-600 font-medium"
                              placeholder="Budget, preferred location, timeline..."
                            />
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={formState === 'submitting'}
                          whileHover={formState !== 'submitting' ? { scale: 1.02 } : {}}
                          whileTap={formState !== 'submitting' ? { scale: 0.98 } : {}}
                          className={`relative overflow-hidden w-full font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 tracking-wide ${
                            formState === 'submitting'
                              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-white text-slate-950 shadow-xl group/submit'
                          }`}
                        >
                          {formState !== 'submitting' && (
                            <>
                              <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/submit:scale-y-100" />
                              <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 2 }}
                                className="absolute inset-0 opacity-20"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.8), transparent)', width: '30%' }}
                              />
                            </>
                          )}

                          {formState === 'submitting' ? (
                            <span className="relative z-10 flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-slate-600 border-t-slate-400 rounded-full"
                              />
                              Sending Request...
                            </span>
                          ) : (
                            <span className="relative z-10 flex items-center gap-2 group-hover/submit:text-slate-950 transition-colors">
                              <Sparkles size={18} />
                              Send Request
                              <ArrowRight size={18} className="group-hover/submit:translate-x-1 transition-transform" />
                            </span>
                          )}
                        </motion.button>

                        <p className="text-center text-xs text-slate-600 font-light">
                          By submitting, you agree to our privacy policy. Your data is strictly confidential.
                        </p>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center py-12 gap-5 relative z-10"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
                        >
                          <CheckCircle size={40} className="text-emerald-400" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2">Request Sent! 🎉</h3>
                          <p className="text-slate-400 text-sm font-light">
                            Opening your celebration... <span className="text-amber-400">✨</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-slate-100 bg-gradient-to-b from-[#F8F9FA] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
            >
              {[
                { num: '01', label: 'Discovery Call', desc: 'We analyze your exact requirements, budget, and investment goals over a brief priority call.', color: 'border-slate-200 text-slate-900' },
                { num: '02', label: 'Curated Shortlist', desc: 'You receive a highly filtered list of premium Grade-A properties that match your criteria exactly.', color: 'border-slate-200 text-slate-900' },
                { num: '03', label: 'VIP Site Visit', desc: 'We organize an escorted tour of the properties, handle negotiations, and secure the best builder price.', color: 'border-amber-200 text-amber-600', amber: true },
              ].map(({ num, label, desc, amber }, i) => (
                <motion.div
                  key={num}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-center relative"
                >
                  {i > 0 && (
                    <div className="hidden sm:block absolute top-7 -left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg sm:text-xl mx-auto mb-4 sm:mb-6 relative z-10 shadow-sm border ${amber ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    {num}
                  </motion.div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{label}</h4>
                  <p className="text-slate-500 text-sm font-light leading-relaxed px-2 sm:px-4">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}