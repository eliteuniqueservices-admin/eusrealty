import { Search, MapPin, ArrowRight, HomeIcon, ShieldCheck, Zap, Star, Quote, ChevronRight, Play } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import SectionWrapper from "@/components/SectionWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans">
      
      {/* --- HERO SECTION --- */}
      <SectionWrapper gradient="from-[#F4F7FF] via-white to-white">
        <section className="relative max-w-7xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

          <Reveal>
            <div className="group relative inline-flex items-center gap-3 bg-white/40 backdrop-blur-md border border-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-10 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 hover:shadow-blue-500/10 hover:-translate-y-0.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Zap size={14} className="animate-[pulse_2s_ease-in-out_infinite]" />
              </span>
              <span>New: Direct Builder Listings for 2026</span>
              <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.05] z-10 relative">
              Find your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 animate-gradient-x">
                masterpiece.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mb-16 leading-relaxed font-light z-10 relative">
              EusRealty connects you directly with top-tier builders. 
              <br className="hidden md:block" /> No middleman, no clutter—just premium living spaces.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            {/* Glassmorphic Search Bar */}
            <div className="relative z-20 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] rounded-full p-2 md:p-3 flex flex-col md:flex-row gap-2 items-center focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-500">
              <div className="flex items-center gap-4 flex-1 px-8 py-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-200/50 w-full group">
                <MapPin className="text-blue-500 group-focus-within:animate-bounce" size={24} />
                <input 
                  type="text" 
                  placeholder="Where do you want to live?" 
                  className="w-full bg-transparent outline-none text-gray-800 text-lg md:text-xl placeholder:text-gray-400 font-medium"
                />
              </div>
              <button className="w-full md:w-auto bg-gray-900 hover:bg-blue-600 text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 group">
                <Search size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                Search Homes
              </button>
            </div>
          </Reveal>
        </section>
      </SectionWrapper>

      {/* --- TRUST MARKERS --- */}
      <SectionWrapper>
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <HomeIcon size={28} />, title: "0% Brokerage", desc: "Pay only for your home, nothing else. Transparent pricing directly from builders." },
              { icon: <ShieldCheck size={28} />, title: "Verified Assets", desc: "Every single project undergoes a rigorous 50-point RERA & Eus verification check." },
              { icon: <ArrowRight size={28} />, title: "Direct Connect", desc: "Skip the queues. Talk, negotiate, and finalize directly with the developers." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="group p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* --- FEATURED PROPERTY GRID --- */}
      <SectionWrapper gradient="from-white to-gray-50">
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <Reveal>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Exclusive</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Featured Collections</h2>
                <p className="text-lg text-gray-500 max-w-xl font-light">
                  Handpicked premium properties with exclusive direct-builder pricing.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Reveal delay={0.1}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-3xl overflow-hidden">
                <PropertyCard title="Eus Heights" location="Andheri West, Mumbai" price="2.5 Cr" beds="3" baths="3" area="1450" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-3xl overflow-hidden">
                <PropertyCard title="The Azure Wing" location="Bandra East, Mumbai" price="4.2 Cr" beds="4" baths="4" area="2100" />
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-3xl overflow-hidden">
                <PropertyCard title="Skyline Villas" location="Worli, Mumbai" price="8.9 Cr" beds="5" baths="6" area="4500" />
              </div>
            </Reveal>
          </div>
        </section>
      </SectionWrapper>

      {/* --- OTHER PROJECTS SECTION --- */}
      <SectionWrapper>
        <section className="max-w-[95%] mx-auto bg-[#0A0A0A] py-32 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden my-12 border border-gray-800 shadow-2xl">
          {/* Subtle noise/grid background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-10">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Discover More</h2>
                  <p className="text-gray-400 font-light text-lg">Explore more upcoming and ready-to-move projects in prime locations.</p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full font-semibold transition-all hover:pr-4 group mt-6 md:mt-0">
                  View Directory 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Emerald Bay", loc: "Thane", price: "1.1 Cr" },
                { name: "The Grand", loc: "Powai", price: "3.2 Cr" },
                { name: "Urban Oasis", loc: "Juhu", price: "6.5 Cr" },
                { name: "Silicon Valley", loc: "Navi Mumbai", price: "85 L" },
              ].map((project, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group bg-white/[0.03] border border-white/[0.08] p-4 rounded-[2rem] hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500 cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="h-48 bg-gray-900 rounded-2xl mb-5 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                           <Play size={20} className="ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="px-2">
                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h4>
                      <p className="text-gray-400 text-sm mb-4">{project.loc}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">From <span className="text-blue-400 font-bold">₹{project.price}</span></p>
                        <ArrowRight size={16} className="text-gray-500 group-hover:text-blue-400 group-hover:-rotate-45 transition-all" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* --- FREE CONSULTATION SECTION --- */}
      <SectionWrapper>
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-blue-600 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl shadow-blue-900/20">
              {/* Animated meshes */}
              <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/40 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4 animate-[spin_25s_linear_infinite_reverse]" />

              <div className="grid lg:grid-cols-2 gap-16 items-center p-10 md:p-20 relative z-10">
                <Reveal>
                  <div className="text-white space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-sm font-bold border border-white/20 shadow-lg">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>Exclusive Concierge Service</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                      Confused about the <br /> 
                      <span className="text-blue-200">perfect investment?</span>
                    </h2>
                    <p className="text-xl text-blue-100 leading-relaxed font-light">
                      Our experts provide a 45-minute deep-dive consultation to align your 
                      financial goals with the best properties in Pune.
                    </p>
                    <ul className="space-y-4 pt-4">
                      {["Unbiased Market Comparison", "Hidden Cost Analysis", "Area Appreciation Forecasts", "Custom Payment Plans"].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-white font-medium text-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-sm shadow-inner border border-white/30">✔</div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.3}>
                  <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transform transition duration-500 hover:scale-[1.02]">
                    <h3 className="text-3xl font-black text-gray-900 mb-2 text-center tracking-tight">Book Your Strategy Call</h3>
                    <p className="text-center text-gray-500 mb-8 font-light">100% Free. No commitments.</p>
                    <form className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                          <input type="text" placeholder="John Doe" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                          <input type="text" placeholder="+91 98765 43210" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" />
                        </div>
                      </div>
                      <button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 group shadow-xl">
                        Claim Free Consultation 
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
        <section className="max-w-7xl mx-auto px-6 py-32">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">What our clients say</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-xl font-light">
                Real stories from people who found their sanctuary through EusRealty.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ananya Sharma", role: "First-time Buyer", text: "The direct-to-builder approach saved me lakhs in brokerage. The transparency and UI was genuinely refreshing." },
              { name: "Vikram Malhotra", role: "Investor", text: "EusRealty's ROI calculator and verified listings make it my go-to platform. No other platform comes close." },
              { name: "Rajesh Gupta", role: "Homeowner", text: "Spacious UI, easy navigation, and direct contact. This is exactly what house hunting should feel like in 2026." },
            ].map((testi, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 relative group hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] transition-all duration-500 flex flex-col justify-between h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Quote className="text-blue-100" size={60} />
                  </div>
                  <div>
                    <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-blue-500 text-blue-500" />)}
                    </div>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed font-medium relative z-10">"{testi.text}"</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 border-t border-gray-100 pt-6 mt-auto">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testi.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{testi.role}</p>
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
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <Reveal>
            <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center text-white overflow-hidden relative shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse]" />
              
              <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10 tracking-tight leading-[1.1]">
                Ready to find your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">next home?</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto relative z-10 font-light">
                Join over 10,000+ people who found their dream residence through EusRealty.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-bold transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1">
                  Browse Properties
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-full font-bold transition-all hover:-translate-y-1">
                  Contact Sales
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      </SectionWrapper>

    </main>
  );
}