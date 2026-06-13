// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   X, Send, CheckCheck, MessageCircle, User, Phone, 
//   ChevronRight, Sparkles, Mail, MapPin, Home, Clock
// } from "lucide-react";

// /* ──────────────────────────────────────────────────────
//    INTENTS: keyword → smart bot reply (Fallback Mode)
// ────────────────────────────────────────────────────── */
// const INTENTS = [
//   {
//     id: "greet",
//     keywords: ["hi", "hello", "hey", "namaste", "hii", "helo", "howdy", "good morning", "good evening", "good afternoon", "start"],
//     answer: "Hello! 😊 Great to connect with you. I'm Vision, your EusRealty AI assistant.\n\nI can help you explore properties, check prices, arrange site visits, or connect you with our team. What would you like to do?",
//     chips: ["🏢 Show me properties", "💰 What's the pricing?", "🗓️ Book a site visit", "📋 Request a callback"],
//     waMsg: null,
//   },
//   {
//     id: "thanks",
//     keywords: ["thank", "thanks", "thankyou", "great", "awesome", "nice", "perfect", "wonderful", "brilliant", "good"],
//     answer: "You're very welcome! 🙏 I'm always here to help. Is there anything else you'd like to know about our properties or services?",
//     chips: ["🏢 View listings", "📋 Get a callback", "📞 Contact our team"],
//     waMsg: null,
//   },
//   {
//     id: "bye",
//     keywords: ["bye", "goodbye", "see you", "later", "ok bye", "cya", "done"],
//     answer: "Goodbye! 👋 Have a wonderful day. Feel free to come back anytime — we're always here at EusRealty!\n\n📞 +91 7620733613",
//     chips: null,
//     waMsg: null,
//   },
//   {
//     id: "callback",
//     keywords: ["callback", "call back", "call me", "contact me", "reach me", "get in touch", "enquire", "enquiry", "inquiry", "form", "register"],
//     answer: null,
//     action: "show_lead_form",
//   },
//   {
//     id: "price",
//     keywords: ["price", "cost", "rate", "budget", "affordable", "cheap", "expensive", "₹", "lakh", "crore", "how much", "pricing", "cost of"],
//     answer: "💰 Our properties are priced to suit every budget:\n\n🏠 2BHK Apartments: ₹85 Lakhs – ₹1.8 Cr\n🏡 3BHK Luxury: ₹1.8 Cr – ₹4.5 Cr\n🌴 Villas & Bungalows: ₹4.5 Cr – ₹8.9 Cr\n🏢 Commercial: ₹45 Lakhs onwards\n\nFlexible payment plans & builder subventions available!",
//     chips: ["📋 Get price sheet", "🏦 Home loan help", "🗓️ Book site visit"],
//     waMsg: "Hi, please send the detailed pricing sheet and payment plans for your properties.",
//   },
//   {
//     id: "projects",
//     keywords: ["project", "property", "flat", "apartment", "villa", "house", "bhk", "studio", "listing", "new launch", "available", "show me", "properties"],
//     answer: "🏢 Here are our featured premium projects:\n\n⭐ Eus Heights — Tathawade (2 & 3 BHK)\n⭐ Skyline Villas — Balewadi (3 & 4 BHK)\n⭐ Juhu Oasis — Baner (Studio to 3 BHK)\n⭐ Green Valley — Hinjewadi (2 & 3 BHK)\n\nAll are RERA registered with 0% brokerage!",
//     chips: ["💰 Check prices", "🗓️ Book a visit", "📋 Get full catalog"],
//     waMsg: "Hi, I'd like to explore your latest premium property listings and get the full catalog.",
//   },
//   {
//     id: "brokerage",
//     keywords: ["brokerage", "commission", "fee", "zero brokerage", "0%", "no charge", "middleman", "charges", "hidden"],
//     answer: "🤝 Absolutely — EusRealty is 100% zero brokerage!\n\nWe connect you directly with top builders & developers, cutting out the middleman entirely.\n\n💰 You save ₹2 – ₹10 Lakhs in commission fees that you'd otherwise pay to traditional agents.",
//     chips: ["🏢 Explore projects", "📋 Talk to our team", "💰 View pricing"],
//     waMsg: "Hi, I want to buy a property with 0% brokerage directly from the builder.",
//   },
//   {
//     id: "contact",
//     keywords: ["contact", "call", "email", "phone", "reach", "number", "address", "office", "support", "helpline", "speak"],
//     answer: "📞 Reach us anytime:\n\n📱 +91 7620733613\n📧 eliteuniqueservices@gmail.com\n📍 Corporate Office, Tathawade, Pune\n\n🕐 Available: Tue–Sun, 10 AM – 7 PM\n\nOr tap below to connect instantly on WhatsApp!",
//     chips: ["📋 Request a callback", "🗓️ Book site visit"],
//     waMsg: "Hi, I'd like to speak with a senior real estate consultant from EusRealty.",
//   },
//   {
//     id: "loan",
//     keywords: ["loan", "emi", "finance", "bank", "mortgage", "home loan", "interest rate", "down payment", "subsidy", "pmay", "financing"],
//     answer: "🏦 We make home loans easy:\n\n✅ Tie-ups with 15+ banks & NBFCs\n✅ Pre-approved loans in 24 hours\n✅ EMI starting at just ₹55,000/month\n✅ PMAY subsidy up to ₹2.67 Lakhs\n✅ 90% financing on select projects\n\nWant a free eligibility check?",
//     chips: ["📋 Get loan assistance", "💰 See property prices", "🗓️ Book site visit"],
//     waMsg: "Hi, I need help with home loan assistance, EMI calculation, and pre-approval.",
//   },
//   {
//     id: "visit",
//     keywords: ["visit", "site visit", "tour", "show flat", "schedule", "appointment", "demo", "book", "viewing", "come", "see"],
//     answer: "🗓️ We'd love to arrange a free site visit!\n\n✅ Available 7 days a week\n✅ Complimentary pickup & drop\n✅ Dedicated property consultant\n✅ Virtual 3D tours also available\n\nShare your preferred date on WhatsApp and we'll confirm within minutes!",
//     chips: ["📅 Schedule on WhatsApp", "📋 Request a callback"],
//     waMsg: "Hi, I'd like to schedule a free site visit. Please share available time slots.",
//   },
//   {
//     id: "location",
//     keywords: ["location", "area", "where", "pune", "hinjewadi", "baner", "balewadi", "tathawade", "wakad", "pimple", "sus", "kothrud", "nibm", "hadapsar", "near"],
//     answer: "📍 Properties in Pune's best micro-markets:\n\n🔵 IT Corridor: Hinjewadi, Wakad (₹85L+)\n🟢 Premium West: Baner, Balewadi, Sus (₹1.2Cr+)\n🟡 Value: Tathawade, Pimple Saudagar (₹75L+)\n🔴 South Pune: Hadapsar, NIBM (₹90L+)\n\nWhich area are you most interested in?",
//     chips: ["🏢 See Baner projects", "🏢 See Hinjewadi projects", "💰 Compare prices by area"],
//     waMsg: "Hi, I want to explore properties in a specific area of Pune. Please share options.",
//   },
//   {
//     id: "invest",
//     keywords: ["invest", "investment", "roi", "rental", "return", "commercial", "shop", "office space", "plot", "land", "yield", "appreciation"],
//     answer: "📈 Pune is one of India's top investment destinations!\n\n💹 8–12% annual price appreciation\n🏪 Commercial: 6–9% rental yield\n🏠 Residential: 4–6% rental income\n🚀 Pre-launch: 30–40% potential gain\n\nOur investment advisors can help you pick the highest ROI property!",
//     chips: ["📋 Get investment advice", "🏢 Commercial properties", "💰 Pre-launch projects"],
//     waMsg: "Hi, I'm interested in real estate investment opportunities in Pune for maximum ROI.",
//   },
//   {
//     id: "ready",
//     keywords: ["ready to move", "possession", "delivery", "handover", "immediate", "move in", "occupancy"],
//     answer: "🏠 We have both ready-to-move and under-construction options!\n\n✅ Ready-to-move\n  • Immediate possession\n  • No GST payable\n  • What you see is what you get\n\n🏗️ Under-construction\n  • Lower entry price\n  • Higher appreciation potential\n  • Customisation options\n\nAll are RERA registered! 🔒",
//     chips: ["🏢 Show ready-to-move", "💰 Compare prices", "🗓️ Book a visit"],
//     waMsg: "Hi, I'm looking for ready-to-move properties. Please share available options.",
//   },
//   {
//     id: "legal",
//     keywords: ["rera", "legal", "document", "agreement", "registration", "stamp duty", "safe", "trust", "verified", "fraud", "genuine"],
//     answer: "⚖️ 100% safe to invest with EusRealty!\n\n🛡️ All projects RERA registered & verified\n📄 Complete legal documentation support\n✍️ Sale agreement & stamp duty guidance\n🔍 Title search & due diligence help\n💯 Fully transparent transactions\n\nYour investment is in safe hands! 🔒",
//     chips: ["📋 Speak to legal team", "🏢 View verified projects"],
//     waMsg: "Hi, I'd like to know about the legal process, documents required, and RERA verification.",
//   },
// ];

