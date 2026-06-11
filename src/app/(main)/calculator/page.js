"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calculator, ArrowUpRight, TrendingUp, AlertTriangle, Shield, MapPin, DollarSign, Activity, Star, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import jsPDF from "jspdf";
import { Chart } from "chart.js/auto";
import { formatINR } from "@/lib/formatCurrency";


export default function ROICalculator() {
  const reportRef = useRef();
  const chartRef = useRef();

  // 1. Acquisition & Financing
  const [cost, setCost] = useState(10000000);
  const [financingType, setFinancingType] = useState("loan");
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);
  const [stampDutyRate, setStampDutyRate] = useState(6.0); 
  const [brokerageBuy, setBrokerageBuy] = useState(0.0); // Defaulted to 0 for Zero Brokerage Channel Partner

  // 2. Income & Operations (Annual)
  const [rentalYield, setRentalYield] = useState(3.0);
  const [rentalGrowth, setRentalGrowth] = useState(5.0); 
  const [propertyTax, setPropertyTax] = useState(0.3); 
  const [maintenance, setMaintenance] = useState(0.2); 

  // 3. Disposition (Selling)
  const [sellingPrice, setSellingPrice] = useState(18000000);
  const [purchaseYear, setPurchaseYear] = useState(new Date().getFullYear());
  const [yearsHeld, setYearsHeld] = useState(10);
  const [brokerageSell, setBrokerageSell] = useState(1.0);
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState(20.0); 

  // 4. Meta
  const [location, setLocation] = useState("Pune");

  // ==========================================
  // FINANCIAL CALCULATIONS (Unchanged)
  // ==========================================
  const loanAmount = financingType === "loan" ? Math.max(cost - downPayment, 0) : 0;
  
  const stampDutyCost = cost * (stampDutyRate / 100);
  const buyBrokerageCost = cost * (brokerageBuy / 100);
  const totalAcquisitionCost = cost + stampDutyCost + buyBrokerageCost;
  
  const initialCashInvested = financingType === "loan" 
    ? downPayment + stampDutyCost + buyBrokerageCost 
    : totalAcquisitionCost;

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanYears * 12;
  const monthsHeld = yearsHeld * 12;
  
  const emi = loanAmount > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;
  
  const annualEMI = emi * 12;

  const remainingLoanBalance = loanAmount > 0 && monthsHeld < totalMonths
    ? loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsHeld)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  let totalRentalIncome = 0;
  let totalMaintenanceAndTaxes = 0;
  let currentRent = cost * (rentalYield / 100);

  for (let i = 0; i < yearsHeld; i++) {
    totalRentalIncome += currentRent;
    currentRent *= (1 + rentalGrowth / 100); 
    totalMaintenanceAndTaxes += (cost * (propertyTax / 100)) + (cost * (maintenance / 100));
  }

  const totalHoldingCost = totalMaintenanceAndTaxes + (annualEMI * yearsHeld);
  const totalNetOperatingIncome = totalRentalIncome - totalMaintenanceAndTaxes;
  const totalCashFlow = totalNetOperatingIncome - (annualEMI * yearsHeld); 

  const sellBrokerageCost = sellingPrice * (brokerageSell / 100);
  const capitalGains = Math.max((sellingPrice - sellBrokerageCost) - totalAcquisitionCost, 0);
  const taxPaid = capitalGains * (capitalGainsTaxRate / 100);

  const netProceedsFromSale = sellingPrice - sellBrokerageCost - remainingLoanBalance - taxPaid;
  const totalNetProfit = netProceedsFromSale + totalCashFlow - initialCashInvested;
  
  const averageAnnualCashFlow = totalCashFlow / yearsHeld;
  const cashOnCashReturn = initialCashInvested > 0 ? (averageAnnualCashFlow / initialCashInvested) * 100 : 0;

  const totalReturnMultiplier = (netProceedsFromSale + totalRentalIncome - totalHoldingCost - taxPaid) / initialCashInvested;
  const annualizedROI = initialCashInvested > 0 && totalReturnMultiplier > 0 
    ? (Math.pow(totalReturnMultiplier, 1 / yearsHeld) - 1) * 100 
    : 0;

  const riskLevel = financingType === "loan" && cashOnCashReturn < 0 && emi > (currentRent/12) ? "High" : annualizedROI > 12 ? "Low" : "Medium";

  // Chart Data
  const chartData = useMemo(() => {
    const labels = [];
    const equityData = []; 
    
    let currentPropValue = cost;
    const valueGrowthRate = Math.pow(sellingPrice / cost, 1 / yearsHeld) - 1; 
    
    for (let i = 0; i <= yearsHeld; i++) {
      labels.push(purchaseYear + i);
      
      const mos = i * 12;
      const loanRem = loanAmount > 0 && mos < totalMonths
        ? loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, mos)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : 0;

      const equity = currentPropValue - loanRem;
      equityData.push(equity);
      
      currentPropValue *= (1 + valueGrowthRate);
    }
    return { labels, equityData };
  }, [cost, sellingPrice, yearsHeld, purchaseYear, loanAmount, monthlyRate, totalMonths]);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Your Equity Built (Value - Debt)',
            data: chartData.equityData,
            borderColor: '#f59e0b', // Amber-500
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          plugins: {
            tooltip: { callbacks: { label: (context) => formatINR(context.parsed.y) } }
          },
          scales: {
            y: { ticks: { callback: (value) => formatINR(value) } }
          }
        }
      });
      return () => chart.destroy();
    }
  }, [chartData]);



  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("Image load failed"));
    });
  };

  const createChartImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const chart = new Chart(ctx, {
      type: "line",
      data: { 
        labels: chartData.labels, 
        datasets: [{ 
          label: "Equity Built (Value - Debt)", 
          data: chartData.equityData, 
          borderWidth: 4, 
          tension: 0.4,
          borderColor: '#f59e0b', // Amber
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#0f172a' // Slate
        }] 
      },
      options: { 
        responsive: false, 
        animation: false,
        scales: {
          y: { ticks: { font: { size: 14 }, callback: (value) => formatINR(value) } },
          x: { ticks: { font: { size: 14 } } }
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 600)); 
    const image = canvas.toDataURL("image/jpeg", 1.0);
    chart.destroy();
    return image;
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const chartImage = await createChartImage();
    
    let logo = null, qr = null;
    try { logo = await loadImage("/logo.png"); } catch (e) {}
    try { qr = await loadImage("/MahaRERA QR_CODE.png"); } catch (e) {}

    const drawRow = (y, label, value, isBold = false) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100); 
      
      const wrappedLabel = pdf.splitTextToSize(label, 100); 
      pdf.text(wrappedLabel, 25, y);

      const labelHeight = wrappedLabel.length * 4.5;
      
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      pdf.setFontSize(isBold ? 11 : 10);

      const stringValue = String(value);
      if (isBold && stringValue.includes('%')) {
        pdf.setTextColor("#f59e0b"); // Amber
      } else if (isBold) {
        pdf.setTextColor("#0f172a"); // Slate-950
      } else {
        pdf.setTextColor("#334155"); // Slate-700
      }
      
      pdf.text(stringValue, pageWidth - 25, y + (labelHeight / 2) - 2, { align: "right" });
      
      pdf.setDrawColor(240, 240, 240);
      const nextY = y + Math.max(labelHeight, 8) + 2;
      pdf.line(25, nextY, pageWidth - 25, nextY);
      return nextY;
    };

    // Header updated to Slate-950
    pdf.setFillColor(2, 6, 23); 
    pdf.rect(0, 0, pageWidth, 45, "F");
    if (logo) pdf.addImage(logo, "PNG", 15, 10, 25, 25);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Investment Analysis Report", 45, 22);
    
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Authorized Channel Partner | MahaRERA: A041262501741", 45, 28);
    pdf.text("Pune, Maharashtra | Ph: 7620733613", 45, 33);
    if (qr) pdf.addImage(qr, "PNG", pageWidth - 35, 10, 25, 25);

    let y = 60;
    pdf.setFillColor(248, 250, 252); // Slate-50
    pdf.roundedRect(20, y, pageWidth - 40, 30, 2, 2, "F");
    
    pdf.setTextColor(15, 23, 42); // Slate-900
    pdf.setFontSize(11);
    pdf.text("ANNUALIZED ROI (IRR)", 30, y + 12);
    pdf.setFontSize(24);
    pdf.text(`${annualizedROI.toFixed(1)}%`, 30, y + 23);

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.text("TOTAL NET PROFIT", pageWidth - 30, y + 12, { align: "right" });
    pdf.setTextColor(245, 158, 11); // Amber
    pdf.setFontSize(18);
    pdf.text(formatINR(totalNetProfit), pageWidth - 30, y + 23, { align: "right" });

    y += 45;
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(13);
    pdf.text("Detailed Performance Breakdown", 20, y);
    y += 8;

    y = drawRow(y, "Initial Property Cost", formatINR(cost));
    y = drawRow(y, "Acquisition Costs (Stamp Duty/Fees)", formatINR(initialCashInvested - downPayment));
    y = drawRow(y, "Total Capital Committed", formatINR(initialCashInvested), true);
    y = drawRow(y, "Projected Selling Price", formatINR(sellingPrice));
    y = drawRow(y, "Estimated Rental Income (Holding Period)", formatINR(totalNetOperatingIncome)); 
    y = drawRow(y, "Post-Tax Net Proceeds", formatINR(netProceedsFromSale));
    y = drawRow(y, "Cash on Cash Return", `${cashOnCashReturn.toFixed(2)}%`, true);

    y += 15;
    pdf.setFontSize(12);
    pdf.text("Equity Buildup Projection", 20, y);
    y += 5;
    pdf.addImage(chartImage, "JPEG", 25, y, pageWidth - 50, 75);

    y += 85;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const disclaimer = "Disclaimer: This report is based on projected market trends and user inputs. Real estate investments carry risk. Consult a financial advisor before investing.";
    pdf.text(pdf.splitTextToSize(disclaimer, pageWidth - 40), 20, y);

    pdf.save(`Investment_Report_${location}.pdf`);
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] selection:bg-amber-500 selection:text-white py-16 md:py-24 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs md:text-sm font-bold shadow-sm mb-6">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="tracking-wide text-slate-700">Institutional Grade Analytics</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-slate-950">
              Property <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">ROI Calculator</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-light md:text-lg">
              Forecast your exact net returns by factoring in taxes, closing costs, loan amortization, and operational cash flow.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Luxury Dark Card) */}
          <div className="lg:col-span-8 space-y-6">
            <Reveal>
              <div className="bg-slate-950 p-6 md:p-10 rounded-[2rem] shadow-2xl border border-slate-800 text-white relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3 border-b border-slate-800 pb-5 tracking-tight">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                  Acquisition & Financing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Purchase Price</label>
                    <div className="text-3xl font-black text-white mb-3 mt-1">{formatINR(cost)}</div>
                    <input type="range" min="1000000" max="100000000" step="500000" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stamp Duty (%)</label>
                    <input type="number" value={stampDutyRate} onChange={(e) => setStampDutyRate(Number(e.target.value))} className="w-full mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Financing Type</label>
                  <div className="flex gap-4 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                    <button 
                      onClick={() => setFinancingType("cash")} 
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${financingType === "cash" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      All Cash
                    </button>
                    <button 
                      onClick={() => setFinancingType("loan")} 
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${financingType === "loan" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      Bank Loan
                    </button>
                  </div>
                </div>

                {financingType === "loan" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Down Payment</label>
                      <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interest Rate (%)</label>
                      <input type="number" value={interestRate} step="0.1" onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenure (Years)</label>
                      <input type="number" value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium text-sm" />
                    </div>
                  </div>
                )}

                <h3 className="text-xl md:text-2xl font-black mb-6 mt-12 flex items-center gap-3 border-b border-slate-800 pb-5 tracking-tight">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                  Income & Exit Strategy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Selling Price</label>
                    <div className="text-3xl font-black text-amber-400 mb-3 mt-1">{formatINR(sellingPrice)}</div>
                    <input type="range" min={cost} max={cost * 5} step="500000" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Years Held</label>
                    <div className="text-3xl font-black text-white mb-3 mt-1">{yearsHeld} Years</div>
                    <input type="range" min="1" max="30" step="1" value={yearsHeld} onChange={(e) => setYearsHeld(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Rental Yield (%)</label>
                    <input type="number" step="0.1" value={rentalYield} onChange={(e) => setRentalYield(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Rent Growth (%)</label>
                    <input type="number" step="0.1" value={rentalGrowth} onChange={(e) => setRentalGrowth(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Tax/Maint (%)</label>
                    <input type="number" step="0.1" value={propertyTax + maintenance} onChange={(e) => {
                      setPropertyTax(Number(e.target.value) / 2);
                      setMaintenance(Number(e.target.value) / 2);
                    }} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Cap Gains Tax (%)</label>
                    <input type="number" value={capitalGainsTaxRate} onChange={(e) => setCapitalGainsTaxRate(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 outline-none font-medium" />
                  </div>
                </div>

              </div>
            </Reveal>

            {/* Chart Area */}
            <Reveal>
              <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.05)] border border-slate-100">
                <h3 className="text-xl font-black mb-2 text-slate-900 tracking-tight">Equity Buildup Projection</h3>
                <p className="text-sm text-slate-500 mb-6 font-light">Visualizing your property value appreciation minus remaining loan debt.</p>
                <div className="h-72 w-full">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky Results Panel */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white sticky top-8 border border-slate-800 shadow-2xl">
                
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Net Annualized Return</p>
                <h2 className="text-6xl font-black mb-2 tracking-tighter">{annualizedROI.toFixed(1)}<span className="text-3xl text-slate-500 ml-1">%</span></h2>
                <p className="text-sm text-slate-400 mb-8 border-b border-slate-800 pb-6 font-light">Post-tax, post-debt IRR equivalent</p>

                <div className="space-y-4 text-sm font-medium">
                  
                  {/* Invested */}
                  <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400">Total Cash Invested</span>
                    <span className="font-bold text-base">{formatINR(initialCashInvested)}</span>
                  </div>

                  {/* Cashflow */}
                  <div className="flex justify-between items-center p-2 px-1">
                    <span className="text-slate-400">Avg Annual Cash Flow</span>
                    <span className={averageAnnualCashFlow >= 0 ? "text-amber-400 font-bold" : "text-red-400 font-bold"}>
                      {formatINR(averageAnnualCashFlow)}
                    </span>
                  </div>
                  
                  {/* Out at Sale */}
                  <div className="flex justify-between items-center p-2 px-1">
                    <span className="text-slate-400">Net Proceeds at Sale</span>
                    <span className="font-bold text-white">{formatINR(netProceedsFromSale)}</span>
                  </div>

                  {/* Total Profit */}
                  <div className="flex justify-between items-center p-2 px-1 border-t border-slate-800 pt-5 mt-2">
                    <span className="text-slate-300 font-bold">Total Net Profit</span>
                    <span className={totalNetProfit >= 0 ? "text-amber-400 font-black text-xl" : "text-red-400 font-black text-xl"}>
                      {formatINR(totalNetProfit)}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-slate-800">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Cash on Cash</p>
                      <p className="font-bold text-white text-lg">{cashOnCashReturn.toFixed(1)}%</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Risk Profile</p>
                      <p className={`font-bold text-lg ${riskLevel === "Low" ? "text-amber-400" : riskLevel === "Medium" ? "text-white" : "text-red-400"}`}>{riskLevel}</p>
                    </div>
                  </div>

                </div>

                {/* PRIMARY CTA: "Building Rise" Animation applied to PDF Export */}
                <button 
                  onClick={downloadPDF} 
                  className="relative overflow-hidden w-full bg-white text-slate-950 font-bold py-5 rounded-2xl mt-8 shadow-xl tracking-wide group transition-all"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300">
                    Export Strategy Report
                    <ArrowRight size={18} className="text-amber-500 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
                  </span>
                </button>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </main>
  );
}