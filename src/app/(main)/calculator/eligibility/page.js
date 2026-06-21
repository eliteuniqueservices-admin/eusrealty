// c:\Users\rahul\eusrealty\src\app\(main)\calculator\eligibility\page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldCheck, Info, FileText } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";

export default function EligibilityCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000); // 1 Lakh default
  const [existingEmi, setExistingEmi] = useState(10000); // 10k default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState(20); // 20 years default

  const eligibility = useMemo(() => {
    const FOIR = 0.50; // Banks allow max 50% of income for EMIs
    const maxTotalEmi = monthlyIncome * FOIR;
    const maxNewEmiAllowed = Math.max(0, maxTotalEmi - existingEmi);

    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    let maxLoanAmount = 0;
    if (maxNewEmiAllowed > 0) {
      maxLoanAmount = r > 0
        ? maxNewEmiAllowed * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
        : maxNewEmiAllowed * n;
    }

    const foirPct = monthlyIncome > 0 ? ((existingEmi + maxNewEmiAllowed) / monthlyIncome) * 100 : 0;
    
    // Suggest property price based on 20% down payment (Property Price = Loan Amount / 0.8)
    const suggestedPropertyPrice = maxLoanAmount / 0.8;

    return {
      maxNewEmiAllowed,
      maxLoanAmount,
      foirPct,
      suggestedPropertyPrice
    };
  }, [monthlyIncome, existingEmi, interestRate, tenureYears]);

  return (
    <main className="min-h-screen bg-[#FCFCFD] font-sans pb-16">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 mb-6">
            <Calculator size={12} className="text-amber-400" />
            Home Loan Research
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Home Loan Eligibility Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Estimate your maximum home loan borrowing limit based on your net income and existing EMIs.
          </p>
        </div>
      </section>

      {/* Calculator Fold */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Inputs Col (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Income input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Monthly Income (₹)</label>
                  <span className="text-base font-black text-slate-900">{formatINR(monthlyIncome)}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="1000000" 
                  step="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                  <span>₹10,000</span>
                  <span>₹10 Lakhs</span>
                </div>
              </div>

              {/* Obligations input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Existing Monthly EMIs (₹)</label>
                  <span className="text-base font-black text-slate-900">{formatINR(existingEmi)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200000" 
                  step="2000"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                  <span>₹0</span>
                  <span>₹2 Lakhs</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Interest Rate (% p.a.)</label>
                  <span className="text-base font-black text-slate-900">{interestRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="15" 
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenure</label>
                  <span className="text-base font-black text-slate-900">{tenureYears} Years</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Direct inputs */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">Net Monthly Salary</label>
                  <input 
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">Other EMIs</label>
                  <input 
                    type="number"
                    value={existingEmi}
                    onChange={(e) => setExistingEmi(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

            </div>

            {/* Output dashboard (Span 5) */}
            <div className="lg:col-span-5 bg-[#FAFAFB] border border-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="text-center pb-6 border-b border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Eligible Loan</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1.5">
                  {eligibility.maxLoanAmount > 0 ? formatINR(eligibility.maxLoanAmount) : "₹0"}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Max New EMI Allowed</span>
                  <span className="text-slate-800 font-black">{formatINR(eligibility.maxNewEmiAllowed)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Debt servicing ratio (FOIR)</span>
                  <span className="text-slate-800 font-black">{eligibility.foirPct.toFixed(0)}% / 50%</span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Suggested Property Value</span>
                  <span className="text-slate-800 font-black">{formatINR(eligibility.suggestedPropertyPrice)}</span>
                </div>
              </div>

              {/* Debt distribution visual */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50">
                <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  <span>Obligations ({(monthlyIncome > 0 ? (existingEmi / monthlyIncome) * 100 : 0).toFixed(0)}%)</span>
                  <span>Available ({(monthlyIncome > 0 ? (eligibility.maxNewEmiAllowed / monthlyIncome) * 100 : 0).toFixed(0)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-red-400" style={{ width: `${monthlyIncome > 0 ? (existingEmi / monthlyIncome) * 100 : 0}%` }} />
                  <div className="h-full bg-emerald-400" style={{ width: `${monthlyIncome > 0 ? (eligibility.maxNewEmiAllowed / monthlyIncome) * 100 : 0}%` }} />
                </div>
              </div>

              <Link href="/properties">
                <button
                  className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md mt-4"
                >
                  Browse Matching Houses
                  <ArrowRight size={16} />
                </button>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* Info Fold */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-amber-500" />
            Home Loan Eligibility Rules
          </h2>
          <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
            Lenders calculate loan eligibility based on your net monthly disposable surplus. Generally, banks restrict your total fixed monthly obligation ratio (FOIR) to 50% of your net monthly salary. This means if you earn ₹1,00,000, your total debt servicing (including any car loans, personal loans, credit card balances, and the new home loan) cannot exceed ₹50,000. 
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>Pro Tip</strong>: You can increase your home loan eligibility by adding a co-applicant (spouse or family member) with a source of income, clearing existing short-term loans, or opting for a longer loan tenure.
          </div>
        </div>
      </section>

    </main>
  );
}
