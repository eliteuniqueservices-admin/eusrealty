import Link from "next/link";
import { BarChart3, Building2, HelpCircle, MapPin, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { cityFaqs, localityMetrics, popularSearchLinks } from "@/lib/seoData";

const budgetLinks = [
  { label: "Flats under Rs. 75 Lakh in Pune", href: "/properties/flats-under-75-lakh-in-pune" },
  { label: "Flats under Rs. 1 Cr in Pune", href: "/properties/flats-under-1-cr-in-hinjawadi" },
  { label: "Luxury flats above Rs. 2 Cr", href: "/properties/luxury-flats-in-baner" },
];

const bhkLinks = [
  { label: "1 BHK flats in Pune", href: "/properties/1-bhk-flats-in-pune" },
  { label: "2 BHK flats in Baner Pune", href: "/properties/2-bhk-flats-in-baner-pune" },
  { label: "3 BHK flats in Wakad Pune", href: "/properties/3-bhk-flats-in-wakad-pune" },
  { label: "4 BHK luxury flats in Pune", href: "/properties/luxury-flats-in-baner" },
];

const statusLinks = [
  { label: "Ready to move flats in Pune", href: "/properties/ready-to-move-flats-in-pune" },
  { label: "New launch projects in Pune", href: "/properties/new-launch-projects-in-pune" },
  { label: "RERA approved projects in Pune", href: "/properties/rera-approved-projects-in-pune" },
  { label: "No brokerage flats in Pune", href: "/properties/no-brokerage-flats-in-pune" },
];

const resaleLinks = [
  { label: "Resale flats in Pune", href: "/properties/no-brokerage-flats-in-pune" },
  { label: "Resale apartments in Baner", href: "/properties/2-bhk-flats-in-baner-pune" },
  { label: "Ready resale homes in Wakad", href: "/properties/3-bhk-flats-in-wakad-pune" },
];

const luxuryLinks = [
  { label: "Luxury apartments in Pune", href: "/properties/luxury-flats-in-baner" },
  { label: "Villas for sale in Pune", href: "/pune-real-estate" },
  { label: "Penthouses in Koregaon Park", href: "/pune-real-estate" },
];

const commercialLinks = [
  { label: "Commercial properties in Hinjawadi", href: "/properties/location/hinjawadi" },
  { label: "Shops for sale in Baner Pune", href: "/properties/location/baner" },
  { label: "Office space in Wakad", href: "/properties/location/wakad" },
];

function LinkGroup({ title, links }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesSeoBlocks({ totalCount = 0 }) {
  const localities = Object.entries(localityMetrics);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cityFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <section className="bg-[#F8F9FA] px-4 pb-24 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3 className="text-amber-500" size={24} />
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Pune Property Price Trends</h2>
              <p className="text-sm text-slate-500">
                Locality data for flats, houses, villas, new projects, resale homes and luxury apartments in Pune.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                  <th className="px-4 py-3">Locality</th>
                  <th className="px-4 py-3">Avg Price</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">1-Year Trend</th>
                  <th className="px-4 py-3">Rental Yield</th>
                  <th className="px-4 py-3">Connectivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localities.map(([slug, item]) => (
                  <tr key={slug} className="hover:bg-amber-50/30">
                    <td className="px-4 py-4">
                      <Link href={`/localities/${slug}`} className="font-black text-slate-900 hover:text-amber-600">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400">{item.region}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{item.avgPrice}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                        <Star size={12} className="fill-emerald-500" /> {item.rating}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 font-black text-emerald-600">
                        <TrendingUp size={14} /> {item.yearlyGrowth}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{item.rentalYield}</td>
                    <td className="px-4 py-4 text-slate-500">{item.metro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LinkGroup title="Popular Localities" links={localities.map(([slug, item]) => ({ label: `${item.name} properties`, href: `/properties/location/${slug}` }))} />
          <LinkGroup title="Regions" links={[{ label: "West Pune properties", href: "/pune-real-estate" }, { label: "PCMC properties", href: "/pune-real-estate" }, { label: "Hinjawadi IT corridor", href: "/properties/location/hinjawadi" }]} />
          <LinkGroup title="Budget Searches" links={budgetLinks} />
          <LinkGroup title="BHK Searches" links={bhkLinks} />
          <LinkGroup title="Status Searches" links={statusLinks} />
          <LinkGroup title="Resale Searches" links={resaleLinks} />
          <LinkGroup title="Luxury Searches" links={luxuryLinks} />
          <LinkGroup title="Commercial Searches" links={commercialLinks} />
          <LinkGroup title="High-Intent Searches" links={popularSearchLinks} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <HelpCircle className="text-amber-500" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">FAQs About Flats for Sale in Pune</h2>
          </div>
          <div className="space-y-4">
            {cityFaqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <summary className="cursor-pointer font-black text-slate-900">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "RERA-Verified Inventory", text: `${totalCount} listed opportunities with legal verification and channel-partner support.` },
            { icon: Building2, title: "Direct Builder Pricing", text: "Get launch offers, floor-plan access and payment-plan guidance without buyer brokerage." },
            { icon: MapPin, title: "Pune Local Expertise", text: "Compare Baner, Wakad, Hinjawadi, Tathawade, Balewadi, Aundh and PCMC with advisor context." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Icon className="mb-4 text-amber-500" />
              <h3 className="text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
