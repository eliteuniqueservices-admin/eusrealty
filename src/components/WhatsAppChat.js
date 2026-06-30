"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { speakCongratulation, cancelSpeech, speakText } from "@/lib/elevenLabsTTS";
import { 
  X, Send, CheckCheck, MessageCircle, User, Phone, 
  ChevronRight, Sparkles, Mail, MapPin, Home, Clock,
  Mic, MicOff, Volume2, VolumeX
} from "lucide-react";
import PropertyCard from "./PropertyCard";

/* ──────────────────────────────────────────────────────
   INTENTS: keyword → smart bot reply (Fallback Mode)
────────────────────────────────────────────────────── */
const INTENTS = [
  {
    id: "greet",
    keywords: ["hi", "hello", "hey", "namaste", "hii", "helo", "howdy", "good morning", "good evening", "good afternoon", "start"],
    answer: "Namaste! 🙏 Welcome to EusRealty. I'm Vision, your Senior Property Advisor.\n\nOver my 25 years of helping families settle in Pune, I've learned that finding a home is about trust and long-term security. I am here to help you navigate our verified, zero-brokerage properties with absolute transparency.\n\nTell me, are you looking for your dream home or a high-yield investment?",
    chips: ["🏠 Show me properties", "💰 What's the pricing?", "🗓️ Book site visit", "📋 Request callback"],
    waMsg: null,
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thankyou", "great", "awesome", "nice", "perfect", "wonderful", "brilliant", "good"],
    answer: "It is my absolute pleasure! 🙏 I believe in offering genuine guidance first. Please feel free to ask me anything else about Pune's properties, configurations, or legal processes.",
    chips: ["🏢 View listings", "📋 Get callback", "📞 Contact our team"],
    waMsg: null,
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "later", "ok bye", "cya", "done"],
    answer: "Thank you for your valuable time today! 👋 Have a wonderful and blessed day ahead. Should you need any advice in the future, my desk is always open for you.\n\n📞 +91 7620733613",
    chips: null,
    waMsg: null,
  },
  {
    id: "callback",
    keywords: ["callback", "call back", "call me", "contact me", "reach me", "get in touch", "enquire", "enquiry", "inquiry", "form", "register"],
    answer: null,
    action: "show_lead_form",
  },
  {
    id: "price",
    keywords: ["price", "cost", "rate", "budget", "affordable", "cheap", "expensive", "₹", "lakh", "crore", "how much", "pricing", "cost of"],
    answer: "💰 Over my 25 years in the Pune real estate market, I've observed that standard pricing depends heavily on the locality and builder quality. Currently, our verified developer portfolio offers options for every profile:\n\n• **2 BHK Apartments**: ₹85 Lakhs – ₹1.8 Cr\n• **3 BHK Luxury Flats**: ₹1.8 Cr – ₹4.5 Cr\n• **Villas & Row Houses**: ₹4.5 Cr – ₹8.9 Cr\n• **Commercial Units**: ₹45 Lakhs onwards\n\nI can also assist you with builder payment plans and bank subvention options. What budget range are you comfortable with?",
    chips: ["📋 Get price sheet", "🏦 Home loan help", "🗓️ Book site visit"],
    waMsg: "Hi, please send the detailed pricing sheet and payment plans for your properties.",
  },
  {
    id: "projects",
    keywords: ["project", "property", "flat", "apartment", "villa", "house", "bhk", "studio", "listing", "new launch", "available", "show me", "properties"],
    answer: "🏢 We have hand-picked some of the finest RERA-registered projects directly from developers in Pune's major micro-markets:\n\n• **Eus Heights** — Tathawade (Excellent 2 & 3 BHK configuration)\n• **Skyline Villas** — Balewadi (Gated 3 & 4 BHK luxury residences)\n• **Juhu Oasis** — Baner (Premium spaces from Studio to 3 BHK)\n• **Green Valley** — Hinjewadi (IT corridor prime location)\n\nAll properties come with direct developer pricing and zero brokerage. Would you like details on a specific project?",
    chips: ["💰 Check prices", "🗓️ Book a visit", "📋 Get full catalog"],
    waMsg: "Hi, I'd like to explore your latest premium property listings and get the full catalog.",
  },
  {
    id: "brokerage",
    keywords: ["brokerage", "commission", "fee", "zero brokerage", "0%", "no charge", "middleman", "charges", "hidden"],
    answer: "🤝 EusRealty is built on a strict **0% brokerage** foundation. \n\nHaving spent more than two decades in this business, I strongly believe buyers shouldn't pay brokers to find their homes. We connect you directly with builders, which saves you ₹2 Lakhs to ₹10 Lakhs in commission fees—funds that are better spent on your new home's interiors or registry.",
    chips: ["🏢 Explore projects", "📋 Talk to our team", "💰 View pricing"],
    waMsg: "Hi, I want to buy a property with 0% brokerage directly from the builder.",
  },
  {
    id: "contact",
    keywords: ["contact", "call", "email", "phone", "reach", "number", "address", "office", "support", "helpline", "speak"],
    answer: "📞 My team and I are at your service:\n\n📱 **Direct Line**: +91 7620733613\n📧 **Email**: eliteuniqueservices@gmail.com\n📍 **Office**: Corporate Desk, Tathawade, Pune\n\n🕐 Available: Tuesday to Sunday, 10 AM – 7 PM\n\nOr tap below to connect with us directly on WhatsApp!",
    chips: ["📋 Request callback", "🗓️ Book site visit"],
    waMsg: "Hi, I'd like to speak with a senior real estate consultant from EusRealty.",
  },
  {
    id: "loan",
    keywords: ["loan", "emi", "finance", "bank", "mortgage", "home loan", "interest rate", "down payment", "subsidy", "pmay", "financing"],
    answer: "🏦 Navigating home finance can be overwhelming. Over the years, I've established strong relationships with 15+ major banks & NBFCs (including SBI, HDFC, ICICI) to provide support:\n\n• **Pre-approvals** within 24 hours\n• **Attractive interest rates** starting at current market lows\n• **PMAY subsidy benefits** up to ₹2.67 Lakhs\n• **Up to 90% financing** options on select projects\n\nWould you like me to connect you with our bank relationship officers for a free eligibility check?",
    chips: ["📋 Get loan help", "💰 Property pricing", "🗓️ Book site visit"],
    waMsg: "Hi, I need help with home loan assistance, EMI calculation, and pre-approval.",
  },
  {
    id: "visit",
    keywords: ["visit", "site visit", "tour", "show flat", "schedule", "appointment", "demo", "book", "viewing", "come", "see"],
    answer: "🗓️ I always say: *'A site visit is 80% of the decision.'* Seeing the structure, location, and ventilation first-hand is irreplaceable.\n\nWe would be honored to arrange a complimentary chauffeured site visit (with pickup and drop service) for you and your family, 7 days a week.\n\nWhich day fits your schedule best — this coming Saturday or Sunday?",
    chips: ["📅 Schedule on WhatsApp", "📋 Request callback"],
    waMsg: "Hi, I'd like to schedule a free site visit. Please share available time slots.",
  },
  {
    id: "location",
    keywords: ["location", "area", "where", "pune", "hinjewadi", "baner", "balewadi", "tathawade", "wakad", "pimple", "sus", "kothrud", "nibm", "hadapsar", "near"],
    answer: "📍 Pune has several excellent micro-markets that suit different needs. Based on my experience:\n\n• **IT Corridor (Hinjewadi, Wakad)**: Best for professionals seeking rental yields (6-8%) and short commutes. Options start at ₹85L.\n• **Premium West (Baner, Balewadi, Sus)**: Ideal for a premium lifestyle and families wanting proximity to top schools. Options start at ₹1.2 Cr.\n• **Value Zones (Tathawade, Punawale)**: Fastest growing infrastructure with maximum appreciation. Options start at ₹75L.\n\nWhich of these areas aligns best with your preferences?",
    chips: ["🏢 See Baner projects", "🏢 See Hinjewadi projects", "💰 Compare prices"],
    waMsg: "Hi, I want to explore properties in a specific area of Pune. Please share options.",
  },
  {
    id: "invest",
    keywords: ["invest", "investment", "roi", "rental", "return", "commercial", "shop", "office space", "plot", "land", "yield", "appreciation"],
    answer: "📈 Real estate in Pune is highly resilient. If your focus is wealth creation:\n\n• **Commercial spaces (Retail/Office)**: Deliver strong yields between **6% to 9%**.\n• **Residential properties**: Offer steady **4% to 6%** rental yield, combined with **8% to 12%** annual capital appreciation.\n• **Pre-launch opportunities**: Yield maximum capital appreciation (up to 30-40% from launch to completion).\n\nLet me know if you prefer regular rental income or capital growth so I can suggest options.",
    chips: ["📋 Get investment advice", "🏢 Commercial properties", "💰 Pre-launch projects"],
    waMsg: "Hi, I'm interested in real estate investment opportunities in Pune for maximum ROI.",
  },
  {
    id: "ready",
    keywords: ["ready to move", "possession", "delivery", "handover", "immediate", "move in", "occupancy"],
    answer: "🏠 Both ready-to-move and under-construction properties have distinct advantages:\n\n• **Ready-to-Move**: Immediate possession, zero delay risk, and **no GST payable** (saving you 5% upfront).\n• **Under-Construction**: Typically **15% to 20% cheaper** than ready homes, with flexible, slab-wise payment structures and higher capital appreciation potential.\n\nAre you looking to move in immediately, or is a 1 to 2-year possession timeline workable for you?",
    chips: ["🏢 Show ready-to-move", "💰 Compare prices", "🗓️ Book site visit"],
    waMsg: "Hi, I'm looking for ready-to-move properties. Please share available options.",
  },
  {
    id: "legal",
    keywords: ["rera", "legal", "document", "agreement", "registration", "stamp duty", "safe", "trust", "verified", "fraud", "genuine"],
    answer: "⚖️ In my 25 years in this industry, the implementation of MahaRERA in 2017 is the best thing that happened for buyer protection. We *only* deal with RERA-registered, legally verified projects.\n\nMy team will guide you through title deeds, encumbrance certificates, draft agreements, stamp duty benefits (such as the 1% concession for female co-applicants), and registration. Your investment is completely safe with us.\n\nWould you like details on the legal checklist?",
    chips: ["📋 Speak to legal desk", "🏢 View verified projects"],
    waMsg: "Hi, I'd like to know about the legal process, documents required, and RERA verification.",
  },
  {
    id: "telegram",
    keywords: ["telegram", "tele", "tg"],
    answer: "Perfect! I'll arrange for one of our senior real estate consultants to continue the conversation with you on Telegram.\n\nClick the button below to connect with us on Telegram, or share your Telegram username here and I'll notify our team.",
    chips: ["📋 Request callback", "🗓️ Book site visit"],
    waMsg: null,
    tgMsg: "EUSRealty_Bot",
  },
];

