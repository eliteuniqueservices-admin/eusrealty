import {
  Search, MapPin, ArrowRight, ShieldCheck, Star, Quote,
  ChevronRight, Building2, TrendingUp, Award, Users, Home as HomeIcon,
  Zap, Phone, CheckCircle2, BarChart3, Sparkles, Clock
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import DarkProjectCard from '@/components/DarkProjectCard';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import HeroClient from '@/components/HeroClient';
import StatsCounter from '@/components/StatsCounter';
import MarqueeBanner from '@/components/MarqueeBanner';
import HeroSuccessStories from '@/components/HeroSuccessStories';
import HeroSearchBar from '@/components/HeroSearchBar';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProjects = [];
  let signatureProperties = [];

  try {
    await dbConnect();
    const mandates = await Property.find({ isMandate: true }).sort({ createdAt: -1 }).limit(4).lean();
    if (mandates.length > 0) {
      featuredProjects = mandates;
    } else {
      featuredProjects = await Property.find({}).sort({ createdAt: -1 }).limit(4).lean();
    }
    signatureProperties = await Property.find({ isSignature: true }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Failed to load featured properties from database:", error.message);
  }

  if (featuredProjects.length === 0) {
    featuredProjects = [
      { _id: 'dummy1', name: "Omega Retreat (Phase 2)", location: "Wakad, Pune", images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"], configDetails: [{ price: "2.5 Cr" }] },
      { _id: 'dummy2', name: "Lara Solitaire", location: "Baner, Pune", images: ["/uploads/1780825436591-Lara-Solitaire.avif"], configDetails: [{ price: "4.2 Cr" }] },
    ];
  }

  if (signatureProperties.length === 0) {
    signatureProperties = [
      {
        _id: 'mock_sig1', name: "Omega Retreat (Phase 2)", location: "Wakad, Pune",
        configDetails: [{ type: "3BHK", carpet: "1450 sqft", price: "2.5 Cr" }],
        images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"],
        status: "Signature", roi: "12.8", views: "3.1k"
      },
      {
        _id: 'mock_sig2', name: "Lara Solitaire", location: "Baner, Pune",
        configDetails: [{ type: "4BHK", carpet: "2100 sqft", price: "4.2 Cr" }],
        images: ["/uploads/1780825436591-Lara-Solitaire.avif"],
        status: "Ultra Luxury", roi: "16.4", views: "5.8k", isNew: true
      },
      {
        _id: 'mock_sig3', name: "Skyline Villas", location: "Koregaon Park, Pune",
        configDetails: [{ type: "5BHK", carpet: "4500 sqft", price: "8.9 Cr" }],
        images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"],
        status: "Exclusive", roi: "18.9", views: "7.2k"
      }
    ];
  }

  const serializedFeatured = featuredProjects.map(project => ({
    ...project,
    _id: project._id ? project._id.toString() : ''
  }));

  const trustBadges = [
    { icon: <ShieldCheck size={16} />, text: "RERA Registered" },
    { icon: <Award size={16} />, text: "ISO Certified" },
    { icon: <Star size={16} className="fill-current" />, text: "4.9★ Rated" },
    { icon: <CheckCircle2 size={16} />, text: "Zero Brokerage" },
    { icon: <Building2 size={16} />, text: "500+ Projects" },
    { icon: <Users size={16} />, text: "10,000+ Clients" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] overflow-x-hidden font-sans text-slate-900">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Immersive full-viewport entry
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-white">

        {/* Layered background: grid + radial gradient + orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Hero radial glow from top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-radial from-amber-100/60 via-amber-50/30 to-transparent rounded-full blur-3xl" />
          {/* Floating orbs */}
          <div className="hero-orb absolute top-1/4 left-[10%] w-72 h-72 bg-amber-200/25 animate-drift" style={{ animationDelay: '0s' }} />
          <div className="hero-orb absolute top-1/3 right-[8%] w-80 h-80 bg-slate-200/30 animate-drift" style={{ animationDelay: '-5s' }} />
          <div className="hero-orb absolute bottom-1/4 left-1/3 w-64 h-64 bg-amber-100/20 animate-drift" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="flex flex-col items-center text-center">

            {/* Animated Trust Badge */}
            <HeroClient />

            {/* Main Headline */}
            <Reveal delay={0.1} variant="fade-up" blur={true}>
              <h1 className="text-[clamp(2.2rem,7vw,4.5rem)] font-black text-slate-950 tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8 max-w-5xl">
                Discover Pune&apos;s most{' '}
                <span
                  className="relative inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #78716c 40%, #f59e0b 70%, #d97706 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  exclusive residences.
                  {/* Underline glow */}
                  <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-70" />
                </span>
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal delay={0.2} variant="fade-up">
              <p className="text-[clamp(1rem,2.5vw,1.35rem)] text-slate-500 max-w-2xl mb-10 md:mb-14 leading-relaxed font-light px-2">
                Discover <span className="text-amber-600 font-semibold">Verified Properties</span>,{' '}
                <span className="text-slate-700 font-semibold">Exclusive Opportunities</span>, and{' '}
                <span className="text-amber-600 font-semibold">Expert Real Estate Guidance</span>—All in One Place.
              </p>
            </Reveal>

            {/* Search Bar */}
            <Reveal delay={0.3} variant="fade-up">
              <HeroSearchBar />
              {/* Micro Ticker Success Stories */}
              <HeroSuccessStories />
            </Reveal>
          </div>

          {/* Hero Stats Row */}
          <Reveal delay={0.5} variant="fade-up">
            <div className="mt-16 md:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                { value: 500, suffix: "+", label: "Projects Listed", icon: <Building2 size={20} /> },
                { value: 10000, suffix: "+", label: "Happy Clients", icon: <Users size={20} /> },
                { value: 98, suffix: "%", label: "RERA Verified", icon: <ShieldCheck size={20} /> },
                { value: 0, suffix: "₹", label: "Brokerage Fee", icon: <TrendingUp size={20} />, prefix: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-5 md:p-6 text-center hover:-translate-y-1 hover:shadow-card transition-all duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/0 group-hover:from-amber-50/80 group-hover:to-transparent transition-all duration-300 rounded-2xl" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-300">
                      {stat.icon}
                    </div>
                    <StatsCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE TRUST BAND
      ═══════════════════════════════════════════════════════════ */}
      <MarqueeBanner />

      {/* ═══════════════════════════════════════════════════════════
          VALUE PROPS — 3 Feature Cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 relative bg-gradient-to-b from-[#FAFAFA] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-widest mb-5">
                <Zap size={12} className="fill-amber-500" />
                Why Choose Us
              </div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-slate-900 tracking-tight">
                The Smart Way to Buy Real Estate
              </h2>
              <p className="text-slate-500 mt-4 max-w-xl mx-auto font-light">
                We eliminate the middleman so you get the best price, the best access, and the best advice — always.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <TrendingUp size={28} />,
                title: "Zero Brokerage",
                desc: "As an official Strategic Partner, our advisory and transaction services are completely free for buyers. Save lakhs.",
                highlight: "₹0 fees",
                color: "from-emerald-500/10 to-emerald-50/50",
                iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
                hoverIcon: "group-hover:bg-emerald-900 group-hover:text-emerald-400",
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "100% RERA Verified",
                desc: "Every listing is legally vetted and RERA-approved from Pune's Grade-A builders. Zero legal risk, total peace of mind.",
                highlight: "Legal Safety",
                color: "from-blue-500/10 to-blue-50/50",
                iconBg: "bg-blue-50 border-blue-100 text-blue-600",
                hoverIcon: "group-hover:bg-blue-900 group-hover:text-blue-400",
              },
              {
                icon: <Building2 size={28} />,
                title: "Pre-Launch Access",
                desc: "Get priority access to exclusive floor plans and introductory pricing before the public — maximize your ROI from day one.",
                highlight: "Early Access",
                color: "from-amber-500/10 to-amber-50/50",
                iconBg: "bg-amber-50 border-amber-100 text-amber-600",
                hoverIcon: "group-hover:bg-slate-900 group-hover:text-amber-400",
              }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className={`group relative p-8 md:p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-card transition-all duration-500 hover:-translate-y-2 h-full overflow-hidden`}>
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />

                  <div className="relative z-10">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-500 ${feature.iconBg} ${feature.hoverIcon}`}>
                      {feature.icon}
                    </div>
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide mb-4">
                      {feature.highlight}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SIGNATURE COLLECTION — Premium Property Cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle background noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[3px] w-8 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                  <span className="text-amber-600 font-bold uppercase tracking-widest text-xs">Signature Collection</span>
                </div>
                <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black text-slate-900 mb-4 tracking-tight">
                  Premium Developments
                </h2>
                <p className="text-base md:text-lg text-slate-500 max-w-xl font-light">
                  Handpicked luxury properties with exclusive direct-builder pricing and maximum ROI.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <Link href="/properties">
                <button className="relative overflow-hidden flex items-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-full font-semibold text-sm group hover:shadow-gold transition-all duration-300">
                  <span className="absolute inset-0 bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                    View All Properties
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {signatureProperties.map((p, i) => {
              const priceVal = p.configDetails?.[0]?.price || "Call";
              const carpetVal = p.configDetails?.[0]?.carpet || "1500";
              const areaParsed = parseInt(carpetVal.replace(/[^\d]/g, '')) || 1500;
              const configType = p.configDetails?.[0]?.type || p.configurations?.[0] || "3BHK";
              const bhkParsed = parseInt(configType.replace(/[^\d]/g, '')) || 3;
              const imageVal = p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

              return (
                <Reveal key={p._id ? p._id.toString() : `sig-${i}`} delay={(i + 1) * 0.1}>
                  <PropertyCard
                    id={p._id?.toString() || 'dummy'}
                    title={p.name}
                    location={p.location}
                    price={priceVal}
                    bhk={bhkParsed}
                    baths={bhkParsed}
                    area={areaParsed}
                    image={imageVal}
                    badge={p.status || "Signature"}
                    roi={p.roi || "14.2"}
                    views={p.views || "2.8k"}
                    isNew={p.isNew || p.status === 'Pre-Launch' || p.status === 'New Launch'}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INVESTMENT OPPORTUNITIES — Dark Section
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative">
        <div className="max-w-[95%] xl:max-w-7xl mx-auto">
          <div className="bg-slate-950 py-20 md:py-32 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden border border-slate-800 shadow-dark-card">

            {/* Animated grid overlay */}
            <div className="absolute inset-0 animated-grid opacity-100" />

            {/* Ambient orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-slate-700/30 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 w-full px-6 sm:px-10">
              <Reveal>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 border-b border-white/10 pb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[3px] w-8 bg-amber-500 rounded-full" />
                      <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">High ROI</span>
                    </div>
                    <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black text-white mb-3 tracking-tight">
                      Investment Opportunities
                    </h2>
                    <p className="text-slate-400 font-light text-base md:text-lg max-w-xl">
                      Explore high-ROI upcoming and ready-to-move projects handpicked by our analysts.
                    </p>
                  </div>

                  <Link
                    href="/properties"
                    className="relative overflow-hidden mt-6 lg:mt-0 flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full font-semibold transition-all group tracking-wide cursor-pointer hover:border-amber-500/50"
                  >
                    <span className="absolute inset-0 w-full h-full bg-amber-500 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-950 transition-colors duration-300">
                      View Full Inventory
                      <ArrowRight size={18} className="text-amber-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
                    </span>
                  </Link>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {serializedFeatured.length > 0 ? serializedFeatured.map((project, i) => (
                  <Reveal key={project._id.toString()} delay={i * 0.1}>
                    <DarkProjectCard project={project} index={i} />
                  </Reveal>
                )) : (
                  <div className="col-span-full text-center text-slate-500 py-10">No projects published yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION — How It Works
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white via-[#FAFAFA] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-xs font-bold uppercase tracking-widest mb-5">
                <Clock size={12} />
                Simple Process
              </div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-slate-900 tracking-tight">
                From Search to Dream Home <br className="hidden md:block" />
                <span className="text-amber-500">in 4 Simple Steps</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {[
              { step: "01", icon: <Search size={24} />, title: "Browse & Discover", desc: "Explore our curated portfolio of RERA-verified premium properties across Pune." },
              { step: "02", icon: <Phone size={24} />, title: "Book Consultation", desc: "Schedule a free 45-minute session with our real estate analysts. No obligation." },
              { step: "03", icon: <HomeIcon size={24} />, title: "Site Visits", desc: "We arrange exclusive site visits with builder representatives for shortlisted projects." },
              { step: "04", icon: <CheckCircle2 size={24} />, title: "Close the Deal", desc: "Our legal team handles documentation, registration, and handover — end to end." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="group relative flex flex-col items-center text-center p-6 md:p-8">
                  {/* Step number bubble */}
                  <div className="relative mb-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-card text-slate-900 flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all duration-500">
                      <div className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-white text-[10px] font-black">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FREE CONSULTATION SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden shadow-dark-card">
            {/* Animated blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/8 blur-[100px] rounded-full -translate-x-1/3 -translate-y-1/3 animate-drift" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-700/30 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4 animate-drift" style={{ animationDelay: '-8s' }} />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center p-8 sm:p-12 md:p-16 lg:p-20 relative z-10">

              {/* Left: Content */}
              <Reveal>
                <div className="text-white space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-sm font-bold border border-white/10">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="tracking-wide">Exclusive Advisory Desk</span>
                  </div>
                  <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.1] tracking-tight">
                    Confused about the{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                      perfect investment?
                    </span>
                  </h2>
                  <p className="text-slate-300 leading-relaxed font-light text-base md:text-lg">
                    Our real estate analysts provide a 45-minute deep-dive consultation to align your
                    financial goals with the highest-appreciating assets in Pune.
                  </p>

                  <ul className="space-y-3 md:space-y-4 pt-2">
                    {[
                      "Unbiased Builder Comparisons",
                      "Hidden Cost Analysis",
                      "ROI & Appreciation Forecasts",
                      "Custom Payment Plans"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-white font-medium text-sm md:text-base">
                        <div className="flex-shrink-0 w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30 text-amber-400 text-sm">
                          ✓
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Social proof */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {['A', 'R', 'V', 'M'].map((initial, i) => (
                        <div
                          key={i}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-slate-900 flex items-center justify-center text-slate-950 text-xs font-black"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Rated 4.9 by 1000+ clients</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Right: Form Card */}
              <Reveal delay={0.25}>
                <div className="bg-white p-7 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5 text-center tracking-tight">
                    Book a Strategy Session
                  </h3>
                  <p className="text-sm text-center text-slate-500 mb-8 font-light">
                    100% Free Advisory. No obligations. Response in 2 hours.
                  </p>

                  <form className="space-y-4">
                    {[
                      { label: "Full Name", type: "text", placeholder: "Rahul Upadhyay" },
                      { label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                      { label: "Email Address", type: "email", placeholder: "rahulUpadhyay@example.com" },
                    ].map((field) => (
                      <div key={field.label} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm placeholder:text-slate-400"
                        />
                      </div>
                    ))}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Budget Range
                      </label>
                      <select className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white focus:border-amber-300 transition-all font-medium text-sm text-slate-700">
                        <option>Under ₹1 Cr</option>
                        <option>₹1 Cr – ₹3 Cr</option>
                        <option>₹3 Cr – ₹5 Cr</option>
                        <option>₹5 Cr – ₹10 Cr</option>
                        <option>Above ₹10 Cr</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="relative overflow-hidden w-full bg-slate-950 text-white font-bold py-4 rounded-2xl group shadow-xl tracking-wide mt-2"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                        Claim Free Consultation
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-3">
                      🔒 Your details are 100% secure. We never share your information.
                    </p>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <SuccessStoriesSection />

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-10 sm:p-16 md:p-24 text-center text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-700/30 blur-[100px] rounded-full" />
              <div className="absolute inset-0 animated-grid opacity-50" />

              {/* Floating decorative dots */}
              <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-amber-400/50 animate-pulse" />
              <div className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-16 left-24 w-1 h-1 rounded-full bg-amber-400/30 animate-pulse" style={{ animationDelay: '2s' }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-amber-400 text-sm font-bold border border-white/10 mb-8">
                  <Sparkles size={14} className="fill-amber-400" />
                  Limited Inventory Available
                </div>

                <h2 className="text-[clamp(2.2rem,6vw,5rem)] font-black mb-6 md:mb-8 tracking-tight leading-[1.05]">
                  Ready to secure your{' '}
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
                    dream asset?
                  </span>
                </h2>

                <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto font-light">
                  Join our elite network of buyers and get exclusive access to Pune&apos;s finest real estate.
                  Pre-launch prices available for a limited time.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/properties" className="w-full sm:w-auto">
                    <button
                      className="relative overflow-hidden bg-amber-500 text-slate-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-black group shadow-gold tracking-wide w-full sm:w-auto text-sm md:text-base transition-transform duration-300 active:scale-[0.97] hover:scale-[1.04]"
                    >
                      <span className="absolute inset-0 bg-white origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 block">
                        View Exclusive Inventory →
                      </span>
                    </button>
                  </Link>

                  <Link href="/contact" className="w-full sm:w-auto">
                    <button
                      className="relative overflow-hidden border-2 border-white/20 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold group tracking-wide w-full sm:w-auto text-sm md:text-base hover:border-white/40 transition-all duration-300 active:scale-[0.97] hover:scale-[1.04]"
                    >
                      <span className="absolute inset-0 bg-white/5 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 block">
                        Schedule a Site Visit
                      </span>
                    </button>
                  </Link>
                </div>

                {/* Bottom trust row */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 md:mt-14 border-t border-white/10 pt-8 md:pt-10">
                  {[
                    { icon: <ShieldCheck size={14} />, text: "RERA Verified" },
                    { icon: <BarChart3 size={14} />, text: "Best ROI Guaranteed" },
                    { icon: <CheckCircle2 size={14} />, text: "Zero Brokerage" },
                    { icon: <Award size={14} />, text: "Award Winning" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <span className="text-amber-400">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}