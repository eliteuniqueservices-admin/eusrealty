"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  Calculator, ArrowUpRight, TrendingUp, AlertTriangle, Shield, MapPin, 
  DollarSign, Activity, Star, ArrowRight, Download, RefreshCw, FileText,
  Info, Percent, Calendar, ShieldCheck
} from "lucide-react";
import Reveal from "@/components/Reveal";
import jsPDF from "jspdf";
import { Chart } from "chart.js/auto";
import { formatINR } from "@/lib/formatCurrency";

export default function ROICalculator() {
  const chartRef = useRef();

  // ─── 1. Acquisition & Financing ─────────────────────────────────
  const [cost, setCost] = useState(15000000); // Default 1.5 Cr
  const [stampDutyRate, setStampDutyRate] = useState(6.0);
  const [registrationRate, setRegistrationRate] = useState(1.0);
  const [legalFees, setLegalFees] = useState(50000);
  const [brokerageBuy, setBrokerageBuy] = useState(0.0); // Zero brokerage strategic partner

  const [financingType, setFinancingType] = useState("loan");
  const [downPayment, setDownPayment] = useState(3000000); // 20% down
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  // ─── 2. Operational Income & Outgoings (Annualized) ─────────────
  const [rentalYield, setRentalYield] = useState(3.5);
  const [rentalGrowth, setRentalGrowth] = useState(5.0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.3); // % of cost per year
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(4000); // Society maintenance
  const [insuranceAnnual, setInsuranceAnnual] = useState(12000);

  // ─── 3. Exit / Disposition Strategy ─────────────────────────────
  const [sellingPrice, setSellingPrice] = useState(28000000);
  const [purchaseYear] = useState(new Date().getFullYear());
  const [yearsHeld, setYearsHeld] = useState(8);
  const [brokerageSell, setBrokerageSell] = useState(1.0);
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState(20.0);

  // Meta details
  const [location, setLocation] = useState("Pune");

  // Real Data Presets
  const applyPreset1 = () => {
    setCost(15000000); // 1.5 Cr
    setDownPayment(3000000); // 20%
    setSellingPrice(28000000); // 2.8 Cr
    setYearsHeld(8);
    setRentalYield(3.5);
    setRentalGrowth(5.0);
    setInterestRate(8.5);
    setFinancingType("loan");
    setStampDutyRate(6.0);
    setRegistrationRate(1.0);
    setLegalFees(50000);
    setPropertyTaxRate(0.3);
    setMaintenanceMonthly(4000);
    setInsuranceAnnual(12000);
    setBrokerageSell(1.0);
    setCapitalGainsTaxRate(20.0);
  };

  const applyPreset2 = () => {
    setCost(45000000); // 4.5 Cr
    setDownPayment(10000000); // 22%
    setSellingPrice(85000000); // 8.5 Cr
    setYearsHeld(10);
    setRentalYield(4.0);
    setRentalGrowth(6.0);
    setInterestRate(8.2);
    setFinancingType("loan");
    setStampDutyRate(6.0);
    setRegistrationRate(1.0);
    setLegalFees(80000);
    setPropertyTaxRate(0.3);
    setMaintenanceMonthly(10000);
    setInsuranceAnnual(25000);
    setBrokerageSell(1.0);
    setCapitalGainsTaxRate(20.0);
  };

  // ─── Financial Calculations ─────────────────────────────────────
  const calculations = useMemo(() => {
    const stampDutyCost = cost * (stampDutyRate / 100);
    const registrationCost = cost * (registrationRate / 100);
    const buyBrokerageCost = cost * (brokerageBuy / 100);
    
    // Total closing cost at buy-time
    const totalAcquisitionCost = stampDutyCost + registrationCost + buyBrokerageCost + legalFees;
    const totalCapitalOutlay = cost + totalAcquisitionCost;
    
    // Initial cash invested down-payment plus acquisition closing costs
    const initialCashInvested = financingType === "loan"
      ? downPayment + totalAcquisitionCost
      : totalCapitalOutlay;

    const loanAmount = financingType === "loan" ? Math.max(cost - downPayment, 0) : 0;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanYears * 12;
    const monthsHeld = yearsHeld * 12;

    const emi = loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

    let totalGrossRent = 0;
    let totalOpEx = 0;
    let totalEMIsPaid = 0;
    let totalInterestPaidHolding = 0;
    let remainingBalance = loanAmount;

    const yearlyProjections = [];
    let currentPropValue = cost;
    let currentRentVal = cost * (rentalYield / 100);
    let currentOpExVal = (cost * (propertyTaxRate / 100)) + (maintenanceMonthly * 12) + insuranceAnnual;
    
    // Calculate geometric appreciation rate based on target selling price
    const appreciationRate = Math.pow(sellingPrice / cost, 1 / yearsHeld) - 1;

    for (let y = 1; y <= yearsHeld; y++) {
      let emiPaidThisYear = 0;
      let interestPaidThisYear = 0;
      let principalPaidThisYear = 0;

      if (financingType === "loan") {
        for (let m = 1; m <= 12; m++) {
          const globalMonth = (y - 1) * 12 + m;
          if (globalMonth <= totalMonths) {
            emiPaidThisYear += emi;
            const interestThisMonth = remainingBalance * monthlyRate;
            const principalThisMonth = emi - interestThisMonth;
            interestPaidThisYear += interestThisMonth;
            principalPaidThisYear += principalThisMonth;
            remainingBalance = Math.max(remainingBalance - principalThisMonth, 0);
          }
        }
      }

      const netRentThisYear = currentRentVal - currentOpExVal;
      const netCashFlowThisYear = netRentThisYear - emiPaidThisYear;

      totalGrossRent += currentRentVal;
      totalOpEx += currentOpExVal;
      totalEMIsPaid += emiPaidThisYear;
      totalInterestPaidHolding += interestPaidThisYear;

      currentPropValue *= (1 + appreciationRate);

      yearlyProjections.push({
        year: y,
        propertyValue: currentPropValue,
        loanBalance: remainingBalance,
        rentalIncome: currentRentVal,
        opEx: currentOpExVal,
        emiPaid: emiPaidThisYear,
        interestPaid: interestPaidThisYear,
        netCashFlow: netCashFlowThisYear
      });

      currentRentVal *= (1 + rentalGrowth / 100);
      currentOpExVal *= 1.03; // Society charges & taxes grow at 3% inflation
    }

    // Exit details
    const sellBrokerageCost = sellingPrice * (brokerageSell / 100);
    const capitalGains = Math.max((sellingPrice - sellBrokerageCost) - totalCapitalOutlay, 0);
    const taxPaid = capitalGains * (capitalGainsTaxRate / 100);

    const netProceedsFromSale = sellingPrice - sellBrokerageCost - remainingBalance - taxPaid;
    const totalCashFlow = totalGrossRent - totalOpEx - totalEMIsPaid;
    const totalNetProfit = netProceedsFromSale + totalCashFlow - initialCashInvested;

    const averageAnnualCashFlow = totalCashFlow / yearsHeld;
    const cashOnCashReturn = initialCashInvested > 0 ? (averageAnnualCashFlow / initialCashInvested) * 100 : 0;
    const equityMultiple = initialCashInvested > 0 
      ? (netProceedsFromSale + totalGrossRent - totalOpEx - totalEMIsPaid) / initialCashInvested
      : 0;

    // IRR Calculation using Cash Flow Array Root-Solving (Bisection Method)
    const cashFlows = [-initialCashInvested];
    for (let i = 0; i < yearsHeld; i++) {
      const isLast = i === yearsHeld - 1;
      const yrCf = yearlyProjections[i].netCashFlow;
      cashFlows.push(isLast ? yrCf + netProceedsFromSale : yrCf);
    }

    const calculateIRR = (flows) => {
      const maxIterations = 100;
      const precision = 0.00001;
      let low = -0.99;
      let high = 2.0;

      const npv = (rate) => {
        let sum = 0;
        for (let i = 0; i < flows.length; i++) {
          sum += flows[i] / Math.pow(1 + rate, i);
        }
        return sum;
      };

      if (npv(low) * npv(high) > 0) {
        // Fallback compound growth if signs don't invert
        const totalReturnMultiplier = (flows.reduce((a, b) => a + b, 0) + flows[0]) / (-flows[0]);
        return totalReturnMultiplier > 0 ? (Math.pow(totalReturnMultiplier, 1 / (flows.length - 1)) - 1) * 100 : 0;
      }

      for (let i = 0; i < maxIterations; i++) {
        const mid = (low + high) / 2;
        const midNpv = npv(mid);
        if (Math.abs(midNpv) < precision) {
          return mid * 100;
        }
        if (npv(low) * midNpv < 0) {
          high = mid;
        } else {
          low = mid;
        }
      }
      return ((low + high) / 2) * 100;
    };

    const annualizedROI = calculateIRR(cashFlows);

    // Operational Year 1 Metrics
    const year1GrossRent = cost * (rentalYield / 100);
    const year1OpEx = (cost * (propertyTaxRate / 100)) + (maintenanceMonthly * 12) + insuranceAnnual;
    const year1NOI = year1GrossRent - year1OpEx;
    const capRate = (year1NOI / cost) * 100;
    const dscr = emi > 0 ? year1NOI / (emi * 12) : 999;

    const riskLevel = financingType === "loan" && (dscr < 1.15 || cashOnCashReturn < 0) ? "High" : annualizedROI > 14 ? "Low" : "Medium";
    
    // total interest over entire loan duration
    const totalInterestEntireLoan = loanAmount > 0 ? (emi * totalMonths) - loanAmount : 0;

    return {
      stampDutyCost,
      registrationCost,
      buyBrokerageCost,
      totalAcquisitionCost,
      totalCapitalOutlay,
      initialCashInvested,
      loanAmount,
      emi,
      totalGrossRent,
      totalOpEx,
      totalEMIsPaid,
      totalInterestPaidHolding,
      remainingBalance,
      sellBrokerageCost,
      capitalGains,
      taxPaid,
      netProceedsFromSale,
      totalCashFlow,
      totalNetProfit,
      averageAnnualCashFlow,
      cashOnCashReturn,
      equityMultiple,
      annualizedROI,
      capRate,
      dscr,
      riskLevel,
      totalInterestEntireLoan,
      yearlyProjections,
      appreciationRate
    };
  }, [
    cost, stampDutyRate, registrationRate, brokerageBuy, legalFees,
    financingType, downPayment, interestRate, loanYears, yearsHeld,
    rentalYield, rentalGrowth, propertyTaxRate, maintenanceMonthly, insuranceAnnual,
    sellingPrice, brokerageSell, capitalGainsTaxRate
  ]);

  // ─── Chart Data Structure ───────────────────────────────────────
  const chartData = useMemo(() => {
    const labels = [];
    const equityData = [];
    const debtData = [];
    const propValData = [];

    const projections = calculations.yearlyProjections;
    labels.push(purchaseYear);
    equityData.push(cost - calculations.loanAmount);
    debtData.push(calculations.loanAmount);
    propValData.push(cost);

    for (let i = 0; i < projections.length; i++) {
      labels.push(purchaseYear + projections[i].year);
      equityData.push(projections[i].propertyValue - projections[i].loanBalance);
      debtData.push(projections[i].loanBalance);
      propValData.push(projections[i].propertyValue);
    }

    return { labels, equityData, debtData, propValData };
  }, [calculations, purchaseYear, cost]);

  // Render Visual Chart
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Property Market Value",
              data: chartData.propValData,
              borderColor: "#64748b", // Slate-500
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [4, 4],
              tension: 0.35
            },
            {
              label: "Remaining Debt",
              data: chartData.debtData,
              borderColor: "#f43f5e", // Rose-500
              backgroundColor: "transparent",
              borderWidth: 2,
              tension: 0.35
            },
            {
              label: "Net Equity",
              data: chartData.equityData,
              borderColor: "#10b981", // Emerald-500
              backgroundColor: "rgba(16, 185, 129, 0.06)",
              fill: true,
              borderWidth: 3.5,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatINR(context.parsed.y)}` } },
            legend: { labels: { color: "#334155", font: { weight: "bold", size: 11 } } }
          },
          scales: {
            y: { ticks: { color: "#64748b", callback: (val) => formatINR(val) }, grid: { color: "rgba(226, 232, 240, 0.5)" } },
            x: { ticks: { color: "#64748b" }, grid: { display: false } }
          }
        }
      });
      return () => chart.destroy();
    }
  }, [chartData]);

  // Load Image Helper for PDF rendering
  const loadImage = (src) => {
    return new Promise((resolve) => {
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
      img.onerror = () => resolve(null);
    });
  };

  // Generate Offscreen High-Res Chart Image for PDF
  const createChartImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Property Market Value",
            data: chartData.propValData,
            borderColor: "#64748b",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          },
          {
            label: "Remaining Debt",
            data: chartData.debtData,
            borderColor: "#f43f5e",
            borderWidth: 2,
            fill: false,
            tension: 0.4
          },
          {
            label: "Net Built Equity",
            data: chartData.equityData,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            borderWidth: 3.5,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: false,
        animation: false,
        scales: {
          y: { ticks: { font: { size: 13 }, callback: (v) => formatINR(v) } },
          x: { ticks: { font: { size: 13 } } }
        }
      }
    });

    await new Promise(r => setTimeout(r, 400));
    const image = canvas.toDataURL("image/jpeg", 1.0);
    chart.destroy();
    return image;
  };

  // Generate PDF Report
  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth  = pdf.internal.pageSize.getWidth();   // 210
    const pageHeight = pdf.internal.pageSize.getHeight();  // 297
    const margin     = 14;
    const colRight   = pageWidth - margin;
    const midX       = pageWidth / 2;
    const contentW   = pageWidth - margin * 2;

    const chartImage = await createChartImage();
    let logo = null, qr = null;
    try { logo = await loadImage("/logo.png"); }           catch {}
    try { qr   = await loadImage("/MahaRERA QR_CODE.png"); } catch {}

    // ── Colour palette ───────────────────────────────────────────
    const C = {
      dark:    [2,   6,   23],
      darkMid: [15,  23,  42],
      body:    [51,  65,  85],
      muted:   [100, 116, 139],
      faint:   [148, 163, 184],
      stripe:  [248, 250, 252],
      line:    [226, 232, 240],
      amber:   [245, 158, 11],
      amberDk: [180, 83,  9],
      amberLt: [254, 243, 199],
      green:   [16,  185, 129],
      red:     [239, 68,  68],
      white:   [255, 255, 255],
    };

    const setColor = (c) => pdf.setTextColor(...c);
    const setFill  = (c) => pdf.setFillColor(...c);
    const setDraw  = (c) => pdf.setDrawColor(...c);

    const formatPDFCurrency = (num) => formatINR(num).replace(/₹/g, "Rs. ");

    const hr = (y, color = C.line) => {
      setDraw(color); pdf.setLineWidth(0.25);
      pdf.line(margin, y, colRight, y);
    };

    const sectionTitle = (y, title) => {
      setFill(C.amber); pdf.rect(margin, y, 3, 4.5, "F");
      setColor(C.darkMid); pdf.setFont("helvetica", "bold"); pdf.setFontSize(10);
      pdf.text(title, margin + 5, y + 3.8);
      return y + 10;
    };

    const row = (y, label, value, opts = {}) => {
      const { bold = false, valueColor = C.body, fontSize = 8.5 } = opts;
      setColor(C.muted); pdf.setFont("helvetica", "normal"); pdf.setFontSize(fontSize);
      pdf.text(label, margin, y);
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(bold ? fontSize + 0.5 : fontSize);
      setColor(valueColor);
      pdf.text(String(value), colRight, y, { align: "right" });
      hr(y + 2.0);
      return y + 7.2;
    };

    // ══════════════════════════════════════════════════════════════
    // PAGE 1 — EXECUTIVE BRIEF & ACQUISITION FINANCING
    // ══════════════════════════════════════════════════════════════

    // ── Dark header banner ──────────────────────────────────────
    setFill(C.dark);
    pdf.rect(0, 0, pageWidth, 44, "F");
    if (logo) pdf.addImage(logo, "PNG", margin, 8, 24, 24);

    setColor(C.white);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("Property Investment Analysis Report", margin + 28, 19);

    setColor([203, 213, 225]);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.8);
    pdf.text("Authorized Strategic Partner | MahaRERA Agent Reg: A041262501741", margin + 28, 26);
    pdf.text(`Location: ${location || "Pune"} | Prepared: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, margin + 28, 31.5);
    pdf.text("Office 424-427, Vardhamaan Moonstone, Tathawade, Pune 411033 | eusrealty.co.in", margin + 28, 37);

    if (qr) pdf.addImage(qr, "PNG", colRight - 24, 8, 24, 24);

    // ── Hero KPI strip ──────────────────────────────────────────
    let y = 50;
    const kpiBoxW = (contentW - 4) / 2;
    const kpiBoxH = 18;

    // Row 1: IRR | Net Profit
    setFill(C.stripe); pdf.roundedRect(margin,              y, kpiBoxW, kpiBoxH, 1.5, 1.5, "F");
    setFill(C.stripe); pdf.roundedRect(margin + kpiBoxW + 4, y, kpiBoxW, kpiBoxH, 1.5, 1.5, "F");

    setColor(C.faint); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text("ANNUALIZED RETURN (IRR)", margin + 4, y + 5.5);
    setColor(C.green); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    pdf.text(`${calculations.annualizedROI.toFixed(2)}%`, margin + 4, y + 14);

    setColor(C.faint); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text("CUMULATIVE NET PROFIT", margin + kpiBoxW + 8, y + 5.5);
    setColor(C.amber); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    pdf.text(formatPDFCurrency(calculations.totalNetProfit), margin + kpiBoxW + 8, y + 14);

    y += kpiBoxH + 4;

    // Row 2: Cash Committed | Equity Multiple
    setFill(C.stripe); pdf.roundedRect(margin,              y, kpiBoxW, kpiBoxH, 1.5, 1.5, "F");
    setFill(C.stripe); pdf.roundedRect(margin + kpiBoxW + 4, y, kpiBoxW, kpiBoxH, 1.5, 1.5, "F");

    setColor(C.faint); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text("TOTAL CASH COMMITTED", margin + 4, y + 5.5);
    setColor(C.darkMid); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    pdf.text(formatPDFCurrency(calculations.initialCashInvested), margin + 4, y + 14);

    setColor(C.faint); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text("EQUITY MULTIPLE (MoIC)", margin + kpiBoxW + 8, y + 5.5);
    setColor(C.darkMid); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    pdf.text(`${calculations.equityMultiple.toFixed(2)}x`, margin + kpiBoxW + 8, y + 14);

    y += kpiBoxH + 6;

    // ── Acquisition & Financing ─────────────────────────────────
    y = sectionTitle(y, "Acquisition & Financing");
    y = row(y, "Property Purchase Price",                    formatPDFCurrency(cost));
    y = row(y, "Stamp Duty",                                 formatPDFCurrency(calculations.stampDutyCost));
    y = row(y, "Registration Cost",                          formatPDFCurrency(calculations.registrationCost));
    y = row(y, "Legal / Consulting Fees",                    formatPDFCurrency(legalFees));
    y = row(y, "Buy-Side Brokerage",                         "Rs. 0 (EUS Zero Brokerage)", { valueColor: C.green });
    y = row(y, "Total Closing Costs",                        formatPDFCurrency(calculations.totalAcquisitionCost), { bold: true });
    y = row(y, "Total Capital Outlay (Cost + Closing)",     formatPDFCurrency(calculations.totalCapitalOutlay),   { bold: true, valueColor: C.darkMid });

    if (financingType === "loan") {
      y = row(y, "Down Payment",                             formatPDFCurrency(downPayment));
      y = row(y, "Loan Amount (Principal)",                  formatPDFCurrency(calculations.loanAmount));
      y = row(y, "Interest Rate",                            `${interestRate}% p.a.`);
      y = row(y, "Loan Tenure",                              `${loanYears} Years`);
      y = row(y, "Monthly EMI",                              `${formatPDFCurrency(calculations.emi)} / month`, { bold: true });
      y = row(y, "Initial Cash Invested (Down + Closing)",  formatPDFCurrency(calculations.initialCashInvested), { bold: true, valueColor: C.darkMid });
    } else {
      y = row(y, "Financing",                                "All Cash — No Loan");
      y = row(y, "Total Cash Invested",                      formatPDFCurrency(calculations.initialCashInvested), { bold: true, valueColor: C.darkMid });
    }

    // ── Key Investment Ratios ───────────────────────────────────
    y = sectionTitle(y, "Key Investment Ratios");
    y = row(y, "Cap Rate (Year 1 NOI / Purchase Price)",   `${calculations.capRate.toFixed(2)}%`);
    y = row(y, "Cash on Cash Return (CoC)",                `${calculations.cashOnCashReturn.toFixed(2)}%`, { bold: true });
    if (financingType === "loan") {
      y = row(y, "Total Interest Paid (Holding Period)",   formatPDFCurrency(calculations.totalInterestPaidHolding), { bold: true, valueColor: C.red });
      y = row(y, "Total Interest Paid (Full Loan Life)",   formatPDFCurrency(calculations.totalInterestEntireLoan));
      y = row(y, "Principal Repaid During Holding",         formatPDFCurrency(calculations.loanAmount - calculations.remainingBalance));
      y = row(y, "Outstanding Debt at Sale",                formatPDFCurrency(calculations.remainingBalance));
      y = row(y, "Debt Service Coverage Ratio (DSCR)",     calculations.dscr > 50 ? "N/A" : calculations.dscr.toFixed(2));
    }
    y = row(y, "Risk Profile",                              calculations.riskLevel, {
      bold: true,
      valueColor: calculations.riskLevel === "Low" ? C.green : calculations.riskLevel === "Medium" ? C.amber : C.red,
    });

    // ── Disclaimer ──────────────────────────────────────────────
    const disclaimerText = "Disclaimer: This report is generated from client-provided inputs and projected market models. Real estate investments carry inherent market risks. EUS Realty does not represent legally binding guarantees of future capital appreciation. Consult a SEBI-registered financial advisor before investing.";
    setColor(C.faint);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.8);
    pdf.text(pdf.splitTextToSize(disclaimerText, contentW), margin, pageHeight - 24);


    // ══════════════════════════════════════════════════════════════
    // PAGE 2 — INVESTMENT RETURNS & PROJECTION CHART
    // ══════════════════════════════════════════════════════════════
    pdf.addPage();

    setFill(C.dark); pdf.rect(0, 0, pageWidth, 14, "F");
    setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5);
    pdf.text("Investment Returns & Financial Projections", margin, 9.5);
    setColor([203, 213, 225]); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text(`${yearsHeld}-Year Holding Period | ${location || "Pune"}`, colRight, 9.5, { align: "right" });

    let p2y = 22;

    p2y = sectionTitle(p2y, "Investment Returns Overview");
    p2y = row(p2y, "Target Holding Period",                  `${yearsHeld} Years`);
    p2y = row(p2y, "Expected Selling Price",                 formatPDFCurrency(sellingPrice));
    p2y = row(p2y, "Expected Price CAGR",                    `${(calculations.appreciationRate * 100).toFixed(2)}% p.a.`);
    p2y = row(p2y, "Total Gross Rental Collected",           formatPDFCurrency(calculations.totalGrossRent));
    p2y = row(p2y, "Total Operating Expenses (Tax + Maint + Ins)", formatPDFCurrency(calculations.totalOpEx));
    p2y = row(p2y, "Avg Annual Net Cash Flow",               formatPDFCurrency(calculations.averageAnnualCashFlow), { bold: true, valueColor: calculations.averageAnnualCashFlow >= 0 ? C.green : C.red });
    p2y = row(p2y, "Net Proceeds at Sale (After Tax & Debt)", formatPDFCurrency(calculations.netProceedsFromSale), { bold: true });
    p2y = row(p2y, "Total Net Profit",                       formatPDFCurrency(calculations.totalNetProfit), { bold: true, valueColor: calculations.totalNetProfit >= 0 ? C.green : C.red });

    p2y += 4;

    p2y = sectionTitle(p2y, "Equity Buildup Projection Chart");
    pdf.addImage(chartImage, "JPEG", margin, p2y, contentW, 60);
    p2y += 65;


    // ══════════════════════════════════════════════════════════════
    // PAGE 2 (CONTINUED) OR 3 — CASH FLOW LEDGER
    // ══════════════════════════════════════════════════════════════
    
    // Check if the ledger table has enough space on page 2, otherwise start on a new page
    let tableY = p2y + 6;
    if (tableY > pageHeight - 40) {
      pdf.addPage();
      setFill(C.dark); pdf.rect(0, 0, pageWidth, 14, "F");
      setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5);
      pdf.text("Year-by-Year Cash Flow & Amortization Ledger", margin, 9.5);
      tableY = 22;
    } else {
      tableY = sectionTitle(tableY, "Year-by-Year Cash Flow & Amortization Ledger");
    }

    // Column config — all numeric columns are right-aligned
    const cols = [
      { label: "Yr",             x: margin,        w: 8  },
      { label: "Property Value", x: margin + 10,   w: 33 },
      { label: "Debt Balance",   x: margin + 45,   w: 28 },
      { label: "Rental Income",  x: margin + 75,   w: 28 },
      { label: "Oper. Cost",     x: margin + 105,  w: 27 },
      { label: "Total EMI",      x: margin + 134,  w: 27 },
      { label: "Net Cash Flow",  x: margin + 163,  w: 33 },
    ];

    const drawHeader = (headerY) => {
      setFill([30, 41, 59]); pdf.rect(margin, headerY, contentW, 8, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.2); setColor(C.faint);
      cols.forEach((col, i) => {
        if (i === 0) pdf.text(col.label, col.x + 1, headerY + 5.5);
        else         pdf.text(col.label, col.x + col.w, headerY + 5.5, { align: "right" });
      });
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    };

    drawHeader(tableY);
    tableY += 8;

    calculations.yearlyProjections.forEach((proj, idx) => {
      if (tableY > pageHeight - 32) {
        pdf.addPage();
        setFill(C.dark); pdf.rect(0, 0, pageWidth, 14, "F");
        setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5);
        pdf.text("Cash Flow Ledger (continued)", margin, 9.5);
        tableY = 22; 
        drawHeader(tableY);
        tableY += 8;
      }
      if (idx % 2 === 0) { setFill(C.stripe); pdf.rect(margin, tableY, contentW, 7, "F"); }
      setColor(C.body);
      pdf.text(String(proj.year),             cols[0].x + 1,              tableY + 5);
      pdf.text(formatPDFCurrency(proj.propertyValue), cols[1].x + cols[1].w,     tableY + 5, { align: "right" });
      pdf.text(formatPDFCurrency(proj.loanBalance),   cols[2].x + cols[2].w,     tableY + 5, { align: "right" });
      pdf.text(formatPDFCurrency(proj.rentalIncome),  cols[3].x + cols[3].w,     tableY + 5, { align: "right" });
      pdf.text(formatPDFCurrency(proj.opEx),          cols[4].x + cols[4].w,     tableY + 5, { align: "right" });
      pdf.text(formatPDFCurrency(proj.emiPaid),       cols[5].x + cols[5].w,     tableY + 5, { align: "right" });
      setColor(proj.netCashFlow < 0 ? C.red : C.green);
      pdf.text(formatPDFCurrency(proj.netCashFlow),   cols[6].x + cols[6].w,     tableY + 5, { align: "right" });
      setDraw(C.line); pdf.setLineWidth(0.2);
      pdf.line(margin, tableY + 7, colRight, tableY + 7);
      tableY += 7;
    });

    // Draw Totals Summary
    if (tableY > pageHeight - 45) {
      pdf.addPage();
      setFill(C.dark); pdf.rect(0, 0, pageWidth, 14, "F");
      setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5);
      pdf.text("Cash Flow Ledger (continued)", margin, 9.5);
      tableY = 22;
    }
    tableY += 3;
    setFill(C.amberLt); pdf.roundedRect(margin, tableY, contentW, 22, 1.5, 1.5, "F");
    setColor(C.amberDk); pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text("HOLDING PERIOD TOTALS", margin + 4, tableY + 7);
    const totalItems = [
      { label: "Gross Rent",    value: formatPDFCurrency(calculations.totalGrossRent) },
      { label: "OpEx",          value: formatPDFCurrency(calculations.totalOpEx)       },
      { label: "EMIs Paid",     value: formatPDFCurrency(calculations.totalEMIsPaid)   },
      { label: "Net Cash Flow", value: formatPDFCurrency(calculations.totalCashFlow)   },
    ];
    totalItems.forEach((item, i) => {
      const tx = margin + 4 + i * (contentW / 4);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
      pdf.text(item.label, tx, tableY + 14);
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
      pdf.text(item.value, tx, tableY + 19.5);
    });


    // ══════════════════════════════════════════════════════════════
    // PAGE 3 (OR 4) — FAMILY SUMMARY + CONTACT CARD
    // ══════════════════════════════════════════════════════════════
    pdf.addPage();

    setFill(C.dark); pdf.rect(0, 0, pageWidth, 14, "F");
    setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5);
    pdf.text("Family Cost Summary & Contact Information", margin, 9.5);

    let p3y = 22;

    p3y = sectionTitle(p3y, "Family Cost of Homeownership — What You Actually Pay");

    const boxH = 33;
    const boxW = (contentW - 6) / 3;
    const summaryBoxes = [
      {
        label: "Total Upfront Buying Cost",
        value: formatPDFCurrency(cost + calculations.totalAcquisitionCost),
        sub1: `Property: ${formatPDFCurrency(cost)}`,
        sub2: `Closing Costs: ${formatPDFCurrency(calculations.totalAcquisitionCost)}`,
        color: C.darkMid,
      },
      {
        label: financingType === "loan" ? "Total Interest Paid to Bank" : "Bank Interest Paid",
        value: financingType === "loan" ? formatPDFCurrency(calculations.totalInterestPaidHolding) : "Rs. 0 (No Loan)",
        sub1:  financingType === "loan" ? `Holding ${yearsHeld} yrs: ${formatPDFCurrency(calculations.totalInterestPaidHolding)}` : "All-cash purchase",
        sub2:  financingType === "loan" ? `Full ${loanYears}-yr life: ${formatPDFCurrency(calculations.totalInterestEntireLoan)}` : "Zero interest fees",
        color: C.red,
      },
      {
        label: "Total Cash Outflow (All-In)",
        value: formatPDFCurrency(calculations.initialCashInvested + (financingType === "loan" ? calculations.totalEMIsPaid : 0) + calculations.totalOpEx),
        sub1: "Down + Closing + All EMIs",
        sub2: "+ Tax + Maintenance + Insurance",
        color: C.darkMid,
      },
    ];
    summaryBoxes.forEach((box, i) => {
      const bx = margin + i * (boxW + 3);
      setFill(C.stripe); pdf.roundedRect(bx, p3y, boxW, boxH, 2, 2, "F");
      setColor(C.faint); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
      pdf.text(box.label.toUpperCase(), bx + 4, p3y + 6);
      setColor(box.color); pdf.setFont("helvetica", "bold"); pdf.setFontSize(12.5);
      pdf.text(box.value, bx + 4, p3y + 16);
      setColor(C.muted); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
      pdf.text(box.sub1, bx + 4, p3y + 23);
      pdf.text(box.sub2, bx + 4, p3y + 28);
    });
    p3y += boxH + 6;

    // Savings banner
    setFill([236, 253, 245]); pdf.roundedRect(margin, p3y, contentW, 14, 2, 2, "F");
    setColor([6, 95, 70]); pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text("EUS Realty Zero Brokerage Advantage", margin + 4, p3y + 5.5);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5);
    pdf.text(
      `By buying through EUS Realty you save ${formatPDFCurrency(cost * 0.02)} in brokerage (2% industry standard). Zero brokerage. Guaranteed.`,
      margin + 4, p3y + 11
    );
    p3y += 20;

    // Monthly budget breakdown
    if (financingType === "loan") {
      p3y = sectionTitle(p3y, "Monthly Budget Breakdown (What to Set Aside Every Month)");
      const monthlyItems = [
        { label: "Monthly Home Loan EMI",          value: `${formatPDFCurrency(calculations.emi)} / month`,                                                                             bold: true },
        { label: "Monthly Society Maintenance",    value: `${formatPDFCurrency(maintenanceMonthly)} / month`                                                                                       },
        { label: "Monthly Property Tax (est.)",    value: `${formatPDFCurrency((cost * propertyTaxRate / 100) / 12)} / month`                                                                      },
        { label: "Monthly Insurance (est.)",       value: `${formatPDFCurrency(insuranceAnnual / 12)} / month`                                                                                     },
        { label: "Total Monthly Housing Budget",   value: `${formatPDFCurrency(calculations.emi + maintenanceMonthly + (cost * propertyTaxRate / 100) / 12 + insuranceAnnual / 12)} / month`,
          bold: true, valueColor: C.amber },
      ];
      monthlyItems.forEach((item) => {
        p3y = row(p3y, item.label, item.value, { bold: item.bold || false, valueColor: item.valueColor || C.body });
      });
      p3y += 4;
    }

    // ── Contact Card ─────────────────────────────────────────────
    const cardY = pageHeight - 76;
    setFill(C.dark); pdf.roundedRect(margin, cardY, contentW, 58, 3, 3, "F");
    setFill(C.amber); pdf.rect(margin, cardY, contentW, 1.5, "F");

    if (logo) pdf.addImage(logo, "PNG", margin + 6, cardY + 7, 18, 18);
    setColor(C.white); pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
    pdf.text("EUS", margin + 28, cardY + 16);
    setColor(C.amber);
    pdf.text("REALTY", margin + 41, cardY + 16);
    setColor([203, 213, 225]); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
    pdf.text("Pune's Finest | MahaRERA Authorized Strategic Partner", margin + 28, cardY + 22);

    setDraw([51, 65, 85]); pdf.setLineWidth(0.3);
    pdf.line(margin + 6, cardY + 28, colRight - 6, cardY + 28);

    const contactLeft  = [
      "Address: Office 424-427, Vardhamaan Moonstone,",
      "         Tathawade, Pune - 411033",
      "Phone:   +91 76207 33613 | +91 9112229809",
      "Email:   eliteuniqueservices@gmail.com"
    ];
    const contactRight = [
      "Website:   www.eusrealty.co.in",
      "Instagram: @eus.pune",
      "LinkedIn:  Elite Unique Services",
      "YouTube:   @Elite_Unique_Services"
    ];

    setColor([203, 213, 225]); pdf.setFont("helvetica", "normal"); pdf.setFontSize(8);
    contactLeft.forEach((t, i)  => pdf.text(t, margin + 6,   cardY + 35 + i * 6.5));
    contactRight.forEach((t, i) => pdf.text(t, midX + 4,     cardY + 35 + i * 6.5));

    if (qr) pdf.addImage(qr, "PNG", colRight - 22, cardY + 7, 19, 19);
    setColor(C.amber); pdf.setFont("helvetica", "bold"); pdf.setFontSize(6.5);
    pdf.text("MahaRERA: A041262501741", colRight - 22, cardY + 30);


    // ══════════════════════════════════════════════════════════════
    // POST-PROCESSING — DYNAMIC FOOTERS & PAGE NUMBERS
    // ══════════════════════════════════════════════════════════════
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      const fy = pageHeight - 11;
      setDraw(C.line); pdf.setLineWidth(0.25);
      pdf.line(margin, fy - 3, colRight, fy - 3);
      
      setColor(C.muted); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
      pdf.text(
        "EUS Realty | MahaRERA: A041262501741 | +91 76207 33613 | eliteuniqueservices@gmail.com | eusrealty.co.in",
        midX, fy, { align: "center" }
      );
      pdf.text(`Page ${i} of ${totalPages}`, colRight, fy, { align: "right" });
      setColor(C.faint);
      pdf.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, margin, fy);
    }

    pdf.save(`EUS_Realty_Investment_Report_${(location || "Pune").replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] selection:bg-amber-500 selection:text-white py-16 md:py-24 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ─── Header Section ─── */}
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold shadow-sm mb-6">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span className="tracking-wide text-amber-800 uppercase">Institutional Grade Advisory Desk</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-slate-950 font-outfit">
              Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">ROI Analytics</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-light md:text-lg mb-8">
              Simulate cash flow, index tax adjustments, map amortization levels, and export customized investment prospectus models.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={applyPreset1} 
                className="px-5.5 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors border border-slate-700 flex items-center gap-2 shadow-sm"
              >
                <Activity size={13} className="text-amber-400" /> Scenario 1: Premium 2BHK (₹1.5 Cr)
              </button>
              <button 
                onClick={applyPreset2} 
                className="px-5.5 py-3 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Star size={13} className="fill-slate-950 text-slate-950" /> Scenario 2: Luxury Villa (₹4.5 Cr)
              </button>
            </div>
          </div>
        </Reveal>

        {/* ─── Grid Configuration ─── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Hand side inputs panels */}
          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <div className="bg-slate-950 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Section 1: Acquisition & Financing */}
                <h3 className="text-lg font-black mb-6 flex items-center gap-3 border-b border-slate-900 pb-5 tracking-tight font-outfit">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 w-7 h-7 rounded-full flex items-center justify-center text-xs">1</span>
                  Acquisition & Closing Costs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      <span>Property Value (Cost)</span>
                      <span className="text-white">{formatINR(cost)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="2000000" 
                      max="150000000" 
                      step="500000" 
                      value={cost} 
                      onChange={(e) => {
                        const newCost = Number(e.target.value);
                        setCost(newCost);
                        setDownPayment(Math.round(newCost * 0.20));
                      }} 
                      className="w-full accent-amber-500 mt-2.5" 
                    />
                    <input 
                      type="number" 
                      value={cost} 
                      onChange={(e) => {
                        const newCost = Math.max(0, Number(e.target.value));
                        setCost(newCost);
                        setDownPayment(Math.round(newCost * 0.20));
                      }} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stamp Duty (%)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={stampDutyRate} 
                        onChange={(e) => setStampDutyRate(Number(e.target.value))} 
                        className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration (%)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={registrationRate} 
                        onChange={(e) => setRegistrationRate(Number(e.target.value))} 
                        className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal / Consulting (₹)</label>
                    <input 
                      type="number" 
                      value={legalFees} 
                      onChange={(e) => setLegalFees(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buy Brokerage (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={brokerageBuy} 
                        disabled
                        className="w-full mt-2 p-3 pr-10 rounded-xl bg-slate-900/40 border border-slate-900 text-sm text-slate-500 outline-none font-medium" 
                      />
                      <ShieldCheck size={14} className="text-emerald-500 absolute right-3.5 top-5.5" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase mt-1 block tracking-wider">EUS Zero Brokerage Apply</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Location</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                </div>

                {/* Capital Outlay details banner */}
                <div className="mb-10 bg-slate-900/40 p-4 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Total Closing Cost Capital Add-on:</span>
                  <span className="font-bold text-amber-400">{formatINR(calculations.totalAcquisitionCost)} (Stamps + Reg + Legal)</span>
                </div>

                {/* Financing Split section */}
                <div className="mb-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Financing Strategy</label>
                  <div className="flex gap-4 p-1 bg-slate-900 rounded-2xl border border-slate-900">
                    <button
                      onClick={() => setFinancingType("cash")}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${financingType === "cash" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      All Cash Portfolio
                    </button>
                    <button
                      onClick={() => setFinancingType("loan")}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${financingType === "loan" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                      Leveraged Bank Loan
                    </button>
                  </div>
                </div>

                {financingType === "loan" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-slate-900/20 p-5 rounded-2xl border border-slate-900/60 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex justify-between">
                        <span>Down Payment</span>
                        <span className="text-white font-bold">{((downPayment / cost) * 100).toFixed(0)}%</span>
                      </label>
                      <input 
                        type="number" 
                        value={downPayment} 
                        onChange={(e) => setDownPayment(Number(e.target.value))} 
                        className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                      />
                      <input 
                        type="range" 
                        min={cost * 0.1} 
                        max={cost * 0.9} 
                        step="100000" 
                        value={downPayment} 
                        onChange={(e) => setDownPayment(Number(e.target.value))} 
                        className="w-full accent-amber-500 mt-2" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Interest Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={interestRate} 
                        onChange={(e) => setInterestRate(Number(e.target.value))} 
                        className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                      />
                      <span className="text-[9px] text-amber-500/80 mt-1 block font-bold">Standard bank rate: 8.5% (SBI/HDFC average)</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">Expected EMI: {formatINR(calculations.emi)}/mo</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Loan Term (Years)</label>
                      <input 
                        type="number" 
                        value={loanYears} 
                        onChange={(e) => setLoanYears(Number(e.target.value))} 
                        className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                      />
                    </div>
                  </div>
                )}

                {/* Section 2: Cash Flow & Operations */}
                <h3 className="text-lg font-black mb-6 mt-10 flex items-center gap-3 border-b border-slate-900 pb-5 tracking-tight font-outfit">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 w-7 h-7 rounded-full flex items-center justify-center text-xs">2</span>
                  Rental Operations & Holding Costs
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gross Yield (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={rentalYield} 
                      onChange={(e) => setRentalYield(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                    <span className="text-[9px] text-slate-500 mt-1 block">Yr 1: {formatINR((cost * rentalYield) / 100)}/yr</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Rent Growth (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={rentalGrowth} 
                      onChange={(e) => setRentalGrowth(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Prop Tax (%/yr)</label>
                    <input 
                      type="number" 
                      step="0.05" 
                      value={propertyTaxRate} 
                      onChange={(e) => setPropertyTaxRate(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Maintenance (₹/mo)</label>
                    <input 
                      type="number" 
                      value={maintenanceMonthly} 
                      onChange={(e) => setMaintenanceMonthly(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Insurance (₹/yr)</label>
                    <input 
                      type="number" 
                      value={insuranceAnnual} 
                      onChange={(e) => setInsuranceAnnual(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                </div>

                {/* Section 3: Exit strategy */}
                <h3 className="text-lg font-black mb-6 mt-10 flex items-center gap-3 border-b border-slate-900 pb-5 tracking-tight font-outfit">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 w-7 h-7 rounded-full flex items-center justify-center text-xs">3</span>
                  Exit & Liquidation Strategy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      <span>Expected Selling Value</span>
                      <span className="text-amber-400 font-bold">{formatINR(sellingPrice)}</span>
                    </label>
                    <input 
                      type="range" 
                      min={cost * 0.9} 
                      max={cost * 4} 
                      step="500000" 
                      value={sellingPrice} 
                      onChange={(e) => setSellingPrice(Number(e.target.value))} 
                      className="w-full accent-amber-500 mt-2.5" 
                    />
                    <input 
                      type="number" 
                      value={sellingPrice} 
                      onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      <span>Investment Horizon (Holding Period)</span>
                      <span className="text-white font-bold">{yearsHeld} Years</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="25" 
                      step="1" 
                      value={yearsHeld} 
                      onChange={(e) => setYearsHeld(Number(e.target.value))} 
                      className="w-full accent-amber-500 mt-2.5" 
                    />
                    <span className="text-[9px] text-slate-500 mt-1 block">Expected annual appreciation: {(calculations.appreciationRate * 100).toFixed(2)}% CAGR</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sell Brokerage/Fees (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={brokerageSell} 
                      onChange={(e) => setBrokerageSell(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Capital Gains Tax (%)</label>
                    <input 
                      type="number" 
                      value={capitalGainsTaxRate} 
                      onChange={(e) => setCapitalGainsTaxRate(Number(e.target.value))} 
                      className="w-full mt-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-white focus:ring-1 focus:ring-amber-500/50 outline-none font-medium" 
                    />
                  </div>
                </div>

              </div>
            </Reveal>

            {/* 🏠 Family Homeownership Cost Summary */}
            <Reveal>
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.04)] border border-slate-100">
                <h3 className="text-xl font-black text-slate-950 font-outfit mb-2 flex items-center gap-2">
                  <span>🏠</span> Family Cost of Homeownership
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-light">
                  A simple, easy-to-understand breakdown of what a standard family will pay to buy and live in this home.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Total Upfront Buying Cost */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Buying Price</p>
                      <p className="text-xl font-black text-slate-900 mt-2">
                        {formatINR(cost + calculations.totalAcquisitionCost)}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 font-light leading-relaxed">
                      Includes property price of <strong className="font-semibold text-slate-800">{formatINR(cost)}</strong> + closing costs (stamp duty, registration, legal fees) of <strong className="font-semibold text-slate-800">{formatINR(calculations.totalAcquisitionCost)}</strong>.
                    </p>
                  </div>

                  {/* Card 2: Total Interest Paid */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interest Paid to Bank</p>
                      <p className="text-xl font-black text-rose-600 mt-2">
                        {financingType === "loan" ? formatINR(calculations.totalInterestPaidHolding) : "₹0 (No Loan)"}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 font-light leading-relaxed">
                      {financingType === "loan" ? (
                        <>
                          Interest paid over the <strong className="font-semibold text-slate-800">{yearsHeld} years</strong> holding term. Total interest if you keep the loan for the full {loanYears} years would be <strong className="font-semibold text-slate-800">{formatINR(calculations.totalInterestEntireLoan)}</strong>.
                        </>
                      ) : (
                        "You are paying 100% cash, meaning you pay zero rupees in bank interest fees."
                      )}
                    </p>
                  </div>

                  {/* Card 3: Total Overall Cost */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cash Outflow</p>
                      <p className="text-xl font-black text-slate-900 mt-2">
                        {formatINR(
                          calculations.initialCashInvested +
                          (financingType === "loan" ? calculations.totalEMIsPaid : 0) +
                          calculations.totalOpEx
                        )}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 font-light leading-relaxed">
                      The total money paid out of your pocket over the <strong className="font-semibold text-slate-800">{yearsHeld} years</strong>. Includes downpayment, all monthly EMIs, property tax, maintenance, and insurance.
                    </p>
                  </div>
                </div>

                {/* Savings highlights & EEAT block */}
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-800 font-medium leading-normal">
                    <strong className="font-bold">Family Savings Tip:</strong> By purchasing this property with EUS Realty, your upfront commission brokerage is <strong className="font-bold">₹0</strong>. You are saving up to <strong className="font-bold">{formatINR(cost * 0.02)} (2% standard brokerage)</strong> directly!
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Visual equity buildup graph container */}
            <Reveal>
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.04)] border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-950 font-outfit">Equity Growth Chart</h3>
                    <p className="text-xs text-slate-500 mt-1 font-light">See how your net ownership grows relative to amortization and price appreciation.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 hidden sm:flex">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Net Equity</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Market Value</span>
                    {financingType === "loan" && (
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Debt</span>
                    )}
                  </div>
                </div>
                <div className="h-80 w-full relative">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Hand side sticky results panel */}
          <div className="lg:col-span-4 sticky top-8">
            <Reveal>
              <div className="bg-slate-950 rounded-[2.5rem] p-6 md:p-8 text-white border border-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Internal Rate of Return (IRR)</span>
                <h2 className="text-6xl font-black mt-1.5 tracking-tight font-outfit text-emerald-400">
                  {calculations.annualizedROI.toFixed(2)}<span className="text-xl text-slate-500 ml-1">%</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 border-b border-slate-900 pb-5 font-light">Projected annualized return (post-tax & debt)</p>

                <div className="space-y-3.5 text-xs font-medium pt-5">
                  <div className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-900">
                    <span className="text-slate-400">Total Net Profit</span>
                    <span className="font-bold text-sm text-amber-400">{formatINR(calculations.totalNetProfit)}</span>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-400">Capital Outlay (Committed Cash)</span>
                    <span className="font-bold text-white">{formatINR(calculations.initialCashInvested)}</span>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-400">Rental Net Cash Flow (Holding)</span>
                    <span className={`font-bold ${calculations.totalCashFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {formatINR(calculations.totalCashFlow)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-400">Net Proceeds (At Selling Point)</span>
                    <span className="font-bold text-white">{formatINR(calculations.netProceedsFromSale)}</span>
                  </div>

                  {financingType === "loan" && (
                    <>
                      <div className="flex justify-between items-center px-1 border-t border-slate-900 pt-3.5 mt-2">
                        <span className="text-slate-400">Total Interest (Holding Term)</span>
                        <span className="font-bold text-rose-400">{formatINR(calculations.totalInterestPaidHolding)}</span>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-slate-400">EMI Principal Debt Reduction</span>
                        <span className="font-bold text-emerald-400">{formatINR(calculations.loanAmount - calculations.remainingBalance)}</span>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-slate-400">Outstanding Debt at Sale</span>
                        <span className="font-bold text-slate-300">{formatINR(calculations.remainingBalance)}</span>
                      </div>
                    </>
                  )}

                  {/* Calculated metrics grid details */}
                  <div className="grid grid-cols-2 gap-3 pt-5 mt-4 border-t border-slate-900">
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-center">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Cap Rate (Yr 1)</p>
                      <p className="font-bold text-white text-sm mt-1">{calculations.capRate.toFixed(2)}%</p>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-center">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Equity Multiple</p>
                      <p className="font-bold text-white text-sm mt-1">{calculations.equityMultiple.toFixed(2)}x</p>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-center">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Cash on Cash</p>
                      <p className="font-bold text-white text-sm mt-1">{calculations.cashOnCashReturn.toFixed(2)}%</p>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-center">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Risk Level</p>
                      <p className={`font-bold text-sm mt-1 ${calculations.riskLevel === "Low" ? "text-emerald-400" : calculations.riskLevel === "Medium" ? "text-slate-300" : "text-rose-400"}`}>
                        {calculations.riskLevel}
                      </p>
                    </div>
                  </div>

                </div>

                {/* PDF generation button */}
                <button
                  onClick={downloadPDF}
                  className="relative overflow-hidden w-full bg-white text-slate-950 font-bold py-4.5 rounded-2xl mt-8 shadow-xl text-xs uppercase tracking-widest group transition-all"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-slate-950 transition-colors">
                    Export Strategy Report
                    <Download size={14} className="text-slate-950" />
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