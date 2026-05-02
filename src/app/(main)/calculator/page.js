"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calculator, ArrowUpRight, TrendingUp, AlertTriangle, Shield, MapPin, DollarSign, Activity } from "lucide-react";
import Reveal from "@/components/Reveal"; // Ensure this matches your project structure
import jsPDF from "jspdf";
import { Chart } from "chart.js/auto";

export default function ROICalculator() {
  const reportRef = useRef();
  const chartRef = useRef();

  // 1. Acquisition & Financing
  const [cost, setCost] = useState(10000000);
  const [financingType, setFinancingType] = useState("loan");
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);
  const [stampDutyRate, setStampDutyRate] = useState(6.0); // e.g., Maharashtra
  const [brokerageBuy, setBrokerageBuy] = useState(1.0);

  // 2. Income & Operations (Annual)
  const [rentalYield, setRentalYield] = useState(3.0);
  const [rentalGrowth, setRentalGrowth] = useState(5.0); // Rent increases YoY
  const [propertyTax, setPropertyTax] = useState(0.3); // % of property value
  const [maintenance, setMaintenance] = useState(0.2); // % of property value

  // 3. Disposition (Selling)
  const [sellingPrice, setSellingPrice] = useState(18000000);
  const [purchaseYear, setPurchaseYear] = useState(new Date().getFullYear());
  const [yearsHeld, setYearsHeld] = useState(10);
  const [brokerageSell, setBrokerageSell] = useState(1.0);
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState(20.0); // Standard LTCG

  // 4. Meta
  const [location, setLocation] = useState("Hinjewadi");
  const [clientName, setClientName] = useState("");

  // ==========================================
  // FINANCIAL CALCULATIONS
  // ==========================================

  const loanAmount = financingType === "loan" ? Math.max(cost - downPayment, 0) : 0;
  
  // Acquisition Costs
  const stampDutyCost = cost * (stampDutyRate / 100);
  const buyBrokerageCost = cost * (brokerageBuy / 100);
  const totalAcquisitionCost = cost + stampDutyCost + buyBrokerageCost;
  
  // Actual cash out of pocket at purchase
  const initialCashInvested = financingType === "loan" 
    ? downPayment + stampDutyCost + buyBrokerageCost 
    : totalAcquisitionCost;

  // Loan Calculations
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanYears * 12;
  const monthsHeld = yearsHeld * 12;
  
  const emi = loanAmount > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;
  
  const annualEMI = emi * 12;

  // Loan Amortization (Remaining Principal at year of sale)
  const remainingLoanBalance = loanAmount > 0 && monthsHeld < totalMonths
    ? loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsHeld)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  // Operational Cash Flows over holding period
  let totalRentalIncome = 0;
  let totalMaintenanceAndTaxes = 0;
  let currentRent = cost * (rentalYield / 100);

  for (let i = 0; i < yearsHeld; i++) {
    totalRentalIncome += currentRent;
    currentRent *= (1 + rentalGrowth / 100); // Rent compounds
    totalMaintenanceAndTaxes += (cost * (propertyTax / 100)) + (cost * (maintenance / 100));
  }

  const totalHoldingCost = totalMaintenanceAndTaxes + (annualEMI * yearsHeld);
  const totalNetOperatingIncome = totalRentalIncome - totalMaintenanceAndTaxes;
  const totalCashFlow = totalNetOperatingIncome - (annualEMI * yearsHeld); // Can be negative

  // Disposition (Sale) Calculations
  const sellBrokerageCost = sellingPrice * (brokerageSell / 100);
  
  // Capital Gains (Simplified: Sale Price - Acq Cost. Ignoring indexation for base formula)
  const capitalGains = Math.max((sellingPrice - sellBrokerageCost) - totalAcquisitionCost, 0);
  const taxPaid = capitalGains * (capitalGainsTaxRate / 100);

  // Net Proceeds from Sale
  const netProceedsFromSale = sellingPrice - sellBrokerageCost - remainingLoanBalance - taxPaid;

  // Final ROI Math
  const totalNetProfit = netProceedsFromSale + totalCashFlow - initialCashInvested;
  
  // Cash on Cash (CoC) Return: Average annual pre-tax cash flow / Total cash invested
  const averageAnnualCashFlow = totalCashFlow / yearsHeld;
  const cashOnCashReturn = initialCashInvested > 0 ? (averageAnnualCashFlow / initialCashInvested) * 100 : 0;

  // Annualized ROI (Net IRR Approximation)
  const totalReturnMultiplier = (netProceedsFromSale + totalRentalIncome - totalHoldingCost - taxPaid) / initialCashInvested;
  const annualizedROI = initialCashInvested > 0 && totalReturnMultiplier > 0 
    ? (Math.pow(totalReturnMultiplier, 1 / yearsHeld) - 1) * 100 
    : 0;

  // UI Helpers
  const riskLevel = financingType === "loan" && cashOnCashReturn < 0 && emi > (currentRent/12) ? "High" : annualizedROI > 12 ? "Low" : "Medium";
  const isGoodInvestment = annualizedROI > 9;

  // Chart Data
  const chartData = useMemo(() => {
    const labels = [];
    const equityData = []; // How much of the property you actually "own" (Value - Loan)
    
    let currentPropValue = cost;
    const valueGrowthRate = Math.pow(sellingPrice / cost, 1 / yearsHeld) - 1; // Implied growth rate
    
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
            label: 'Your Equity Built (Property Value - Remaining Debt)',
            data: chartData.equityData,
            borderColor: '#10b981', // Emerald
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
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

  // 1. Enhanced Formatting Helper
  const formatINR = (num) => {
    const absNum = Math.abs(num);
    if (absNum >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (absNum >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  // 2. Image Loader Helper
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

  // 3. Chart Generator (Fixed Scaling & White Background)
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
          data: chartData.equityData, // Ensure these numbers are raw (e.g., 110000000)
          borderWidth: 4, 
          tension: 0.4,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#1e40af'
        }] 
      },
      options: { 
        responsive: false, 
        animation: false,
        scales: {
          y: { 
            ticks: { 
              font: { size: 14 }, 
              callback: (value) => formatINR(value) // Corrects the 1Cr vs 11Cr axis 
            } 
          },
          x: { ticks: { font: { size: 14 } } }
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 600)); 
    const image = canvas.toDataURL("image/jpeg", 1.0);
    chart.destroy();
    return image;
  };

  // 4. Premium PDF Generator
  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const chartImage = await createChartImage();
    
    let logo = null, qr = null;
    try { logo = await loadImage("/logo.png"); } catch (e) {}
    try { qr = await loadImage("/MahaRERA QR_CODE.png"); } catch (e) {}

    // Grid System Helper (Solves Text Truncation) 
    const drawRow = (y, label, value, isBold = false) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100); // Gray for labels
      
      const wrappedLabel = pdf.splitTextToSize(label, 100); 
      pdf.text(wrappedLabel, 25, y);

      const labelHeight = wrappedLabel.length * 4.5;
      
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      pdf.setFontSize(isBold ? 11 : 10);

      // FIXED: Using Hex strings instead of arrays for setTextColor
      // Also ensuring 'value' is a string before checking .includes()
      const stringValue = String(value);
      if (isBold && stringValue.includes('%')) {
        pdf.setTextColor("#10b981"); // Emerald Green
      } else if (isBold) {
        pdf.setTextColor("#1e3a8a"); // Blue
      } else {
        pdf.setTextColor("#1e1e1e"); // Dark Gray/Black
      }
      
      pdf.text(stringValue, pageWidth - 25, y + (labelHeight / 2) - 2, { align: "right" });
      
      pdf.setDrawColor(240, 240, 240);
      const nextY = y + Math.max(labelHeight, 8) + 2;
      pdf.line(25, nextY, pageWidth - 25, nextY);
      return nextY;
    };

    // --- HEADER SECTION ---
    pdf.setFillColor(30, 58, 138); 
    pdf.rect(0, 0, pageWidth, 45, "F");
    if (logo) pdf.addImage(logo, "PNG", 15, 10, 25, 25);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Investment Analysis Report", 45, 22);
    
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Elite Unique Services | MahaRERA: A041262501741", 45, 28);
    pdf.text("Tathawade, Pune | Ph: 7620733613", 45, 33);
    if (qr) pdf.addImage(qr, "PNG", pageWidth - 35, 10, 25, 25);

    // --- SUMMARY HERO BOX ---
    let y = 60;
    pdf.setFillColor(245, 250, 255);
    pdf.roundedRect(20, y, pageWidth - 40, 30, 2, 2, "F");
    
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(11);
    pdf.text("ANNUALIZED ROI (IRR)", 30, y + 12);
    pdf.setFontSize(24);
    pdf.text(`${annualizedROI}%`, 30, y + 23);

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.text("TOTAL NET PROFIT", pageWidth - 30, y + 12, { align: "right" });
    pdf.setTextColor(16, 185, 129);
    pdf.setFontSize(18);
    pdf.text(formatINR(totalNetProfit), pageWidth - 30, y + 23, { align: "right" });

    // --- DATA GRID ---
    y += 45;
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(13);
    pdf.text("Detailed Performance Breakdown", 20, y);
    y += 8;

    y = drawRow(y, "Initial Property Cost", formatINR(cost));
    y = drawRow(y, "Acquisition Costs (Stamp Duty/Fees)", formatINR(initialCashInvested - downPayment));
    y = drawRow(y, "Total Capital Committed", formatINR(initialCashInvested), true);
    y = drawRow(y, "Projected Selling Price", formatINR(sellingPrice));
    y = drawRow(y, "Estimated Rental Income (Holding Period)", formatINR(totalNetOperatingIncome)); // Ensure this variable exists in your state
    y = drawRow(y, "Post-Tax Net Proceeds", formatINR(netProceedsFromSale));
    y = drawRow(y, "Cash on Cash Return", `${cashOnCashReturn.toFixed(2)}%`, true);

    // --- CHART ---
    y += 15;
    pdf.setFontSize(12);
    pdf.text("Equity Buildup Projection", 20, y);
    y += 5;
    pdf.addImage(chartImage, "JPEG", 25, y, pageWidth - 50, 75);

    // --- FOOTER ---
    y += 85;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const disclaimer = "Disclaimer: This report is based on projected market trends and user inputs. Real estate investments carry risk. Consult a financial advisor before investing.";
    pdf.text(pdf.splitTextToSize(disclaimer, pageWidth - 40), 20, y);

    pdf.save(`Investment_Report_${location}.pdf`);
  };

  return (
    <main className="min-h-screen bg-slate-900 py-16 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-900/50 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-emerald-800">
              <Activity size={16} />
              Investor Grade Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Real Estate Pro <span className="text-emerald-400">ROI Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate actual net returns factoring in taxes, closing costs, loan amortization, and operational cash flow.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-8 space-y-6">
            <Reveal>
              <div className="bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-700">
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                  Acquisition & Financing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase">Purchase Price</label>
                    <div className="text-2xl font-black text-white mb-2">{formatINR(cost)}</div>
                    <input type="range" min="1000000" max="100000000" step="500000" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase">Stamp Duty (%)</label>
                    <input type="number" value={stampDutyRate} onChange={(e) => setStampDutyRate(Number(e.target.value))} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-bold text-gray-400 uppercase block mb-3">Financing Type</label>
                  <div className="flex gap-4">
                    <button onClick={() => setFinancingType("cash")} className={`flex-1 py-3 rounded-xl font-semibold transition ${financingType === "cash" ? "bg-blue-600 text-white" : "bg-slate-900 text-gray-400 border border-slate-700"}`}>All Cash</button>
                    <button onClick={() => setFinancingType("loan")} className={`flex-1 py-3 rounded-xl font-semibold transition ${financingType === "loan" ? "bg-blue-600 text-white" : "bg-slate-900 text-gray-400 border border-slate-700"}`}>Bank Loan</button>
                  </div>
                </div>

                {financingType === "loan" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <label className="text-xs text-gray-400 uppercase">Down Payment</label>
                      <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-800 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase">Interest Rate (%)</label>
                      <input type="number" value={interestRate} step="0.1" onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-800 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase">Tenure (Years)</label>
                      <input type="number" value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-800 text-white text-sm" />
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-6 mt-10 flex items-center gap-2 border-b border-slate-700 pb-4">
                  <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                  Income & Exit Strategy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase">Expected Selling Price</label>
                    <div className="text-2xl font-black text-emerald-400 mb-2">{formatINR(sellingPrice)}</div>
                    <input type="range" min={cost} max={cost * 5} step="500000" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase">Years Held</label>
                    <div className="text-2xl font-black text-white mb-2">{yearsHeld} Years</div>
                    <input type="range" min="1" max="30" step="1" value={yearsHeld} onChange={(e) => setYearsHeld(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Rental Yield (%)</label>
                    <input type="number" step="0.1" value={rentalYield} onChange={(e) => setRentalYield(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Rent Growth (%)</label>
                    <input type="number" step="0.1" value={rentalGrowth} onChange={(e) => setRentalGrowth(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Tax/Maint (%)</label>
                    <input type="number" step="0.1" value={propertyTax + maintenance} onChange={(e) => {
                      setPropertyTax(Number(e.target.value) / 2);
                      setMaintenance(Number(e.target.value) / 2);
                    }} className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Capital Gains Tax (%)</label>
                    <input type="number" value={capitalGainsTaxRate} onChange={(e) => setCapitalGainsTaxRate(Number(e.target.value))} className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                  </div>
                </div>

              </div>
            </Reveal>

            {/* Chart Area */}
            <Reveal>
              <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-white">Equity Buildup Over Time</h3>
                <p className="text-xs text-gray-400 mb-4">Shows your property value minus your remaining loan balance.</p>
                <div className="h-64">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky Results Panel */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="bg-slate-800 rounded-3xl p-8 text-white sticky top-8 border border-slate-700 shadow-2xl">
                
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Net Annualized Return</p>
                <h2 className="text-6xl font-black mb-1">{annualizedROI.toFixed(1)}<span className="text-3xl text-gray-400">%</span></h2>
                <p className="text-sm text-gray-400 mb-8 border-b border-slate-700 pb-6">Post-tax, post-debt IRR equivalent</p>

                <div className="space-y-4 text-sm">
                  
                  {/* Invested */}
                  <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                    <span className="text-gray-400">Initial Cash Invested</span>
                    <span className="font-bold">{formatINR(initialCashInvested)}</span>
                  </div>

                  {/* Cashflow */}
                  <div className="flex justify-between items-center p-2">
                    <span className="text-gray-400">Avg Annual Cash Flow</span>
                    <span className={averageAnnualCashFlow >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {formatINR(averageAnnualCashFlow)}
                    </span>
                  </div>
                  
                  {/* Out at Sale */}
                  <div className="flex justify-between items-center p-2">
                    <span className="text-gray-400">Net Proceeds at Sale</span>
                    <span className="font-bold">{formatINR(netProceedsFromSale)}</span>
                  </div>

                  {/* Total Profit */}
                  <div className="flex justify-between items-center p-2 border-t border-slate-700 pt-4">
                    <span className="text-gray-300 font-bold">Total Net Profit</span>
                    <span className={totalNetProfit >= 0 ? "text-emerald-400 font-black text-lg" : "text-red-400 font-black text-lg"}>
                      {formatINR(totalNetProfit)}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-700">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                      <p className="text-xs text-gray-400 uppercase mb-1">Cash on Cash</p>
                      <p className="font-bold text-blue-400">{cashOnCashReturn.toFixed(1)}%</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                      <p className="text-xs text-gray-400 uppercase mb-1">Risk Profile</p>
                      <p className={`font-bold ${riskLevel === "Low" ? "text-emerald-400" : riskLevel === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{riskLevel}</p>
                    </div>
                  </div>

                </div>

                <button onClick={downloadPDF} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl mt-8 font-bold transition-all duration-300 shadow-lg shadow-emerald-900/50">
                  Export Investor Report
                </button>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </main>
  );
}