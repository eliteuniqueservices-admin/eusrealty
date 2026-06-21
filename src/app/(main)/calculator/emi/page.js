// c:\Users\rahul\eusrealty\src\app\(main)\calculator\emi\page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, BookOpen, Info, RefreshCw, FileText } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState(20); // 20 years default
  const [showSchedule, setShowSchedule] = useState(false);

  // Core Calculations
  const emiCalculations = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    const monthlyEmi = r > 0 
      ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;

    const totalPayment = monthlyEmi * n;
    const totalInterest = totalPayment - P;

    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    // Amortization Schedule
    const yearlySchedule = [];
    let balance = P;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    for (let year = 1; year <= tenureYears; year++) {
      let interestThisYear = 0;
      let principalThisYear = 0;

      for (let m = 1; m <= 12; m++) {
        const interestThisMonth = balance * r;
        const principalThisMonth = monthlyEmi - interestThisMonth;
        
        interestThisYear += interestThisMonth;
        principalThisYear += principalThisMonth;
        balance = Math.max(0, balance - principalThisMonth);
      }

      totalInterestPaid += interestThisYear;
      totalPrincipalPaid += principalThisYear;

      yearlySchedule.push({
        year,
        principalPaid: principalThisYear,
        interestPaid: interestThisYear,
        totalPaid: principalThisYear + interestThisYear,
        remainingBalance: balance
      });
    }

    return {
      monthlyEmi,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
      yearlySchedule
    };
  }, [loanAmount, interestRate, tenureYears]);

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
            Real Estate Financial Tools
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Home Loan EMI Calculator
          </h1>
          <p className="text-slate-400 font-light mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Calculate your monthly payment obligations, interest breakdowns, and generate a complete amortization schedule.
          </p>
        </div>
      </section>

      {/* Main Form Dashboard */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Inputs (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Sliders Container */}
              <div className="space-y-6">
                
                {/* Input 1: Loan Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loan Amount</label>
                    <span className="text-base font-black text-slate-900">{formatINR(loanAmount)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500000" 
                    max="100000000" 
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>₹5 Lakhs</span>
                    <span>₹10 Crores</span>
                  </div>
                </div>

                {/* Input 2: Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interest Rate (% p.a.)</label>
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
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>5%</span>
                    <span>15%</span>
                  </div>
                </div>

                {/* Input 3: Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loan Tenure</label>
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
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>

              </div>

              {/* Direct Value Inputs */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">Amount (₹)</label>
                  <input 
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">Rate (%)</label>
                  <input 
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">Years</label>
                  <input 
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FAFAFB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

            </div>

            {/* Right Output Dashboard (Span 5) */}
            <div className="lg:col-span-5 bg-[#FAFAFB] border border-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* EMI Callout */}
              <div className="text-center pb-6 border-b border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Payment (EMI)</span>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 mt-1.5">
                  {formatINR(emiCalculations.monthlyEmi)}
                </div>
              </div>

              {/* Ratios Breakdown List */}
              <div className="space-y-4 pt-2">
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Principal Amount</span>
                  <span className="text-slate-800 font-black">{formatINR(loanAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Interest Payable</span>
                  <span className="text-slate-800 font-black">{formatINR(emiCalculations.totalInterest)}</span>
                </div>

                <hr className="border-slate-200/50" />

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Total Amount Payable</span>
                  <span className="text-slate-900 font-black text-base">{formatINR(emiCalculations.totalPayment)}</span>
                </div>

              </div>

              {/* Progress Split Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  <span>Principal ({emiCalculations.principalPercent.toFixed(1)}%)</span>
                  <span>Interest ({emiCalculations.interestPercent.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-slate-950" style={{ width: `${emiCalculations.principalPercent}%` }} />
                  <div className="h-full bg-amber-500" style={{ width: `${emiCalculations.interestPercent}%` }} />
                </div>
              </div>

              {/* Schedule CTA */}
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md"
              >
                <FileText size={16} />
                {showSchedule ? "Hide Payment Ledger" : "View Amortization Ledger"}
              </button>

            </div>

          </div>

          {/* Amortization Ledger Section */}
          {showSchedule && (
            <div className="mt-10 pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xl font-black text-slate-950 mb-6 tracking-tight flex items-center gap-2">
                <FileText className="text-amber-500" />
                Year-by-Year Amortization Schedule
              </h3>
              
              <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner">
                <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5">Year</th>
                      <th className="px-5 py-3.5">Principal Paid</th>
                      <th className="px-5 py-3.5">Interest Paid</th>
                      <th className="px-5 py-3.5">Total Paid</th>
                      <th className="px-5 py-3.5">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-500">
                    {emiCalculations.yearlySchedule.map((row) => (
                      <tr key={`year-${row.year}`} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-semibold text-slate-700">Year {row.year}</td>
                        <td className="px-5 py-3">{formatINR(row.principalPaid)}</td>
                        <td className="px-5 py-3">{formatINR(row.interestPaid)}</td>
                        <td className="px-5 py-3 font-medium text-slate-700">{formatINR(row.totalPaid)}</td>
                        <td className="px-5 py-3 font-bold text-slate-800">{formatINR(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Info folds */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Info className="text-amber-500" />
            About Home Loan EMIs
          </h2>
          <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
            Equated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month, so that over a specified number of years, the loan is paid off in full. In the initial years, a major portion of the EMI is allocated toward interest, and as time progresses, a larger share goes toward repaying the principal amount.
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>Calculation Method</strong>: Our calculator uses the standard reducing balance method to amortize payments. Actual banking numbers might vary marginally based on loan processing dates, upfront fee adjustments, or loan servicing policies.
          </div>
        </div>
      </section>

    </main>
  );
}