// function getSmartReply(text) {
//   const lower = text.toLowerCase().trim();
//   for (const intent of INTENTS) {
//     if (intent.keywords.some((kw) => lower.includes(kw))) return intent;
//   }
//   return null;
// }

// /* ──────────────────────────────────────────────────────
//    VOICE CONGRATULATION  (Web Speech API)
// ────────────────────────────────────────────────────── */
// // const currentSpeechController = {
// //   active: false,
// //   cancel: function() {
// //     this.active = false;
// //     if (typeof window !== 'undefined' && window.speechSynthesis) {
// //       window.speechSynthesis.cancel();
// //     }
// //   }
// // };

// // function speakCongratulation(name) {
// //   if (typeof window === 'undefined' || !window.speechSynthesis) return;

// //   try {
// //     currentSpeechController.cancel();
// //     currentSpeechController.active = true;

// //     const firstName = name?.trim().split(' ')[0] || 'there';

// //     const doSpeak = () => {
// //       if (!currentSpeechController.active) return;
// //       const voices = window.speechSynthesis.getVoices();

// //       const preferred = [
// //         'Microsoft Neerja Online (Natural) - English (India)',
// //         'Microsoft Heera Online (Natural) - English (India)',
// //         'Google हिन्दी',
// //         'Google Hindi',
// //         'Microsoft Hemant - Hindi (India)',
// //         'Microsoft Kalpana - Hindi (India)',
// //         'Lekha',
// //         'Veena',
// //         'Microsoft Heera',
// //         'Microsoft Neerja',
// //         'Google en-IN',
// //         'Google UK English Female',
// //         'Microsoft Zira Desktop',
// //         'Samantha',
// //       ];

// //       let chosenVoice = null;
// //       for (const pref of preferred) {
// //         chosenVoice = voices.find(v => v.name === pref || v.name.includes(pref));
// //         if (chosenVoice) break;
// //       }

// //       if (!chosenVoice) {
// //         chosenVoice = voices.find(v =>
// //           v.lang === 'hi-IN' || v.lang.startsWith('hi') ||
// //           v.lang === 'en-IN' ||
// //           v.name.toLowerCase().includes('hindi') ||
// //           v.name.toLowerCase().includes('neerja') ||
// //           v.name.toLowerCase().includes('heera') ||
// //           v.name.toLowerCase().includes('lekha') ||
// //           v.name.toLowerCase().includes('kalpana')
// //         );
// //       }

// //       if (!chosenVoice) {
// //         chosenVoice = voices.find(v =>
// //           v.name.toLowerCase().includes('female') ||
// //           v.name.toLowerCase().includes('zira') ||
// //           v.name.toLowerCase().includes('samantha') ||
// //           v.name.toLowerCase().includes('google uk english female')
// //         );
// //       }

// //       const isHindi = chosenVoice && (
// //         chosenVoice.lang.startsWith('hi') ||
// //         chosenVoice.name.toLowerCase().includes('hindi')
// //       );

// //       const sentences = isHindi ? [
// //         `Bahut bahut badhai ho, ${firstName}!`,
// //         `Aap apne sapno ke ghar ke ek kadam aur paas aa gaye hain.`,
// //         `Hamare senior consultant aapko call karenge agle pandrah minute mein.`,
// //         `EUS Realty parivar mein aapka swagat hai.`
// //       ] : [
// //         `Congratulations, ${firstName}!`,
// //         `You are one step closer to your dream home.`,
// //         `Our senior consultant will call you personally within the next fifteen minutes.`,
// //         `Welcome to the E-U-S Realty family.`
// //       ];

// //       const lang = isHindi ? 'hi-IN' : (chosenVoice?.lang || 'en-IN');
// //       let index = 0;

// //       const speakNext = () => {
// //         if (!currentSpeechController.active) return;
// //         if (index >= sentences.length) return;

// //         const utter = new SpeechSynthesisUtterance(sentences[index]);
// //         utter.rate = isHindi ? 0.85 : 0.9;
// //         utter.pitch = 1.05;
// //         utter.volume = 1;
// //         utter.lang = lang;
// //         if (chosenVoice) utter.voice = chosenVoice;

// //         utter.onend = () => {
// //           if (!currentSpeechController.active) return;
// //           setTimeout(() => {
// //             if (!currentSpeechController.active) return;
// //             index++;
// //             speakNext();
// //           }, 600);
// //         };

// //         utter.onerror = () => {
// //           if (!currentSpeechController.active) return;
// //           index++;
// //           speakNext();
// //         };

// //         window.speechSynthesis.speak(utter);
// //       };

// //       speakNext();
// //     };

// //     const voices = window.speechSynthesis.getVoices();
// //     if (voices.length > 0) {
// //       doSpeak();
// //     } else {
// //       const onVoicesLoaded = () => {
// //         window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
// //         doSpeak();
// //       };
// //       window.speechSynthesis.addEventListener('voiceschanged', onVoicesLoaded);
// //       setTimeout(() => {
// //         window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
// //         doSpeak();
// //       }, 1500);
// //     }
// //   } catch (err) {
// //     console.error('Error in speakCongratulation:', err);
// //   }
// // }
// const currentSpeechController = {
//   active: false,
//   cancel: function () {
//     this.active = false;
//     if (typeof window !== "undefined" && window.speechSynthesis) {
//       window.speechSynthesis.cancel();
//     }
//   },
// };

// function speakCongratulation(name) {
//   if (typeof window === "undefined" || !window.speechSynthesis) return;

//   try {
//     currentSpeechController.cancel();
//     currentSpeechController.active = true;

//     const firstName = name?.trim().split(" ")[0] || "there";

//     const doSpeak = () => {
//       if (!currentSpeechController.active) return;
//       const voices = window.speechSynthesis.getVoices();

//       const preferredNames = [
//         "Microsoft Neerja Online (Natural) - English (India)",
//         "Microsoft Heera Online (Natural) - English (India)",
//         "Google हिन्दी",
//         "Google Hindi",
//         "Microsoft Hemant - Hindi (India)",
//         "Microsoft Kalpana - Hindi (India)",
//         "Lekha",
//         "Veena",
//         "Microsoft Heera",
//         "Microsoft Neerja",
//         "Google en-IN",
//         "Google UK English Female",
//         "Microsoft Zira Desktop",
//         "Samantha",
//       ];

//       let chosenVoice = null;
//       for (const pref of preferredNames) {
//         chosenVoice = voices.find(
//           (v) => v.name === pref || v.name.includes(pref)
//         );
//         if (chosenVoice) break;
//       }
//       if (!chosenVoice) {
//         chosenVoice = voices.find(
//           (v) =>
//             v.lang === "hi-IN" ||
//             v.lang.startsWith("hi") ||
//             v.lang === "en-IN" ||
//             v.name.toLowerCase().includes("hindi") ||
//             v.name.toLowerCase().includes("neerja") ||
//             v.name.toLowerCase().includes("heera") ||
//             v.name.toLowerCase().includes("lekha") ||
//             v.name.toLowerCase().includes("kalpana")
//         );
//       }
//       if (!chosenVoice) {
//         chosenVoice = voices.find(
//           (v) =>
//             v.name.toLowerCase().includes("female") ||
//             v.name.toLowerCase().includes("zira") ||
//             v.name.toLowerCase().includes("samantha") ||
//             v.name.toLowerCase().includes("google uk english female")
//         );
//       }

//       const isHindi =
//         chosenVoice &&
//         (chosenVoice.lang.startsWith("hi") ||
//           chosenVoice.name.toLowerCase().includes("hindi"));

//       const lang = isHindi ? "hi-IN" : chosenVoice?.lang || "en-IN";

//       // Each segment: { text, rate, pitch, volume, pauseAfter }
//       // Emotional arc: delight → deliver news → intimate pause → reassurance → welcome → warm close
//       const enSegments = [
//         { text: `Oh, congratulations ${firstName}!`,                                               rate: 0.88, pitch: 1.18, volume: 1.0,  pauseAfter: 420 },
//         { text: `You have taken a very important step today.`,                                     rate: 0.82, pitch: 1.05, volume: 0.97, pauseAfter: 380 },
//         { text: `Your dream home... is now within reach.`,                                         rate: 0.78, pitch: 1.0,  volume: 0.95, pauseAfter: 520 },
//         { text: `Our senior consultant will personally call you in the next fifteen minutes.`,     rate: 0.83, pitch: 1.02, volume: 0.96, pauseAfter: 400 },
//         { text: `${firstName}, welcome to the E U S Realty family.`,                              rate: 0.85, pitch: 1.08, volume: 1.0,  pauseAfter: 350 },
//         { text: `We are so happy to have you with us.`,                                           rate: 0.80, pitch: 1.0,  volume: 0.93, pauseAfter: 0   },
//       ];

//       const hiSegments = [
//         { text: `Bahut bahut badhai ho, ${firstName}!`,                                                    rate: 0.87, pitch: 1.18, volume: 1.0,  pauseAfter: 420 },
//         { text: `Aaj aapne ek bahut zaroori kadam uthaya hai.`,                                            rate: 0.82, pitch: 1.04, volume: 0.97, pauseAfter: 380 },
//         { text: `Aapka sapno ka ghar... ab bahut paas hai.`,                                               rate: 0.78, pitch: 1.0,  volume: 0.95, pauseAfter: 520 },
//         { text: `Hamare senior consultant aapko personally call karenge, agle pandrah minute mein.`,       rate: 0.82, pitch: 1.02, volume: 0.96, pauseAfter: 400 },
//         { text: `${firstName}, E U S Realty parivar mein aapka dil se swagat hai.`,                       rate: 0.84, pitch: 1.08, volume: 1.0,  pauseAfter: 350 },
//         { text: `Hum bahut khush hain ki aap humare saath hain.`,                                         rate: 0.80, pitch: 1.0,  volume: 0.93, pauseAfter: 0   },
//       ];

