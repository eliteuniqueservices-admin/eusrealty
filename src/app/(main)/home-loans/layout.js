import Link from 'next/link';
import { Calculator, ArrowRight, TrendingUp, BookOpen, Building2 } from 'lucide-react';

export const metadata = {
  title: "Home Loan Eligibility Calculator | EMI & Mortgage Check Pune | EUS Realty",
  description: "Check your home loan eligibility instantly, calculate EMIs, compare interest rates, and apply for a mortgage in Pune. Free banking-grade eligibility engine by EUS Realty.",
  keywords: "home loan eligibility calculator Pune, EMI calculator, mortgage calculator India, home loan on 50000 salary, housing loan interest rates 2025, home loan Pune",
  alternates: {
    canonical: "https://eusrealty.co.in/home-loans",
  },
  openGraph: {
    title: "Home Loan Eligibility Calculator | EUS Realty Pune",
    description: "Check your home loan eligibility instantly. Calculate EMIs, FOIR, LTV ratio, and get pre-approved for a mortgage in Pune.",
    url: "https://eusrealty.co.in/home-loans",
    type: "website",
  },
};

const HOME_LOAN_FAQS = [
  {
    q: "How much home loan can I get on a ₹50,000 salary?",
    a: "On a monthly salary of ₹50,000 with no existing EMIs, you can typically get a home loan of approximately ₹35-40 Lakhs at 8.5% interest for 20 years. Banks use FOIR (Fixed Obligation to Income Ratio) of 50-60%, meaning your total EMIs (including new home loan) should not exceed ₹25,000-30,000 per month. Your exact eligibility depends on credit score, employer category, existing obligations, and the bank's internal policies."
  },
  {
    q: "What credit score is needed for a home loan in India?",
    a: "Most banks require a minimum CIBIL score of 650 for home loan approval, but a score of 750+ gets you the best interest rates (currently 8.25-8.75% for salaried individuals). Scores between 650-750 may result in slightly higher rates. Below 650, approval becomes difficult. You can improve your score by paying credit card bills on time, keeping credit utilization below 30%, and avoiding multiple loan inquiries."
  },
  {
    q: "What is FOIR and how does it affect loan eligibility?",
    a: "FOIR (Fixed Obligation to Income Ratio) measures what percentage of your monthly income goes toward existing EMIs. Banks typically allow a maximum FOIR of 50-60%. For example, if your monthly income is ₹1,00,000 and your existing EMIs total ₹20,000, your FOIR is 20% — leaving room for a new EMI of ₹30,000-40,000. Lower FOIR means higher loan eligibility."
  },
  {
    q: "What is the current home loan interest rate in Pune?",
    a: "As of 2025, home loan interest rates in Pune range from 8.25% to 9.50% depending on the bank, your credit score, and employment type. SBI offers rates starting at 8.25%, HDFC at 8.35%, ICICI at 8.40%, and Bank of Baroda at 8.30%. Self-employed borrowers typically pay 0.25-0.50% higher than salaried applicants. We help you compare and find the best rate."
  },
  {
    q: "What is LTV ratio and maximum loan amount I can get?",
    a: "LTV (Loan to Value) ratio determines the maximum percentage of property value a bank will finance. Per RBI guidelines: up to 90% for properties valued under ₹30 Lakhs, 80% for ₹30-75 Lakhs, and 75% for properties above ₹75 Lakhs. For a ₹1 Crore property, maximum LTV is 75%, meaning you need at least ₹25 Lakhs as down payment."
  },
  {
    q: "Can self-employed individuals get a home loan?",
    a: "Yes, self-employed professionals and business owners can get home loans. Banks typically require: minimum 3 years of business vintage, last 3 years' ITR (Income Tax Returns), audited financial statements, GST returns, and a CIBIL score above 650. Eligible loan amount is usually calculated at 3-4x of annual net profit instead of the salary-based multiplier used for salaried applicants."
  },
  {
    q: "What documents are needed for a home loan application?",
    a: "For salaried applicants: PAN card, Aadhaar, last 6 months salary slips, Form 16, last 2 years' ITR, 12 months bank statements, property documents, and builder RERA certificate. For self-employed: additional documents include 3 years' ITR with computation, audited balance sheets, P&L statements, GST returns, and business registration proof."
  },
  {
    q: "What are the tax benefits on home loan in India?",
    a: "Home loan borrowers can claim: Section 24(b) deduction up to ₹2 Lakhs per year on interest paid (self-occupied property), Section 80C deduction up to ₹1.5 Lakhs on principal repayment, and Section 80EEA additional ₹1.5 Lakhs for first-time buyers (properties up to ₹45 Lakhs). For joint home loans, both co-borrowers can claim these deductions separately, effectively doubling the tax benefit."
  },
  {
    q: "How long does home loan approval take?",
    a: "Typical home loan processing takes 7-15 business days from application to disbursement. This includes: document verification (2-3 days), credit assessment (2-3 days), property legal and technical verification (3-5 days), and final sanction (1-2 days). Pre-approved or pre-qualified loans through channel partners like EUS Realty can expedite the process to 5-7 days."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://eusrealty.co.in/home-loans#app",
      "name": "EUS Realty Home Loan Eligibility Calculator",
      "url": "https://eusrealty.co.in/home-loans",
      "description": "Check your home loan eligibility instantly, calculate EMIs, and apply for a mortgage in Pune with banking-grade analytics.",
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
      "@id": "https://eusrealty.co.in/home-loans#faq",
      "mainEntity": HOME_LOAN_FAQS.map(faq => ({
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
        { "@type": "ListItem", "position": 2, "name": "Home Loan Calculator", "item": "https://eusrealty.co.in/home-loans" }
      ]
    },
    {
      "@type": "FinancialProduct",
      "name": "Home Loan Eligibility Assessment",
      "description": "Free home loan eligibility check and EMI calculator for Pune properties. Compare rates across banks and get pre-approved.",
      "provider": {
        "@type": "Organization",
        "name": "EUS Realty"
      },
      "areaServed": {
        "@type": "City",
        "name": "Pune"
      }
    }
  ]
};

export default function HomeLoanLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Interactive Calculator (client-rendered) */}
      {children}

      {/* Server-Rendered SEO Content — fully crawlable by Google */}
      <section className="bg-slate-950 py-16 md:py-24 px-4 sm:px-6 font-sans border-t border-white/5">
        <div className="max-w-5xl mx-auto">

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
                <BookOpen size={14} /> Knowledge Base
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Home Loan FAQs
              </h2>
              <p className="text-slate-400 font-light mt-3 max-w-2xl mx-auto">
                Everything you need to know about home loan eligibility, EMI calculations, interest rates, and tax benefits in India.
              </p>
            </div>

            <div className="space-y-3">
              {HOME_LOAN_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all"
                >
                  <summary className="flex items-start gap-3 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded mt-0.5 flex-shrink-0">Q</span>
                    <span className="font-bold text-white text-sm sm:text-base flex-1 pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-slate-400 font-light text-sm sm:text-base leading-relaxed pl-12">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Cross-Link CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/calculator"
              className="group bg-slate-900/60 text-white p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Calculator size={18} className="text-amber-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">ROI Calculator</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">
                Analyze your property investment returns with our institutional-grade ROI and equity buildup tool.
              </p>
              <span className="text-amber-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Calculate ROI <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/properties"
              className="group bg-slate-900/60 text-white p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Building2 size={18} className="text-amber-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Browse Properties</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">
                Explore verified builder-direct properties with zero brokerage across Baner, Wakad, and all of West Pune.
              </p>
              <span className="text-amber-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Properties <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/blog"
              className="group bg-slate-900/60 text-white p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <BookOpen size={18} className="text-amber-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Buying Guides</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">
                Read expert guides on home buying, loan comparison, zero-brokerage strategies, and market analysis.
              </p>
              <span className="text-amber-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Articles <ArrowRight size={14} />
              </span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
