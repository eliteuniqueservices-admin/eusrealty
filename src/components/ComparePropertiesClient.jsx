'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, ArrowLeftRight, Check, X, ShieldCheck, 
  MapPin, Calendar, Layers, Sparkles, Plus, Trash2, 
  Info, Compass, Award, IndianRupee, HelpCircle, PhoneCall
} from 'lucide-react';

export default function ComparePropertiesClient({ inventory = [] }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [userPriority, setUserPriority] = useState('overall'); // overall, connectivity, amenities, budget

  // Preset quick comparisons
  const presets = useMemo(() => {
    return [
      {
        name: "Hinjewadi IT Specials",
        ids: inventory
          .filter(p => p.location.toLowerCase().includes('hinjewadi'))
          .slice(0, 3)
          .map(p => p._id)
      },
      {
        name: "Tathawade Growth Gems",
        ids: inventory
          .filter(p => p.location.toLowerCase().includes('tathawade'))
          .slice(0, 3)
          .map(p => p._id)
      },
      {
        name: "Premium Luxury Hotsellers",
        ids: inventory
          .filter(p => p.priceRange.toLowerCase().includes('cr') || parseFloat(p.priceRange) > 120)
          .slice(0, 3)
          .map(p => p._id)
      }
    ].filter(p => p.ids.length > 0);
  }, [inventory]);

  const selectPreset = (ids) => {
    setSelectedIds(ids);
  };

  const handleSelectProperty = (slotIndex, propertyId) => {
    if (!propertyId) {
      // Remove slot
      setSelectedIds(prev => prev.filter((_, idx) => idx !== slotIndex));
      return;
    }

    setSelectedIds(prev => {
      const updated = [...prev];
      updated[slotIndex] = propertyId;
      return updated.filter(Boolean); // Clean any undefined/nulls
    });
  };

  const handleRemoveProperty = (id) => {
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleAddSlot = () => {
    if (selectedIds.length < 3) {
      // Find a property not yet selected
      const nextAvailable = inventory.find(p => !selectedIds.includes(p._id));
      if (nextAvailable) {
        setSelectedIds(prev => [...prev, nextAvailable._id]);
      }
    }
  };

  const selectedProperties = useMemo(() => {
    return selectedIds.map(id => inventory.find(p => p._id === id)).filter(Boolean);
  }, [selectedIds, inventory]);

  // Dynamic suitability scoring based on user priority
  const calculatedMetrics = useMemo(() => {
    return selectedProperties.map(prop => {
      let score = 85; // Base line suitability score
      const desc = (prop.description || "").toLowerCase();
      const usp = (prop.usp || "").toLowerCase();
      const amenities = (prop.amenities || "").toLowerCase();
      const loc = (prop.location || "").toLowerCase();

      // Check RERA
      const isReraVerified = prop.rera.toLowerCase().includes('verified') || prop.rera.toLowerCase().includes('p52');
      if (isReraVerified) score += 5;

      // Check priorities
      if (userPriority === 'connectivity') {
        if (loc.includes('hinjewadi') || desc.includes('metro') || usp.includes('highway') || usp.includes('road')) {
          score += 10;
        } else if (desc.includes('expressway') || desc.includes('connect')) {
          score += 6;
        }
      } else if (userPriority === 'amenities') {
        if (amenities.split(',').length > 8 || desc.includes('clubhouse') || desc.includes('pool')) {
          score += 10;
        }
      } else if (userPriority === 'budget') {
        const priceText = prop.priceRange.toLowerCase();
        if (priceText.includes('lakh') && !priceText.includes('cr')) {
          // Generally lower price point
          score += 10;
        } else if (priceText.includes('cr')) {
          const matchVal = priceText.match(/(\d+(\.\d+)?)/);
          const val = matchVal ? parseFloat(matchVal[1]) : 1.5;
          if (val < 1.2) score += 5;
          else score -= 5; // higher drag for budget priority
        }
      }

      // Max score cap
      const finalScore = Math.min(99, Math.max(65, score));

      // Derive Pros & Cons dynamically
      const pros = [];
      const cons = [];

      // Pros derivation
      if (isReraVerified) pros.push("MahaRERA Registered & Verified");
      if (prop.openSpace && prop.openSpace !== 'N/A' && !prop.openSpace.includes('0')) pros.push(`${prop.openSpace} Open Spaces`);
      if (prop.possession.toLowerCase().includes('ready')) pros.push("Ready to Move / Near Possession");
      if (prop.developer.toLowerCase().includes('godrej') || prop.developer.toLowerCase().includes('kolte') || prop.developer.toLowerCase().includes('lodha') || prop.developer.toLowerCase().includes('shapoorji')) {
        pros.push("A-Grade Developer Credentials");
      }
      if (usp) {
        const uspSplits = prop.usp.split(',').map(s => s.trim()).filter(Boolean);
        if (uspSplits.length > 0) pros.push(uspSplits[0]);
        if (uspSplits.length > 1) pros.push(uspSplits[1]);
      }
      if (pros.length < 2) {
        pros.push("Premium building amenities array");
        pros.push("High potential rental yield corridor");
      }

      // Cons derivation
      if (!isReraVerified) cons.push("Under registration review");
      if (prop.possession.toLowerCase().includes('2028') || prop.possession.toLowerCase().includes('2029')) {
        cons.push("Longer holding period timeline");
      }
      if (prop.priceRange.toLowerCase().includes('cr') && parseFloat(prop.priceRange) > 1.4) {
        cons.push("Premium capital entry layout");
      }
      if (cons.length === 0) {
        cons.push("Under-construction timeline adjustments");
      }

      return {
        ...prop,
        suitabilityScore: finalScore,
        pros: pros.slice(0, 3),
        cons: cons.slice(0, 2)
      };
    });
  }, [selectedProperties, userPriority]);

  return (
    <div className="min-h-screen bg-[#030305] text-[#ededf0] selection:bg-amber-500 selection:text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Background radial glows and grid system */}
      <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* Header section */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/5 bg-[#080810]/40 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
            E
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">
              EUS<span className="text-amber-500">Realty</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Comparison Desk
            </p>
          </div>
        </Link>
        <Link href="/properties" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors">
          &larr; Return to Catalog
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 md:py-16 relative z-10 space-y-12">
        
        {/* Title Block */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
            <ArrowLeftRight size={10} /> Smart Spec Evaluator
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Side-by-Side <span className="text-amber-500">Property Comparison</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Select up to three premium residential developments in West Pune. Analyze layout sizing, RERA clearance status, actual developer rankings, and commute timelines.
          </p>
        </section>

        {/* Quick presets & controls */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#0a0a14]/60 border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Matchups:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => selectPreset(preset.ids)}
                className="px-3.5 py-1.5 bg-[#121222] hover:bg-[#1a1a30] border border-white/5 hover:border-amber-500/30 text-xs font-semibold text-slate-350 hover:text-white rounded-xl transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Priority:</span>
            <div className="flex bg-[#121222] p-0.5 rounded-xl border border-white/5 text-[11px] font-bold">
              {[
                { id: 'overall', label: 'Score' },
                { id: 'connectivity', label: 'Transit' },
                { id: 'amenities', label: 'Amenities' },
                { id: 'budget', label: 'Budget' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setUserPriority(opt.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${userPriority === opt.id ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Comparison Dashboard */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Selectors Panel */}
            <div className="md:col-span-3 flex flex-col justify-between p-6 bg-[#0a0a14]/40 border border-white/5 rounded-[2rem] backdrop-blur-xl space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers size={18} className="text-amber-500" /> Comparison Slots
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select properties from the inventory drop-down list inside the comparison cards to match metrics.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-500 uppercase">
                    <ShieldCheck size={14} /> Zero Commission
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                    EUS platform processes direct developer listings. Save 2% on purchasing fees.
                  </p>
                </div>

                <div className="p-3 bg-[#121222] border border-white/5 rounded-2xl text-[10px] font-medium text-slate-400">
                  ⚠️ Prices and inventory sizes reflect verified builder catalog quotes.
                </div>
              </div>

              {selectedIds.length < 3 && (
                <button
                  onClick={handleAddSlot}
                  disabled={selectedIds.length >= inventory.length}
                  className="w-full py-3 bg-[#121222] hover:bg-amber-500 hover:text-slate-950 text-xs font-bold rounded-xl border border-white/5 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5 group"
                >
                  <Plus size={14} className="group-hover:scale-110 transition-transform" /> Add Competitor Slot
                </button>
              )}
            </div>

            {/* Comparison Cards & Details Grid */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
              {Array.from({ length: 3 }).map((_, slotIdx) => {
                const prop = calculatedMetrics[slotIdx];
                return (
                  <div 
                    key={slotIdx} 
                    className={`rounded-[2rem] border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      prop 
                        ? 'bg-[#0a0a14]/65 border-white/5 hover:border-amber-500/30 shadow-lg' 
                        : 'bg-[#06060c]/20 border-dashed border-white/10 flex items-center justify-center p-8'
                    }`}
                  >
                    {prop ? (
                      /* Active Property card state */
                      <div className="flex flex-col h-full justify-between">
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveProperty(prop._id)}
                          className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 border border-white/10 hover:border-red-500/30 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Top Media & Dropdown Selector */}
                        <div className="relative">
                          <div className="relative h-44 w-full">
                            <Image 
                              src={prop.image} 
                              alt={prop.name} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover brightness-90 rounded-t-[2rem]"
                            />
                            {/* Suitability score tag */}
                            <div className="absolute bottom-4 left-4 bg-[#030305]/90 border border-amber-500/20 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Sparkles size={12} className="text-amber-500 animate-pulse" />
                              <span className="text-[11px] font-black text-white">{prop.suitabilityScore}% Match</span>
                            </div>
                          </div>

                          <div className="p-4 border-b border-white/5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Select Competitor</label>
                            <select
                              value={prop._id}
                              onChange={(e) => handleSelectProperty(slotIdx, e.target.value)}
                              className="w-full mt-1 bg-[#121222] text-white border border-white/10 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                            >
                              {inventory.map(item => (
                                <option 
                                  key={item._id} 
                                  value={item._id}
                                  disabled={selectedIds.includes(item._id) && item._id !== prop._id}
                                >
                                  {item.name} ({item.location})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Property Basic Specs Table */}
                        <div className="p-5 flex-1 space-y-4">
                          <div>
                            <h4 className="text-base font-black text-white tracking-tight">{prop.name}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{prop.developer}</p>
                          </div>

                          <div className="space-y-2.5 pt-2 text-xs">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Starting Price</span>
                              <span className="text-amber-500 font-black flex items-center"><IndianRupee size={10} /> {prop.priceRange}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Micro-Market</span>
                              <span className="text-white font-bold flex items-center gap-1"><MapPin size={10} className="text-slate-500" /> {prop.location}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">RERA Number</span>
                              <span className="text-emerald-400 font-extrabold max-w-[120px] text-right truncate" title={prop.rera}>{prop.rera}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Possession</span>
                              <span className="text-white font-bold flex items-center gap-1"><Calendar size={10} className="text-slate-500" /> {prop.possession}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Land Parcel</span>
                              <span className="text-white font-semibold">{prop.landParcel}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Layouts Sizing</span>
                              <span className="text-white font-semibold">{prop.bhkOptions} ({prop.carpetArea})</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Total Floors</span>
                              <span className="text-white font-semibold">{prop.totalFloors} Floors</span>
                            </div>
                          </div>

                          {/* Dynamic Pros Section */}
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Key Advantages</span>
                            <ul className="space-y-1">
                              {prop.pros.map((pro, idx) => (
                                <li key={idx} className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                                  <Check size={12} className="text-emerald-500 shrink-0" /> {pro}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Dynamic Cons Section */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Points to Note</span>
                            <ul className="space-y-1">
                              {prop.cons.map((con, idx) => (
                                <li key={idx} className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                                  <Info size={11} className="text-amber-650 shrink-0" /> {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="p-4 bg-[#121222]/50 border-t border-white/5 space-y-2">
                          <Link 
                            href={`/properties/${prop.slug}`}
                            className="w-full py-2.5 bg-[#121222] hover:bg-[#1c1c36] text-[11px] font-black uppercase text-center block rounded-xl tracking-wider border border-white/5 hover:border-amber-500/20 transition-all text-white"
                          >
                            Explore Project Catalog &rarr;
                          </Link>
                          
                          <button
                            onClick={() => {
                              // Trigger click event on global WhatsApp chat bot if it's there
                              const chatBtn = document.getElementById('whatsapp-chat-trigger');
                              if (chatBtn) {
                                chatBtn.click();
                                // Send custom message to the chat
                                setTimeout(() => {
                                  const textInput = document.getElementById('chat-text-input');
                                  if (textInput) {
                                    textInput.value = `I am comparing ${prop.name} from EUS site. Please share layout plans.`;
                                    const sendBtn = document.getElementById('chat-send-btn');
                                    if (sendBtn) sendBtn.click();
                                  }
                                }, 600);
                              } else {
                                window.open(`https://wa.me/919923485746?text=Interested in ${encodeURIComponent(prop.name)}`, '_blank');
                              }
                            }}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black uppercase text-center rounded-xl tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <PhoneCall size={12} /> Schedule Site Visit
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Slot placeholder state */
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto text-slate-500">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400">Empty Competitor Slot</p>
                          <p className="text-[10px] text-slate-550 max-w-[150px] mx-auto mt-1 leading-relaxed">Select a development below to compare side-by-side.</p>
                        </div>
                        <div className="w-full px-2">
                          <select
                            onChange={(e) => handleSelectProperty(slotIdx, e.target.value)}
                            defaultValue=""
                            className="w-full bg-[#121222] text-slate-450 border border-white/5 hover:border-white/15 rounded-xl px-2 py-2 text-xs font-semibold focus:outline-none"
                          >
                            <option value="" disabled>Choose Property...</option>
                            {inventory
                              .filter(item => !selectedIds.includes(item._id))
                              .map(item => (
                                <option key={item._id} value={item._id}>
                                  {item.name} ({item.location})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
          </div>
        </section>

        {/* Global Catalog Link Banner */}
        <section className="p-8 bg-gradient-to-r from-amber-500/10 via-[#0a0a14]/80 to-[#030305]/80 border border-amber-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Award size={20} className="text-amber-500" /> Need a Customized Investment Portfolio?
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed max-w-2xl">
              Our professional strategic planners curate custom property portfolios matching your tax brackets and investment holding horizon. Fill out the AI Property Profiler to get matches immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/property-matcher"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Start 60-Sec Profiler
            </Link>
            <Link
              href="/calculator/roi"
              className="px-6 py-3.5 bg-[#121222] hover:bg-[#1a1a32] text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/5 transition-all text-center"
            >
              Check ROI Calculations
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} Elite Unique Services (EUS Realty) · Strategic Real Estate Advisory</p>
      </footer>
    </div>
  );
}