//       const segments = isHindi ? hiSegments : enSegments;
//       let index = 0;

//       const speakNext = () => {
//         if (!currentSpeechController.active) return;
//         if (index >= segments.length) return;

//         const seg = segments[index];
//         const utter = new SpeechSynthesisUtterance(seg.text);
//         utter.lang = lang;
//         utter.rate = seg.rate;
//         utter.pitch = seg.pitch;
//         utter.volume = seg.volume;
//         if (chosenVoice) utter.voice = chosenVoice;

//         utter.onend = () => {
//           if (!currentSpeechController.active) return;
//           setTimeout(() => {
//             if (!currentSpeechController.active) return;
//             index++;
//             speakNext();
//           }, seg.pauseAfter || 0);
//         };

//         utter.onerror = () => {
//           if (!currentSpeechController.active) return;
//           index++;
//           speakNext();
//         };

//         window.speechSynthesis.speak(utter);
//       };

//       speakNext();
//     };

//     const voices = window.speechSynthesis.getVoices();
//     if (voices.length > 0) {
//       doSpeak();
//     } else {
//       const onReady = () => {
//         window.speechSynthesis.removeEventListener("voiceschanged", onReady);
//         doSpeak();
//       };
//       window.speechSynthesis.addEventListener("voiceschanged", onReady);
//       setTimeout(() => {
//         window.speechSynthesis.removeEventListener("voiceschanged", onReady);
//         doSpeak();
//       }, 1500);
//     }
//   } catch (err) {
//     console.error("speakCongratulation error:", err);
//   }
// }
// /* ──────────────────────────────────────────────────────
//    LeadFormCard – inline chat bubble form (Enhanced)
// ────────────────────────────────────────────────────── */
// function LeadFormCard({ phoneNumber, onSubmitted, sessionId }) {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [budget, setBudget] = useState("");
//   const [location, setLocation] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [possession, setPossession] = useState("");
//   const [interest, setInterest] = useState("Residential Property");
//   const [submitted, setSubmitted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const e = {};
//     if (!name.trim() || name.trim().length < 2) e.name = "Enter your full name";
//     if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
//     return e;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     // Unlock speech synthesis context synchronously in user click gesture handler
//     if (typeof window !== 'undefined' && window.speechSynthesis) {
//       const silentUtterance = new SpeechSynthesisUtterance('');
//       silentUtterance.volume = 0;
//       window.speechSynthesis.speak(silentUtterance);
//     }

//     setSubmitting(true);

//     try {
//       await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           phone: `+91 ${phone.trim()}`,
//           email: email.trim(),
//           objective: interest,
//           budget: budget.trim(),
//           preferredLocation: location.trim(),
//           propertyType: propertyType.trim(),
//           possession: possession.trim(),
//           message: `Lead form filled inside AI Assistant widget.`,
//           source: "Chatbot Widget",
//           sessionId: sessionId || "",
//         }),
//       });
//     } catch (err) {
//       console.error("Failed to submit contact details to DB:", err);
//     }

//     // Also open WhatsApp link for live connection
//     const msg = `🏠 *New Lead – EusRealty Chatbot*\n\n` +
//                 `👤 Name: ${name.trim()}\n` +
//                 `📞 Phone: +91 ${phone.trim()}\n` +
//                 (email.trim() ? `📧 Email: ${email.trim()}\n` : "") +
//                 `🏢 Interest: ${interest}\n` +
//                 (budget.trim() ? `💰 Budget: ${budget.trim()}\n` : "") +
//                 (location.trim() ? `📍 Location: ${location.trim()}\n` : "") +
//                 (propertyType.trim() ? `🏗️ Prop Type: ${propertyType.trim()}\n` : "") +
//                 (possession.trim() ? `🔑 Possession: ${possession.trim()}\n` : "") +
//                 `\nPlease contact me soon!`;

//     window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

//     setSubmitting(false);
//     setSubmitted(true);
//     if (onSubmitted) onSubmitted(name.trim());
//     speakCongratulation(name);
//   };

//   if (submitted) {
//     return (
//       <div className="text-center py-3">
//         <div className="text-3xl mb-2">🎉</div>
//         <p className="text-sm font-bold text-green-700">Thank you, {name}!</p>
//         <p className="text-xs text-gray-500 mt-1">Our consultant will call you within 15 minutes.</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full max-h-[350px] overflow-y-auto pr-1" noValidate>
//       <p className="text-[11px] text-gray-500 mb-1">Fill in details for direct builder catalog & callback ⚡</p>
      
//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
//         <div className="relative">
//           <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
//             placeholder="Your full name"
//             className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.name ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
//           />
//         </div>
//         {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number *</label>
//         <div className="flex">
//           <span className="flex items-center px-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-[11px] font-bold text-gray-600">+91</span>
//           <div className="relative flex-1">
//             <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type="tel" value={phone} maxLength={10} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErrors(p => ({ ...p, phone: "" })); }}
//               placeholder="10-digit number"
//               className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-r-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.phone ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
//             />
//           </div>
//         </div>
//         {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
//         <div className="relative">
//           <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//             placeholder="Your email (optional)"
//             className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">I&apos;m looking for</label>
//         <select value={interest} onChange={(e) => setInterest(e.target.value)}
//           className="w-full px-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 font-medium text-gray-700 cursor-pointer">
//           <option>Residential Property</option>
//           <option>Commercial Property</option>
//           <option>Investment / ROI</option>
//           <option>Home Loan Help</option>
//           <option>Free Site Visit</option>
//         </select>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Budget</label>
//         <div className="relative">
//           <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">₹</span>
//           <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)}
//             placeholder="e.g. 80L - 1.2 Cr"
//             className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preferred Location</label>
//         <div className="relative">
//           <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
//             placeholder="e.g. Baner, Tathawade"
//             className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
//           <div className="relative">
//             <Home size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type="text" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
//               placeholder="e.g. 2BHK"
//               className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Possession</label>
//           <div className="relative">
//             <Clock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type="text" value={possession} onChange={(e) => setPossession(e.target.value)}
//               placeholder="e.g. Ready / 1 Yr"
//               className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       <motion.button
//         type="submit"
//         disabled={submitting}
//         whileHover={!submitting ? { scale: 1.02 } : {}}
//         whileTap={!submitting ? { scale: 0.97 } : {}}
//         className={`w-full py-2.5 text-white text-[12px] font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1 touch-manipulation ${
//           submitting
//             ? "bg-green-400 cursor-not-allowed"
//             : "bg-[#25D366] hover:bg-[#20ba59] shadow-green-500/20"
//         }`}
//       >
//         {submitting ? (
//           <>
//             <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <span>Sending...</span>
//           </>
//         ) : (
//           <>
//             <MessageCircle size={13} fill="currentColor" />
//             <span>Send details</span>
//             <ChevronRight size={12} />
//           </>
//         )}
//       </motion.button>
//       <p className="text-[9px] text-gray-400 text-center">🔒 Secure direct builder registration.</p>
//     </form>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    MODULE-LEVEL CONSTANTS
// ────────────────────────────────────────────────────────────────────────── */
// const BOT_REPLY_DELAY_MS = 1050;

// /* ──────────────────────────────────────────────────────────────────────────
//    Framer-motion variants
// ────────────────────────────────────────────────────────────────────────── */
// const windowV = {
//   hidden: { opacity: 0, scale: 0.88, y: 24, transformOrigin: "bottom right" },
//   visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 } },
//   exit: { opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
// };
// const mobileWindowV = {
//   hidden: { opacity: 0, y: "100%" },
//   visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 32 } },
//   exit: { opacity: 0, y: "100%", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
// };
// const nudgeV = {
//   hidden: { opacity: 0, x: 32, scale: 0.86 },
//   visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 270, damping: 22 } },
//   exit: { opacity: 0, x: 18, scale: 0.9, transition: { duration: 0.16, ease: "easeIn" } },
// };
// const bubbleV = {
//   hidden: (s) => ({ opacity: 0, x: s === "agent" ? -16 : 16, y: 6, scale: 0.94 }),
//   visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 28 } },
// };
// const chipRowV = {
//   hidden: { opacity: 0, y: 8 },
//   visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.15 } },
// };
// const typingV = {
//   hidden: { opacity: 0, y: 8, scale: 0.88 },
//   visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 24 } },
//   exit: { opacity: 0, y: 4, scale: 0.9, transition: { duration: 0.14 } },
// };

// /* ──────────────────────────────────────────────────────
//    Main Component
// ────────────────────────────────────────────────────── */
// export default function WhatsAppChat() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showNudge, setShowNudge] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(1);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [sessionId, setSessionId] = useState("");
//   const [viewportHeight, setViewportHeight] = useState("100dvh");

//   const getNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   const phoneNumber = "917620733613";

