// c:\Users\rahul\eusrealty\src\components\CalculatorTabs.js

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { name: "Property ROI", href: "/calculator" },
  { name: "EMI Calculator", href: "/calculator/emi" },
  { name: "Loan Eligibility", href: "/calculator/eligibility" },
  { name: "Affordability", href: "/calculator/affordability" },
  { name: "Valuation Estimator", href: "/calculator/valuation" },
  { name: "Rent Value", href: "/calculator/rent-value" },
  { name: "Area Converter", href: "/calculator/square-meter-to-square-feet" }
];

export default function CalculatorTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 py-4 overflow-x-auto select-none">
      <div className="max-w-5xl mx-auto px-4 flex gap-2 md:gap-3 whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-800">
        {TABS.map((tab) => {
          // Strict check for root /calculator, and prefix checks for nested ones
          const isActive = tab.href === "/calculator"
            ? pathname === "/calculator"
            : pathname === tab.href || 
              (tab.href.includes("square-meter-to-square-feet") && pathname.includes("-to-") && !pathname.includes("emi") && !pathname.includes("eligibility") && !pathname.includes("affordability") && !pathname.includes("valuation") && !pathname.includes("rent-value"));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                isActive
                  ? "bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
