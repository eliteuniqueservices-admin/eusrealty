// c:\Users\rahul\eusrealty\src\app\(main)\calculator\affordability\page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Wallet, Info } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";

export default function AffordabilityCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(120000); // 1.2L default
  const [existingDebts, setExistingDebts] = useState(15000); // 15k default
  const [downPayment, setDownPayment] = useState(2000000); // 20 Lakhs default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState(20); // 20 years default

  const affordability = useMemo(() => {
    // Standard affordability guidelines: Max 40% of income should go toward home loan EMI
    const maxHomeEmi = Math.max(0, (monthlyIncome * 0.40) - existingDebts);

    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    let maxLoan = 0;
    if (maxHomeEmi > 0) {
      maxLoan = r > 0
        ? maxHomeEmi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
        : maxHomeEmi * n;
    }

    const affordablePropertyPrice = maxLoan + downPayment;
    
    // Percentage contributions
    const downPaymentPercent = affordablePropertyPrice > 0 ? (downPayment / affordablePropertyPrice) * 100 : 0;
    const loanPercent = affordablePropertyPrice > 0 ? (maxLoan / affordablePropertyPrice) * 100 : 0;

    return {
      maxHomeEmi,
      maxLoan,
      affordablePropertyPrice,
      downPaymentPercent,
      loanPercent
    };
  }, [monthlyIncome, existingDebts, downPayment, interestRate, tenureYears]);

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
            Home Budget Planning
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Home Affordability Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Find out how much property budget you can comfortably afford based on your income, savings, and debts.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Inputs Col (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Income slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Monthly Income (₹)</label>
                  <span className="text-base font-black text-slate-900">{formatINR(monthlyIncome)}</span>
                </div>
                <input 
                  type="range" 
                  min="20000" 
                  max="1000000" 
                  step="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Savings (Down Payment) slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upfront Down Payment Available (₹)</label>
                  <span className="text-base font-black text-slate-900">{formatINR(downPayment)}</span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="50000000" 
                  step="100000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Debts slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other Monthly EMI Obligations (₹)</label>
                  <span className="text-base font-black text-slate-900">{formatINR(existingDebts)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150000" 
                  step="2000"
                  value={existingDebts}
                  onChange={(e) => setExistingDebts(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Terms grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Interest Rate (%)</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Tenure (Years)</label>
                  <input 
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

            </div>

            {/* Output dashboard (Span 5) */}
            <div className="lg:col-span-5 bg-[#FAFAFB] border border-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="text-center pb-6 border-b border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Affordable Home Price</span>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 mt-1.5">
                  {formatINR(affordability.affordablePropertyPrice)}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Upfront Cash (Down Payment)</span>
                  <span className="text-slate-800 font-black">{formatINR(downPayment)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Estimated Loan Required</span>
                  <span className="text-slate-800 font-black">{formatINR(affordability.maxLoan)}</span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Estimated Monthly EMI</span>
                  <span className="text-slate-800 font-black">{formatINR(affordability.maxHomeEmi)}</span>
                </div>
              </div>

              {/* Breakdown split visual */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50">
                <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  <span>Down Payment ({affordability.downPaymentPercent.toFixed(0)}%)</span>
                  <span>Loan ({affordability.loanPercent.toFixed(0)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-slate-950" style={{ width: `${affordability.downPaymentPercent}%` }} />
                  <div className="h-full bg-amber-500" style={{ width: `${affordability.loanPercent}%` }} />
                </div>
              </div>

              <Link href="/properties">
                <button
                  className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md mt-4"
                >
                  Find Homes in this Budget
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
            <Wallet className="text-amber-500" />
            Home Affordability Advice
          </h2>
          <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
            Property affordability represents the purchase capability of a buyer without stressing their household cash flows. While banks might approve higher borrowing caps, financial planners suggest utilizing the <strong className="text-slate-800">40% Rule</strong>: Your total monthly EMI payments (existing EMIs + the new home loan) should not exceed 40% of your gross income. This provides a safety cushion for other living requirements, medical contingencies, and family expenditures.
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>Hidden Upfront Costs</strong>: Don&apos;t forget to factor in closing costs such as Maharashtra Stamp Duty (6%), registration charges (1%), and legal documentation/processing fees which typically add around 7-8% of the property value to your cash requirement.
          </div>
        </div>
      </section>

    </main>
  );
}