//   const [messages, setMessages] = useState([
//     {
//       id: "welcome",
//       sender: "agent",
//       text: "Hi there! 👋 I'm *Vision*, your EusRealty AI assistant.\n\nI help you explore Pune's finest zero-brokerage properties, arrange site visits, and connect you with our team. What can I help you with today?",
//       time: getNow(),
//       chips: ["🏢 Show me properties", "💰 Pricing & budget", "🗓️ Book a site visit", "📋 Request a callback"],
//     },
//   ]);

//   const widgetRef = useRef(null);
//   const inputRef = useRef(null);
//   const chatBodyRef = useRef(null);
//   const nudgeTimerRef = useRef(null);
//   const nudgeDismissTimerRef = useRef(null);
//   const idleTimerRef = useRef(null);

//   /* ── Detect screen size, load session and history ── */
//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);

//     // Initialize/Get Session ID
//     let sid = localStorage.getItem("eusrealty_chat_session_id");
//     if (!sid) {
//       sid = "sid_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//       localStorage.setItem("eusrealty_chat_session_id", sid);
//     }
//     setSessionId(sid);

//     // Load Chat History from LocalStorage
//     const saved = localStorage.getItem("eusrealty_chat_history");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           setMessages(parsed);
//         }
//       } catch (err) {
//         console.error("Failed to load saved chat history:", err);
//       }
//     }

//     return () => window.removeEventListener("resize", check);
//   }, []);

//   /* ── Visual Viewport resize handler for mobile keyboard behavior ── */
//   useEffect(() => {
//     if (typeof window === "undefined") return;
    
//     const updateViewportHeight = () => {
//       if (window.visualViewport) {
//         setViewportHeight(`${window.visualViewport.height}px`);
//       } else {
//         setViewportHeight(`${window.innerHeight}px`);
//       }
//     };

//     updateViewportHeight();
    
//     if (window.visualViewport) {
//       window.visualViewport.addEventListener("resize", updateViewportHeight);
//     } else {
//       window.addEventListener("resize", updateViewportHeight);
//     }

//     return () => {
//       if (window.visualViewport) {
//         window.visualViewport.removeEventListener("resize", updateViewportHeight);
//       } else {
//         window.removeEventListener("resize", updateViewportHeight);
//       }
//     };
//   }, []);

//   /* ── Save chat history to localstorage when messages update ── */
//   useEffect(() => {
//     if (messages.length > 1) {
//       localStorage.setItem("eusrealty_chat_history", JSON.stringify(messages));
//     }
//   }, [messages]);

//   /* ── Lock body scroll when mobile chat is open ── */
//   useEffect(() => {
//     if (isMobile && isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => { 
//       document.body.style.overflow = "";
//     };
//   }, [isMobile, isOpen]);

//   /* ── Nudge logic (desktop only) ── */
//   const showNudgeTemporarily = useCallback(() => {
//     if (isOpen) return;
//     setShowNudge(true);
//     clearTimeout(nudgeDismissTimerRef.current);
//     nudgeDismissTimerRef.current = setTimeout(() => {
//       setShowNudge(false);
//     }, 6000);
//   }, [isOpen]);

//   const resetIdleTimer = useCallback(() => {
//     clearTimeout(idleTimerRef.current);
//     idleTimerRef.current = setTimeout(() => {
//       if (!isOpen) showNudgeTemporarily();
//     }, 30000);
//   }, [isOpen, showNudgeTemporarily]);

//   useEffect(() => {
//     if (isMobile) return;

//     nudgeTimerRef.current = setTimeout(() => {
//       if (!isOpen) showNudgeTemporarily();
//     }, 4500);

//     window.addEventListener("mousemove", resetIdleTimer);
//     window.addEventListener("keydown", resetIdleTimer);
//     window.addEventListener("scroll", resetIdleTimer);
//     window.addEventListener("touchstart", resetIdleTimer);

//     return () => {
//       clearTimeout(nudgeTimerRef.current);
//       clearTimeout(nudgeDismissTimerRef.current);
//       clearTimeout(idleTimerRef.current);
//       window.removeEventListener("mousemove", resetIdleTimer);
//       window.removeEventListener("keydown", resetIdleTimer);
//       window.removeEventListener("scroll", resetIdleTimer);
//       window.removeEventListener("touchstart", resetIdleTimer);
//     };
//   }, [isMobile, isOpen, showNudgeTemporarily, resetIdleTimer]);

//   /* ── Close on outside click (desktop only) ── */
//   useEffect(() => {
//     if (isMobile) return;
//     const handleOutside = (e) => {
//       if (widgetRef.current && !widgetRef.current.contains(e.target)) setIsOpen(false);
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, [isOpen, isMobile]);

//   /* ── Focus input & clear unread on open ── */
//   useEffect(() => {
//     if (isOpen) {
//       setUnreadCount(0);
//       setShowNudge(false);
//       clearTimeout(nudgeDismissTimerRef.current);
//       setTimeout(() => inputRef.current?.focus(), 420);
//     }
//   }, [isOpen]);

//   /* ── Smooth scroll to bottom on new message ── */
//   useEffect(() => {
//     if (chatBodyRef.current) {
//       chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
//     }
//   }, [messages, isTyping]);

//   const handleFocus = () => {
//     // Scroll chat body to bottom when input is focused, after keyboard layout changes
//     setTimeout(() => {
//       if (chatBodyRef.current) {
//         chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
//       }
//     }, 150);
//   };

//   /* ── Bot reply ── */
//   const botReply = (text, waMsg, chips) => {
//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         { id: `agent-${Date.now()}`, sender: "agent", text, time: getNow(), waActionMsg: waMsg, chips },
//       ]);
//     }, BOT_REPLY_DELAY_MS);
//   };

//   const showLeadForm = () => {
//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         { id: `form-${Date.now()}`, sender: "agent", type: "lead_form", time: getNow() },
//       ]);
//     }, 700);
//   };

//   const handleLeadSubmitted = (name) => {
//     setTimeout(() => {
//       botReply(
//         `Thanks ${name}! 🎉 Our senior consultant will call you within 15 minutes.\n\nFeel free to ask me anything else!`,
//         null,
//         ["🏢 Explore projects", "💰 View pricing", "🗓️ Book a site visit"]
//       );
//     }, 1200);
//   };

//   const handleChipClick = async (chip) => {
//     if (isTyping) return;
    
//     setMessages((prev) => [
//       ...prev,
//       { id: `user-${Date.now()}`, sender: "user", text: chip, time: getNow() },
//     ]);

//     const label = chip.replace(/^[^\w\s]+\s*/, "").toLowerCase();
//     if (label.includes("callback") || label.includes("request")) {
//       showLeadForm(); 
//       return;
//     }

//     setIsTyping(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: chip,
//           sessionId: sessionId,
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setIsTyping(false);
//         setMessages((prev) => [
//           ...prev,
//           { 
//             id: `agent-${Date.now()}`, 
//             sender: "agent", 
//             text: data.reply, 
//             time: getNow(), 
//             waActionMsg: null, 
//             chips: data.chips || [] 
//           },
//         ]);
//         return;
//       }
//       throw new Error("API call failed");
//     } catch (err) {
//       console.warn("API Chat failed on chip click, using local intents:", err);
//       setIsTyping(false);
//       const match = getSmartReply(chip);
//       if (match) {
//         if (match.action === "show_lead_form") { showLeadForm(); return; }
//         botReply(match.answer, match.waMsg, match.chips);
//       } else {
//         botReply("Great choice! 😊 Let me connect you with our team on WhatsApp for that.", chip, null);
//       }
//     }
//   };

//   const handleSend = async () => {
//     const finalMsg = message.trim();
//     if (!finalMsg) return;
//     setMessage("");
    
//     setMessages((prev) => [
//       ...prev,
//       { id: `user-${Date.now()}`, sender: "user", text: finalMsg, time: getNow() },
//     ]);
    
//     setIsTyping(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: finalMsg,
//           sessionId: sessionId,
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setIsTyping(false);
//         setMessages((prev) => [
//           ...prev,
//           { 
//             id: `agent-${Date.now()}`, 
//             sender: "agent", 
//             text: data.reply, 
//             time: getNow(), 
//             waActionMsg: null, 
//             chips: data.chips || [] 
//           },
//         ]);
//         return;
//       }
//       throw new Error("API call failed");
//     } catch (err) {
//       console.warn("API Chat failed on message send, using local intents:", err);
//       setIsTyping(false);
      
//       const match = getSmartReply(finalMsg);
//       if (match) {
//         if (match.action === "show_lead_form") { showLeadForm(); return; }
//         botReply(match.answer, match.waMsg, match.chips);
//       } else {
//         botReply(
//           "That's a great question! 😊 I'm connecting you with one of our senior property consultants on WhatsApp who can give you a detailed answer.",
//           finalMsg,
//           null
//         );
//       }
//     }
//   };

//   const handleWaAction = (waMsg) => {
//     window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMsg)}`, "_blank", "noopener,noreferrer");
//     setIsOpen(false);
//   };

//   /* ── Chat window inner content ── */
//   const ChatWindowContent = () => (
//     <>
//       {/* ── Header ── */}
//       <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white px-4 py-3.5 flex items-center justify-between flex-shrink-0 overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),transparent_60%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.1),transparent_60%)]" />

