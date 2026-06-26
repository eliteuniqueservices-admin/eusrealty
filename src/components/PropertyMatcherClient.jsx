'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, ArrowRight, ArrowLeft, CheckCircle2, 
  MapPin, HelpCircle, Shield, Award, Users, Compass, Zap
} from 'lucide-react';

const STEPS = [
  {
    id: 'objective',
    title: 'What is your primary investment goal?',
    subtitle: 'This helps us filter projects based on rental yields or long-term family utility.',
    options: [
      { value: 'home', label: 'Dream Home (Self Use)', desc: 'Focus on lifestyle, amenities, and connectivity to top schools/hospitals.', icon: <Award className="w-5 h-5" /> },
      { value: 'invest', label: 'High-Yield Investment', desc: 'Focus on maximum rental returns, capital growth, and prime locations.', icon: <Compass className="w-5 h-5" /> }
    ]
  },
  {
    id: 'budget',
    title: 'Select your comfortable budget range',
    subtitle: 'Direct developer listings with 0% brokerage save you lakhs upfront.',
    options: [
      { value: 'under-80', label: 'Below ₹80 Lakhs', desc: 'Affordable premium entry-level homes and high-occupancy IT corridor rentals.', icon: <Zap className="w-5 h-5" /> },
      { value: '80-1.5', label: '₹80 Lakhs – ₹1.5 Crore', desc: 'Premium lifestyle apartments in high-appreciation suburbs like Tathawade.', icon: <Building2 className="w-5 h-5" /> },
      { value: 'above-1.5', label: 'Above ₹1.5 Crore', desc: 'Luxury duplexes, row houses, and top-tier gated developer options.', icon: <Award className="w-5 h-5" /> }
    ]
  },
  {
    id: 'location',
    title: 'Select your preferred micro-markets',
    subtitle: 'You can select multiple locations in West Pune.',
    isMultiSelect: true,
    options: [
      { value: 'hinjewadi', label: 'Hinjewadi', desc: 'IT Hub corridor, high tenant occupancy and solid rental yields.', icon: <MapPin className="w-4 h-4" /> },
      { value: 'tathawade', label: 'Tathawade', desc: 'Rapid appreciation, top educational institutes, great connectivity.', icon: <MapPin className="w-4 h-4" /> },
      { value: 'baner', label: 'Baner & Balewadi', desc: 'Ultra-premium lifestyle district, high-end residential demand.', icon: <MapPin className="w-4 h-4" /> },
      { value: 'wakad', label: 'Wakad & Punawale', desc: 'Central connectivity, robust infrastructure, major family hub.', icon: <MapPin className="w-4 h-4" /> }
    ]
  },
  {
    id: 'priority',
    title: 'What is your top community priority?',
    subtitle: 'This matches your choice against builder amenities and RERA status.',
    options: [
      { value: 'connectivity', label: 'Zero Commute / Near Metro', desc: 'Proximity to highways, ring roads, and metro corridors.', icon: <Zap className="w-5 h-5" /> },
      { value: 'amenities', label: 'World-Class Amenities', desc: 'Clubhouse, infinity pool, gymnasium, and kids play arrays.', icon: <Building2 className="w-5 h-5" /> },
      { value: 'security', label: 'A-Grade Builder Credentials', desc: 'RERA-verified, premium construction quality, and timely handovers.', icon: <Shield className="w-5 h-5" /> }
    ]
  }
];

