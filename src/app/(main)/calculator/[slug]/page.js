// c:\Users\rahul\eusrealty\src\app\(main)\calculator\[slug]\page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  UNITS, TOP_CALCULATORS, SQM_TO_OTHERS, LENGTH_CONVERSIONS, 
  getUnitKey, getUnitDetails, convertUnits 
} from "@/lib/converters";
import ClientConverter from "./ClientConverter";
import { Ruler, Scale, ChevronRight, BookOpen, Calculator, Info, ArrowLeftRight } from "lucide-react";

export const dynamicParams = true;

// Pre-render the most important conversion combinations at build time
export async function generateStaticParams() {
  const paths = [];
  const allConversations = [...TOP_CALCULATORS, ...SQM_TO_OTHERS, ...LENGTH_CONVERSIONS];
  const uniqueSlugs = new Set();
  
  for (const item of allConversations) {
    const slug = `${item.from}-to-${item.to}`;
    uniqueSlugs.add(slug);
  }
  
  return Array.from(uniqueSlugs).map(slug => ({ slug }));
}

// Generate dynamic metadata for search engines
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parts = slug.split("-to-");
  if (parts.length !== 2) return {};

  const fromKey = getUnitKey(parts[0]);
  const toKey = getUnitKey(parts[1]);

  const fromUnit = getUnitDetails(fromKey);
  const toUnit = getUnitDetails(toKey);

  if (!fromUnit || !toUnit || fromUnit.type !== toUnit.type) {
    return {
      title: "Unit Converter | EUS Realty",
      description: "Convert area and length units."
    };
  }

  const fromName = fromUnit.plural;
  const toName = toUnit.plural;
  const title = `Convert ${fromUnit.name} to ${toUnit.name} | ${fromUnit.name} to ${toUnit.name} Calculator`;
  const description = `Quickly convert ${fromUnit.name} to ${toUnit.name} using our real estate unit converter. Find the formula, step-by-step conversion examples, tables, and definition of ${fromUnit.plural} and ${toUnit.plural}.`;

  return {
    title,
    description,
    keywords: `${fromUnit.name} to ${toUnit.name}, convert ${fromUnit.name} to ${toUnit.name}, ${fromUnit.symbol} to ${toUnit.symbol}, land unit converter, property calculator, ${fromUnit.name} conversion`,
    alternates: {
      canonical: `https://eusrealty.co.in/calculator/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://eusrealty.co.in/calculator/${slug}`,
      type: "website",
    }
  };
}