//         <div className="flex items-center gap-3 relative z-10">
//           <div className="relative">
//             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-indigo-400/40 shadow-lg overflow-hidden ring-2 ring-emerald-400/20">
//               <Image src="/logo.svg" alt="EusRealty" width={30} height={30} className="object-contain" />
//             </div>
//             <motion.span
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
//               className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0f172a]"
//             >
//               <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
//             </motion.span>
//           </div>
//           <div>
//             <div className="flex items-center gap-1.5">
//               <h4 className="font-bold text-[13px] tracking-tight text-white">Vision</h4>
//               <span className="flex items-center gap-0.5 bg-indigo-500/30 border border-indigo-400/30 px-1.5 py-0.5 rounded-full">
//                 <Sparkles size={8} className="text-indigo-300" />
//                 <span className="text-[9px] text-indigo-300 font-bold tracking-wider">AI</span>
//               </span>
//             </div>
//             <AnimatePresence mode="wait">
//               {isTyping ? (
//                 <motion.div key="typ" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}
//                   className="flex items-center gap-1.5">
//                   <span className="flex gap-0.5">
//                     {[0, 0.18, 0.36].map((d, i) => (
//                       <motion.span key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d, ease: "easeInOut" }}
//                         className="w-1 h-1 rounded-full bg-emerald-300 inline-block" />
//                     ))}
//                   </span>
//                   <span className="text-[11px] text-emerald-300 font-medium">typing...</span>
//                 </motion.div>
//               ) : (
//                 <motion.p key="onl" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}
//                   className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
//                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
//                   EusRealty AI · Online now
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         <button onClick={() => setIsOpen(false)}
//           className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 transition-all p-1.5 rounded-full z-10 touch-manipulation">
//           <X size={18} />
//         </button>
//       </div>

//       {/* ── Chat Body ── */}
//       <div
//         ref={chatBodyRef}
//         className="wa-body flex-1 min-h-0 px-3 sm:px-4 py-3 flex flex-col gap-3 overflow-y-auto overscroll-contain"
//         style={{
//           background: "linear-gradient(180deg,#f8fafc 0%,#f0f4f8 100%)",
//           backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
//           backgroundSize: "20px 20px",
//           msOverflowStyle: "none",
//           scrollbarWidth: "none",
//           WebkitOverflowScrolling: "touch",
//           overscrollBehavior: "contain",
//         }}
//       >
//         <style>{`.wa-body::-webkit-scrollbar{display:none!important}`}</style>

//         <div className="self-center bg-white/80 backdrop-blur text-gray-400 text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-widest shadow-sm border border-gray-200/60 flex items-center gap-1.5">
//           <span>🔒</span> End-to-End Encrypted
//         </div>

//         <AnimatePresence initial={false}>
//           {messages.map((msg) => (
//             <motion.div
//               key={msg.id}
//               custom={msg.sender}
//               variants={bubbleV}
//               initial="hidden"
//               animate="visible"
//               className={`flex flex-col gap-2 ${msg.sender === "agent" ? "self-start items-start max-w-[90%] sm:max-w-[92%]" : "self-end items-end max-w-[82%] sm:max-w-[85%]"}`}
//             >
//               {/* Lead form bubble */}
//               {msg.type === "lead_form" ? (
//                 <div className="bg-white rounded-2xl rounded-tl-none shadow-md border border-gray-100 p-3 sm:p-4 w-full max-w-[290px] sm:max-w-[300px]">
//                   <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
//                     <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
//                       <Phone size={13} className="text-emerald-600" />
//                     </div>
//                     <div>
//                       <p className="text-[12px] font-bold text-gray-800">Direct Builder Registration</p>
//                       <p className="text-[10px] text-gray-400">Request catalog & callback</p>
//                     </div>
//                   </div>
//                   <LeadFormCard phoneNumber={phoneNumber} onSubmitted={handleLeadSubmitted} sessionId={sessionId} />
//                   <div className="flex justify-end mt-2">
//                     <span className="text-[9px] text-gray-400">{msg.time}</span>
//                   </div>
//                 </div>
//               ) : (
//                 /* Normal bubble */
//                 <div
//                   className={`px-3.5 py-2.5 rounded-2xl shadow-sm flex flex-col gap-1.5 ${msg.sender === "agent"
//                     ? "bg-white rounded-tl-none text-gray-800 border border-gray-100"
//                     : "bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none border border-indigo-500/20"
//                     }`}
//                 >
//                   <p className="text-[13px] leading-relaxed whitespace-pre-line">{msg.text}</p>

//                   {msg.waActionMsg && (
//                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//                       onClick={() => handleWaAction(msg.waActionMsg)}
//                       className="mt-1 w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation">
//                       <MessageCircle size={12} fill="currentColor" />
//                       Continue on WhatsApp
//                     </motion.button>
//                   )}

//                   <div className={`flex items-center gap-1 ${msg.sender === "agent" ? "justify-start" : "justify-end"}`}>
//                     <span className={`text-[9px] ${msg.sender === "agent" ? "text-gray-400" : "text-indigo-200"}`}>{msg.time}</span>
//                     {msg.sender === "user" && <CheckCheck size={11} className="text-indigo-200" />}
//                   </div>
//                 </div>
//               )}

//               {/* Smart chips below agent message */}
//               {msg.sender === "agent" && msg.chips && msg.chips.length > 0 && (
//                 <motion.div
//                   variants={chipRowV}
//                   initial="hidden"
//                   animate="visible"
//                   className="flex flex-wrap gap-1.5 max-w-full"
//                 >
//                   {msg.chips.map((chip, ci) => (
//                     <motion.button
//                       key={ci}
//                       whileHover={{ scale: 1.04, y: -1 }}
//                       whileTap={{ scale: 0.96 }}
//                       onClick={() => handleChipClick(chip)}
//                       className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 shadow-sm transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95"
//                     >
//                       {chip}
//                     </motion.button>
//                   ))}
//                 </motion.div>
//               )}
//             </motion.div>
//           ))}
//         </AnimatePresence>

//         {/* Typing indicator */}
//         <AnimatePresence>
//           {isTyping && (
//             <motion.div key="typing" variants={typingV} initial="hidden" animate="visible" exit="exit"
//               className="self-start bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1.5">
//               {[0, 0.2, 0.4].map((delay, i) => (
//                 <motion.span key={i} animate={{ y: [0, -5, 0] }}
//                   transition={{ duration: 0.55, repeat: Infinity, delay, ease: "easeInOut" }}
//                   className="w-2 h-2 bg-gray-300 rounded-full block" />
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ── Input bar ── */}
//       <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-2.5 safe-area-inset-bottom">
//         <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
//           <input
//             ref={inputRef}
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onFocus={handleFocus}
//             placeholder="Ask Vision anything…"
//             className="flex-1 py-2.5 px-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none text-[13px] text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
//             style={{ fontSize: "16px" }}
//           />
//           <motion.button
//             type="submit"
//             disabled={!message.trim()}
//             whileHover={message.trim() ? { scale: 1.12 } : {}}
//             whileTap={message.trim() ? { scale: 0.88 } : {}}
//             className={`p-2.5 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 touch-manipulation ${message.trim()
//               ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
//               : "bg-gray-100 text-gray-400 cursor-not-allowed"
//               }`}
//           >
//             <Send size={15} />
//           </motion.button>
//         </form>
//         <p className="text-[9px] text-gray-400 text-center mt-1.5">Powered by EusRealty AI · Vision</p>
//       </div>
//     </>
//   );

//   return (
//     <>
//       {/* ════════════════════════════════════
//           MOBILE: Full-screen overlay
//       ════════════════════════════════════ */}
//       <AnimatePresence>
//         {isMobile && isOpen && (
//           <motion.div
//             key="mobile-chat"
//             variants={mobileWindowV}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="fixed inset-0 z-[9999] bg-white flex flex-col overscroll-none"
//             style={{ 
//               height: viewportHeight,
//               top: 0,
//               bottom: 0,
//               paddingBottom: "env(safe-area-inset-bottom)" 
//             }}
//           >
//             {ChatWindowContent()}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ════════════════════════════════════
//           FAB + Desktop panel (always rendered)
//       ════════════════════════════════════ */}
//       <div
//         ref={widgetRef}
//         className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9998] font-sans select-text"
//       >
//         <AnimatePresence mode="sync">

//           {/* ── Nudge (desktop only, no mobile) ── */}
//           {!isMobile && showNudge && !isOpen && (
//             <motion.div
//               key="nudge"
//               variants={nudgeV}
//               initial="hidden" animate="visible" exit="exit"
//               onClick={() => setIsOpen(true)}
//               className="absolute bottom-[76px] right-2 mb-1 w-64 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-800 cursor-pointer flex flex-col gap-1 hover:-translate-y-0.5 transition-transform"
//             >
//               <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
//                 </span>
//                 EUS Realty AI · ONLINE NOW
//               </div>
//               <p className="text-gray-200 mt-1 text-xs leading-snug">Looking for a dream home in Pune? Chat with our AI now! 🏠</p>
//               <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-gray-800" />
//             </motion.div>
//           )}