export default function PropertyMatcherClient({ inventory = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    objective: '',
    budget: '',
    location: [],
    priority: ''
  });

  const handleSelectOption = (optionValue) => {
    const stepObj = STEPS[currentStep];
    if (stepObj.isMultiSelect) {
      setSelections(prev => {
        const currentLocs = prev.location || [];
        const isAlreadySelected = currentLocs.includes(optionValue);
        const updatedLocs = isAlreadySelected 
          ? currentLocs.filter(v => v !== optionValue)
          : [...currentLocs, optionValue];
        return { ...prev, location: updatedLocs };
      });
    } else {
      setSelections(prev => ({ ...prev, [stepObj.id]: optionValue }));
      // Auto advance for single select pages (except budget to allow user reading)
      if (currentStep !== 1) {
        setTimeout(() => handleNext(), 300);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(STEPS.length); // Results step
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetMatcher = () => {
    setSelections({
      objective: '',
      budget: '',
      location: [],
      priority: ''
    });
    setCurrentStep(0);
  };

  // ── Matching Engine Scoring Algorithm ──
  const matchedProperties = useMemo(() => {
    if (currentStep !== STEPS.length) return [];

    const scored = inventory.map(item => {
      let score = 100;
      const desc = item.description.toLowerCase();
      const name = item.name.toLowerCase();
      const loc = item.location.toLowerCase();

      // 1. Objective match
      if (selections.objective === 'invest') {
        // Boost rental yield/IT hubs
        if (loc.includes('hinjewadi') || desc.includes('rental') || desc.includes('yield')) {
          score += 5;
        }
      } else {
        // Boost luxury/amenities
        if (desc.includes('clubhouse') || desc.includes('premium') || desc.includes('family')) {
          score += 5;
        }
      }

      // 2. Budget match
      const priceText = item.priceRange.toLowerCase();
      let estPrice = 100; // In Lakhs as fallback
      const lakhMatch = priceText.match(/(\d+)\s*lakh/);
      const crMatch = priceText.match(/(\d+(\.\d+)?)\s*cr/);
      
      if (crMatch) {
        estPrice = parseFloat(crMatch[1]) * 100;
      } else if (lakhMatch) {
        estPrice = parseInt(lakhMatch[1]);
      }

      if (selections.budget === 'under-80') {
        if (estPrice > 80) score -= (estPrice - 80) * 1.5;
      } else if (selections.budget === '80-1.5') {
        if (estPrice < 80) score -= (80 - estPrice) * 1.2;
        if (estPrice > 150) score -= (estPrice - 150) * 1.5;
      } else if (selections.budget === 'above-1.5') {
        if (estPrice < 150) score -= (150 - estPrice) * 1.5;
      }

      // 3. Location match
      if (selections.location.length > 0) {
        const isMatchedLoc = selections.location.some(selLoc => loc.includes(selLoc));
        if (isMatchedLoc) {
          score += 15;
        } else {
          score -= 20;
        }
      }

      // 4. Priority match
      if (selections.priority === 'connectivity') {
        if (desc.includes('highway') || desc.includes('metro') || desc.includes('commute')) {
          score += 8;
        }
      } else if (selections.priority === 'amenities') {
        if (desc.includes('pool') || desc.includes('gym') || desc.includes('amenities')) {
          score += 8;
        }
      } else if (selections.priority === 'security') {
        if (item.rera.toLowerCase().includes('verified') || desc.includes('rera') || name.includes('godrej')) {
          score += 10;
        }
      }

      // Normalize score between 60 and 99
      const finalScore = Math.max(60, Math.min(99, Math.round(score)));

      return {
        ...item,
        matchScore: finalScore
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [selections, currentStep, inventory]);

  const stepObj = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#030305] text-[#ededf0] selection:bg-amber-500 selection:text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Background Grids & Radial Glows */}
      <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
            E
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">
              EUS<span className="text-amber-500">Realty</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Strategic Advisor
            </p>
          </div>
        </Link>

        {currentStep < STEPS.length && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Step {currentStep + 1} of {STEPS.length}</span>
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Form container */}
      <main className="flex-1 flex items-center justify-center py-10 md:py-16 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep < STEPS.length ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    <CheckCircle2 size={10} /> AI compatibility quiz
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {stepObj.title}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium max-w-xl mx-auto">
                    {stepObj.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {stepObj.options.map(opt => {
                    const isSelected = stepObj.isMultiSelect 
                      ? (selections.location || []).includes(opt.value)
                      : selections[stepObj.id] === opt.value;

                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[170px] group relative ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/5 shadow-[0_15px_30px_-5px_rgba(245,158,11,0.05)]'
                            : 'border-white/5 bg-slate-950/40 hover:border-white/10 hover:bg-slate-950/70'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-white/5 border-white/5 text-slate-400 group-hover:text-white'
                        }`}>
                          {opt.icon}
                        </div>
                        <div className="mt-4 space-y-1">
                          <h4 className={`font-extrabold text-sm ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                            {opt.label}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-amber-500">
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={
                      stepObj.isMultiSelect 
                        ? (selections.location || []).length === 0
                        : !selections[stepObj.id]
                    }
                    className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-full text-xs font-bold hover:bg-amber-500 hover:scale-103 hover:shadow-lg hover:shadow-amber-500/10 transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    <CheckCircle2 size={10} /> matching complete
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                    Your Top matches in Pune
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    We scored {inventory.length} verified listings against your requirements. Here are the top 3 direct builder matches.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                  {matchedProperties.map((item, index) => (
                    <div 
                      key={item._id}
                      className="bg-slate-950/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between group hover:border-white/10 transition-colors"
                    >
                      {/* Image container */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        
                        {/* Compatibility score badge */}
                        <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <CheckCircle2 size={12} /> {item.matchScore}% Match
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <MapPin size={12} /> {item.location}
                          </div>
                          <h3 className="text-lg font-extrabold text-white group-hover:text-amber-500 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">
                            Developer: {item.developer}
                          </p>
                          <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-400">
                            <div>Config: <span className="text-white font-bold">{item.bhkOptions}</span></div>
                            <div>Carpet: <span className="text-white font-bold">{item.carpetArea}</span></div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Pricing</span>
                            <span className="text-lg font-black text-amber-500">{item.priceRange}</span>
                          </div>

                          <Link 
                            href={`/properties/${item.slug}`}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/5 hover:bg-amber-500 border border-white/5 hover:border-amber-500 text-slate-300 hover:text-slate-950 text-xs font-bold transition-all shadow-md group"
                          >
                            Explore Property <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                  <button
                    onClick={resetMatcher}
                    className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full border border-white/10 text-xs font-bold hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-102"
                  >
                    Schedule Free Consultation
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Elite Unique Services (EUS Realty) · RERA Agent No. A041262501741</p>
      </footer>
    </div>
  );
}