function getSmartReply(text) {
  const lower = text.toLowerCase().trim();
  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return null;
}

/* ──────────────────────────────────────────────────────
   VOICE: Using ElevenLabs Anika voice (imported from @/lib/elevenLabsTTS)
────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────
   LeadFormCard – inline chat bubble form (Enhanced)
────────────────────────────────────────────────────── */
function LeadFormCard({ phoneNumber, onSubmitted, sessionId }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [possession, setPossession] = useState("");
  const [interest, setInterest] = useState("Residential Property");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Unlock speech synthesis context synchronously in user click gesture handler
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const silentUtterance = new SpeechSynthesisUtterance('');
      silentUtterance.volume = 0;
      window.speechSynthesis.speak(silentUtterance);
    }

    setSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+91 ${phone.trim()}`,
          email: email.trim(),
          objective: interest,
          budget: budget.trim(),
          preferredLocation: location.trim(),
          propertyType: propertyType.trim(),
          possession: possession.trim(),
          message: `Lead form filled inside AI Assistant widget.`,
          source: "Chatbot Widget",
          sessionId: sessionId || "",
        }),
      });
    } catch (err) {
      console.error("Failed to submit contact details to DB:", err);
    }

    // Also open WhatsApp link for live connection
    const msg = `🏠 *New Lead – EusRealty Chatbot*\n\n` +
                `👤 Name: ${name.trim()}\n` +
                `📞 Phone: +91 ${phone.trim()}\n` +
                (email.trim() ? `📧 Email: ${email.trim()}\n` : "") +
                `🏢 Interest: ${interest}\n` +
                (budget.trim() ? `💰 Budget: ${budget.trim()}\n` : "") +
                (location.trim() ? `📍 Location: ${location.trim()}\n` : "") +
                (propertyType.trim() ? `🏗️ Prop Type: ${propertyType.trim()}\n` : "") +
                (possession.trim() ? `🔑 Possession: ${possession.trim()}\n` : "") +
                `\nPlease contact me soon!`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

    setSubmitting(false);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eus_lead_submitted', 'true');
    }
    if (onSubmitted) onSubmitted(name.trim());
    speakCongratulation(name);
  };

  if (submitted) {
    return (
      <div className="text-center py-3">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-sm font-bold text-green-700">Thank you, {name}!</p>
        <p className="text-xs text-gray-500 mt-1">Our consultant will call you within 15 minutes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full max-h-[350px] overflow-y-auto pr-1" noValidate>
      <p className="text-[11px] text-gray-500 mb-1">Fill in details for direct builder catalog & callback ⚡</p>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="chat-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
        <div className="relative">
          <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="chat-name" type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
            placeholder="Your full name"
            className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.name ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
          />
        </div>
        {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chat-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number *</label>
        <div className="flex">
          <span className="flex items-center px-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-[11px] font-bold text-gray-600">+91</span>
          <div className="relative flex-1">
            <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="chat-phone" type="tel" value={phone} maxLength={10} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErrors(p => ({ ...p, phone: "" })); }}
              placeholder="10-digit number"
              className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-r-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.phone ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
            />
          </div>
        </div>
        {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chat-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
        <div className="relative">
          <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="chat-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chat-interest" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">I&apos;m looking for</label>
        <select id="chat-interest" value={interest} onChange={(e) => setInterest(e.target.value)}
          className="w-full px-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 font-medium text-gray-700 cursor-pointer">
          <option>Residential Property</option>
          <option>Commercial Property</option>
          <option>Investment / ROI</option>
          <option>Home Loan Help</option>
          <option>Free Site Visit</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chat-budget" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Budget</label>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">₹</span>
          <input id="chat-budget" type="text" value={budget} onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 80L - 1.2 Cr"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chat-location" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preferred Location</label>
        <div className="relative">
          <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="chat-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Baner, Tathawade"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="chat-type" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
          <div className="relative">
            <Home size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="chat-type" type="text" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
              placeholder="e.g. 2BHK"
              className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="chat-possession" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Possession</label>
          <div className="relative">
            <Clock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="chat-possession" type="text" value={possession} onChange={(e) => setPossession(e.target.value)}
              placeholder="e.g. Ready / 1 Yr"
              className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
            />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={!submitting ? { scale: 1.02 } : {}}
        whileTap={!submitting ? { scale: 0.97 } : {}}
        className={`w-full py-2.5 text-white text-[12px] font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1 touch-manipulation ${
          submitting
            ? "bg-green-400 cursor-not-allowed"
            : "bg-[#25D366] hover:bg-[#20ba59] shadow-green-500/20"
        }`}
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <MessageCircle size={13} fill="currentColor" />
            <span>Send details</span>
            <ChevronRight size={12} />
          </>
        )}
      </motion.button>
      <p className="text-[9px] text-gray-400 text-center">🔒 Secure direct builder registration.</p>
    </form>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MODULE-LEVEL CONSTANTS
────────────────────────────────────────────────────────────────────────── */
const BOT_REPLY_DELAY_MS = 1050;

/* ──────────────────────────────────────────────────────────────────────────
   Framer-motion variants
────────────────────────────────────────────────────────────────────────── */
const windowV = {
  hidden: { opacity: 0, scale: 0.88, y: 24, transformOrigin: "bottom right" },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 } },
  exit: { opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
};
const mobileWindowV = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 32 } },
  exit: { opacity: 0, y: "100%", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
};
const nudgeV = {
  hidden: { opacity: 0, x: 32, scale: 0.86 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 270, damping: 22 } },
  exit: { opacity: 0, x: 18, scale: 0.9, transition: { duration: 0.16, ease: "easeIn" } },
};
const bubbleV = {
  hidden: (s) => ({ opacity: 0, x: s === "agent" ? -16 : 16, y: 6, scale: 0.94 }),
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 28 } },
};
const chipRowV = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.15 } },
};
const typingV = {
  hidden: { opacity: 0, y: 8, scale: 0.88 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 24 } },
  exit: { opacity: 0, y: 4, scale: 0.9, transition: { duration: 0.14 } },
};

/* ──────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────── */
export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showNudge, setShowNudge] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [viewportHeight, setViewportHeight] = useState("100dvh");

  const getNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const phoneNumber = "917620733613";

  // Listen for focus/trigger from homepage AI search bar
  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener("open-ai-search", handleTrigger);
    return () => window.removeEventListener("open-ai-search", handleTrigger);
  }, []);

  const parseBold = (text = "") => {
    // Matches both **bold** and *bold*
    const parts = text.split(/(\*\*?[^*]+\*\*?)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-indigo-600">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <strong key={i} className="font-extrabold text-indigo-650">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  const parseMarkdown = (text = "") => {
    return text.split("\n").map((line, idx) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={idx} className="text-[13px] font-bold text-indigo-650 mt-2.5 mb-1">{trimmed.replace("###", "").trim()}</h3>;
      }
      if (trimmed.startsWith("##")) {
        return <h2 key={idx} className="text-sm font-extrabold text-indigo-800 mt-3 mb-1.5">{trimmed.replace("##", "").trim()}</h2>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(1).trim();
        return (
          <li key={idx} className="ml-3 list-disc text-gray-700 text-[13px] leading-relaxed pl-0.5 my-0.5">
            {parseBold(content)}
          </li>
        );
      }
      return trimmed ? (
        <div key={idx} className="text-[13px] text-gray-850 leading-relaxed my-1">
          {parseBold(trimmed)}
        </div>
      ) : (
        <div key={idx} className="h-1" />
      );
    });
  };

  const [isEscalated, setIsEscalated] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-IN";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(prev => (prev ? prev + " " + transcript : transcript));
        };

        rec.onerror = (err) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cancelSpeech();
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isOpen, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      cancelSpeech(); // stop any reading before listening
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Failed to start speech recognition:", err);
      }
    }
  };

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "agent",
      text: "Namaste! 🙏 I'm **Vision**, your Senior AI Property Advisor at EusRealty.\n\nWith over 25 years of experience in Pune's real estate market, I'm here to help you navigate your options, check verified RERA details, analyze investments, and find direct-builder deals with **0% brokerage**.\n\nTell me, are you looking for a premium home to live in, or a high-yield investment property?",
      time: getNow(),
      chips: ["🏠 Looking for a home", "📈 Investment property", "🗓️ Book site visit", "📋 Request callback"],
    },
  ]);

  const widgetRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const nudgeTimerRef = useRef(null);
  const nudgeDismissTimerRef = useRef(null);
  const idleTimerRef = useRef(null);

  /* ── Detect screen size, load session and history ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    // Initialize/Get Session ID
    let sid = localStorage.getItem("eusrealty_chat_session_id");
    if (!sid) {
      sid = "sid_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("eusrealty_chat_session_id", sid);
    }
    setSessionId(sid);

    // Sync session and history from database
    const syncSession = async () => {
      if (!sid) return;
      try {
        const res = await fetch(`/api/chat?sessionId=${sid}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'Escalated' || data.status === 'Waiting for Sales Consultant') {
            setIsEscalated(true);
          }
          if (data.messages && data.messages.length > 0) {
            const mapped = data.messages.map((m, i) => ({
              id: `msg-${i}-${Date.now()}`,
              sender: m.role === 'user' ? 'user' : 'agent',
              text: m.content,
              time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getNow(),
              matches: m.matches || [],
              tgActionMsg: m.tgActionMsg || null,
              waActionMsg: m.waActionMsg || null
            }));
            setMessages(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to sync session from DB on mount:", err);
      }
    };
    syncSession();

    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Visual Viewport resize handler for mobile keyboard behavior ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateViewportHeight = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      } else {
        setViewportHeight(`${window.innerHeight}px`);
      }
    };

    updateViewportHeight();
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateViewportHeight);
    } else {
      window.addEventListener("resize", updateViewportHeight);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateViewportHeight);
      } else {
        window.removeEventListener("resize", updateViewportHeight);
      }
    };
  }, []);

  /* ── Save chat history to localstorage when messages update ── */
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("eusrealty_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  /* ── Background polling when chat is escalated ── */
  useEffect(() => {
    if (!isOpen || !isEscalated || !sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            if (data.messages.length > messages.length) {
              const mapped = data.messages.map((m, i) => ({
                id: `msg-${i}-${Date.now()}`,
                sender: m.role === 'user' ? 'user' : 'agent',
                text: m.content,
                time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getNow(),
                matches: m.matches || [],
                tgActionMsg: m.tgActionMsg || null,
                waActionMsg: m.waActionMsg || null
              }));
              setMessages(mapped);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to poll escalated chat updates:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isEscalated, sessionId, messages.length]);

  /* ── Lock body scroll when mobile chat is open ── */
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  /* ── Nudge logic (desktop only) ── */
  const showNudgeTemporarily = useCallback(() => {
    if (isOpen) return;
    setShowNudge(true);
    clearTimeout(nudgeDismissTimerRef.current);
    nudgeDismissTimerRef.current = setTimeout(() => {
      setShowNudge(false);
    }, 6000);
  }, [isOpen]);

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!isOpen) showNudgeTemporarily();
    }, 30000);
  }, [isOpen, showNudgeTemporarily]);

  useEffect(() => {
    if (isMobile) return;

    nudgeTimerRef.current = setTimeout(() => {
      if (!isOpen) showNudgeTemporarily();
    }, 4500);

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);

    return () => {
      clearTimeout(nudgeTimerRef.current);
      clearTimeout(nudgeDismissTimerRef.current);
      clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
    };
  }, [isMobile, isOpen, showNudgeTemporarily, resetIdleTimer]);

  /* ── Close on outside click (desktop only) ── */
  useEffect(() => {
    if (isMobile) return;
    const handleOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, isMobile]);

  /* ── Focus input & clear unread on open ── */
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowNudge(false);
      clearTimeout(nudgeDismissTimerRef.current);
      setTimeout(() => inputRef.current?.focus(), 420);
    }
  }, [isOpen]);

  /* ── Smooth scroll to bottom on new message ── */
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleFocus = () => {
    // Scroll chat body to bottom when input is focused, after keyboard layout changes
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 150);
  };

  /* ── Bot reply ── */
  const botReply = (text, waMsg, chips, tgMsg) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `agent-${Date.now()}`, sender: "agent", text, time: getNow(), waActionMsg: waMsg, tgActionMsg: tgMsg, chips },
      ]);
      if (isSpeechEnabled) {
        speakText(text);
      }
    }, BOT_REPLY_DELAY_MS);
  };

  const showLeadForm = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `form-${Date.now()}`, sender: "agent", type: "lead_form", time: getNow() },
      ]);
    }, 700);
  };

  const handleLeadSubmitted = (name) => {
    setTimeout(() => {
      botReply(
        `Thanks ${name}! 🎉 Our senior consultant will call you within 15 minutes.\n\nFeel free to ask me anything else!`,
        null,
        ["🏢 Explore projects", "💰 View pricing", "🗓️ Book a site visit"]
      );
    }, 1200);
  };

  const handleChipClick = async (chip) => {
    if (isTyping) return;
    
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: chip, time: getNow() },
    ]);

    const label = chip.replace(/^[^\w\s]+\s*/, "").toLowerCase();
    if (label.includes("callback") || label.includes("request")) {
      showLeadForm(); 
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chip,
          sessionId: sessionId,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        if (data.isEscalated || data.isHandoverRequested) {
          setIsEscalated(true);
        }
        setMessages((prev) => [
          ...prev,
          { 
            id: `agent-${Date.now()}`, 
            sender: "agent", 
            text: data.reply, 
            time: getNow(), 
            waActionMsg: null,
            tgActionMsg: data.isTelegramHandover ? (data.telegramUsername || "EUSRealty_Bot") : null,
            chips: data.chips || [],
            matches: data.matches || []
          },
        ]);
        if (isSpeechEnabled) {
          speakText(data.reply);
        }
        return;
      }
      throw new Error("API call failed");
    } catch (err) {
      console.warn("API Chat failed on chip click, using local intents:", err);
      setIsTyping(false);
      const match = getSmartReply(chip);
      if (match) {
        if (match.action === "show_lead_form") { showLeadForm(); return; }
        botReply(match.answer, match.waMsg, match.chips, match.tgMsg);
      } else {
        botReply("Great choice! 😊 Let me connect you with our team on WhatsApp for that.", chip, null);
      }
    }
  };

  const handleSend = async () => {
    const finalMsg = message.trim();
    if (!finalMsg) return;
    setMessage("");
    
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: finalMsg, time: getNow() },
    ]);
    
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalMsg,
          sessionId: sessionId,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        if (data.isEscalated || data.isHandoverRequested) {
          setIsEscalated(true);
        }
        setMessages((prev) => [
          ...prev,
          { 
            id: `agent-${Date.now()}`, 
            sender: "agent", 
            text: data.reply, 
            time: getNow(), 
            waActionMsg: null,
            tgActionMsg: data.isTelegramHandover ? (data.telegramUsername || "EUSRealty_Bot") : null,
            chips: data.chips || [],
            matches: data.matches || []
          },
        ]);
        if (isSpeechEnabled) {
          speakText(data.reply);
        }
        return;
      }
      throw new Error("API call failed");
    } catch (err) {
      console.warn("API Chat failed on message send, using local intents:", err);
      setIsTyping(false);
      
      const match = getSmartReply(finalMsg);
      if (match) {
        if (match.action === "show_lead_form") { showLeadForm(); return; }
        botReply(match.answer, match.waMsg, match.chips, match.tgMsg);
      } else {
        botReply(
          "That's a great question! 😊 I'm connecting you with one of our senior property consultants on WhatsApp who can give you a detailed answer.",
          finalMsg,
          null
        );
      }
    }
  };

  const handleWaAction = (waMsg) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMsg)}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleTgAction = (tgUsername) => {
    const cleanUsername = tgUsername.replace(/^@/, "");
    const url = cleanUsername ? `https://t.me/${cleanUsername}` : `https://t.me/EUSRealty_Bot`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  /* ── Chat window inner content ── */
  const ChatWindowContent = () => (
    <>
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white px-4 py-3.5 flex items-center justify-between flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.1),transparent_60%)]" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-indigo-400/40 shadow-lg overflow-hidden ring-2 ring-emerald-400/20">
              <Image src="/logo.svg" alt="EusRealty" width={30} height={30} className="object-contain" />
            </div>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0f172a]"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </motion.span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-[13px] tracking-tight text-white">Vision ✦ AI Advisor</h4>
              <span className="flex items-center gap-0.5 bg-indigo-500/30 border border-indigo-400/30 px-1.5 py-0.5 rounded-full">
                <Sparkles size={8} className="text-indigo-300" />
                <span className="text-[9px] text-indigo-300 font-bold tracking-wider">AI</span>
              </span>
            </div>
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div key="typ" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.span key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d, ease: "easeInOut" }}
                        className="w-1 h-1 rounded-full bg-emerald-300 inline-block" />
                    ))}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-medium">typing...</span>
                </motion.div>
              ) : (
                <motion.p key="onl" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}
                  className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  EusRealty AI Advisor · Online now
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 transition-all p-1.5 rounded-full z-10 touch-manipulation">
          <X size={18} />
        </button>
      </div>

      {/* ── Chat Body ── */}
      <div
        ref={chatBodyRef}
        className="wa-body flex-1 min-h-0 px-3 sm:px-4 py-3 flex flex-col gap-3 overflow-y-auto overscroll-contain"
        style={{
          background: "linear-gradient(180deg,#f8fafc 0%,#f0f4f8 100%)",
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        <style>{`.wa-body::-webkit-scrollbar{display:none!important}`}</style>

        <div className="self-center bg-white/80 backdrop-blur text-gray-400 text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-widest shadow-sm border border-gray-200/60 flex items-center gap-1.5">
          <span>🔒</span> End-to-End Encrypted
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              custom={msg.sender}
              variants={bubbleV}
              initial="hidden"
              animate="visible"
              className={`flex flex-col gap-2 ${msg.sender === "agent" ? "self-start items-start max-w-[90%] sm:max-w-[92%]" : "self-end items-end max-w-[82%] sm:max-w-[85%]"}`}
            >
              {/* Lead form bubble */}
              {msg.type === "lead_form" ? (
                <div className="bg-white rounded-2xl rounded-tl-none shadow-md border border-gray-100 p-3 sm:p-4 w-full max-w-[290px] sm:max-w-[300px]">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={13} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-800">Direct Builder Registration</p>
                      <p className="text-[10px] text-gray-400">Request catalog & callback</p>
                    </div>
                  </div>
                  <LeadFormCard phoneNumber={phoneNumber} onSubmitted={handleLeadSubmitted} sessionId={sessionId} />
                  <div className="flex justify-end mt-2">
                    <span className="text-[9px] text-gray-400">{msg.time}</span>
                  </div>
                </div>
              ) : (
                /* Normal bubble */
                <div
                  className={`px-3.5 py-2.5 rounded-2xl shadow-sm flex flex-col gap-1.5 ${msg.sender === "agent"
                    ? "bg-white rounded-tl-none text-gray-800 border border-gray-100"
                    : "bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none border border-indigo-500/20"
                    }`}
                >
                  {msg.sender === "agent" ? (
                    <div className="space-y-0.5">{parseMarkdown(msg.text)}</div>
                  ) : (
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                  )}

                  {msg.waActionMsg && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleWaAction(msg.waActionMsg)}
                      className="mt-1 w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation">
                      <MessageCircle size={12} fill="currentColor" />
                      Continue on WhatsApp
                    </motion.button>
                  )}

                  {msg.tgActionMsg && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleTgAction(msg.tgActionMsg)}
                      className="mt-1 w-full py-1.5 px-3 bg-[#0088cc] hover:bg-[#0077b5] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation">
                      <Send size={12} className="rotate-45" />
                      Continue on Telegram
                    </motion.button>
                  )}

                  {/* Matching properties horizontal list/slider */}
                  {msg.sender === "agent" && msg.matches && msg.matches.length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100/80 w-full">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500 animate-pulse" />
                        Matched Projects ({msg.matches.length})
                      </p>
                      <div 
                        className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x scrollbar-thin scrollbar-thumb-indigo-100 max-w-[280px] sm:max-w-[310px] overscroll-contain"
                        style={{
                          msOverflowStyle: "auto",
                          scrollbarWidth: "thin",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        {msg.matches.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="w-[230px] shrink-0 snap-start scale-[0.98] hover:scale-100 transition-all duration-300 relative"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <PropertyCard
                              id={item._id}
                              title={item.name}
                              location={item.location}
                              price={item.price}
                              bhk={item.bhk}
                              baths={item.baths}
                              area={item.area}
                              image={item.image}
                              badge={item.badge}
                              rera={item.rera}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center gap-1 ${msg.sender === "agent" ? "justify-start" : "justify-end"}`}>
                    <span className={`text-[9px] ${msg.sender === "agent" ? "text-gray-400" : "text-indigo-200"}`}>{msg.time}</span>
                    {msg.sender === "user" && <CheckCheck size={11} className="text-indigo-200" />}
                  </div>
                </div>
              )}

              {/* Smart chips below agent message */}
              {msg.sender === "agent" && msg.chips && msg.chips.length > 0 && (
                <motion.div
                  variants={chipRowV}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-1.5 max-w-full"
                >
                  {msg.chips.map((chip, ci) => (
                    <motion.button
                      key={ci}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleChipClick(chip)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 shadow-sm transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div key="typing" variants={typingV} initial="hidden" animate="visible" exit="exit"
              className="self-start bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1.5">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span key={i} animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity, delay, ease: "easeInOut" }}
                  className="w-2 h-2 bg-gray-300 rounded-full block" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-2.5 safe-area-inset-bottom">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
          {/* Speaker Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const next = !isSpeechEnabled;
              setIsSpeechEnabled(next);
              if (!next) cancelSpeech();
            }}
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
              isSpeechEnabled 
                ? "bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100" 
                : "bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100"
            }`}
            title={isSpeechEnabled ? "Mute AI Voice" : "Enable AI Voice"}
          >
            {isSpeechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Microphone Dictation Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
              isListening 
                ? "bg-rose-50 border border-rose-200 text-rose-500 animate-pulse hover:bg-rose-100" 
                : "bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100"
            }`}
            title={isListening ? "Stop Voice Typing" : "Dictate Message"}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFocus}
            placeholder="Ask Vision anything…"
            className="flex-1 py-2.5 px-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none text-[13px] text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
            style={{ fontSize: "16px" }}
          />
          <motion.button
            type="submit"
            disabled={!message.trim()}
            whileHover={message.trim() ? { scale: 1.12 } : {}}
            whileTap={message.trim() ? { scale: 0.88 } : {}}
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 touch-manipulation ${message.trim()
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Send size={15} />
          </motion.button>
        </form>
        <p className="text-[9px] text-gray-400 text-center mt-1.5">Powered by EusRealty AI · Vision</p>
      </div>
    </>
  );

  return (
    <>
      {/* ════════════════════════════════════
          MOBILE: Full-screen overlay
      ════════════════════════════════════ */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="mobile-chat"
            variants={mobileWindowV}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] bg-white flex flex-col overscroll-none"
            style={{ 
              height: viewportHeight,
              top: 0,
              bottom: 0,
              paddingBottom: "env(safe-area-inset-bottom)" 
            }}
          >
            {ChatWindowContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          FAB + Desktop panel (always rendered)
      ════════════════════════════════════ */}
      <div
        ref={widgetRef}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9998] font-sans select-text"
      >
        <AnimatePresence mode="sync">

          {/* ── Nudge (desktop only, no mobile) ── */}
          {!isMobile && showNudge && !isOpen && (
            <motion.div
              key="nudge"
              variants={nudgeV}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setIsOpen(true)}
              className="absolute bottom-[76px] right-2 mb-1 w-64 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-800 cursor-pointer flex flex-col gap-1 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                EUS Realty AI · ONLINE NOW
              </div>
              <p className="text-gray-200 mt-1 text-xs leading-snug">Looking for a dream home in Pune? Chat with our AI now! 🏠</p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-gray-800" />
            </motion.div>
          )}

          {/* ── Chat window (desktop / tablet) ── */}
          {!isMobile && isOpen && (
            <motion.div
              key="chat-window"
              variants={windowV}
              initial="hidden" animate="visible" exit="exit"
              className="absolute bottom-[76px] right-0 mb-1 bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.22)] border border-gray-100/80 overflow-hidden flex flex-col"
              style={{
                width: "min(370px, calc(100vw - 28px))",
                height: "min(580px, calc(100dvh - 110px))",
              }}
            >
              {ChatWindowContent()}
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── FAB Button ── */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.87 }}
          transition={{ type: "spring", stiffness: 420, damping: 20 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white z-50 shadow-2xl cursor-pointer transition-colors duration-300 touch-manipulation ${isOpen ? "bg-gray-900 hover:bg-gray-800" : "bg-[#25D366] hover:bg-[#22c35e]"}`}
          aria-label="Chat with EusRealty"
        >
          {!isOpen && (
            <>
              <motion.span className="absolute inset-0 rounded-full bg-[#25D366]"
                animate={{ scale: [1, 1.65], opacity: [0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
              <motion.span className="absolute inset-0 rounded-full bg-[#25D366]"
                animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.75 }} />
            </>
          )}
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 528, damping: 22 }}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
              {unreadCount}
            </motion.span>
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="wa"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="27" height="27" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.806-9.8.001-2.621-1.02-5.086-2.875-6.942C16.35 1.995 13.9 .976 11.278.976c-5.41 0-9.81 4.403-9.813 9.802-.001 1.702.461 3.366 1.39 4.811l-.997 3.637 3.737-.98c1.357.741 2.822 1.13 4.152 1.128zm10.978-7.751c-.302-.152-1.793-.883-2.07-.982-.277-.101-.48-.152-.68.152-.2.302-.776.982-.951 1.182-.175.201-.35.226-.652.076-.302-.15-1.274-.469-2.427-1.496-.897-.8-1.502-1.787-1.678-2.088-.175-.302-.019-.465.132-.615.136-.135.302-.35.453-.526.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.68-1.634-.932-2.238-.245-.589-.493-.51-.68-.52-.175-.01-.377-.01-.579-.01-.201 0-.529.075-.804.378-.277.302-1.058 1.031-1.058 2.516s1.08 2.972 1.23 3.174c.151.2 2.126 3.245 5.15 4.554.719.311 1.28.497 1.719.637.722.229 1.38.197 1.9.12.58-.087 1.794-.733 2.046-1.437.252-.704.252-1.307.176-1.437-.077-.13-.277-.201-.579-.352z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}

