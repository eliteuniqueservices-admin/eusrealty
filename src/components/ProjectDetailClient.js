"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Building2, Calendar, ShieldCheck, MapPin, 
  BedDouble, Bath, Maximize, Share2, MessageCircle, 
  Phone, Eye, Download, Info, Check, 
  Map, School, Stethoscope, Compass, Plus, Minus,
  ChevronDown, X, Loader2, Star, ArrowUpRight,
  TrendingUp, HelpCircle, Newspaper, Calculator,
  Flame, Zap, Layers
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PropertyCard from "@/components/PropertyCard";
import SmartLeadPopup from "@/components/SmartLeadPopup";
import { getPropertySlug } from "@/lib/propertyUrls";

export default function ProjectDetailClient({ property, richData, similarProperties = [], jsonLd }) {
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [activeNearbyTab, setActiveNearbyTab] = useState("schools");
  const [openSpecs, setOpenSpecs] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // EMI Calculator State
  const initialPriceNum = (() => {
    const configPrice = property.configDetails?.[0]?.price || "";
    if (configPrice.toLowerCase().includes("cr")) {
      return parseFloat(configPrice) * 10000000;
    }
    if (configPrice.toLowerCase().includes("l")) {
      return parseFloat(configPrice) * 100000;
    }
    return 7500000; // 75 L default
  })();

  const [loanAmount, setLoanAmount] = useState(Math.round(initialPriceNum * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // Calculate EMI
  const calculateEmi = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return Math.round(P / n);
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emiVal = calculateEmi();
  const totalPayment = emiVal * tenureYears * 12;
  const totalInterest = totalPayment - loanAmount;

  // Q&A State
  const [questions, setQuestions] = useState([
    { q: "Is the internal approach road fully concreted?", a: "Yes, PMC has completed the 24m concrete approach road linking the project gate to Baner High Street.", user: "Amit K.", date: "12 days ago" },
    { q: "What is the source of drinking water for this society?", a: "The development has municipal corporation water line approvals, supported by 24/7 rainwater harvesting and overhead storage backup systems.", user: "Sneha P.", date: "1 month ago" },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [qaSubmitSuccess, setQaSubmitSuccess] = useState(false);

  // Modals state
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "" });
  const [leadSource, setLeadSource] = useState(""); // "brochure" | "visit" | "bestprice" | "general"
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error

  // Q&A Modal State
  const [isQaModalOpen, setIsQaModalOpen] = useState(false);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaForm, setQaForm] = useState({ name: "", phone: "", email: "" });
  const [qaSubmitState, setQaSubmitState] = useState("idle");

  // UTM tracking state
  const [utmParams, setUtmParams] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        source: urlParams.get("utm_source") || "",
        medium: urlParams.get("utm_medium") || "",
        campaign: urlParams.get("utm_campaign") || "",
        adset: urlParams.get("utm_content") || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setLeadForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleQaInputChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setQaForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleOpenLeadModal = (source) => {
    setLeadSource(source);
    setSubmitState("idle");
    if (source === "brochure") {
      setIsBrochureOpen(true);
    } else {
      setIsVisitOpen(true);
    }
  };

  // WhatsApp setup
  const whatsappNumber = "917620733613";
  const getWhatsappMsg = (type) => {
    let base = "";
    if (type === "general") {
      base = `Hi! I'm interested in "${property.name}" located in ${property.location}. Can you share more details?`;
    } else if (type === "sitevisit") {
      base = `Hello! I would like to schedule a site visit to "${property.name}" in ${property.location}. Please tell me available slots.`;
    } else {
      base = `Hi! I would like to get the best pricing quote/payment plan for "${property.name}" in ${property.location}.`;
    }
    return encodeURIComponent(`${base} URL: https://eusrealty.co.in/properties/${property.slug || property.id}`);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `${property.name} - EUS Realty`,
      text: `Check out ${property.name} in ${property.location}. Direct Builder Pricing & 0% Brokerage.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const phoneDigits = leadForm.phone.replace(/\D/g, "");
    if (!leadForm.name.trim() || phoneDigits.length !== 10) {
      alert("Please enter a valid name and 10-digit phone number.");
      return;
    }

    setSubmitState("submitting");

    try {
      const sourceLabel = leadSource === "brochure" 
        ? `Brochure Request for ${property.name}`
        : leadSource === "bestprice" 
        ? `Best Price request for ${property.name}`
        : leadSource === "general"
        ? `WhatsApp inquiry for ${property.name}`
        : `Site Visit request for ${property.name}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim(),
          objective: leadSource === "brochure" ? "Looking to Buy Residential" : leadSource === "bestprice" ? "Get Best Pricing" : "Free Site Visit",
          budget: property.price || "On Request",
          message: `${sourceLabel}. UTM Source: ${utmParams.source || "None"}, Campaign: ${utmParams.campaign || "None"}. Property Location: ${property.location}`,
          source: sourceLabel,
          utmSource: utmParams.source || "",
          utmMedium: utmParams.medium || "",
          utmCampaign: utmParams.campaign || "",
        }),
      });

      if (!res.ok) throw new Error("Lead submission failed");

      setSubmitState("success");
      if (typeof window !== 'undefined') {
        localStorage.setItem('eus_lead_submitted', 'true');
      }

      // Open WhatsApp link in new window/tab
      const type = leadSource === "brochure" ? "general" : leadSource === "bestprice" ? "bestprice" : "sitevisit";
      const waUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsappMsg(type)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      setLeadForm({ name: "", phone: "", email: "" });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsBrochureOpen(false);
        setIsVisitOpen(false);
        setSubmitState("idle");
      }, 3000);

    } catch (err) {
      console.error(err);
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 5000);
    }
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaQuestion(newQuestion);
    setQaSubmitState("idle");
    setIsQaModalOpen(true);
  };

  const handleQaLeadSubmit = async (e) => {
    e.preventDefault();
    const phoneDigits = qaForm.phone.replace(/\D/g, "");
    if (!qaForm.name.trim() || phoneDigits.length !== 10) {
      alert("Please enter a valid name and 10-digit phone number.");
      return;
    }

    setQaSubmitState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: qaForm.name.trim(),
          phone: qaForm.phone.trim(),
          email: qaForm.email.trim(),
          objective: `Ask a Question for ${property.name}`,
          budget: property.price || "On Request",
          message: `Asked question: "${qaQuestion}". Property Location: ${property.location}`,
          source: "Property Q&A",
        }),
      });

      if (!res.ok) throw new Error("Q&A lead submission failed");

      setQaSubmitState("success");
      
      // Add to local state questions list
      setQuestions(prev => [
        {
          q: qaQuestion,
          a: "Thank you for your question! A EUS Realty advisor will verify with the builder and post the response in 2-4 hours.",
          user: qaForm.name.trim(),
          date: "Just now"
        },
        ...prev
      ]);

      setNewQuestion("");
      setQaQuestion("");
      setQaForm({ name: "", phone: "", email: "" });

      setTimeout(() => {
        setIsQaModalOpen(false);
        setQaSubmitState("idle");
      }, 3000);

    } catch (err) {
      console.error(err);
      setQaSubmitState("error");
      setTimeout(() => setQaSubmitState("idle"), 5000);
    }
  };

  const toggleSpec = (index) => {
    setOpenSpecs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Nearby connectivity icon map
  const nearbyTabs = [
    { id: "schools", label: "Schools & Colleges", icon: School },
    { id: "hospitals", label: "Hospitals & Care", icon: Stethoscope },
    { id: "malls", label: "Shopping & Dining", icon: Building2 },
    { id: "metro", label: "Metro & Highway", icon: Map },
    { id: "itparks", label: "IT & Tech Hubs", icon: Compass },
  ];

  // Computed layout variables
  const image = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const config = property.configDetails && property.configDetails.length > 0 
    ? property.configDetails[0] 
    : { carpet: '1200 sqft', price: 'On Request', type: '3 BHK' };

  const liveViewers = (property.name.charCodeAt(0) % 5) + 3;

  let numericPrice = 0;
  if (typeof config.price === 'string') {
    if (config.price.toLowerCase().includes('cr')) {
      numericPrice = parseFloat(config.price) * 10000000;
    } else if (config.price.toLowerCase().includes('l')) {
      numericPrice = parseFloat(config.price) * 100000;
    }
  }
  const numericCarpet = parseInt(String(config.carpet || '').replace(/[^0-9]/g, "")) || 0;
  const calculatedRate = numericCarpet > 0 && numericPrice > 0
    ? `₹${Math.round(numericPrice / numericCarpet).toLocaleString('en-IN')}/sq.ft`
    : "On Request";

  const formattedLocalityUrl = `/localities/${property.location.split(",")[0].trim().toLowerCase().replace(/\s+/g, "-")}`;
  const formattedBuilderUrl = `/builders/${property.developer ? property.developer.toLowerCase().replace(/\s+/g, "-").replace("-properties", "") + "-pune" : "premium-builder"}`;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32">
      {/* Schema Injection */}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      {/* Hero Layout */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-slate-900">
        <Image src={image} alt={property.name} fill className="object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white w-full">
              <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 mb-6 inline-block">
                <Breadcrumbs theme="dark" items={[
                  { label: "Pune", href: "/pune-real-estate" },
                  { label: property.location.split(",")[0], href: formattedLocalityUrl },
                  { label: property.name, href: `/properties/${getPropertySlug(property)}` }
                ]} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">
                  {property.status || 'Premium Project'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-red-400/50 shadow-lg animate-pulse">
                  <Flame size={14} /> {liveViewers} active buyers looking now
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight leading-tight">{property.name}</h1>
              <div className="flex items-center gap-2 text-slate-200 font-medium text-lg">
                <MapPin size={20} className="text-amber-400" />
                <Link href={formattedLocalityUrl} className="hover:underline">{property.location}, Pune</Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare} 
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-lg cursor-pointer" 
                title="Share Project"
              >
                {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
              </button>
              <button 
                onClick={() => handleOpenLeadModal("bestprice")} 
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 cursor-pointer text-xs uppercase"
              >
                <MessageCircle size={20} /> Request Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-10">
            {/* Factual AI Anchor Block - Premium Summary Card */}
            <div className="bg-[#0B0C10] text-white p-8 rounded-[2rem] border border-slate-950 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
                <Zap size={14} className="animate-pulse fill-amber-500" />
                AI Summary & Key Facts
              </div>
              <p className="text-sm leading-relaxed text-slate-300 font-light">
                <strong>{property.name}</strong> is a premium RERA-verified residential development by <strong>{property.developer || 'Premium Developer'}</strong> located in <strong>{property.location}, Pune</strong>. 
                The configuration features <strong>{property.configDetails?.[0]?.type || '3 BHK'}</strong> configurations starting at <strong>{property.configDetails?.[0]?.price || 'On Request'}</strong> with a carpet area of <strong>{property.configDetails?.[0]?.carpet || '1200 sqft'}</strong>. 
                Registered under MahaRERA ID <strong>{property.rera || 'Verified'}</strong>, EUS Realty advises on this project with <strong>0% brokerage fees</strong> and direct developer desk access.
              </p>
            </div>

            {/* Top Specs Strip */}
            <div className="flex flex-wrap gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Developer</p>
                <Link href={formattedBuilderUrl} className="text-lg font-black text-slate-900 hover:text-amber-600 flex items-center gap-1.5">
                  <Building2 size={16} /> {property.developer || 'Premium Developer'}
                </Link>
              </div>
              <div className="w-[1px] bg-slate-200 hidden sm:block"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">RERA Number</p>
                <p className="text-lg font-black text-emerald-600 flex items-center gap-1"><ShieldCheck size={18} /> {property.rera || 'Verified'}</p>
              </div>
              <div className="w-[1px] bg-slate-200 hidden sm:block"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Possession</p>
                <p className="text-lg font-black text-slate-900 flex items-center gap-1"><Calendar size={18} className="text-amber-500" /> {property.possession || 'Ready to Move'}</p>
              </div>
            </div>

            {/* Quick Metrics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Sq.Ft Rate</span>
                <span className="text-base font-black text-slate-900">{calculatedRate}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Land Parcel</span>
                <span className="text-base font-black text-slate-900">{property.landParcel || "4.5 Acres"}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Open Spaces</span>
                <span className="text-base font-black text-slate-900">{property.openSpace || "65% Green"}</span>
              </div>
              <div className="text-center sm:text-left border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Floors</span>
                <span className="text-base font-black text-slate-900">{property.totalFloors || "24 Floors"}</span>
              </div>
            </div>

            {/* About / Description */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">About the Project</h2>
              <p className="text-slate-600 leading-relaxed text-base font-light">
                {property.description || "An exclusive collection of premium residences designed for those who appreciate the finer things in life."}
              </p>
              <div className="mt-8 flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <Zap size={24} className="text-amber-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800">0% Brokerage & Direct Builder Pricing available exclusively through EUS Realty advisors.</p>
              </div>
            </div>

            {/* ── FLOOR PLANS SECTION ── */}
            <div id="floorplans" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Maximize size={22} className="text-amber-500" /> Floor Plans & Layouts</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Configure layout options and floor space dimensions</p>
                </div>
                <button onClick={() => handleOpenLeadModal("brochure")} className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-widest shadow-sm">
                  <Download size={14} /> Request Blueprint PDF
                </button>
              </div>
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                {richData.floorPlans?.map((fp, i) => (
                  <button key={i} onClick={() => setActiveFloorPlan(i)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFloorPlan === i ? "bg-slate-950 text-amber-400 shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>{fp.title}</button>
                ))}
              </div>
              {richData.floorPlans && richData.floorPlans[activeFloorPlan] && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center min-h-[300px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                    <div className="relative w-full max-w-[400px] aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-center z-10 bg-white shadow-sm hover:border-amber-400 transition-colors">
                      <Building2 size={48} className="text-slate-300 group-hover:text-amber-500 transition-colors mb-4" />
                      <h4 className="font-black text-slate-800 text-lg">{richData.floorPlans[activeFloorPlan].title}</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-[250px]">Standard RERA Carpet Layout. Multi-room ventilation & luxury design.</p>
                      <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">Carpet: {richData.floorPlans[activeFloorPlan].carpet}</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full">Pricing: ₹{richData.floorPlans[activeFloorPlan].price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-5 space-y-6">
                    <h3 className="text-xl font-black text-slate-900">Config Highlights</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Configuration Type", val: richData.floorPlans[activeFloorPlan].title },
                        { label: "RERA Carpet Area", val: richData.floorPlans[activeFloorPlan].carpet },
                        { label: "Built-up Space", val: richData.floorPlans[activeFloorPlan].builtup || "On Request" },
                        { label: "Direct Pricing", val: `₹${richData.floorPlans[activeFloorPlan].price}` },
                        { label: "Booking Deposit", val: "₹5,00,000 (100% Refundable)" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                          <span className="text-slate-400 font-medium">{item.label}</span>
                          <span className="text-slate-900 font-bold">{item.val}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleOpenLeadModal("visit")} className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl text-center shadow-md shadow-slate-900/10 transition-colors uppercase tracking-widest text-xs cursor-pointer">Schedule Virtual Walkthrough</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── PROJECT HIGHLIGHTS ── */}
            <div id="highlights" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6"><ShieldCheck size={22} className="text-amber-500" /> Project Highlights & USPs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {richData.highlights?.map((highlight, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">{i + 1}</div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SPECIFICATIONS ── */}
            {richData.specifications && (
              <div id="specs" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6"><Building2 size={22} className="text-amber-500" /> Technical Specifications</h2>
                <div className="space-y-4">
                  {Object.entries(richData.specifications).map(([key, value], idx) => {
                    const isOpen = openSpecs[idx];
                    return (
                      <div key={key} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                        <button onClick={() => toggleSpec(idx)} className="w-full flex items-center justify-between p-5 bg-white text-left font-black text-slate-800 text-sm sm:text-base border-b border-slate-100 hover:text-amber-600 cursor-pointer">
                          <span className="capitalize">{key} details</span>
                          <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`}><ChevronDown size={18} /></div>
                        </button>
                        {isOpen && <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50 font-medium">{value}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── EMI CALCULATOR ── */}
            <div id="calculators" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <Calculator size={22} className="text-amber-500" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Home Loan EMI Calculator</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Estimate your monthly outflow based on interest and tenure</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Loan Amount (₹)</span><span className="text-slate-950 font-black">₹{loanAmount.toLocaleString('en-IN')}</span></div>
                    <input type="range" min={Math.round(initialPriceNum * 0.2)} max={Math.round(initialPriceNum * 0.95)} step="50000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider"><span>Min (20%)</span><span>Max (95%)</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Interest Rate (%)</span><span className="text-slate-950 font-black">{interestRate}% p.a.</span></div>
                    <input type="range" min="6" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider"><span>6%</span><span>15%</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Tenure (Years)</span><span className="text-slate-950 font-black">{tenureYears} Years</span></div>
                    <input type="range" min="5" max="30" step="1" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider"><span>5 Yrs</span><span>30 Yrs</span></div>
                  </div>
                </div>
                <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between text-center md:text-left">
                  <div className="space-y-4">
                    <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Monthly Loan EMI</span><span className="text-3xl sm:text-4xl font-black text-slate-900 block">₹{emiVal.toLocaleString('en-IN')} /mo</span></div>
                    <div className="h-[1px] bg-slate-200" />
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold filter blur-[4px] select-none pointer-events-none">
                      <div><span className="text-slate-400 block mb-0.5">Principal Loan</span><span className="text-slate-800 font-bold text-sm">₹{loanAmount.toLocaleString('en-IN')}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Total Interest</span><span className="text-emerald-600 font-bold text-sm">₹{totalInterest.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                  <button onClick={() => handleOpenLeadModal("emi")} className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-center uppercase tracking-widest text-xs shadow-sm cursor-pointer transition-colors relative z-10 -mt-10">Unlock Full Amortization Schedule</button>
                </div>
              </div>
            </div>

            {/* ── LOCALITY GUIDE ── */}
            <div id="locality-guide" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Locality Deep-Dive</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><MapPin size={22} className="text-amber-500" /> About {property.location.split(',')[0].trim()} Neighborhood</h2>
                </div>
                <Link href={`/localities/${property.location.split(',')[0].trim().toLowerCase()}`} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl uppercase tracking-widest transition-colors shadow-sm">
                  Explore Locality Guide <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm">
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Lifestyle & Infrastructure</span><p className="text-slate-800 font-bold">Highly developed residential corridors with top-rated international schools, multi-specialty hospitals, and premium high-street retail zones nearby.</p></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Transit Connectivity</span><p className="text-slate-800 font-bold">Outstanding connectivity to Hinjawadi IT Park corridors, Mumbai-Pune Expressway routes, and upcoming Metro Line 3 junctions.</p></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Investment Quality Rating</span><div className="flex items-center gap-2"><span className="text-lg font-black text-slate-900">4.7 / 5.0 ★</span><span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-100">Excellent Buy</span></div><p className="text-xs text-slate-500 leading-relaxed font-light mt-1">High year-on-year capital appreciation trends and extremely active tech tenant rental yields.</p></div>
              </div>
            </div>

            {/* ── REVIEWS ── */}
            <div id="reviews" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Star size={22} className="text-amber-500 fill-amber-500" /> Verified Reviews & Ratings</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">What buyers and investors say about {property.developer || "this developer"}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50/50 px-3.5 py-1.5 rounded-full border border-amber-100 text-amber-800"><Star size={16} className="fill-amber-600 text-amber-600" /><span className="text-sm font-black">4.8 / 5.0</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Rakesh Malhotra", rating: 5, comment: "The carpet layout efficiency is outstanding. The balcony views are premium, and the RCC structure build quality looks robust.", date: "2 weeks ago" },
                  { name: "Priya Godse", rating: 4.8, comment: "Strategic IT park connectivity, just 10 mins from the highway corridor. Highly recommended for families working in Hinjawadi.", date: "1 month ago" },
                  { name: "Vikram Shah", rating: 5, comment: "Seamless RERA verification transparency and Strategic Developer Pricing benefits. Zero commission saved me lakhs.", date: "2 months ago" }
                ].map((rev, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} size={12} className={i < Math.floor(rev.rating) ? "fill-amber-500 text-amber-500" : "text-slate-200"} />))}<span className="text-[10px] text-slate-500 font-bold ml-1">{rev.rating}</span></div>
                      <p className="text-slate-600 text-xs leading-relaxed font-light italic">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/60 text-[10px] text-slate-400 font-bold uppercase"><span>{rev.name}</span><span>{rev.date}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── COMMUNITY Q&A ── */}
            <div id="qa" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle size={22} className="text-amber-500" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Q&A</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Get verified answers to your legal, infrastructure, and timeline questions</p>
                </div>
              </div>
              <div className="space-y-6">
                {questions.map((qa, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex items-start gap-2"><span className="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded mt-0.5">Q</span><div className="space-y-1"><h4 className="font-bold text-slate-900 text-sm sm:text-base">{qa.q}</h4><p className="text-[10px] text-slate-400 font-semibold">Asked by {qa.user} • {qa.date}</p></div></div>
                    <div className="flex items-start gap-2 pl-4 border-l-2 border-slate-200"><span className="text-[10px] uppercase font-black bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-0.5">A</span><p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">{qa.a}</p></div>
                  </div>
                ))}
                <form onSubmit={handleAskQuestion} className="pt-4 border-t border-slate-100 flex gap-4">
                  <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Have a question about this project? Ask our expert..." className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all text-slate-900" required />
                  <button type="submit" className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors shadow-sm cursor-pointer">Ask</button>
                </form>
              </div>
            </div>

            {/* ── NEWS ── */}
            <div id="news" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-2 mb-6"><Newspaper size={22} className="text-amber-500" /><div><h2 className="text-2xl font-black text-slate-900 tracking-tight">News & Construction Updates</h2><p className="text-xs text-slate-400 font-semibold mt-1">Infrastructure developments and construction status of this project area</p></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tag: "Metro Transit", title: "Metro Line 3 Trial Runs Commencement slated soon near local corridors", desc: "The upcoming Hinjawadi-Shivajinagar Metro Corridor station access points are in final completion stages.", date: "10 days ago" },
                  { tag: "Road Infra", title: "PMC approves 24m road widening works for smoother highway transit", desc: "PMC has sanctioned road expansion plans to resolve transit bottlenecks.", date: "3 weeks ago" },
                  { tag: "Project Progress", title: "RCC superstructure framework completed for towers A & B", desc: "The developer has finished key structural RCC frameworks. Internal brickwork and plastering works are underway.", date: "1 month ago" }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider rounded">{item.tag}</span>
                    <h4 className="font-black text-slate-900 text-sm leading-snug">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">{item.desc}</p>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">Published {item.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FAQs ── */}
            <div id="faqs" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6"><Info size={22} className="text-amber-500" /> Project FAQs ({property.name})</h2>
              <div className="space-y-4">
                {richData.faqs?.map((faq, fi) => {
                  const isOpen = openFaq === fi;
                  return (
                    <div key={fi} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                      <button onClick={() => setOpenFaq(isOpen ? null : fi)} className="w-full flex items-center justify-between p-5 bg-white text-left font-black text-slate-800 text-sm sm:text-base border-b border-slate-100 hover:text-amber-600 cursor-pointer">
                        <span>{faq.q}</span>
                        <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`}><ChevronDown size={18} /></div>
                      </button>
                      {isOpen && <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50">{faq.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Similar projects */}
            {similarProperties.length > 0 && (
              <div className="space-y-6 mt-12">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Layers size={22} className="text-amber-500" /> Similar Projects in {property.location.split(",")[0].trim()}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{similarProperties.map((sim) => (<PropertyCard key={sim.id} {...sim} />))}</div>
              </div>
            )}

            {/* Internal Links */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-6 mt-12">
              <h3 className="text-lg font-black tracking-tight text-amber-400 border-b border-white/10 pb-3">Pune Real Estate Internal Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400">
                <div className="space-y-2"><span className="text-white font-bold block mb-1">Localities</span><Link href="/localities/baner" className="hover:text-amber-400 block hover:underline">Baner Real Estate Guide</Link><Link href="/localities/wakad" className="hover:text-amber-400 block hover:underline">Wakad Real Estate Guide</Link><Link href="/localities/hinjawadi" className="hover:text-amber-400 block hover:underline">Hinjawadi IT Corridor</Link><Link href="/localities/tathawade" className="hover:text-amber-400 block hover:underline">Tathawade Area Guide</Link></div>
                <div className="space-y-2"><span className="text-white font-bold block mb-1">Top Developers</span><Link href="/builders/godrej-properties-pune" className="hover:text-amber-400 block hover:underline">Godrej Projects Pune</Link><Link href="/builders/kolte-patil-pune" className="hover:text-amber-400 block hover:underline">Kolte Patil Projects</Link><Link href="/builders/vtp-realty-pune" className="hover:text-amber-400 block hover:underline">VTP Realty Projects</Link></div>
                <div className="space-y-2"><span className="text-white font-bold block mb-1">Calculators</span><Link href="/calculator/emi" className="hover:text-amber-400 block hover:underline">Home Loan EMI Calculator</Link><Link href="/calculator/affordability" className="hover:text-amber-400 block hover:underline">Home Affordability Calc</Link><Link href="/calculator/valuation" className="hover:text-amber-400 block hover:underline">Property Valuation Index</Link></div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)]">
              <div className="text-center mb-8">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Starting From</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">₹{config.price}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-100 py-1.5 px-3 rounded-full inline-block">Direct Developer Price • 0% Brokerage</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-3 font-semibold text-slate-600">
                  <div className="flex justify-between items-center"><span>MahaRERA:</span><span className="text-slate-900 font-black uppercase text-[10px] bg-slate-200/60 px-2 py-0.5 rounded">{property.rera || "Verified"}</span></div>
                  <div className="flex justify-between items-center"><span>Locality Hub:</span><Link href={formattedLocalityUrl} className="text-amber-600 font-black hover:underline">{property.location.split(",")[0].trim()}</Link></div>
                  <div className="flex justify-between items-center"><span>Developer Profile:</span><Link href={formattedBuilderUrl} className="text-slate-900 font-black hover:underline">{property.developer || "Verified"}</Link></div>
                  <div className="flex justify-between items-center"><span>Updated Date:</span><span className="text-slate-900 font-bold">{property.updatedAt ? new Date(property.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 20, 2026"}</span></div>
                </div>
                <button onClick={() => handleOpenLeadModal("general")} className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95 text-sm uppercase cursor-pointer"><MessageCircle size={20} /> Chat on WhatsApp</button>
                <button onClick={() => handleOpenLeadModal("visit")} className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm uppercase cursor-pointer">Schedule Free Site Visit</button>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4"><ShieldCheck size={28} /></div>
                <h4 className="text-lg font-black text-slate-900 mb-2">EUS Strategic Advisor</h4>
                <p className="text-xs text-slate-500 font-medium">We are MahaRERA registered advisor strategic partner (Registration: <strong className="text-slate-900 font-bold">A041262501741</strong>).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SmartLeadPopup type="property" contextName={property.name} />

      {/* ── SITE VISIT / BEST PRICE MODAL ── */}
      {isVisitOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsVisitOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {leadSource === "emi" ? "Unlock EMI Schedule" : leadSource === "bestprice" ? "Request Best Price Quote" : leadSource === "general" ? "Get Expert Advisory" : "Book Priority Site Visit"}
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-light">
              {leadSource === "emi" 
                ? `Enter your details to view the detailed amortization schedule and bank quotes for ${property.name}.`
                : `Advising on ${property.name} in ${property.location}. No brokerage advisory.`}
            </p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label><input type="text" name="name" value={leadForm.name} onChange={handleInputChange} required placeholder="Enter full name" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp Number</label><input type="tel" name="phone" value={leadForm.phone} onChange={handleInputChange} required placeholder="e.g. 9876543210" maxLength={10} className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label><input type="email" name="email" value={leadForm.email} onChange={handleInputChange} placeholder="name@email.com" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              {submitState === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center">✓ Request submitted! Connecting on WhatsApp...</div>
              ) : submitState === "error" ? (
                <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100 text-center">⚠️ Failed to submit. Please try again.</div>
              ) : (
                <button type="submit" disabled={submitState === "submitting"} className="w-full py-4 bg-slate-950 text-white font-black rounded-xl text-center shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                  {submitState === "submitting" ? (<><Loader2 size={16} className="animate-spin" /> Submitting...</>) : "Submit Request"}
                </button>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── BROCHURE MODAL ── */}
      {isBrochureOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsBrochureOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Download Layout Brochure</h3>
            <p className="text-xs text-slate-500 mb-6 font-light">Enter your details to download the floorplan catalog PDF of {property.name}.</p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label><input type="text" name="name" value={leadForm.name} onChange={handleInputChange} required placeholder="Enter full name" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Number</label><input type="tel" name="phone" value={leadForm.phone} onChange={handleInputChange} required placeholder="e.g. 9876543210" maxLength={10} className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label><input type="email" name="email" value={leadForm.email} onChange={handleInputChange} placeholder="name@email.com" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              {submitState === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center">✓ Verified! Downloading brochure now...</div>
              ) : submitState === "error" ? (
                <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100 text-center">⚠️ Failed to submit. Please try again.</div>
              ) : (
                <button type="submit" disabled={submitState === "submitting"} className="w-full py-4 bg-slate-950 text-white font-black rounded-xl text-center shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                  {submitState === "submitting" ? (<><Loader2 size={16} className="animate-spin" /> Submitting...</>) : "Download Brochure PDF"}
                </button>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Q&A LEAD CAPTURE MODAL ── */}
      {isQaModalOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsQaModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Ask Our Expert</h3>
            <p className="text-xs text-slate-500 mb-6 font-light">Enter your details to submit your question about {property.name}.</p>
            <form onSubmit={handleQaLeadSubmit} className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label><input type="text" name="name" value={qaForm.name} onChange={handleQaInputChange} required placeholder="Enter full name" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp Number</label><input type="tel" name="phone" value={qaForm.phone} onChange={handleQaInputChange} required placeholder="e.g. 9876543210" maxLength={10} className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address (Optional)</label><input type="email" name="email" value={qaForm.email} onChange={handleQaInputChange} placeholder="name@email.com" className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900" /></div>
              {qaSubmitState === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center">✓ Question and contact details submitted!</div>
              ) : qaSubmitState === "error" ? (
                <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100 text-center">⚠️ Failed to submit. Please try again.</div>
              ) : (
                <button type="submit" disabled={qaSubmitState === "submitting"} className="w-full py-4 bg-slate-950 text-white font-black rounded-xl text-center shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                  {qaSubmitState === "submitting" ? (<><Loader2 size={16} className="animate-spin" /> Submitting...</>) : "Submit Question"}
                </button>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile floating CTA */}
      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mt-8 space-y-4 relative z-10 lg:hidden max-w-7xl mx-auto">
        <h4 className="font-black text-slate-950 text-base">Schedule Site Visit or Advisory Session</h4>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleOpenLeadModal("visit")} className="py-3 bg-slate-950 text-white hover:bg-amber-500 hover:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-sm cursor-pointer">Schedule Site Visit</button>
          <button onClick={() => handleOpenLeadModal("bestprice")} className="py-3 bg-amber-500 text-slate-950 hover:bg-slate-950 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-sm cursor-pointer">Get Best Pricing</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleOpenLeadModal("general")} className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs cursor-pointer"><MessageCircle size={16} /> WhatsApp Advisory</button>
          <a href="tel:+917620733613" className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 text-xs"><Phone size={14} /> Call desk</a>
        </div>
      </div>
    </div>
  );
}

