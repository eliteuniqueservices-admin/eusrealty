import Link from 'next/link';
import { Calculator, ArrowRight, Home, TrendingUp, BookOpen } from 'lucide-react';

export const metadata = {
  title: "Property ROI & EMI Calculator | Pune Real Estate Investment Tool | EUS Realty",
  description: "Calculate property ROI, annualized IRR, EMI, stamp duty, capital gains tax, and equity buildup for Pune real estate investments. Free institutional-grade analytics by EUS Realty.",
  keywords: "ROI calculator Pune real estate, property investment calculator, EMI calculator Pune, stamp duty calculator Maharashtra, real estate ROI India, property appreciation calculator Pune",
  alternates: {
    canonical: "https://eusrealty.co.in/calculator",
  },
  openGraph: {
    title: "Property ROI & EMI Calculator | EUS Realty Pune",
    description: "Free institutional-grade property ROI calculator. Analyze EMI, stamp duty, capital gains, rental yield, and equity buildup for Pune real estate.",
    url: "https://eusrealty.co.in/calculator",
    type: "website",
  },
};

const CALCULATOR_FAQS = [
  {
    q: "How is property ROI calculated in Pune real estate?",
    a: "Property ROI in Pune is calculated by factoring in purchase price, stamp duty (6% in Maharashtra), registration charges, rental income yield (typically 2.5-4% in Pune), annual appreciation (historically 8-12% in West Pune corridors like Baner and Wakad), maintenance costs, and capital gains tax. Our calculator provides annualized IRR (Internal Rate of Return) which is the most accurate measure of real estate investment performance."
  },
  {
    q: "What is a good ROI for property investment in Pune?",
    a: "A good ROI for Pune real estate typically ranges between 10-15% annualized returns when combining rental income and capital appreciation. Premium locations like Baner, Wakad, Hinjawadi, and Balewadi have historically delivered 12-18% annualized returns for direct-builder purchases with zero brokerage through authorized channel partners like EUS Realty."
  },
  {
    q: "How much stamp duty do I pay on property in Maharashtra?",
    a: "Stamp duty in Maharashtra is currently 6% of the property agreement value or circle rate (whichever is higher) for properties in Pune Municipal Corporation areas. Additionally, registration charges of 1% apply. For women buyers, stamp duty is 5% — a 1% concession. Our calculator automatically factors in these costs for accurate net return projections."
  },
  {
    q: "What is the EMI for a 1 Crore home loan at 8.5% interest?",
    a: "For a ₹1 Crore home loan at 8.5% annual interest rate with a 20-year tenure, the monthly EMI is approximately ₹86,782. With a 30-year tenure, it drops to ₹76,891. Our calculator lets you adjust all parameters including down payment amount, interest rate, and loan tenure to find the optimal financing structure."
  },
  {
    q: "How does rental yield affect property investment returns?",
    a: "Rental yield directly impacts your cash-on-cash return during the holding period. In Pune, residential rental yields range from 2.5% to 4.5% depending on location and property type. Premium 2-3 BHK apartments near IT hubs like Hinjawadi typically offer higher yields (3.5-4.5%) due to strong rental demand from IT professionals."
  },
  {
    q: "What is capital gains tax on property sale in India?",
    a: "Long-term capital gains (property held over 2 years) are taxed at 20% with indexation benefit, which significantly reduces taxable gain. Short-term gains (under 2 years) are taxed at your income tax slab rate. You can save capital gains tax by reinvesting in another residential property under Section 54 or in specified bonds under Section 54EC within the prescribed time limits."
  },
  {
    q: "Is it better to buy property with cash or home loan?",
    a: "Home loans offer tax benefits (Section 24 deduction up to ₹2L on interest, Section 80C up to ₹1.5L on principal) and leverage your returns. With an 8.5% loan and 12% property appreciation, your equity multiplier significantly boosts ROI compared to all-cash purchases. Our calculator shows the exact difference between loan-financed and cash purchases."
  },
  {
    q: "How to calculate equity buildup in real estate?",
    a: "Equity buildup = Current property market value minus remaining loan balance. As you pay EMIs, the principal component reduces your debt while the property appreciates in value, creating a dual wealth-building effect. Our calculator visualizes this with a year-by-year equity projection chart showing your net worth growth from the investment."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://eusrealty.co.in/calculator#app",
      "name": "EUS Realty Property ROI & EMI Calculator",
      "url": "https://eusrealty.co.in/calculator",
      "description": "Free institutional-grade property ROI calculator for Pune real estate. Analyze EMI, stamp duty, capital gains, rental yield, and equity buildup projections.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "provider": {
        "@type": "Organization",
        "name": "EUS Realty",
        "url": "https://eusrealty.co.in"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://eusrealty.co.in/calculator#faq",
      "mainEntity": CALCULATOR_FAQS.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://eusrealty.co.in" },
        { "@type": "ListItem", "position": 2, "name": "ROI Calculator", "item": "https://eusrealty.co.in/calculator" }
      ]
    }
  ]
};

export default function CalculatorLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Interactive Calculator (client-rendered) */}
      {children}

      {/* Server-Rendered SEO Content — fully crawlable by Google */}
      <section className="bg-[#FDFDFD] py-16 md:py-24 px-4 sm:px-6 font-sans">
        <div className="max-w-5xl mx-auto">

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
                <BookOpen size={14} className="text-amber-500" /> Knowledge Base
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 font-light mt-3 max-w-2xl mx-auto">
                Everything you need to know about property ROI, EMI calculations, and real estate investment analysis in Pune.
              </p>
            </div>

            <div className="space-y-4">
              {CALCULATOR_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <summary className="flex items-start gap-3 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded mt-0.5 flex-shrink-0">Q</span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base flex-1 pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-slate-500 font-light text-sm sm:text-base leading-relaxed pl-12">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Cross-Link CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <Link
              href="/home-loans"
              className="group bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Home size={18} className="text-amber-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Loan Eligibility</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed flex-1">
                Check your home loan eligibility instantly with our banking-grade engine. Get pre-approved in minutes.
              </p>
              <span className="text-amber-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Check Eligibility <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/properties"
              className="group bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={18} className="text-slate-600" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Browse Properties</h3>
              </div>
              <p className="text-slate-500 text-sm font-light mb-4 leading-relaxed flex-1">
                Explore verified builder-direct properties across Baner, Wakad, Balewadi, and all of West Pune.
              </p>
              <span className="text-amber-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                View Properties <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/blog"
              className="group bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-slate-600" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Investment Insights</h3>
              </div>
              <p className="text-slate-500 text-sm font-light mb-4 leading-relaxed flex-1">
                Read expert analysis on Pune market trends, locality comparisons, and buying strategies.
              </p>
              <span className="text-amber-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Read Articles <ArrowRight size={14} />
              </span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
