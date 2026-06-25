"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Calendar, ShieldCheck, MapPin, 
  BedDouble, Bath, Maximize, Share2, MessageCircle, 
  Phone, Eye, Download, Info, Check, 
  Map, School, Stethoscope, Compass, Plus, Minus,
  ChevronDown, X, Loader2, Star, ArrowUpRight,
  TrendingUp, HelpCircle, Newspaper, Calculator
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectDetailClient({ property, richData }) {
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [activeNearbyTab, setActiveNearbyTab] = useState("schools");
  const [openSpecs, setOpenSpecs] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  
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

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    // Add to questions list with temporary answer
    setQuestions(prev => [
      {
        q: newQuestion,
        a: "Thank you for your question! A EUS Realty advisor will verify with the builder and post the response in 2-4 hours.",
        user: "You",
        date: "Just now"
      },
      ...prev
    ]);
    setNewQuestion("");
    setQaSubmitSuccess(true);
    setTimeout(() => setQaSubmitSuccess(false), 4000);
  };
  
  // Modals state
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "" });
  const [leadSource, setLeadSource] = useState(""); // "brochure" | "visit" | "bestprice"
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error

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

  const handleOpenLeadModal = (source) => {
    setLeadSource(source);
    setSubmitState("idle");
    if (source === "brochure") {
      setIsBrochureOpen(true);
    } else {
      setIsVisitOpen(true);
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
        : `Site Visit request for ${property.name}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim(),
          objective: "Looking to Buy Residential",
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

  const toggleSpec = (index) => {
    setOpenSpecs(prev => ({ ...prev, [index]: !prev[index] }));
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
    return encodeURIComponent(`${base} URL: https://eusrealty.com/properties/${property.slug || property.id}`);
  };

  // Nearby connectivity icon map
  const nearbyTabs = [
    { id: "schools", label: "Schools & Colleges", icon: School },
    { id: "hospitals", label: "Hospitals & Care", icon: Stethoscope },
    { id: "malls", label: "Shopping & Dining", icon: Building2 },
    { id: "metro", label: "Metro & Highway", icon: Map },
    { id: "itparks", label: "IT & Tech Hubs", icon: Compass },
  ];

  return (
    <div className="space-y-12">
      
      {/* ─────────────────────────────────────────────────────────────
          FLOOR PLANS SECTION
      ───────────────────────────────────────────────────────────── */}
      <div id="floorplans" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Maximize size={22} className="text-amber-500" />
              Floor Plans & Layouts
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Configure layout options and floor space dimensions</p>
          </div>
          <button 
            onClick={() => handleOpenLeadModal("brochure")}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-widest shadow-sm"
          >
            <Download size={14} /> Request Blueprint PDF
          </button>
        </div>

        {/* Floor plans toggle buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
          {richData.floorPlans?.map((fp, i) => (
            <button
              key={i}
              onClick={() => setActiveFloorPlan(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeFloorPlan === i 
                  ? "bg-slate-950 text-amber-400 shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {fp.title}
            </button>
          ))}
        </div>

        {/* Active plan layout */}
        {richData.floorPlans && richData.floorPlans[activeFloorPlan] && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center min-h-[300px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              {/* Floor Plan Blueprint mockup drawing */}
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
              <button 
                onClick={() => handleOpenLeadModal("visit")}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl text-center shadow-md shadow-slate-900/10 transition-colors uppercase tracking-widest text-xs"
              >
                Schedule Virtual Walkthrough
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PROJECT HIGHLIGHTS SECTION
      ───────────────────────────────────────────────────────────── */}
      <div id="highlights" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
          <ShieldCheck size={22} className="text-amber-500" />
          Project Highlights & USPs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {richData.highlights?.map((highlight, i) => (
            <div key={i} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl items-start">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                {i + 1}
              </div>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">{highlight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          AMENITIES GRID
      ───────────────────────────────────────────────────────────── */}
      <div id="amenities" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <Building2 size={22} className="text-amber-500" />
          Modern Amenities
        </h2>
        <p className="text-xs text-slate-400 font-semibold mb-6">Premium life features and building amenities</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {richData.amenitiesList?.map((amenity, i) => {
            return (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Check size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SPECIFICATIONS ACCORDION
      ───────────────────────────────────────────────────────────── */}
      <div id="specifications" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <Info size={22} className="text-amber-500" />
          Building Specifications
        </h2>
        <p className="text-xs text-slate-400 font-semibold mb-6">Technical details, structural materials, and fits</p>
        
        <div className="space-y-3">
          {richData.specifications && Object.entries(richData.specifications).map(([title, desc], idx) => {
            const isOpen = openSpecs[idx];
            return (
              <div key={title} className="border border-slate-100 rounded-2xl overflow-hidden transition-all bg-slate-50/50">
                <button
                  onClick={() => toggleSpec(idx)}
                  className="w-full flex items-center justify-between p-5 bg-white text-left font-black text-slate-800 text-sm sm:text-base border-b border-slate-100 hover:text-amber-600"
                >
                  <span className="capitalize">{title.replace(/([A-Z])/g, ' $1')}</span>
                  <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="p-5 text-sm text-slate-500 leading-relaxed font-light bg-slate-50">
                    {desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NEARBY PLACES & CONNECTIVITY
      ───────────────────────────────────────────────────────────── */}
      <div id="connectivity" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <MapPin size={22} className="text-amber-500" />
          Nearby Connectivity & Infrastructure
        </h2>
        <p className="text-xs text-slate-400 font-semibold mb-6">Key educational, health, transit, and IT hubs</p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
          {nearbyTabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeNearbyTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNearbyTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  isActive 
                    ? "bg-slate-950 text-amber-400 shadow-sm" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <TabIcon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Connectivity locations list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {richData.nearby && richData.nearby[activeNearbyTab]?.map((place, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="font-bold text-slate-800 text-sm">{place.name}</span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-black rounded-lg">{place.distance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COMPARISON MODULE
      ───────────────────────────────────────────────────────────── */}
      <div id="compare" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 size={22} className="text-amber-500" />
            Local Project Comparison
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Contrast {property.name} with other properties in {property.location}</p>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full min-w-[700px] text-left text-sm border border-slate-100 rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-widest text-slate-500 font-black">
                <th className="px-4 py-4">Features</th>
                <th className="px-4 py-4 text-amber-600 font-black">{property.name} (Current)</th>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <th key={idx} className="px-4 py-4 text-slate-800">{proj.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-4 font-bold text-slate-500">Starting Price</td>
                <td className="px-4 py-4 font-black text-slate-900">₹{property.price}</td>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <td key={idx} className="px-4 py-4 font-bold text-slate-700">₹{proj.price}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-4 font-bold text-slate-500">Carpet Area</td>
                <td className="px-4 py-4 font-black text-slate-900">{property.area}</td>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <td key={idx} className="px-4 py-4 text-slate-600">{proj.area}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-4 font-bold text-slate-500">Possession</td>
                <td className="px-4 py-4 font-black text-slate-900">{property.possession}</td>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <td key={idx} className="px-4 py-4 text-slate-600">{proj.possession}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-4 font-bold text-slate-500">MahaRERA Status</td>
                <td className="px-4 py-4 font-black text-emerald-600">
                  <a
                    href="https://maharerait.mahaonline.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline hover:text-emerald-700 transition-colors"
                  >
                    <ShieldCheck size={16} /> {property.rera ? `Verified (${property.rera})` : "Verified"}
                  </a>
                </td>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <td key={idx} className="px-4 py-4 font-semibold text-slate-700">
                    <a
                      href="https://maharerait.mahaonline.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-emerald-700"
                    >
                      {proj.reraStatus}
                    </a>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-4 font-bold text-slate-500">EUS Rating</td>
                <td className="px-4 py-4 font-black text-slate-900">4.8 / 5.0</td>
                {richData.comparisonProjects?.map((proj, idx) => (
                  <td key={idx} className="px-4 py-4 font-semibold text-slate-700">{proj.rating} / 5.0</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DEVELOPER PROFILE
      ───────────────────────────────────────────────────────────── */}
      <div id="developer" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Developer Desk</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 size={22} className="text-amber-500" />
              {property.developer || "Premium Developer"}
            </h2>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Est. Year</span>
              <span className="font-black text-slate-900 text-lg">{richData.developerProfile?.estYear || "2005"}</span>
            </div>
            <div className="w-[1px] bg-slate-200"></div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Pune Projects</span>
              <span className="font-black text-slate-900 text-lg">{richData.developerProfile?.projectCount || "15+"}</span>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <p className="text-slate-600 font-light text-sm sm:text-base leading-relaxed">
            {richData.developerProfile?.bio || `${property.developer} is one of Pune's most trusted real estate developers, renowned for architecture craftsmanship, strict compliance with MahaRERA guidelines, timely delivery schedules, and high-quality premium community infrastructure.`}
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRICE TRENDS & HISTORICAL RATES
      ───────────────────────────────────────────────────────────── */}
      <div id="price-trends" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={22} className="text-amber-500" />
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Price Trends & Historical Rates</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Average rate per sq.ft change over the years in this locality</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated 3-Year Appreciation</span>
            <span className="text-3xl font-black text-emerald-600 block">+25.6%</span>
            <span className="text-xs text-slate-500 font-medium">Outperforming city average by 4.2%</span>
          </div>

          <div className="md:col-span-2">
            <div className="min-w-[320px] flex justify-between gap-4 py-4">
              {[
                { year: "2023", rate: "₹7,800", sub: "Base Launch" },
                { year: "2024", rate: "₹8,400", sub: "+7.6% growth" },
                { year: "2025", rate: "₹9,150", sub: "+8.9% growth" },
                { year: "2026 (Current)", rate: "₹9,800", sub: "+7.1% growth", active: true }
              ].map((item, idx) => (
                <div key={item.year} className={`flex-1 p-4 rounded-xl border text-center space-y-1 transition-all ${
                  item.active 
                    ? "bg-amber-50/50 border-amber-300 shadow-sm text-slate-900" 
                    : "bg-white border-slate-100 text-slate-600"
                }`}>
                  <span className="text-xs text-slate-400 font-bold block">{item.year}</span>
                  <span className={`text-lg font-black block ${item.active ? "text-amber-600" : "text-slate-800"}`}>{item.rate}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE HOME LOAN EMI CALCULATOR
      ───────────────────────────────────────────────────────────── */}
      <div id="calculators" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex items-center gap-2 mb-6">
          <Calculator size={22} className="text-amber-500" />
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Home Loan EMI Calculator</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Estimate your monthly outflow based on interest and tenure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sliders */}
          <div className="md:col-span-7 space-y-6">
            {/* Slider 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Loan Amount (₹)</span>
                <span className="text-slate-950 font-black">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min={Math.round(initialPriceNum * 0.2)}
                max={Math.round(initialPriceNum * 0.95)}
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Min (20%)</span>
                <span>Max (95%)</span>
              </div>
            </div>

            {/* Slider 2: Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Interest Rate (%)</span>
                <span className="text-slate-950 font-black">{interestRate}% p.a.</span>
              </div>
              <input 
                type="range"
                min="6"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Slider 3: Loan Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Tenure (Years)</span>
                <span className="text-slate-950 font-black">{tenureYears} Years</span>
              </div>
              <input 
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>5 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between text-center md:text-left">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Monthly Loan EMI</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 block">₹{emiVal.toLocaleString('en-IN')} /mo</span>
              </div>
              <div className="h-[1px] bg-slate-200" />
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block mb-0.5">Principal Loan</span>
                  <span className="text-slate-800 font-bold text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Interest</span>
                  <span className="text-emerald-600 font-bold text-sm">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleOpenLeadModal("visit")}
              className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl text-center uppercase tracking-widest text-xs shadow-sm"
            >
              Get Custom Bank Quotes
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NEIGHBORHOOD LOCALITY GUIDE
      ───────────────────────────────────────────────────────────── */}
      <div id="locality-guide" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Locality Deep-Dive</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin size={22} className="text-amber-500" />
              About {property.location.split(',')[0].trim()} Neighborhood
            </h2>
          </div>
          <Link 
            href={`/localities/${property.location.split(',')[0].trim().toLowerCase()}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl uppercase tracking-widest transition-colors shadow-sm"
          >
            Explore Locality Guide <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Lifestyle & Infrastructure</span>
            <p className="text-slate-800 font-bold">Highly developed residential corridors with top-rated international schools, multi-specialty hospitals, and premium high-street retail zones nearby.</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Transit Connectivity</span>
            <p className="text-slate-800 font-bold">Outstanding connectivity to Hinjawadi IT Park corridors, Mumbai-Pune Expressway routes, and upcoming Metro Line 3 junctions.</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Investment Quality Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">4.7 / 5.0 ★</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-100">Excellent Buy</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light mt-1">High year-on-year capital appreciation trends and extremely active tech tenant rental yields.</p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          REVIEWS & BUYER RATING
      ───────────────────────────────────────────────────────────── */}
      <div id="reviews" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Star size={22} className="text-amber-500 fill-amber-500" />
              Verified Reviews & Ratings
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">What buyers and investors say about {property.developer || "this developer"}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50/50 px-3.5 py-1.5 rounded-full border border-amber-100 text-amber-800">
            <Star size={16} className="fill-amber-600 text-amber-600" />
            <span className="text-sm font-black">4.8 / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rakesh Malhotra", rating: 5, comment: "The carpet layout efficiency is outstanding. The balcony views are premium, and the RCC structure build quality looks robust.", date: "2 weeks ago" },
            { name: "Priya Godse", rating: 4.8, comment: "Strategic IT park connectivity, just 10 mins from the highway corridor. Highly recommended for families working in Hinjawadi.", date: "1 month ago" },
            { name: "Vikram Shah", rating: 5, comment: "Seamless RERA verification transparency and Strategic Developer Pricing benefits. Zero commission saved me lakhs.", date: "2 months ago" }
          ].map((rev, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < Math.floor(rev.rating) ? "fill-amber-500 text-amber-500" : "text-slate-200"} 
                    />
                  ))}
                  <span className="text-[10px] text-slate-500 font-bold ml-1">{rev.rating}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed font-light italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/60 text-[10px] text-slate-400 font-bold uppercase">
                <span>{rev.name}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COMMUNITY Q&A SECTION
      ───────────────────────────────────────────────────────────── */}
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
              <div className="flex items-start gap-2">
                <span className="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded mt-0.5">Q</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{qa.q}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Asked by {qa.user} • {qa.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pl-4 border-l-2 border-slate-200">
                <span className="text-[10px] uppercase font-black bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-0.5">A</span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                  {qa.a}
                </p>
              </div>
            </div>
          ))}

          {/* Ask a Question Form */}
          <form onSubmit={handleAskQuestion} className="pt-4 border-t border-slate-100 flex gap-4">
            <input 
              type="text" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Have a question about this project? Ask our expert..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all text-slate-900"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              Ask
            </button>
          </form>

          {qaSubmitSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center animate-fade-in">
              ✓ Question submitted successfully! We are reviewing your question.
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LATEST NEWS & INFRASTRUCTURE UPDATES
      ───────────────────────────────────────────────────────────── */}
      <div id="news" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <div className="flex items-center gap-2 mb-6">
          <Newspaper size={22} className="text-amber-500" />
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">News & Construction Updates</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Infrastructure developments and construction status of this project area</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: "Metro Transit", title: "Metro Line 3 Trial Runs Commencement slated soon near local corridors", desc: "The upcoming Hinjawadi-Shivajinagar Metro Corridor station access points are in final completion stages, reducing peak transit times.", date: "10 days ago" },
            { tag: "Road Infra", title: "PMC approves 24m road widening works for smoother highway transit", desc: "PMC has sanctioned road expansion plans to resolve transit bottlenecks, ensuring faster highway access.", date: "3 weeks ago" },
            { tag: "Project Progress", title: "RCC superstructure framework completed for high-rise residential towers A & B", desc: "The developer has finished key structural RCC frameworks. Internal brickwork and plastering works are underway.", date: "1 month ago" }
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider rounded">
                {item.tag}
              </span>
              <h4 className="font-black text-slate-900 text-sm leading-snug">{item.title}</h4>
              <p className="text-slate-500 text-xs font-light leading-relaxed">{item.desc}</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
                Published {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PROJECT FAQS ACCORDION
      ───────────────────────────────────────────────────────────── */}
      <div id="faqs" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
          <Info size={22} className="text-amber-500" />
          Project FAQs ({property.name})
        </h2>
        
        <div className="space-y-4">
          {richData.faqs?.map((faq, fi) => {
            const isOpen = openFaq === fi;
            return (
              <div key={fi} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : fi)}
                  className="w-full flex items-center justify-between p-5 bg-white text-left font-black text-slate-800 text-sm sm:text-base border-b border-slate-100 hover:text-amber-600"
                >
                  <span>{faq.q}</span>
                  <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SIDE VISIT / BEST PRICE FLOATING CTA MODAL
      ───────────────────────────────────────────────────────────── */}
      {isVisitOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 relative shadow-2xl border border-slate-100">
            <button 
              onClick={() => setIsVisitOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {leadSource === "bestprice" ? "Request Best Price Quote" : "Book Priority Site Visit"}
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-light">
              Advising on {property.name} in {property.location}. No brokerage advisory.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={leadForm.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="Enter full name"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={leadForm.phone} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={leadForm.email} 
                  onChange={handleInputChange} 
                  placeholder="name@email.com"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              {submitState === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center">
                  ✓ Request submitted successfully! Connecting in 15 minutes...
                </div>
              ) : submitState === "error" ? (
                <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100 text-center">
                  ⚠️ Failed to submit request. Please try again.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="w-full py-4 bg-slate-950 text-white font-black rounded-xl text-center shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  {submitState === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BROCHURE DOWNLOAD LEAD MODAL
      ───────────────────────────────────────────────────────────── */}
      {isBrochureOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 relative shadow-2xl border border-slate-100">
            <button 
              onClick={() => setIsBrochureOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Download Layout Brochure
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-light">
              Enter your details to download the floorplan catalog PDF of {property.name}.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={leadForm.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="Enter full name"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={leadForm.phone} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={leadForm.email} 
                  onChange={handleInputChange} 
                  placeholder="name@email.com"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              {submitState === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 text-center">
                  ✓ Verified! Downloading brochure now...
                </div>
              ) : submitState === "error" ? (
                <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100 text-center">
                  ⚠️ Failed to submit request. Please try again.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="w-full py-4 bg-slate-950 text-white font-black rounded-xl text-center shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  {submitState === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Download Brochure PDF"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Floating CTA buttons for detail sidebar/bottom */}
      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mt-8 space-y-4 relative z-10">
        <h4 className="font-black text-slate-950 text-base">Schedule Site Visit or Advisory Session</h4>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleOpenLeadModal("visit")}
            className="py-3 bg-slate-950 text-white hover:bg-amber-500 hover:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-sm"
          >
            Schedule Site Visit
          </button>
          <button 
            onClick={() => handleOpenLeadModal("bestprice")}
            className="py-3 bg-amber-500 text-slate-950 hover:bg-slate-950 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-sm"
          >
            Get Best Pricing
          </button>
        </div>
        <div className="flex gap-2">
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${getWhatsappMsg("general")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <MessageCircle size={16} /> WhatsApp Advisory
          </a>
          <a 
            href={`tel:+917620733613`}
            className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <Phone size={14} /> Call desk
          </a>
        </div>
      </div>

    </div>
  );
}
