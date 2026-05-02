'use client';

import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Building2,
  TrendingUp
} from "lucide-react";

export default function DigitalMarketingExecutive() {
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
              Growth & Marketing
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-8">
            Digital Marketing Executive
          </h1>

          {/* Job Meta */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</p>
                <p className="font-medium">Tathawade, Pune</p>
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
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Compensation</p>
                <p className="font-medium text-green-700">Fixed + Performance Incentives</p>
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
                Eus Realty is seeking a Digital Marketing Executive who can
                generate high-quality property leads through online channels.
                You will manage advertising campaigns, optimize digital funnels,
                and work closely with the sales team to convert traffic into
                qualified property buyers across West Pune markets.
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
                  "Plan and execute Meta (Facebook/Instagram) and Google Ads campaigns",
                  "Generate high-quality property leads for sales teams",
                  "Optimize landing pages and lead funnels for better conversions",
                  "Monitor campaign performance and adjust targeting strategies",
                  "Coordinate with sales team to improve lead quality",
                  "Track campaign ROI and generate weekly performance reports"
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
                  "1–3 years experience in digital marketing",
                  "Hands-on experience with Meta Ads and Google Ads",
                  "Understanding of lead generation funnels",
                  "Basic knowledge of SEO and landing page optimization",
                  "Strong analytical and campaign optimization skills",
                  "Experience in real estate marketing is a plus"
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
                  "Competitive fixed salary",
                  "Performance-based incentives",
                  "Opportunity to work with premium real estate brands",
                  "Exposure to large-scale lead generation campaigns",
                  "Fast career growth in marketing leadership roles"
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
              href="https://mail.google.com/mail/?view=cm&fs=1&to=eliteuniqueservices@gmail.com&su=Application%20for%20Digital%20Marketing%20Executive"
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