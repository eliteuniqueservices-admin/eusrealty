'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import Link from 'next/link';
import { 
  Building2, TrendingUp, DollarSign, Wallet, 
  ArrowRight, ShieldCheck, HelpCircle, BarChart3 
} from 'lucide-react';

const formatINR = (value) => {
  if (value >= 100) {
    return `₹${(value / 100).toFixed(2)} Cr`;
  }
  return `₹${value.toFixed(0)} Lakhs`;
};

export default function RoiCalculatorClient() {
  const [propertyPrice, setPropertyPrice] = useState(80); // In Lakhs
  const [holdPeriod, setHoldPeriod] = useState(5); // In Years
  const [appreciationRate, setAppreciationRate] = useState(8); // In %
  const [propertyType, setPropertyType] = useState('residential'); // residential (3.5% yield) or commercial (7.0% yield)

  const chartRef = useRef(null);

  // Compute ROI Details
  const calculations = useMemo(() => {
    const yieldRate = propertyType === 'residential' ? 0.035 : 0.07;
    const initialPrice = propertyPrice;
    
    // 2% Brokerage Savings
    const brokerageSavings = initialPrice * 0.02;

    // Projected Future Property Value: P * (1 + r)^n
    const futureValue = initialPrice * Math.pow(1 + appreciationRate / 100, holdPeriod);

    // Cumulative Rental Income with 5% annual increase: P * Yield * sum((1.05)^t)
    let totalRent = 0;
    let currentRentYearly = initialPrice * yieldRate;
    for (let t = 0; t < holdPeriod; t++) {
      totalRent += currentRentYearly;
      currentRentYearly *= 1.05; // 5% escalation
    }

    const netInvestmentEus = initialPrice - brokerageSavings;
    const netInvestmentTraditional = initialPrice;

    const totalReturnEus = futureValue + totalRent - netInvestmentEus;
    const totalReturnTraditional = futureValue + totalRent - netInvestmentTraditional - (futureValue * 0.01); // 1% exit brokerage

    const roiEus = (totalReturnEus / netInvestmentEus) * 100;
    const roiTraditional = (totalReturnTraditional / netInvestmentTraditional) * 100;

    // Build timeline data for charts
    const timeline = [];
    for (let y = 0; y <= holdPeriod; y++) {
      const val = initialPrice * Math.pow(1 + appreciationRate / 100, y);
      let accumulatedRent = 0;
      let rentYear = initialPrice * yieldRate;
      for (let t = 0; t < y; t++) {
        accumulatedRent += rentYear;
        rentYear *= 1.05;
      }
      
      const valEus = val + accumulatedRent + brokerageSavings;
      const valTrad = val + accumulatedRent;

      timeline.push({
        year: `Year ${y}`,
        eusGrowth: valEus,
        traditionalGrowth: valTrad
      });
    }

    return {
      brokerageSavings,
      futureValue,
      totalRent,
      totalReturnEus,
      totalReturnTraditional,
      roiEus,
      roiTraditional,
      timeline
    };
  }, [propertyPrice, holdPeriod, appreciationRate, propertyType]);

  // Chart Rendering
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const labels = calculations.timeline.map(t => t.year);
    const eusData = calculations.timeline.map(t => t.eusGrowth);
    const tradData = calculations.timeline.map(t => t.traditionalGrowth);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'EUS Realty (0% Brokerage & Pre-launch Savings)',
            data: eusData,
            borderColor: '#f59e0b', // Amber-500
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 3.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#f59e0b',
            pointHoverRadius: 7
          },
          {
            label: 'Traditional Brokerage (Broker Fee Drag)',
            data: tradData,
            borderColor: '#64748b', // Slate-500
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.35,
            pointBackgroundColor: '#64748b'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: { weight: 'bold', size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatINR(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: '#64748b',
              callback: (val) => formatINR(val)
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          x: {
            ticks: { color: '#64748b' },
            grid: { display: false }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [calculations]);

  return (
    <div className="min-h-screen bg-[#030305] text-[#ededf0] selection:bg-amber-500 selection:text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Background Grids & Radial Glows */}
      <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
            E
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">
              EUS<span className="text-amber-500">Realty</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Investment Desk
            </p>
          </div>
        </Link>
        <Link href="/properties" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors">
          View Projects &rarr;
        </Link>
      </header>

      {/* Calculator Main Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-10">
        
        {/* Left Inputs Panel */}
        <section className="lg:col-span-5 space-y-8 bg-slate-950/40 border border-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-xl">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
              <BarChart3 size={10} /> Projections tool
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              ROI & Yield Projections
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Analyze appreciation trends, cash flow, and zero brokerage parameters for West Pune.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Property Type Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Profile</label>
              <div className="flex bg-[#12121a] p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => setPropertyType('residential')}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${propertyType === 'residential' ? 'bg-white shadow text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Residential (3.5% Yield)
                </button>
                <button
                  onClick={() => setPropertyType('commercial')}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${propertyType === 'commercial' ? 'bg-white shadow text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Commercial (7.0% Yield)
                </button>
              </div>
            </div>

            {/* Slider 1: Property Value */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-450">Investment Value</span>
                <span className="text-amber-500 text-sm font-black">{formatINR(propertyPrice)}</span>
              </div>
              <input
                type="range"
                min="40"
                max="500"
                step="5"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>₹40L</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Slider 2: Hold Period */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-450">Holding Horizon</span>
                <span className="text-amber-500 text-sm font-black">{holdPeriod} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={holdPeriod}
                onChange={(e) => setHoldPeriod(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>1 Year</span>
                <span>15 Years</span>
              </div>
            </div>

            {/* Slider 3: Appreciation Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-450">Estimated Appreciation</span>
                <span className="text-amber-500 text-sm font-black">{appreciationRate}% / Year</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>3% (Conservative)</span>
                <span>15% (Aggressive)</span>
              </div>
            </div>
          </div>

          {/* Savings Highlight Badge */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3.5 mt-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Wallet size={16} />
            </div>
            <div>
              <p className="text-emerald-400 font-extrabold text-xs uppercase tracking-wide">EUS 0% Brokerage Savings</p>
              <p className="text-slate-200 text-xs font-medium mt-0.5">
                You save <span className="font-extrabold text-white">{formatINR(calculations.brokerageSavings)}</span> in middleman commission fees compared to traditional brokers.
              </p>
            </div>
          </div>
        </section>

        {/* Right Dashboard / Graph Section */}
        <section className="lg:col-span-7 space-y-8 flex flex-col justify-between">
          {/* Top Numeric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Future Asset Value</p>
              <h3 className="text-xl md:text-2xl font-black text-white">{formatINR(calculations.futureValue)}</h3>
              <p className="text-[10px] text-slate-500 font-medium">Growth compounding at {appreciationRate}%</p>
            </div>

            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumulative Rent</p>
              <h3 className="text-xl md:text-2xl font-black text-white">{formatINR(calculations.totalRent)}</h3>
              <p className="text-[10px] text-slate-500 font-medium">Yield with 5% annual escalation</p>
            </div>

            <div className="p-5 bg-slate-950/40 border border-amber-500/10 rounded-3xl bg-amber-500/5 space-y-2">
              <p className="text-[10px] font-black text-amber-550 uppercase tracking-widest">Net ROI (Compounded)</p>
              <h3 className="text-xl md:text-2xl font-black text-amber-500">+{calculations.roiEus.toFixed(1)}%</h3>
              <p className="text-[10px] text-slate-500 font-medium">Traditional model: {calculations.roiTraditional.toFixed(1)}%</p>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="bg-slate-950/20 border border-white/5 p-6 rounded-[2.5rem] h-[340px] relative shadow-2xl">
            <canvas ref={chartRef} />
          </div>

          {/* Trust and closing links */}
          <div className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-white font-extrabold text-xs tracking-wide">100% Verified Developer Portfolio</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">MahaRERA Registration Included</p>
              </div>
            </div>
            <Link
              href="/property-matcher"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-6 py-3 rounded-full shadow-lg shadow-amber-500/10 transition-all hover:scale-103 group w-full sm:w-auto"
            >
              Match Your Profile <ArrowRight size={14} className="text-slate-950 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} Elite Unique Services (EUS Realty) · Strategic Real Estate Advisory</p>
      </footer>
    </div>
  );
}