//           {/* ── Chat window (desktop / tablet) ── */}
//           {!isMobile && isOpen && (
//             <motion.div
//               key="chat-window"
//               variants={windowV}
//               initial="hidden" animate="visible" exit="exit"
//               className="absolute bottom-[76px] right-0 mb-1 bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.22)] border border-gray-100/80 overflow-hidden flex flex-col"
//               style={{
//                 width: "min(370px, calc(100vw - 28px))",
//                 height: "min(580px, calc(100dvh - 110px))",
//               }}
//             >
//               {ChatWindowContent()}
//             </motion.div>
//           )}

//         </AnimatePresence>

//         {/* ── FAB Button ── */}
//         <motion.button
//           onClick={() => setIsOpen(!isOpen)}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.87 }}
//           transition={{ type: "spring", stiffness: 420, damping: 20 }}
//           className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white z-50 shadow-2xl cursor-pointer transition-colors duration-300 touch-manipulation ${isOpen ? "bg-gray-900 hover:bg-gray-800" : "bg-[#25D366] hover:bg-[#22c35e]"}`}
//           aria-label="Chat with EusRealty"
//         >
//           {!isOpen && (
//             <>
//               <motion.span className="absolute inset-0 rounded-full bg-[#25D366]"
//                 animate={{ scale: [1, 1.65], opacity: [0.5, 0] }}
//                 transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
//               <motion.span className="absolute inset-0 rounded-full bg-[#25D366]"
//                 animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
//                 transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.75 }} />
//             </>
//           )}
//           {unreadCount > 0 && !isOpen && (
//             <motion.span
//               initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
//               transition={{ type: "spring", stiffness: 528, damping: 22 }}
//               className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
//               {unreadCount}
//             </motion.span>
//           )}
//           <AnimatePresence mode="wait">
//             {isOpen ? (
//               <motion.div key="close"
//                 initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
//                 exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}>
//                 <X size={24} />
//               </motion.div>
//             ) : (
//               <motion.div key="wa"
//                 initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
//                 exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
//                 className="flex items-center justify-center">
//                 <svg viewBox="0 0 24 24" width="27" height="27" fill="currentColor">
//                   <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.806-9.8.001-2.621-1.02-5.086-2.875-6.942C16.35 1.995 13.9 .976 11.278.976c-5.41 0-9.81 4.403-9.813 9.802-.001 1.702.461 3.366 1.39 4.811l-.997 3.637 3.737-.98c1.357.741 2.822 1.13 4.152 1.128zm10.978-7.751c-.302-.152-1.793-.883-2.07-.982-.277-.101-.48-.152-.68.152-.2.302-.776.982-.951 1.182-.175.201-.35.226-.652.076-.302-.15-1.274-.469-2.427-1.496-.897-.8-1.502-1.787-1.678-2.088-.175-.302-.019-.465.132-.615.136-.135.302-.35.453-.526.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.68-1.634-.932-2.238-.245-.589-.493-.51-.68-.52-.175-.01-.377-.01-.579-.01-.201 0-.529.075-.804.378-.277.302-1.058 1.031-1.058 2.516s1.08 2.972 1.23 3.174c.151.2 2.126 3.245 5.15 4.554.719.311 1.28.497 1.719.637.722.229 1.38.197 1.9.12.58-.087 1.794-.733 2.046-1.437.252-.704.252-1.307.176-1.437-.077-.13-.277-.201-.579-.352z" />
//                 </svg>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.button>
//       </div>
//     </>
//   );
// }


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, CheckCheck, MessageCircle, User, Phone, 
  ChevronRight, Sparkles, Mail, MapPin, Home, Clock
} from "lucide-react";

