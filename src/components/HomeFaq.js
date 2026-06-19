"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Do you charge brokerage for property purchases?",
    a: "No, EusRealty is an official MahaRERA registered strategic strategic partner with Pune's top-tier developers. Our advisory, comparative market analysis, project reports, site visits, and legal transaction support are 100% free of charge to buyers. We receive marketing fee payouts directly from builders, ensuring you save lakhs in intermediate broker commissions."
  },
  {
    q: "What is 'Direct-Builder Pricing' and how does it benefit me?",
    a: "Direct-Builder Pricing means we connect you directly with the developer's senior corporate sales desk, bypassing traditional brokers who mark up rates or control/hide premium inventory. Due to our high transaction volumes, we secure launch benefits, flexible custom payment schedules, and exclusive pre-launch inventory before it is published to the general public."
  },
  {
    q: "Which specific localities in Pune does EusRealty specialize in?",
    a: "We specialize in the high-growth residential corridors of West Pune and premium central zones, including Baner, Wakad, Hinjewadi, Kothrud, Aundh, Tathawade, and Koregaon Park. We analyze local infrastructural developments, corporate tech hubs, and upcoming metro line data to recommend properties with maximum capital appreciation."
  },
  {
    q: "How do you verify the legal security and compliance of listed projects?",
    a: "Every project listed on EusRealty undergoes a rigorous due diligence process. We verify developer track records, structural stability audits, exact carpet area layouts, and official MahaRERA registration certificates. EusRealty is a registered agent (MahaRERA Registration No. A041262501741), guaranteeing complete transparency and zero legal hassles."
  },
  {
    q: "How does the strategic advisory and booking process work?",
    a: "It begins with a free 45-minute strategy call with our expert analysts to align your investment goals and budget. We then provide a curated portfolio comparison report, organize chauffeured site visits with developer sales heads, assist in price negotiations, and support you completely through legal registration, tax paperwork, and key handover."
  }
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-widest mb-5">
              <HelpCircle size={12} className="text-amber-500" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-slate-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed">
              Explore critical insights about our direct-builder models, 0% brokerage policies, and property verification standards.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <Reveal key={idx} delay={idx * 0.08}>
                <div
                  className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "border-amber-500/30 shadow-[0_15px_30px_-10px_rgba(245,158,11,0.06)]"
                      : "border-slate-100 hover:border-amber-200 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex justify-between items-center w-full py-5 sm:py-6 px-6 sm:px-8 font-black text-slate-900 text-left text-sm sm:text-base cursor-pointer select-none group focus:outline-none"
                    aria-expanded={isOpen}
                    id={`faq-title-${idx}`}
                    aria-controls={`faq-content-${idx}`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 transition-transform duration-300 ${
                          isOpen ? "scale-150" : ""
                        }`}
                      />
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform duration-500 group-hover:text-amber-500 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-content-${idx}`}
                        role="region"
                        aria-labelledby={`faq-title-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 sm:px-8 pb-6 text-slate-500 font-light leading-relaxed text-xs sm:text-sm border-t border-slate-50/80 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
