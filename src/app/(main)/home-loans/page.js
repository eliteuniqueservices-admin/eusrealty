'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Building2, Briefcase, CreditCard, Home, ShieldCheck,
  ChevronRight, ChevronLeft, CheckCircle, Calculator, Info
} from 'lucide-react';

const STEPS = [
  { id: 'personal', title: 'Personal Details', icon: ShieldCheck },
  { id: 'employment', title: 'Employment Info', icon: Briefcase },
  { id: 'obligations', title: 'Current Loans', icon: CreditCard },
  { id: 'property', title: 'Property Details', icon: Home },
  { id: 'credit', title: 'Credit Profile', icon: Building2 },
];

export default function HomeLoanCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      employmentType: 'Salaried',
      propertyType: 'Flat',
      existingHomeLoan: 'No',
      defaults: 'No',
      personalLoanEmi: 0,
      carLoanEmi: 0,
      creditCardEmi: 0,
      otherEmi: 0,
    }
  });

  const empType = watch('employmentType');

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const nextStep = async () => {
    const fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate.push('fullName', 'mobile', 'email', 'dob', 'city', 'state');
    if (currentStep === 1) {
      fieldsToValidate.push('companyOrBusiness', 'experience');
      if (empType === 'Salaried') fieldsToValidate.push('netSalary');
      else fieldsToValidate.push('annualIncome', 'vintage');
    }
    if (currentStep === 2) fieldsToValidate.push('personalLoanEmi', 'carLoanEmi', 'creditCardEmi', 'otherEmi');
    if (currentStep === 3) fieldsToValidate.push('propertyValue', 'downPayment');
    if (currentStep === 4) fieldsToValidate.push('creditScore');

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 0) {
        const age = calculateAge(watch('dob'));
        if (age < 21 || age > 65) {
          alert('Age not eligible: Age must be between 21 and 65 years.');
          return;
        }
      }
      if (currentStep === 3) {
        if (Number(watch('propertyValue')) <= Number(watch('downPayment'))) {
          alert('Invalid amount: Down payment cannot be greater than property value.');
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        personalDetails: {
          fullName: data.fullName, mobile: data.mobile, email: data.email,
          dob: data.dob, age: calculateAge(data.dob), city: data.city, state: data.state
        },
        employment: {
          employmentType: data.employmentType, companyOrBusiness: data.companyOrBusiness,
          netSalary: Number(data.netSalary) || 0, annualIncome: Number(data.annualIncome) || 0,
          experience: Number(data.experience) || 0, vintage: Number(data.vintage) || 0
        },
        obligations: {
          personalLoanEmi: Number(data.personalLoanEmi) || 0,
          carLoanEmi: Number(data.carLoanEmi) || 0,
          creditCardEmi: Number(data.creditCardEmi) || 0,
          otherEmi: Number(data.otherEmi) || 0,
          totalExistingEmi: (Number(data.personalLoanEmi) || 0) + (Number(data.carLoanEmi) || 0) + (Number(data.creditCardEmi) || 0) + (Number(data.otherEmi) || 0)
        },
        property: {
          propertyType: data.propertyType,
          propertyValue: Number(data.propertyValue) || 0,
          location: data.city,
          downPayment: Number(data.downPayment) || 0,
          loanRequirement: (Number(data.propertyValue) || 0) - (Number(data.downPayment) || 0)
        },
        creditInfo: {
          creditScore: Number(data.creditScore) || 0,
          existingHomeLoan: data.existingHomeLoan,
          defaults: data.defaults
        }
      };

      const res = await fetch('/api/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();
      if (res.ok) {
        setResults(responseData);
      } else {
        alert(responseData.error || 'Failed to calculate eligibility.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-500/30 pt-24 pb-20">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Calculator size={14} /> Intelligence Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Home Loan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Eligibility</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Check your eligibility instantly, calculate custom EMIs, and apply for a mortgage with our advanced banking-grade engine.
          </p>
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* Progress Tracker */}
        {!results && (
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-10" />
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 -z-10"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-950 p-2 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'border-amber-500 bg-amber-500/10 text-amber-400' : isPast ? 'border-amber-500 bg-amber-500 text-slate-900' : 'border-slate-800 bg-slate-900 text-slate-600'}`}>
                    {isPast ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden md:block ${isActive ? 'text-amber-400' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">

            {/* CALCULATOR FORM */}
            {!results ? (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleSubmit(onSubmit, (errors) => {
                  alert('Please fill all required fields correctly. Check Credit Score (300-900) or missing inputs.');
                  console.error(errors);
                })} className="space-y-8">

                  {/* STEP 1: Personal */}
                  {currentStep === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Personal Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                          <input {...register('fullName', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="Rahul Upadhyay" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                          <input type="tel" {...register('mobile', { required: true, pattern: /^[0-9]{10}$/ })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="9876543210" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                          <input type="email" {...register('email', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="rahul@example.com" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                          <input type="date" {...register('dob', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors [color-scheme:dark]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
                          <input {...register('city', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="Pune" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
                          <input {...register('state', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="Maharashtra" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Employment */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Employment Information</h2>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {['Salaried', 'Self Employed Professional', 'Self Employed Business'].map(type => (
                          <label key={type} className={`cursor-pointer px-5 py-3 rounded-xl border font-bold text-sm transition-all ${empType === type ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                            <input type="radio" value={type} {...register('employmentType')} className="hidden" />
                            {type}
                          </label>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company / Business Name</label>
                          <input {...register('companyOrBusiness', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="TCS / Your Business Name" />
                        </div>

                        {empType === 'Salaried' ? (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Net Salary (₹)</label>
                              <input type="number" {...register('netSalary', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="75000" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Experience (Years)</label>
                              <input type="number" {...register('experience', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="5" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Income (₹)</label>
                              <input type="number" {...register('annualIncome', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="1200000" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Vintage (Years)</label>
                              <input type="number" {...register('vintage', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="3" />
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Obligations */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Existing EMIs</h2>
                      <p className="text-sm text-slate-400 mb-6">Provide details of any existing monthly loan obligations.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Loan EMI (₹)</label>
                          <input type="number" {...register('personalLoanEmi')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Car Loan EMI (₹)</label>
                          <input type="number" {...register('carLoanEmi')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Credit Card EMI (₹)</label>
                          <input type="number" {...register('creditCardEmi')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Other EMI (₹)</label>
                          <input type="number" {...register('otherEmi')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="0" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Property Details */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Property Requirements</h2>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Property Type</label>
                          <select {...register('propertyType')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none">
                            <option value="Flat">Flat</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Plot + Construction">Plot + Construction</option>
                            <option value="Resale Property">Resale Property</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Property Value (₹)</label>
                            <input type="number" {...register('propertyValue', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="10000000" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Planned Down Payment (₹)</label>
                            <input type="number" {...register('downPayment', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="2000000" />
                          </div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3 mt-2">
                          <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Based on RBI guidelines, banks typically fund up to <strong className="text-slate-200">90%</strong> of property value for loans under ₹30L, <strong className="text-slate-200">80%</strong> for ₹30L-₹75L, and <strong className="text-slate-200">75%</strong> for loans above ₹75L.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: Credit Info */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Credit Profile</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Credit Score (CIBIL)</label>
                          <input type="number" {...register('creditScore', { required: true, min: 300, max: 900 })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="750" />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Any Existing Home Loan?</label>
                          <div className="flex gap-4 mt-2">
                            {['Yes', 'No'].map(opt => (
                              <label key={opt} className={`cursor-pointer flex-1 py-3 text-center rounded-xl border font-bold text-sm transition-all ${watch('existingHomeLoan') === opt ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                                <input type="radio" value={opt} {...register('existingHomeLoan')} className="hidden" />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Any Past Defaults / Settlements?</label>
                          <div className="flex gap-4 mt-2">
                            {['Yes', 'No'].map(opt => (
                              <label key={opt} className={`cursor-pointer flex-1 py-3 text-center rounded-xl border font-bold text-sm transition-all ${watch('defaults') === opt ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                                <input type="radio" value={opt} {...register('defaults')} className="hidden" />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-0"
                    >
                      Back
                    </button>
                    {currentStep < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        Next <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Processing...' : 'Calculate Eligibility'}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            ) : (
              /* RESULTS DASHBOARD */
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>

                <div className="text-center mb-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${results.eligibilityStatus === 'Eligible' ? 'bg-emerald-500/20 text-emerald-400' :
                    results.eligibilityStatus === 'Conditionally Eligible' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    {results.eligibilityStatus === 'Eligible' ? 'Congratulations! You are Eligible.' :
                      results.eligibilityStatus === 'Conditionally Eligible' ? 'You are Conditionally Eligible.' :
                        'Currently Not Eligible'}
                  </h2>
                  <p className="text-slate-400">Application No: <strong className="text-white font-mono">{results.applicationNumber}</strong></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Eligible Loan</p>
                    <p className="text-2xl md:text-3xl font-black text-emerald-400">{formatCurrency(results.calculatedMetrics.eligibleLoanAmount)}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estimated EMI</p>
                    <p className="text-2xl md:text-3xl font-black text-white">{formatCurrency(results.calculatedMetrics.suggestedEmi)}<span className="text-sm text-slate-500">/mo</span></p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credit Risk Level</p>
                    <p className={`text-2xl md:text-3xl font-black ${results.calculatedMetrics.riskLevel === 'Excellent' ? 'text-emerald-400' :
                      results.calculatedMetrics.riskLevel === 'Good' ? 'text-blue-400' :
                        results.calculatedMetrics.riskLevel === 'Average' ? 'text-amber-400' : 'text-red-400'
                      }`}>{results.calculatedMetrics.riskLevel}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8">
                  <h3 className="font-bold text-white mb-4">Banking Metrics Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">FOIR (Fixed Obligation to Income Ratio)</span>
                        <span className="font-bold text-white">{results.calculatedMetrics.foir}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${results.calculatedMetrics.foir > 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, results.calculatedMetrics.foir)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">LTV (Loan to Value Ratio)</span>
                        <span className="font-bold text-white">{results.calculatedMetrics.ltv}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${results.calculatedMetrics.ltv > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, results.calculatedMetrics.ltv)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-8 border-t border-white/10">
                  <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                    Your application has been securely submitted to our advisory team. A loan expert will contact you shortly to process your file.
                  </p>
                  <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors">
                    Start New Calculation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
