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
  Star
} from "lucide-react";

export default function SourcingManager() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-white font-sans text-slate-900 relative overflow-hidden">
      
      {/* Background Styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Back Button */}
        <a
          href="/careers"
          className="inline-flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-amber-600 transition-colors duration-300 group tracking-wide text-sm"
        >
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-amber-200 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Careers
        </a>

        {/* Job Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.05)] border border-slate-100 relative">
          
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-amber-500 rounded-b-full"></div>

          {/* Department */}
          <div className="flex items-center mb-8 mt-2">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full shadow-sm">
              Inventory & Developer Relations
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 mt-2 mb-10 tracking-tight leading-[1.1]">
            Sourcing Manager
          </h1>

          {/* Job Meta Details */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-slate-100">
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <MapPin size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Location</p>
                <p className="font-bold text-slate-900">West Pune (Baner / Wakad / Hinjewadi)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <Briefcase size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Employment</p>
                <p className="font-bold text-slate-900">Full-time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <Calendar size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Posted</p>
                <p className="font-bold text-slate-900">12 March 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <Clock size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Expires</p>
                <p className="font-bold text-slate-900">12 April 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <Building2 size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Office</p>
                <p className="font-bold text-slate-900">Tathawade HQ</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-amber-50 border border-amber-100 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                <Handshake size={20} className="text-amber-600 group-hover:text-slate-950 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-amber-600/70 font-bold uppercase tracking-widest mb-0.5">Compensation</p>
                <p className="font-bold text-amber-600">Commission + Incentives</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                Role Overview
              </h2>
              <p className="text-slate-500 leading-relaxed text-lg font-light">
                Eus Realty is seeking a proactive Sourcing Manager responsible
                for building and maintaining relationships with real estate
                developers across Pune. The role focuses on sourcing premium
                residential projects, securing exclusive channel partner
                mandates, and expanding our property inventory to meet growing
                client demand.
              </p>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                Key Responsibilities
              </h2>
              <ul className="space-y-4">
                {[
                  "Identify and onboard new real estate developers and projects.",
                  "Maintain relationships with builder sales teams.",
                  "Negotiate channel partner terms and project inventory allocations.",
                  "Keep updated records of all project inventories and pricing.",
                  "Coordinate with the internal sales team for project launches.",
                  "Monitor market trends and identify high-demand projects."
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 text-slate-600 font-light text-lg">
                    <CheckCircle2
                      size={22}
                      className="text-amber-500 mt-0.5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                Requirements
              </h2>
              <ul className="space-y-4">
                {[
                  "2–5 years experience in real estate sourcing or developer relations.",
                  "Strong network with Pune real estate developers preferred.",
                  "Excellent negotiation and relationship-building skills.",
                  "Understanding of real estate pricing, inventory, and project launches.",
                  "Ability to coordinate between developers and internal sales teams.",
                  "Graduate in business, marketing, or related field."
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 text-slate-600 font-light text-lg">
                    <CheckCircle2
                      size={22}
                      className="text-amber-500 mt-0.5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                Benefits & Perks
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  "Attractive commission-based incentives",
                  "Direct interaction with leading real estate developers",
                  "Opportunity to build strong industry networks",
                  "Fast career growth in real estate leadership roles",
                  "Collaborative and supportive work culture",
                  "Performance-based bonuses"
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 text-slate-600 font-light text-lg items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
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

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ready to join the elite?</h3>
              <p className="text-slate-500 font-light">Send your resume and a brief cover letter.</p>
            </div>
            
            {/* PRIMARY BUTTON: "Building Rise" Animation */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com&su=Application%20for%20Sourcing%20Manager"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex bg-slate-950 text-white px-10 py-5 rounded-2xl font-bold group tracking-wide text-center border border-slate-800 shadow-xl w-full sm:w-auto"
            >
              <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
              <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300 w-full">
                Apply Now <ArrowRight size={18} className="text-amber-400 group-hover:text-slate-950 transition-colors" />
              </span>
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}