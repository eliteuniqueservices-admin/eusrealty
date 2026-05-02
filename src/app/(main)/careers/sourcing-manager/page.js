'use client';

import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Layers,
  Handshake
} from "lucide-react";

export default function SourcingManager() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <a
          href="/careers"
          className="flex items-center gap-2 text-gray-600 font-medium mb-12 hover:text-blue-700 transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Careers
        </a>

        {/* Job Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200">

          {/* Department */}
          <div className="flex items-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-700 bg-blue-100 px-4 py-2 rounded-lg">
              Inventory & Developer Relations
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-8">
            Sourcing Manager
          </h1>

          {/* Job Meta */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</p>
                <p className="font-medium">West Pune (Baner / Wakad / Hinjewadi)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Employment Type</p>
                <p className="font-medium">Full-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Posted</p>
                <p className="font-medium">12 March 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Expires</p>
                <p className="font-medium">12 April 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Office</p>
                <p className="font-medium">Tathawade HQ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Handshake size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Compensation</p>
                <p className="font-medium text-green-700">Commission + Incentives</p>
              </div>
            </div>
          </div>
          <div className="space-y-12">

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                Job Overview
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                Key Responsibilities
              </h2>
              <ul className="space-y-4">
                {[
                  "Identify and onboard new real estate developers and projects",
                  "Maintain relationships with builder sales teams",
                  "Negotiate channel partner terms and project inventory allocations",
                  "Keep updated records of all project inventories and pricing",
                  "Coordinate with the internal sales team for project launches",
                  "Monitor market trends and identify high-demand projects"
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 text-gray-700">
                    <CheckCircle2
                      size={20}
                      className="text-blue-600 mt-0.5 shrink-0"
                    />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                Requirements
              </h2>
              <ul className="space-y-4">
                {[
                  "2–5 years experience in real estate sourcing or developer relations",
                  "Strong network with Pune real estate developers preferred",
                  "Excellent negotiation and relationship-building skills",
                  "Understanding of real estate pricing, inventory, and project launches",
                  "Ability to coordinate between developers and internal sales teams",
                  "Graduate in business, marketing, or related field"
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 text-gray-700">
                    <CheckCircle2
                      size={20}
                      className="text-blue-600 mt-0.5 shrink-0"
                    />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                Benefits & Perks
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Attractive commission-based incentives",
                  "Direct interaction with leading real estate developers",
                  "Opportunity to build strong industry networks",
                  "Fast career growth in real estate leadership roles",
                  "Collaborative and supportive work culture",
                  "Performance-based bonuses"
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 text-gray-700">
                    <CheckCircle2
                      size={20}
                      className="text-green-600 mt-0.5 shrink-0"
                    />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* CTA */}
          <div className="mt-14 pt-10 border-t border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-6">Ready to apply?</p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com&su=Application%20for%20Sourcing%20Manager"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Apply Now
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Send your resume and a brief cover letter to our careers team.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}