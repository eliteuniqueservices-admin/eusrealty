'use client';

import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Users,
  Handshake,
  ArrowRight,
  Star
} from "lucide-react";

export default function CustomerSuccessAssociate() {
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
              CRM Department
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 mt-2 mb-10 tracking-tight leading-[1.1]">
            Customer Success Associate
          </h1>

          {/* Job Meta Details */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-slate-100">
            <div className="flex items-center gap-4 text-slate-700 group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                <MapPin size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Location</p>
                <p className="font-bold text-slate-900">Pune, Maharashtra</p>
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
                <p className="font-bold text-amber-600">Fixed + Bonus</p>
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
                Eus Realty is looking for a highly driven Customer Success Associate to
                manage client relationships throughout the luxury property buying
                journey. You will ensure that clients receive a flawless, premium
                experience from inquiry to registration while maintaining
                strong communication between buyers, our sales force, and top-tier developers.
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
                  "Manage incoming VIP customer inquiries and assist them through the property buying process.",
                  "Maintain regular, professional follow-ups with potential and existing clients.",
                  "Coordinate seamlessly between the sales team and customers for site visits and legal documentation.",
                  "Maintain and update customer portfolios within our proprietary CRM system.",
                  "Ensure highest levels of customer satisfaction and engagement to drive referrals.",
                  "Resolve customer queries related to premium projects, bookings, and compliance documents."
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
                  "0–2 years experience in customer support, CRM, or high-end client handling.",
                  "Impeccable communication and interpersonal skills.",
                  "Strong organizational and multitasking ability in a fast-paced environment.",
                  "Comfortable utilizing modern CRM tools and analytics dashboards.",
                  "Graduate in any discipline preferred."
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
                  "Competitive fixed salary package",
                  "Aggressive performance-based bonuses",
                  "Fast-tracked professional growth",
                  "Advanced real estate CRM training",
                  "Elite, collaborative work environment"
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
              href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com&su=Application%20for%20Customer%20Success%20Associate"
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