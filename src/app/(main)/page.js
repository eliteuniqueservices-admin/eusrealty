import { Search, MapPin, ArrowRight, ShieldCheck, Star, Quote, ChevronRight, Play, Building2, TrendingUp } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import SectionWrapper from "@/components/SectionWrapper";
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProjects = [];
  try {
    await dbConnect();
    // Fetch up to 4 latest properties to feature on the homepage
    featuredProjects = await Property.find({}).sort({ createdAt: -1 }).limit(4);
  } catch (error) {
    console.error("Failed to load featured properties from database:", error.message);
    // When using dummy credentials, show placeholder data so UI doesn't look empty
    featuredProjects = [
      { _id: 'dummy1', name: "Omega Retreat (Phase 2)", location: "Wakad, Pune", images: ["/uploads/1780739194019-Omega-Retreat-Phase-2.jpg"], configDetails: [{price: "2.5 Cr"}] },
      { _id: 'dummy2', name: "Lara Solitaire", location: "Baner, Pune", images: ["/uploads/1780825436591-Lara-Solitaire.avif"], configDetails: [{price: "4.2 Cr"}] },
    ];
  }
  return (
    <main className="min-h-screen bg-[#FDFDFD] selection:bg-amber-500 selection:text-white overflow-x-hidden font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <SectionWrapper gradient="from-[#F8F9FA] via-white to-white">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 md:py-40 lg:py-48 flex flex-col items-center text-center overflow-hidden">
          {/* Subtle Luxury Background Elements */}
          <div className="absolute top-20 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-slate-200/40 rounded-full blur-[100px] md:blur-[120px] mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-amber-100/40 rounded-full blur-[100px] md:blur-[120px] mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

          <Reveal>
            <div className="group relative inline-flex items-center justify-center mb-8 md:mb-10 p-[2px] rounded-full overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
              {/* Spinning conic gradient for the light border */}
              <div 
                className="absolute w-[300%] h-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,#f59e0b_30%,transparent_50%)] animate-spin" 
                style={{ animationDuration: '4s' }}
              />
              
              {/* Inner content container masking the center */}
              <div className="relative inline-flex items-center gap-3 bg-white/95 backdrop-blur-xl text-slate-800 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold w-full h-full transition-colors duration-300 hover:bg-white">
                <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Star size={10} className="fill-white md:w-3 md:h-3" />
                </span>
                <span className="tracking-wide">Authorized Channel Partner | RERA Registered</span>
                <ChevronRight size={16} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-950 tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[1.05] z-10 relative">
              Discover Pune's most <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900">
                exclusive residences.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg md:text-2xl text-slate-500 max-w-3xl mb-12 md:mb-16 leading-relaxed font-light z-10 relative px-2">
              Access premium pre-launch inventory and direct-builder pricing. 
              <br className="hidden md:block" /> Expert guidance. Zero brokerage. Total transparency.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            {/* High-End Search Bar */}
            <div className="relative z-20 w-full max-w-4xl bg-white backdrop-blur-xl border border-slate-200 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] rounded-[2rem] md:rounded-full p-2 md:p-3 flex flex-col md:flex-row gap-2 items-center focus-within:ring-4 focus-within:ring-amber-500/10 transition-all duration-500">
              <div className="flex items-center gap-3 md:gap-4 flex-1 px-4 py-4 md:px-8 md:py-0 border-b md:border-b-0 md:border-r border-slate-100 w-full group">
                <MapPin className="text-amber-500 group-focus-within:animate-bounce shrink-0" size={24} />
                <input 
                  type="text" 
                  placeholder="Search micro-market (e.g., Baner)" 
                  className="w-full bg-transparent outline-none text-slate-800 text-base md:text-lg placeholder:text-slate-400 font-medium truncate"
                />
              </div>
              
              {/* PRIMARY BUTTON: "Building Rise" Animation */}
              <button className="relative overflow-hidden w-full md:w-auto bg-slate-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full font-bold group tracking-wide active:scale-95 transition-all shadow-md">
                <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                  <Search size={20} className="text-amber-500 group-hover:text-slate-950 group-hover:rotate-90 transition-all duration-500" />
                  <span>Find Properties</span>
                </span>
              </button>
            </div>
          </Reveal>
        </section>
      </SectionWrapper>

      {/* --- SEO VALUE PROPOSITION (TRUST MARKERS) --- */}
      <SectionWrapper>
        <section className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <TrendingUp size={28} />, title: "Zero Brokerage", desc: "As an official channel partner, our advisory and transaction services are completely free for buyers." },
              { icon: <ShieldCheck size={28} />, title: "100% RERA Verified", desc: "We exclusively list legally vetted, RERA-approved developments from Pune's Grade-A builders." },
              { icon: <Building2 size={28} />, title: "Pre-Launch Access", desc: "Get priority access to exclusive floor plans and introductory pricing before public release." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="group p-8 md:p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 flex items-center justify-center mb-6 group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* --- FEATURED PROPERTY GRID --- */}
      <SectionWrapper gradient="from-white to-[#F8F9FA]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <Reveal>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 bg-amber-500 rounded-full"></div>
                  <span className="text-amber-600 font-bold uppercase tracking-widest text-xs md:text-sm">Signature Collection</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Premium Developments</h2>
                <p className="text-base md:text-lg text-slate-500 max-w-xl font-light">
                  Handpicked luxury properties with exclusive direct-builder pricing.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Reveal delay={0.1}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 rounded-3xl h-full">
                <PropertyCard title="Omega Retreat (Phase 2)" location="Wakad, Pune" price="2.5 Cr" beds="3" baths="3" area="1450" image="/uploads/1780739194019-Omega-Retreat-Phase-2.jpg" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 rounded-3xl h-full">
                <PropertyCard title="Lara Solitaire" location="Baner, Pune" price="4.2 Cr" beds="4" baths="4" area="2100" image="/uploads/1780825436591-Lara-Solitaire.avif" />
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 rounded-3xl h-full">
                <PropertyCard title="Skyline Villas" location="Koregaon Park, Pune" price="8.9 Cr" beds="5" baths="6" area="4500" />
              </div>
            </Reveal>
          </div>
        </section>
      </SectionWrapper>

      {/* --- OTHER PROJECTS SECTION (DARK MODE) --- */}
      <SectionWrapper>
        <section className="max-w-[95%] xl:max-w-7xl mx-auto bg-slate-950 py-20 md:py-32 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden my-12 border border-slate-800 shadow-2xl px-4 sm:px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <div className="relative z-10 w-full">
            <Reveal>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 border-b border-white/10 pb-8 md:pb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Investment Opportunities</h2>
                  <p className="text-slate-400 font-light text-base md:text-lg">Explore high-ROI upcoming and ready-to-move projects.</p>
                </div>
                
                {/* SECONDARY BUTTON: "Door Slide" Animation */}
                <Link 
                  href="/properties" 
                  className="relative overflow-hidden mt-6 lg:mt-0 flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full font-semibold transition-all group tracking-wide cursor-pointer"
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
              {featuredProjects.length > 0 ? featuredProjects.map((project, i) => (
                <Reveal key={project._id.toString()} delay={i * 0.1}>
                  <div className="group bg-white/[0.02] border border-white/[0.05] p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] hover:border-amber-500/50 transition-all duration-300 cursor-pointer overflow-hidden relative">
                    <div className="h-40 md:h-48 bg-slate-900 rounded-xl md:rounded-2xl mb-4 md:mb-5 overflow-hidden relative border border-slate-800">
                      {project.images?.[0] ? (
                        <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-700 ease-out" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/20 backdrop-blur-sm">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                           <Play size={20} className="ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="px-2 relative z-10">
                      <h4 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{project.name}</h4>
                      <p className="text-slate-400 text-xs md:text-sm mb-3 md:mb-4">{project.location}</p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <p className="text-slate-300 font-medium text-sm">
                          {project.configDetails && project.configDetails[0] ? (
                            <>From <span className="text-amber-400 font-bold">{project.configDetails[0].price}</span></>
                          ) : (
                            <span className="text-amber-400 font-bold">Contact for Price</span>
                          )}
                        </p>
                        <ArrowRight size={16} className="text-slate-500 group-hover:text-amber-400 group-hover:-rotate-45 transition-all" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              )) : (
                <div className="col-span-full text-center text-slate-500 py-10">No projects published yet.</div>
              )}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* --- FREE CONSULTATION SECTION --- */}
      <SectionWrapper>
        <section className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-amber-500/10 blur-[80px] md:blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
              <div className="absolute bottom-0 right-0 w-80 h-80 md:w-[600px] md:h-[600px] bg-slate-700/40 blur-[100px] md:blur-[120px] rounded-full translate-x-1/4 translate-y-1/4 animate-[spin_25s_linear_infinite_reverse]" />

              <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center p-8 sm:p-12 md:p-20 relative z-10">
                <Reveal>
                  <div className="text-white space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 backdrop-blur-xl rounded-full text-xs md:text-sm font-bold border border-white/10 shadow-lg">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="tracking-wide">Exclusive Advisory Desk</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                      Confused about the <br /> 
                      <span className="text-amber-400">perfect investment?</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
                      Our real estate analysts provide a 45-minute deep-dive consultation to align your 
                      financial goals with the highest-appreciating assets.
                    </p>
                    <ul className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                      {["Unbiased Builder Comparisons", "Hidden Cost Analysis", "ROI & Appreciation Forecasts", "Custom Payment Plans"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 md:gap-4 text-white font-medium text-sm md:text-lg">
                          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-xs md:text-sm shadow-inner border border-amber-500/30 text-amber-400">✔</div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.3}>
                  <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center tracking-tight">Book a Strategy Session</h3>
                    <p className="text-sm md:text-base text-center text-slate-500 mb-6 md:mb-8 font-light">100% Free Advisory. No obligations.</p>
                    <form className="space-y-4 md:space-y-5">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">Full Name</label>
                          <input type="text" placeholder="John Doe" className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all font-medium text-sm md:text-base" />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                          <input type="text" placeholder="+91 98765 43210" className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all font-medium text-sm md:text-base" />
                        </div>
                      </div>
                      
                      {/* PRIMARY BUTTON: "Building Rise" Animation */}
                      <button className="relative overflow-hidden w-full bg-slate-950 text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl group shadow-xl tracking-wide mt-4 md:mt-6">
                        <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                          Claim Free Consultation 
                          <ArrowRight size={20} className="text-amber-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </form>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* --- TESTIMONIALS SECTION --- */}
      <SectionWrapper>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">Client Success Stories</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-xl font-light">
                Hear from investors and homeowners who secured their assets through EusRealty.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Ananya Sharma", role: "First-time Buyer", text: "The direct-to-builder approach saved me lakhs in brokerage. Their transparency and legal vetting gave me immense peace of mind." },
              { name: "Vikram Malhotra", role: "NRI Investor", text: "EusRealty's ROI breakdown and portfolio management makes them my exclusive channel partner for Pune real estate." },
              { name: "Rajesh Gupta", role: "Homeowner", text: "They negotiated a payment plan I couldn't have secured on my own. True professionals from site visit to registration." },
            ].map((testi, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 relative group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] transition-all duration-500 flex flex-col justify-between h-full">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Quote className="text-slate-100 w-12 h-12 md:w-16 md:h-16" />
                  </div>
                  <div>
                    <div className="flex gap-1 mb-6 md:mb-8">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 md:w-[18px] md:h-[18px] fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-slate-700 text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium relative z-10">"{testi.text}"</p>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 relative z-10 border-t border-slate-100 pt-5 md:pt-6 mt-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-900 font-bold text-base md:text-lg shrink-0">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">{testi.name}</h4>
                      <p className="text-xs md:text-sm text-slate-500 font-medium">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* --- CTA SECTION --- */}
      <SectionWrapper>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-32">
          <Reveal>
            <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center text-white overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-slate-800/50 blur-[80px] md:blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-amber-900/20 blur-[80px] md:blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />
              
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 relative z-10 tracking-tight leading-[1.1]">
                Ready to secure your <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">dream asset?</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg md:text-2xl mb-10 md:mb-12 max-w-2xl mx-auto relative z-10 font-light">
                Join our elite network of buyers and get exclusive access to Pune's finest real estate.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                {/* PRIMARY CTA: "Building Rise" */}
                <button className="relative overflow-hidden bg-white text-slate-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    View Exclusive Inventory
                  </span>
                </button>
                <button className="relative overflow-hidden bg-white text-slate-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold group shadow-xl tracking-wide w-full sm:w-auto">
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    Schedule a Site Visit
                  </span>
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      </SectionWrapper>

    </main>
  );
}