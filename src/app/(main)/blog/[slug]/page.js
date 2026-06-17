import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogPostDetailClient from "@/components/BlogPostDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Cache individual blog detail for 1 hour

const MOCK_BLOGS = [
  {
    _id: "mockblog1",
    title: "Tathawade vs Wakad: Which is the Best Investment Hub in West Pune?",
    slug: "tathawade-vs-wakad",
    summary: "An in-depth comparative analysis of price appreciation trends, infrastructure, schools, and rental yields between Tathawade and Wakad corridors.",
    content: `
      <h2>Introduction</h2>
      <p>Both Tathawade and Wakad are high-performing corridors in West Pune. While Wakad is more saturated, Tathawade offers higher relative entry appreciation potential.</p>
      <h2>Market Appreciation & Capital Value Comparison</h2>
      <p>Wakad has developed into a premium micro-market with property rates ranging from ₹7,500 to ₹9,500 per sq. ft. On the other hand, Tathawade rates stand at ₹6,000 to ₹7,800 per sq. ft., showing an annual appreciation of over 8.5% over the past three years.</p>
      <h2>Infrastructure and Connectivity</h2>
      <p>Both locations enjoy supreme connectivity to the Mumbai-Pune Expressway and the Hinjawadi IT Park. However, Wakad benefits from established social structures, while Tathawade boasts proximity to key educational institutes like Indira College and JSPM.</p>
      <h2>Verdict: Where Should You Invest?</h2>
      <p>For immediate rental income, Wakad is highly suitable. For mid-to-long term ROI, Tathawade direct-developer properties present maximum growth.</p>
    `,
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
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mockblog2",
    title: "First-Time Home Buyer Guide: Saving Lakhs with Zero Brokerage",
    slug: "first-time-home-buyer-guide",
    summary: "Learn the secrets of purchasing property in Pune direct from the developer and avoiding costly broker fee marks-ups.",
    content: `
      <h2>The Brokerage Illusion</h2>
      <p>Many traditional buyers assume brokers provide unbiased advice, but traditional brokerage fees (1-2%) can translate to lakhs of rupees on premium Pune real estate.</p>
      <h2>Benefits of Direct-Developer Purchases</h2>
      <p>By bypassing mediators and utilizing verified Direct-to-Developer platforms like EUS Realty, you get early inventory choice, pre-launch price slabs, and zero extra brokerage commissions.</p>
      <h2>Key Negotiation Pillars</h2>
      <p>When booking directly, request developers for stamp duty absorption, builder subvention schedules, or free modular kitchens. These are often easier to secure without middle-agent commission overheads.</p>
    `,
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
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function generateStaticParams() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({ status: "Published" }, { slug: 1 }).lean();
    
    // Add default mock slugs to static params so they build successfully
    const dbSlugs = posts.map((post) => ({ slug: post.slug }));
    const mockSlugs = MOCK_BLOGS.map((post) => ({ slug: post.slug }));
    
    // De-duplicate slugs
    const allSlugs = [...dbSlugs, ...mockSlugs];
    const uniqueSlugsMap = new Map();
    allSlugs.forEach((item) => uniqueSlugsMap.set(item.slug, item));
    
    return Array.from(uniqueSlugsMap.values());
  } catch (error) {
    console.error("Failed to generate static params for blogs:", error.message);
    return MOCK_BLOGS.map((post) => ({ slug: post.slug }));
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = null;

  try {
    await dbConnect();
    post = await BlogPost.findOne({ slug, status: "Published" }).lean();
  } catch (error) {
    console.error("Metadata query failed for blog slug:", slug);
  }

  // Fallback to Mock posts
  if (!post) {
    post = MOCK_BLOGS.find((b) => b.slug === slug);
  }

  if (!post) {
    return {
      title: "Blog Not Found | EUS Realty",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | EUS Realty`,
    description: post.summary,
    alternates: {
      canonical: `https://eusrealty.co.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://eusrealty.co.in/blog/${post.slug}`,
      images: [
        {
          url: post.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },
  };
}

export default async function BlogPostDetailPage({ params }) {
  const { slug } = await params;
  let post = null;
  let related = [];

  try {
    await dbConnect();
    const blogData = await BlogPost.findOne({ slug, status: "Published" }).lean();
    if (blogData) {
      post = JSON.parse(JSON.stringify(blogData));

      // Query related posts in the same category
      const relatedData = await BlogPost.find({
        status: "Published",
        slug: { $ne: slug },
        category: post.category
      }).limit(3).lean();

      related = JSON.parse(JSON.stringify(relatedData));

      // If category matches are insufficient, backfill with general published blogs
      if (related.length < 3) {
        const extraData = await BlogPost.find({
          status: "Published",
          slug: { $ne: slug },
          _id: { $nin: related.map(r => r._id) }
        }).limit(3 - related.length).lean();

        related = [
          ...related,
          ...JSON.parse(JSON.stringify(extraData))
        ];
      }
    }
  } catch (error) {
    console.error("Database lookup failed for blog slug:", slug, error.message);
  }

  // Fallback to MOCK_BLOGS if not found in DB
  if (!post) {
    const mockPost = MOCK_BLOGS.find((b) => b.slug === slug);
    if (mockPost) {
      post = mockPost;
      related = MOCK_BLOGS.filter((b) => b.slug !== slug);
    }
  }

  if (!post) {
    notFound();
  }

  // Generate Structured Data (JSON-LD)
  const jsonLdBlob = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://eusrealty.co.in/blog/${post.slug}#article`,
        "url": `https://eusrealty.co.in/blog/${post.slug}`,
        "headline": post.title,
        "description": post.summary,
        "image": post.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "jobTitle": post.author.role
        },
        "publisher": {
          "@type": "Organization",
          "name": "EUS Realty",
          "logo": {
            "@type": "ImageObject",
            "url": "https://eusrealty.co.in/logo.png"
          }
        }
      }
    ]
  };

  if (post.faqs && post.faqs.length > 0) {
    jsonLdBlob["@graph"].push({
      "@type": "FAQPage",
      "@id": `https://eusrealty.co.in/blog/${post.slug}#faq`,
      "mainEntity": post.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlob) }}
      />
      <BlogPostDetailClient post={post} relatedPosts={related} />
    </>
  );
}
