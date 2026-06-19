import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogPageClient from "@/components/BlogPageClient";
import Link from "next/link";
import { Calculator, Home, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 3600; // Cache blog feed for 1 hour

export const metadata = {
  title: "Pune Real Estate Blog | Market Trends, Buying Guides & Investment Tips | EUS Realty",
  description: "Expert insights on Pune real estate. Read market trend analysis, locality comparisons, home buying guides, investment ROI strategies, RERA updates, and home loan tips from EUS Realty advisors.",
  keywords: "Pune real estate blog, property market trends Pune, home buying guide India, real estate investment tips, Baner Wakad property analysis, RERA updates Maharashtra",
  alternates: {
    canonical: "https://eusrealty.co.in/blog",
  },
  openGraph: {
    title: "EUS Insights — Pune Real Estate Intelligence Hub",
    description: "Expert analysis on Pune property market trends, locality reviews, investment strategies, and buyer guides.",
    url: "https://eusrealty.co.in/blog",
    type: "website",
  },
};

const BLOG_FAQS = [
  {
    q: "What are the best areas to invest in Pune real estate in 2025?",
    a: "The top investment areas in Pune for 2025 include Baner (strong appreciation, premium infrastructure), Wakad (IT corridor proximity, excellent rental yield), Hinjawadi (IT Park Phase 3 expansion), Tathawade (upcoming metro connectivity), and Balewadi (commercial growth, High Street ecosystem). West Pune corridors have consistently delivered 10-15% annualized returns over the past 5 years."
  },
  {
    q: "How much have property prices appreciated in Pune over the last 5 years?",
    a: "Pune property prices have appreciated approximately 40-65% over the past 5 years depending on micro-market. Premium West Pune locations like Baner saw 55-65% growth, while Hinjawadi-Wakad corridor appreciated 45-55%. Eastern corridors like Kharadi and Viman Nagar saw 35-50% growth. Our blog provides detailed locality-wise trend analysis with data-backed projections."
  },
  {
    q: "Is it safe to buy under-construction property in Pune?",
    a: "Yes, provided the project is RERA registered (MahaRERA). Under-construction properties typically offer 15-25% lower pricing than ready-to-move-in units, providing significant capital appreciation potential. Always verify: MahaRERA registration number, builder's completion track record, RERA-compliant payment schedule (linked to construction milestones), and bank approvals. EUS Realty only partners with RERA-verified builders."
  },
  {
    q: "What is zero brokerage in real estate and how does it work?",
    a: "Zero brokerage means the home buyer pays no commission or fees to the strategic partner. In the traditional model, brokers charge 1-2% of property value (₹1-2 Lakhs per Crore). Authorized strategic partners like EUS Realty earn their commission directly from the builder — not the buyer — making the purchase cost-neutral while providing professional advisory, site visits, loan assistance, and RERA documentation support."
  },
  {
    q: "How do I verify if a property is RERA registered in Maharashtra?",
    a: "Visit the official MahaRERA website (maharera.maharashtra.gov.in), go to 'Search Project Details', and enter the project name or RERA registration number. The portal shows project approval status, completion timeline, financial details, and developer information. Every legitimate project must display its MahaRERA number in all marketing materials. Our blog regularly covers RERA compliance guides."
  },
  {
    q: "What is the difference between carpet area, built-up area, and super built-up area?",
    a: "Carpet area is the actual usable floor area within walls — this is what RERA mandates for pricing. Built-up area includes carpet area plus wall thickness (typically 10-15% more). Super built-up area adds common areas like lobby, lift, stairs, gym (typically 25-35% more than carpet area). Since RERA, all prices must be quoted per carpet area square foot. Our guides explain how to calculate true cost per sq ft."
  }
];

const MOCK_BLOGS = [
  {
    _id: "mockblog1",
    title: "Tathawade vs Wakad: Which is the Best Investment Hub in West Pune?",
    slug: "tathawade-vs-wakad",
    summary: "An in-depth comparative analysis of price appreciation trends, infrastructure, schools, and rental yields between Tathawade and Wakad corridors.",
    content: "<p>Both Tathawade and Wakad are high-performing corridors in West Pune. While Wakad is more saturated, Tathawade offers higher relative entry appreciation potential...</p>",
    category: "Market Trends",
    tags: ["Wakad", "Tathawade", "Investment Guide", "Pune Real Estate"],
    author: {
      name: "Rahul Upadhyay",
      role: "CTO & Growth Engineer",
      image: "/uploads/Rahul.jpeg"
    },
    readTime: 6,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    status: "Published",
    faqs: [
      { q: "Which locality is closer to Hinjawadi IT Park?", a: "Wakad is closer but Tathawade offers easier highway connectivity, making both commutes roughly 15 minutes." }
    ]
  },
  {
    _id: "mockblog2",
    title: "First-Time Home Buyer Guide: Saving Lakhs with Zero Brokerage",
    slug: "first-time-home-buyer-guide",
    summary: "Learn the secrets of purchasing property in Pune direct from the developer and avoiding costly broker fee marks-ups.",
    content: "<p>Purchasing your first home is a landmark event. However, intermediate fees can add up. By utilizing direct builder strategic partners...</p>",
    category: "Buying Guides",
    tags: ["Zero Brokerage", "Home Loan", "First Time Buyer", "Pune Flats"],
    author: {
      name: "Kunal Verma",
      role: "Catalyst / Director",
      image: "/uploads/Kunal Sir.jpg"
    },
    readTime: 5,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    status: "Published",
    faqs: [
      { q: "Is RERA verification enough for safe purchase?", a: "RERA verification is essential, but you should also check builder track record and occupancy certificate status." }
    ]
  }
];

export default async function BlogPage() {
  let blogs = [];

  try {
    await dbConnect();
    const blogData = await BlogPost.find({ status: "Published" }).sort({ createdAt: -1 }).lean();
    
    blogs = JSON.parse(JSON.stringify(blogData));
  } catch (error) {
    console.warn("Blog posts database query failed. Falling back to MOCK_BLOGS.", error.message);
  }

  // If DB was empty or failed, use mock posts
  if (blogs.length === 0) {
    blogs = MOCK_BLOGS;
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://eusrealty.co.in/blog#collection",
        "name": "EUS Realty Real Estate Blog",
        "url": "https://eusrealty.co.in/blog",
        "description": "Expert insights on Pune real estate: market trends, locality reviews, investment strategies, and home buying guides.",
        "publisher": {
          "@type": "Organization",
          "name": "EUS Realty",
          "url": "https://eusrealty.co.in"
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": blogs.slice(0, 10).map((blog, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://eusrealty.co.in/blog/${blog.slug}`
          }))
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://eusrealty.co.in/blog#faq",
        "mainEntity": BLOG_FAQS.map(faq => ({
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
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://eusrealty.co.in/blog" }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogPageClient initialBlogs={blogs} />

      {/* Server-Rendered FAQ + Cross-Links — fully crawlable by Google */}
      <section className="bg-slate-950 py-16 md:py-24 px-4 sm:px-6 font-sans border-t border-white/5">
        <div className="max-w-5xl mx-auto">

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">
                <BookOpen size={14} /> Pune Real Estate FAQs
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400 font-light mt-3 max-w-2xl mx-auto">
                Common questions about buying property in Pune, RERA verification, market trends, and zero-brokerage purchases.
              </p>
            </div>

            <div className="space-y-3">
              {BLOG_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all"
                >
                  <summary className="flex items-start gap-3 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded mt-0.5 flex-shrink-0">Q</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/calculator"
              className="group bg-slate-900/60 text-white p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Calculator size={18} className="text-cyan-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">ROI Calculator</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">
                Analyze your property investment returns with our institutional-grade ROI calculator. Factor in stamp duty, rental yield, and capital gains.
              </p>
              <span className="text-cyan-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Calculate ROI <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/home-loans"
              className="group bg-slate-900/60 text-white p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Home size={18} className="text-cyan-400" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Loan Eligibility</h3>
              </div>
              <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">
                Check your home loan eligibility instantly. Calculate EMI, FOIR, and LTV ratio with our banking-grade engine.
              </p>
              <span className="text-cyan-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Check Eligibility <ArrowRight size={14} />
              </span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