/* ──────────────────────────────────────────────────────
   INTENTS: keyword → smart bot reply (Fallback Mode)
────────────────────────────────────────────────────── */
const INTENTS = [
  {
    id: "greet",
    keywords: ["hi", "hello", "hey", "namaste", "hii", "helo", "howdy", "good morning", "good evening", "good afternoon", "start"],
    answer: "Hello! 😊 Great to connect with you. I'm Vision, your EusRealty AI assistant.\n\nI can help you explore properties, check prices, arrange site visits, or connect you with our team. What would you like to do?",
    chips: ["🏢 Show me properties", "💰 What's the pricing?", "🗓️ Book a site visit", "📋 Request a callback"],
    waMsg: null,
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thankyou", "great", "awesome", "nice", "perfect", "wonderful", "brilliant", "good"],
    answer: "You're very welcome! 🙏 I'm always here to help. Is there anything else you'd like to know about our properties or services?",
    chips: ["🏢 View listings", "📋 Get a callback", "📞 Contact our team"],
    waMsg: null,
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "later", "ok bye", "cya", "done"],
    answer: "Goodbye! 👋 Have a wonderful day. Feel free to come back anytime — we're always here at EusRealty!\n\n📞 +91 7620733613",
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
    answer: "💰 Our properties are priced to suit every budget:\n\n🏠 2BHK Apartments: ₹85 Lakhs – ₹1.8 Cr\n🏡 3BHK Luxury: ₹1.8 Cr – ₹4.5 Cr\n🌴 Villas & Bungalows: ₹4.5 Cr – ₹8.9 Cr\n🏢 Commercial: ₹45 Lakhs onwards\n\nFlexible payment plans & builder subventions available!",
    chips: ["📋 Get price sheet", "🏦 Home loan help", "🗓️ Book site visit"],
    waMsg: "Hi, please send the detailed pricing sheet and payment plans for your properties.",
  },
  {
    id: "projects",
    keywords: ["project", "property", "flat", "apartment", "villa", "house", "bhk", "studio", "listing", "new launch", "available", "show me", "properties"],
    answer: "🏢 Here are our featured premium projects:\n\n⭐ Eus Heights — Tathawade (2 & 3 BHK)\n⭐ Skyline Villas — Balewadi (3 & 4 BHK)\n⭐ Juhu Oasis — Baner (Studio to 3 BHK)\n⭐ Green Valley — Hinjewadi (2 & 3 BHK)\n\nAll are RERA registered with 0% brokerage!",
    chips: ["💰 Check prices", "🗓️ Book a visit", "📋 Get full catalog"],
    waMsg: "Hi, I'd like to explore your latest premium property listings and get the full catalog.",
  },
  {
    id: "brokerage",
    keywords: ["brokerage", "commission", "fee", "zero brokerage", "0%", "no charge", "middleman", "charges", "hidden"],
    answer: "🤝 Absolutely — EusRealty is 100% zero brokerage!\n\nWe connect you directly with top builders & developers, cutting out the middleman entirely.\n\n💰 You save ₹2 – ₹10 Lakhs in commission fees that you'd otherwise pay to traditional agents.",
    chips: ["🏢 Explore projects", "📋 Talk to our team", "💰 View pricing"],
    waMsg: "Hi, I want to buy a property with 0% brokerage directly from the builder.",
  },
  {
    id: "contact",
    keywords: ["contact", "call", "email", "phone", "reach", "number", "address", "office", "support", "helpline", "speak"],
    answer: "📞 Reach us anytime:\n\n📱 +91 7620733613\n📧 eliteuniqueservices@gmail.com\n📍 Corporate Office, Tathawade, Pune\n\n🕐 Available: Tue–Sun, 10 AM – 7 PM\n\nOr tap below to connect instantly on WhatsApp!",
    chips: ["📋 Request a callback", "🗓️ Book site visit"],
    waMsg: "Hi, I'd like to speak with a senior real estate consultant from EusRealty.",
  },
  {
    id: "loan",
    keywords: ["loan", "emi", "finance", "bank", "mortgage", "home loan", "interest rate", "down payment", "subsidy", "pmay", "financing"],
    answer: "🏦 We make home loans easy:\n\n✅ Tie-ups with 15+ banks & NBFCs\n✅ Pre-approved loans in 24 hours\n✅ EMI starting at just ₹55,000/month\n✅ PMAY subsidy up to ₹2.67 Lakhs\n✅ 90% financing on select projects\n\nWant a free eligibility check?",
    chips: ["📋 Get loan assistance", "💰 See property prices", "🗓️ Book site visit"],
    waMsg: "Hi, I need help with home loan assistance, EMI calculation, and pre-approval.",
  },
  {
    id: "visit",
    keywords: ["visit", "site visit", "tour", "show flat", "schedule", "appointment", "demo", "book", "viewing", "come", "see"],
    answer: "🗓️ We'd love to arrange a free site visit!\n\n✅ Available 7 days a week\n✅ Complimentary pickup & drop\n✅ Dedicated property consultant\n✅ Virtual 3D tours also available\n\nShare your preferred date on WhatsApp and we'll confirm within minutes!",
    chips: ["📅 Schedule on WhatsApp", "📋 Request a callback"],
    waMsg: "Hi, I'd like to schedule a free site visit. Please share available time slots.",
  },
  {
    id: "location",
    keywords: ["location", "area", "where", "pune", "hinjewadi", "baner", "balewadi", "tathawade", "wakad", "pimple", "sus", "kothrud", "nibm", "hadapsar", "near"],
    answer: "📍 Properties in Pune's best micro-markets:\n\n🔵 IT Corridor: Hinjewadi, Wakad (₹85L+)\n🟢 Premium West: Baner, Balewadi, Sus (₹1.2Cr+)\n🟡 Value: Tathawade, Pimple Saudagar (₹75L+)\n🔴 South Pune: Hadapsar, NIBM (₹90L+)\n\nWhich area are you most interested in?",
    chips: ["🏢 See Baner projects", "🏢 See Hinjewadi projects", "💰 Compare prices by area"],
    waMsg: "Hi, I want to explore properties in a specific area of Pune. Please share options.",
  },
  {
    id: "invest",
    keywords: ["invest", "investment", "roi", "rental", "return", "commercial", "shop", "office space", "plot", "land", "yield", "appreciation"],
    answer: "📈 Pune is one of India's top investment destinations!\n\n💹 8–12% annual price appreciation\n🏪 Commercial: 6–9% rental yield\n🏠 Residential: 4–6% rental income\n🚀 Pre-launch: 30–40% potential gain\n\nOur investment advisors can help you pick the highest ROI property!",
    chips: ["📋 Get investment advice", "🏢 Commercial properties", "💰 Pre-launch projects"],
    waMsg: "Hi, I'm interested in real estate investment opportunities in Pune for maximum ROI.",
  },
  {
    id: "ready",
    keywords: ["ready to move", "possession", "delivery", "handover", "immediate", "move in", "occupancy"],
    answer: "🏠 We have both ready-to-move and under-construction options!\n\n✅ Ready-to-move\n  • Immediate possession\n  • No GST payable\n  • What you see is what you get\n\n🏗️ Under-construction\n  • Lower entry price\n  • Higher appreciation potential\n  • Customisation options\n\nAll are RERA registered! 🔒",
    chips: ["🏢 Show ready-to-move", "💰 Compare prices", "🗓️ Book a visit"],
    waMsg: "Hi, I'm looking for ready-to-move properties. Please share available options.",
  },
  {
    id: "legal",
    keywords: ["rera", "legal", "document", "agreement", "registration", "stamp duty", "safe", "trust", "verified", "fraud", "genuine"],
    answer: "⚖️ 100% safe to invest with EusRealty!\n\n🛡️ All projects RERA registered & verified\n📄 Complete legal documentation support\n✍️ Sale agreement & stamp duty guidance\n🔍 Title search & due diligence help\n💯 Fully transparent transactions\n\nYour investment is in safe hands! 🔒",
    chips: ["📋 Speak to legal team", "🏢 View verified projects"],
    waMsg: "Hi, I'd like to know about the legal process, documents required, and RERA verification.",
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
   VOICE  —  Human-feel Indian English congratulation
   
   KEY TECHNIQUES USED:
   1. Phonetic spelling  →  "oh my goodness" not "oh"
   2. Natural fillers    →  "you know", "honestly", "I mean"
   3. Elongated vowels   →  "sooo" "reaaally" force stress
   4. Fragmented rhythm  →  short bursts like real speech
   5. Contrast pauses    →  long pause BEFORE the big line
   6. Rising then falling pitch arc across whole speech
   7. Warm sign-off drops rate+pitch like a real goodbye
────────────────────────────────────────────────────── */
const currentSpeechController = {
  active: false,
  cancel: function () {
    this.active = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
};

function speakCongratulation(name) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  try {
    currentSpeechController.cancel();
    currentSpeechController.active = true;

    const firstName = name?.trim().split(" ")[0] || "there";

    const doSpeak = () => {
      if (!currentSpeechController.active) return;
      const voices = window.speechSynthesis.getVoices();

      // Best Indian / warm female voice priority list
      const preferredNames = [
        "Microsoft Neerja Online (Natural) - English (India)",
        "Microsoft Heera Online (Natural) - English (India)",
        "Google हिन्दी",
        "Google Hindi",
        "Microsoft Hemant - Hindi (India)",
        "Microsoft Kalpana - Hindi (India)",
        "Lekha",
        "Veena",
        "Microsoft Heera",
        "Microsoft Neerja",
        "Google en-IN",
        "Google UK English Female",
        "Microsoft Zira Desktop",
        "Samantha",
      ];

      let chosenVoice = null;
      for (const pref of preferredNames) {
        chosenVoice = voices.find(
          (v) => v.name === pref || v.name.includes(pref)
        );
        if (chosenVoice) break;
      }
      if (!chosenVoice) {
        chosenVoice = voices.find(
          (v) =>
            v.lang === "hi-IN" ||
            v.lang.startsWith("hi") ||
            v.lang === "en-IN" ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("neerja") ||
            v.name.toLowerCase().includes("heera") ||
            v.name.toLowerCase().includes("lekha") ||
            v.name.toLowerCase().includes("kalpana")
        );
      }
      if (!chosenVoice) {
        chosenVoice = voices.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("google uk english female")
        );
      }

      const isHindi =
        chosenVoice &&
        (chosenVoice.lang.startsWith("hi") ||
          chosenVoice.name.toLowerCase().includes("hindi"));

      const lang = isHindi ? "hi-IN" : chosenVoice?.lang || "en-IN";

      /*
        PROSODY DESIGN — English arc:

        [0] Burst of genuine excitement — fast, high, like you just heard great news
        [1] Slow down — let name land — personal, warm, almost a whisper
        [2] The BIG statement — slowest, most weight, highest importance
        [3] Short pause beat — then the promise — confident, clear, slightly faster
        [4] Friendly human reassurance — casual, like a friend talking
        [5] Warm sign-off — drops pitch+rate — like ending a real call

        pauseAfter = silence (ms) between utterances — the most human thing you can add.
        The 600ms pause before segment [2] is what makes it feel real.
      */
      const enSegments = [
        // Burst — excited, can't hold it in
        {
          text: `Oh wow — ${firstName}! Congratulations!`,
          rate: 0.92,
          pitch: 1.22,
          volume: 1.0,
          pauseAfter: 300,
        },
        // Slow — personal — drop pitch slightly — like leaning in
        {
          text: `I am sooo happy for you right now.`,
          rate: 0.78,
          pitch: 1.12,
          volume: 0.98,
          pauseAfter: 260,
        },
        // The weight — slowest moment — let it breathe before and after
        {
          text: `You have just taken the first step... towards your dream home.`,
          rate: 0.74,
          pitch: 1.05,
          volume: 0.97,
          pauseAfter: 600,
        },
        // Promise — confident, clear, slightly upbeat
        {
          text: `Our senior property consultant is going to call you personally — within the next fifteen minutes.`,
          rate: 0.84,
          pitch: 1.08,
          volume: 1.0,
          pauseAfter: 380,
        },
        // Casual warm human — like a friend
        {
          text: `Honestly ${firstName}, you are going to love what we have found for you.`,
          rate: 0.82,
          pitch: 1.06,
          volume: 0.97,
          pauseAfter: 320,
        },
        // Welcome — pride — slightly rising
        {
          text: `Welcome to the E U S Realty family.`,
          rate: 0.80,
          pitch: 1.10,
          volume: 1.0,
          pauseAfter: 280,
        },
        // Soft sign-off — drops naturally — like ending a real call
        {
          text: `We are with you, every single step of the way.`,
          rate: 0.75,
          pitch: 0.98,
          volume: 0.92,
          pauseAfter: 0,
        },
      ];

      const hiSegments = [
        // Burst — genuine excitement
        {
          text: `Are waah — ${firstName} ji! Bahut bahut badhai ho aapko!`,
          rate: 0.90,
          pitch: 1.22,
          volume: 1.0,
          pauseAfter: 300,
        },
        // Personal, warm
        {
          text: `Sacchi mein, mujhe bahut khushi ho rahi hai aaj.`,
          rate: 0.78,
          pitch: 1.10,
          volume: 0.97,
          pauseAfter: 260,
        },
        // The big moment — slow, heavy
        {
          text: `Aapne aaj... apne sapno ke ghar ki taraf pehla kadam rakh diya hai.`,
          rate: 0.73,
          pitch: 1.04,
          volume: 0.96,
          pauseAfter: 600,
        },
        // Promise — confident
        {
          text: `Hamare senior consultant aapko personally call karenge — bilkul agle pandrah minute ke andar.`,
          rate: 0.83,
          pitch: 1.07,
          volume: 1.0,
          pauseAfter: 380,
        },
        // Casual friend energy
        {
          text: `${firstName} ji, believe me — aapko jo chahiye, woh hum zaroor dhundhenge aapke liye.`,
          rate: 0.81,
          pitch: 1.06,
          volume: 0.97,
          pauseAfter: 320,
        },
        // Welcome — pride
        {
          text: `E U S Realty parivar mein aapka dil se swagat hai.`,
          rate: 0.79,
          pitch: 1.10,
          volume: 1.0,
          pauseAfter: 280,
        },
        // Warm sign-off — drops naturally
        {
          text: `Hum hain aapke saath — har ek kadam pe.`,
          rate: 0.74,
          pitch: 0.97,
          volume: 0.91,
          pauseAfter: 0,
        },
      ];

      const segments = isHindi ? hiSegments : enSegments;
      let index = 0;

      const speakNext = () => {
        if (!currentSpeechController.active) return;
        if (index >= segments.length) return;

        const seg = segments[index];
        const utter = new SpeechSynthesisUtterance(seg.text);
        utter.lang = lang;
        utter.rate = seg.rate;
        utter.pitch = seg.pitch;
        utter.volume = seg.volume;
        if (chosenVoice) utter.voice = chosenVoice;

        utter.onend = () => {
          if (!currentSpeechController.active) return;
          setTimeout(() => {
            if (!currentSpeechController.active) return;
            index++;
            speakNext();
          }, seg.pauseAfter || 0);
        };

        utter.onerror = () => {
          if (!currentSpeechController.active) return;
          index++;
          speakNext();
        };

        window.speechSynthesis.speak(utter);
      };

      speakNext();
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      const onReady = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onReady);
        doSpeak();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onReady);
      setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", onReady);
        doSpeak();
      }, 1500);
    }
  } catch (err) {
    console.error("speakCongratulation error:", err);
  }
}

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

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const silentUtterance = new SpeechSynthesisUtterance("");
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

    const msg =
      `🏠 *New Lead – EusRealty Chatbot*\n\n` +
      `👤 Name: ${name.trim()}\n` +
      `📞 Phone: +91 ${phone.trim()}\n` +
      (email.trim() ? `📧 Email: ${email.trim()}\n` : "") +
      `🏢 Interest: ${interest}\n` +
      (budget.trim() ? `💰 Budget: ${budget.trim()}\n` : "") +
      (location.trim() ? `📍 Location: ${location.trim()}\n` : "") +
      (propertyType.trim() ? `🏗️ Prop Type: ${propertyType.trim()}\n` : "") +
      (possession.trim() ? `🔑 Possession: ${possession.trim()}\n` : "") +
      `\nPlease contact me soon!`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setSubmitting(false);
    setSubmitted(true);
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
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
        <div className="relative">
          <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Your full name"
            className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.name ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
          />
        </div>
        {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number *</label>
        <div className="flex">
          <span className="flex items-center px-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-[11px] font-bold text-gray-600">+91</span>
          <div className="relative flex-1">
            <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phone}
              maxLength={10}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, phone: "" })); }}
              placeholder="10-digit number"
              className={`w-full pl-7 pr-3 py-2 text-[12px] rounded-r-lg border bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all ${errors.phone ? "border-red-400 ring-1 ring-red-400/30" : "border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"}`}
            />
          </div>
        </div>
        {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
        <div className="relative">
          <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">I&apos;m looking for</label>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full px-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 font-medium text-gray-700 cursor-pointer"
        >
          <option>Residential Property</option>
          <option>Commercial Property</option>
          <option>Investment / ROI</option>
          <option>Home Loan Help</option>
          <option>Free Site Visit</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Budget</label>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">₹</span>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 80L - 1.2 Cr"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preferred Location</label>
        <div className="relative">
          <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Baner, Tathawade"
            className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
          <div className="relative">
            <Home size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              placeholder="e.g. 2BHK"
              className="w-full pl-7 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Possession</label>
          <div className="relative">
            <Clock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={possession}
              onChange={(e) => setPossession(e.target.value)}
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

  const getNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const phoneNumber = "917620733613";

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "agent",
      text: "Hi there! 👋 I'm *Vision*, your EusRealty AI assistant.\n\nI help you explore Pune's finest zero-brokerage properties, arrange site visits, and connect you with our team. What can I help you with today?",
      time: getNow(),
      chips: ["🏢 Show me properties", "💰 Pricing & budget", "🗓️ Book a site visit", "📋 Request a callback"],
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

    let sid = localStorage.getItem("eusrealty_chat_session_id");
    if (!sid) {
      sid =
        "sid_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("eusrealty_chat_session_id", sid);
    }
    setSessionId(sid);

    const saved = localStorage.getItem("eusrealty_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (err) {
        console.error("Failed to load saved chat history:", err);
      }
    }

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

  /* ── Save chat history ── */
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("eusrealty_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

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
      if (widgetRef.current && !widgetRef.current.contains(e.target))
        setIsOpen(false);
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

  /* ── Smooth scroll to bottom ── */
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleFocus = () => {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  /* ── Bot reply ── */
  const botReply = (text, waMsg, chips) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: "agent",
          text,
          time: getNow(),
          waActionMsg: waMsg,
          chips,
        },
      ]);
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
        body: JSON.stringify({ message: chip, sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: data.reply,
            time: getNow(),
            waActionMsg: null,
            chips: data.chips || [],
          },
        ]);
        return;
      }
      throw new Error("API call failed");
    } catch (err) {
      console.warn("API Chat failed on chip click, using local intents:", err);
      setIsTyping(false);
      const match = getSmartReply(chip);
      if (match) {
        if (match.action === "show_lead_form") { showLeadForm(); return; }
        botReply(match.answer, match.waMsg, match.chips);
      } else {
        botReply(
          "Great choice! 😊 Let me connect you with our team on WhatsApp for that.",
          chip,
          null
        );
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
        body: JSON.stringify({ message: finalMsg, sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: data.reply,
            time: getNow(),
            waActionMsg: null,
            chips: data.chips || [],
          },
        ]);
        return;
      }
      throw new Error("API call failed");
    } catch (err) {
      console.warn("API Chat failed on message send, using local intents:", err);
      setIsTyping(false);

      const match = getSmartReply(finalMsg);
      if (match) {
        if (match.action === "show_lead_form") { showLeadForm(); return; }
        botReply(match.answer, match.waMsg, match.chips);
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
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMsg)}`,
      "_blank",
      "noopener,noreferrer"
    );
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
              <h4 className="font-bold text-[13px] tracking-tight text-white">Vision</h4>
              <span className="flex items-center gap-0.5 bg-indigo-500/30 border border-indigo-400/30 px-1.5 py-0.5 rounded-full">
                <Sparkles size={8} className="text-indigo-300" />
                <span className="text-[9px] text-indigo-300 font-bold tracking-wider">AI</span>
              </span>
            </div>
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  key="typ"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="flex gap-0.5">
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: d, ease: "easeInOut" }}
                        className="w-1 h-1 rounded-full bg-emerald-300 inline-block"
                      />
                    ))}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-medium">typing...</span>
                </motion.div>
              ) : (
                <motion.p
                  key="onl"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                  className="text-[11px] text-emerald-300 font-medium flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  EusRealty AI · Online now
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 transition-all p-1.5 rounded-full z-10 touch-manipulation"
        >
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
              className={`flex flex-col gap-2 ${
                msg.sender === "agent"
                  ? "self-start items-start max-w-[90%] sm:max-w-[92%]"
                  : "self-end items-end max-w-[82%] sm:max-w-[85%]"
              }`}
            >
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
                  <LeadFormCard
                    phoneNumber={phoneNumber}
                    onSubmitted={handleLeadSubmitted}
                    sessionId={sessionId}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[9px] text-gray-400">{msg.time}</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`px-3.5 py-2.5 rounded-2xl shadow-sm flex flex-col gap-1.5 ${
                    msg.sender === "agent"
                      ? "bg-white rounded-tl-none text-gray-800 border border-gray-100"
                      : "bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none border border-indigo-500/20"
                  }`}
                >
                  <p className="text-[13px] leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {msg.waActionMsg && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleWaAction(msg.waActionMsg)}
                      className="mt-1 w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-manipulation"
                    >
                      <MessageCircle size={12} fill="currentColor" />
                      Continue on WhatsApp
                    </motion.button>
                  )}

                  <div
                    className={`flex items-center gap-1 ${
                      msg.sender === "agent" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <span className={`text-[9px] ${msg.sender === "agent" ? "text-gray-400" : "text-indigo-200"}`}>
                      {msg.time}
                    </span>
                    {msg.sender === "user" && <CheckCheck size={11} className="text-indigo-200" />}
                  </div>
                </div>
              )}

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

        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              variants={typingV}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="self-start bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1.5"
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity, delay, ease: "easeInOut" }}
                  className="w-2 h-2 bg-gray-300 rounded-full block"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-2.5 safe-area-inset-bottom">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 items-center"
        >
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
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 touch-manipulation ${
              message.trim()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={15} />
          </motion.button>
        </form>
        <p className="text-[9px] text-gray-400 text-center mt-1.5">
          Powered by EusRealty AI · Vision
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE: Full-screen overlay */}
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
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {ChatWindowContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB + Desktop panel */}
      <div
        ref={widgetRef}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9998] font-sans select-text"
      >
        <AnimatePresence mode="sync">

          {/* Nudge (desktop only) */}
          {!isMobile && showNudge && !isOpen && (
            <motion.div
              key="nudge"
              variants={nudgeV}
              initial="hidden"
              animate="visible"
              exit="exit"
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
              <p className="text-gray-200 mt-1 text-xs leading-snug">
                Looking for a dream home in Pune? Chat with our AI now! 🏠
              </p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-gray-800" />
            </motion.div>
          )}

          {/* Chat window (desktop/tablet) */}
          {!isMobile && isOpen && (
            <motion.div
              key="chat-window"
              variants={windowV}
              initial="hidden"
              animate="visible"
              exit="exit"
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

        {/* FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.87 }}
          transition={{ type: "spring", stiffness: 420, damping: 20 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white z-50 shadow-2xl cursor-pointer transition-colors duration-300 touch-manipulation ${
            isOpen
              ? "bg-gray-900 hover:bg-gray-800"
              : "bg-[#25D366] hover:bg-[#22c35e]"
          }`}
          aria-label="Chat with EusRealty"
        >
          {!isOpen && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full bg-[#25D366]"
                animate={{ scale: [1, 1.65], opacity: [0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-[#25D366]"
                animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.75 }}
              />
            </>
          )}
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 528, damping: 22 }}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10"
            >
              {unreadCount}
            </motion.span>
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="wa"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-center"
              >
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