export default async function ConverterPage({ params }) {
  const { slug } = await params;
  const parts = slug.split("-to-");
  if (parts.length !== 2) {
    notFound();
  }

  const fromKey = getUnitKey(parts[0]);
  const toKey = getUnitKey(parts[1]);

  const fromUnit = getUnitDetails(fromKey);
  const toUnit = getUnitDetails(toKey);

  if (!fromUnit || !toUnit || fromUnit.type !== toUnit.type) {
    notFound();
  }

  const type = fromUnit.type;
  
  // Calculate default values for the conversion table
  const tableValues = [1, 5, 10, 20, 50, 100, 250, 500, 1000, 5000];
  const conversionRate = convertUnits(1, fromKey, toKey);
  const reverseRate = convertUnits(1, toKey, fromKey);

  // Generate dynamic FAQs for structured data (SEO)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do you convert ${fromUnit.name} to ${toUnit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To convert ${fromUnit.plural.toLowerCase()} to ${toUnit.plural.toLowerCase()}, multiply the value in ${fromUnit.plural.toLowerCase()} by the conversion factor of ${conversionRate.toFixed(6)}. For example, to convert 10 ${fromUnit.name} to ${toUnit.name}, calculate: 10 × ${conversionRate.toFixed(6)} = ${(10 * conversionRate).toFixed(4)} ${toUnit.plural.toLowerCase()}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the formula to convert ${fromUnit.name} to ${toUnit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The conversion formula is: Value in ${toUnit.plural} = Value in ${fromUnit.plural} × ${conversionRate.toFixed(6)}.`
        }
      },
      {
        "@type": "Question",
        "name": `How many ${toUnit.plural} are in one ${fromUnit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `There are exactly ${conversionRate.toFixed(6)} ${toUnit.plural.toLowerCase()} in one ${fromUnit.name}.`
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://eusrealty.co.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Calculator",
        "item": "https://eusrealty.co.in/calculator"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${fromUnit.name} to ${toUnit.name}`,
        "item": `https://eusrealty.co.in/calculator/${slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] font-sans pb-12">
      {/* Inject SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero / Header Fold */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 md:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Link 
            href="/calculator"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all mb-6"
          >
            <Calculator size={12} className="text-amber-400" />
            Property Research Calculators
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {fromUnit.name} to {toUnit.name} Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Fast, institutional-grade calculator for real estate measurements. Convert {fromUnit.plural.toLowerCase()} to {toUnit.plural.toLowerCase()} instantly.
          </p>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <ClientConverter 
          initialFromVal={1}
          initialToVal={conversionRate}
          fromUnit={fromUnit}
          toUnit={toUnit}
          fromKey={fromKey}
          toKey={toKey}
          type={type}
          conversionRate={conversionRate}
          unitsDict={UNITS[type]}
        />
      </section>

      {/* Rich SEO Content Fold */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Left Column: Educational Content & Tables */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* About Section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
              <BookOpen size={20} className="text-amber-500" />
              Understanding the Units
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">About {fromUnit.name}</h3>
                <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
                  {fromUnit.description}
                </p>
              </div>
              
              <hr className="border-slate-100" />
              
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">About {toUnit.name}</h3>
                <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
                  {toUnit.description}
                </p>
              </div>

              {fromUnit.regionalNote && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium">
                  {fromUnit.regionalNote}
                </div>
              )}

              {toUnit.regionalNote && !fromUnit.regionalNote && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium">
                  {toUnit.regionalNote}
                </div>
              )}
            </div>
          </div>

          {/* Formula & Steps */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4">
              <Info size={20} className="text-amber-500" />
              How to Convert {fromUnit.name} to {toUnit.name}
            </h2>
            <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed mb-6">
              Converting {fromUnit.plural.toLowerCase()} to {toUnit.plural.toLowerCase()} is simple and straightforward. You just need to multiply the quantity of {fromUnit.plural.toLowerCase()} by the standard multiplier: <span className="font-bold text-slate-800">{conversionRate.toFixed(6)}</span>.
            </p>

            <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-xs sm:text-sm shadow-inner">
              <div className="text-slate-400 mb-1"><span>{'// Formula'}</span></div>
              <div className="text-amber-400 font-bold text-base sm:text-lg">
                Value in {toUnit.plural} = Value in {fromUnit.plural} × {conversionRate.toFixed(6)}
              </div>
              <div className="text-slate-400 mt-4 mb-1"><span>{'// Example Calculation'}</span></div>
              <div>
                To convert 100 {fromUnit.plural.toLowerCase()} to {toUnit.plural.toLowerCase()}:
                <br />
                <span className="text-amber-300">100 {fromUnit.symbol} × {conversionRate.toFixed(6)} = {(100 * conversionRate).toFixed(4)} {toUnit.symbol}</span>
              </div>
            </div>

            <p className="text-slate-500 font-light text-xs sm:text-sm">
              Conversely, to convert {toUnit.plural.toLowerCase()} to {fromUnit.plural.toLowerCase()}, you can divide the value by {conversionRate.toFixed(6)} or multiply by the reverse factor of {reverseRate.toFixed(6)}.
            </p>
          </div>

          {/* Double Conversion Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Table 1: From to To */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 className="font-black text-slate-900 tracking-tight text-base sm:text-lg mb-4 text-center">
                {fromUnit.name} to {toUnit.name} Table
              </h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">{fromUnit.symbol}</th>
                      <th className="px-4 py-3">{toUnit.symbol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-500">
                    {tableValues.map(v => (
                      <tr key={`from-${v}`} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-semibold text-slate-700">{v} {fromUnit.symbol}</td>
                        <td className="px-4 py-2.5">{(v * conversionRate).toLocaleString(undefined, { maximumFractionDigits: 5 })} {toUnit.symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: To to From */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 className="font-black text-slate-900 tracking-tight text-base sm:text-lg mb-4 text-center">
                {toUnit.name} to {fromUnit.name} Table
              </h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">{toUnit.symbol}</th>
                      <th className="px-4 py-3">{fromUnit.symbol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-500">
                    {tableValues.map(v => (
                      <tr key={`to-${v}`} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-semibold text-slate-700">{v} {toUnit.symbol}</td>
                        <td className="px-4 py-2.5">{(v * reverseRate).toLocaleString(undefined, { maximumFractionDigits: 5 })} {fromUnit.symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Other Navigation Links (Highly Crawlable) */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-slate-950 text-lg mb-4 pb-2 border-b border-slate-100 tracking-tight">
              Top Area Calculators
            </h3>
            <div className="flex flex-col gap-2">
              {TOP_CALCULATORS.map((calc, i) => {
                const f = getUnitDetails(calc.from);
                const t = getUnitDetails(calc.to);
                const slug = `${calc.from}-to-${calc.to}`;
                return (
                  <Link 
                    key={`top-${i}`}
                    href={`/calculator/${slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-slate-50/50 p-2 rounded-xl transition-all"
                  >
                    <span>{f?.name} to {t?.name}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-slate-950 text-lg mb-4 pb-2 border-b border-slate-100 tracking-tight">
              Square Meter to other unit
            </h3>
            <div className="flex flex-col gap-2">
              {SQM_TO_OTHERS.map((calc, i) => {
                const f = getUnitDetails(calc.from);
                const t = getUnitDetails(calc.to);
                const slug = `${calc.from}-to-${calc.to}`;
                return (
                  <Link 
                    key={`sqm-${i}`}
                    href={`/calculator/${slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-slate-50/50 p-2 rounded-xl transition-all"
                  >
                    <span>{f?.name} to {t?.name}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-slate-950 text-lg mb-4 pb-2 border-b border-slate-100 tracking-tight">
              Length Conversion Units
            </h3>
            <div className="flex flex-col gap-2">
              {LENGTH_CONVERSIONS.map((calc, i) => {
                const f = getUnitDetails(calc.from);
                const t = getUnitDetails(calc.to);
                const slug = `${calc.from}-to-${calc.to}`;
                return (
                  <Link 
                    key={`len-${i}`}
                    href={`/calculator/${slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-slate-50/50 p-2 rounded-xl transition-all"
                  >
                    <span>{f?.name} to {t?.name}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}
