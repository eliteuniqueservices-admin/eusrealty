"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import {
  Search, SlidersHorizontal, LayoutGrid, List,
  MapPin, Home as HomeIcon, BedDouble, Wallet,
  Clock, X, ChevronDown, Star, ArrowRight, Bath, Maximize
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const bhkOptions = ["All", "1", "2", "3", "4", "5", "5+"];
const statusOptions = ["All", "Ready to Move", "Under Construction", "New Launch", "Pre-Launch"];
const possessionOptions = ["Any Time", "Within 6 Months", "Within 1 Year", "2027 & Beyond"];

const priceRanges = [
  { label: "All Prices", min: 0, max: 100 },
  { label: "Under 1 Cr", min: 0, max: 1 },
  { label: "1 Cr - 2 Cr", min: 1, max: 2 },
  { label: "2 Cr - 5 Cr", min: 2, max: 5 },
  { label: "Above 5 Cr", min: 5, max: 100 },
];

export default function PropertiesPageClient({ initialProperties, customTitle, customDescription }) {
  // --- 2. STATE MANAGEMENT ---
  const [allProperties] = useState(initialProperties || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    type: "All",
    bhk: "All",
    status: "All",
    location: "All",
    priceRange: "All Prices",
    possession: "Any Time"
  });

  const locations = useMemo(() => ["All", ...new Set(allProperties.map(p => p.location).filter(Boolean))], [allProperties]);
  const propertyTypes = useMemo(() => ["All", ...new Set(allProperties.map(p => p.type).filter(Boolean))], [allProperties]);

  // Pre-fill search from URL param when arriving from hero search bar (?search=Baner)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('search');
    if (q) setSearchQuery(decodeURIComponent(q));
  }, []);

  // --- 3. OPTIMIZED HANDLERS ---
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: "All", bhk: "All", status: "All",
      location: "All", priceRange: "All Prices", possession: "Any Time"
    });
    setSearchQuery("");
  }, []);

  // --- 4. ADVANCED FILTERING ENGINE ---
  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower);

      const matchesType = filters.type === "All" || p.type === filters.type;
      const matchesBhk = filters.bhk === "All" || p.bhk === filters.bhk;
      const matchesStatus = filters.status === "All" || p.status === filters.status;
      const matchesLocation = filters.location === "All" || p.location === filters.location;

      let matchesPrice = true;
      if (filters.priceRange !== "All Prices") {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range) {
          matchesPrice = p.priceVal >= range.min && p.priceVal <= range.max;
        }
      }

      let matchesPossession = true;
      if (filters.possession !== "Any Time") {
        if (p.possession === "Immediate") {
          matchesPossession = true;
        } else {
          const [month, year] = p.possession.split(' ');
          const propDate = new Date(`${month} 1, ${year}`);
          const now = new Date();
          const monthsDiff = (propDate.getFullYear() - now.getFullYear()) * 12 + (propDate.getMonth() - now.getMonth());

          if (filters.possession === "Within 6 Months") matchesPossession = monthsDiff <= 6;
          else if (filters.possession === "Within 1 Year") matchesPossession = monthsDiff <= 12;
          else if (filters.possession === "2027 & Beyond") matchesPossession = propDate.getFullYear() >= 2027;
        }
      }

      return matchesSearch && matchesType && matchesBhk && matchesStatus && matchesLocation && matchesPrice && matchesPossession;
    });
  }, [searchQuery, filters, allProperties]);

  const activeFilterCount = Object.entries(filters).filter(([key, v]) => {
    return v !== "All" && v !== "All Prices" && v !== "Any Time";
  }).length;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32 font-sans selection:bg-amber-500 selection:text-white relative text-slate-900">

      {/* --- HERO HEADER --- */}
      <div className="bg-white border-b border-slate-200/60 pt-24 pb-16 relative overflow-hidden">
        {/* Luxury subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> Authorized Strategic Partner
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.05]">
                  {customTitle ? customTitle : (
                    <>Prime living in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">West Pune</span></>
                  )}
                </h1>
                <p className="text-slate-500 text-lg md:text-xl max-w-xl font-light leading-relaxed">
                  {customDescription ? customDescription : (
                    `Your trusted local experts. Browse ${allProperties.length} verified builder-direct premium assets across Baner, Wakad, Balewadi, and beyond.`
                  )}
                </p>
              </div>

              {/* Main Search Input */}
              <div className="relative w-full md:w-[400px] group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors duration-300">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project or location..."
                  className="w-full pl-14 pr-5 py-4 sm:py-5 rounded-2xl md:rounded-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all duration-300 shadow-sm text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 tracking-wide"
                />
              </div>
            </div>
          </Reveal>

          {/* --- ADVANCED FILTER PANEL (DESKTOP) --- */}
          <Reveal delay={0.1}>
            <div className="hidden lg:flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-200/80 p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)]">

              {/* Filter: Location */}
              <div className="flex-1 min-w-[200px] relative">
                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-slate-700 transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tracking-wide"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc === "All" ? "All West Pune Locations" : loc}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Filter: Property Type */}
              <div className="flex-1 min-w-[180px] relative">
                <HomeIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-slate-700 transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tracking-wide"
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  {propertyTypes.map(type => <option key={type} value={type}>{type === "All" ? "Property Type" : type}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Filter: Price Range */}
              <div className="flex-1 min-w-[180px] relative">
                <Wallet size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-slate-700 transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tracking-wide"
                  value={filters.priceRange}
                  onChange={(e) => updateFilter('priceRange', e.target.value)}
                >
                  {priceRanges.map(range => <option key={range.label} value={range.label}>{range.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-10 bg-slate-200 mx-2 hidden xl:block"></div>

              {/* Filter: BHK Chips */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <div className="pl-3 pr-2 text-slate-400"><BedDouble size={18} /></div>
                {bhkOptions.map(bhk => (
                  <button
                    key={bhk}
                    onClick={() => updateFilter('bhk', bhk)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filters.bhk === bhk
                        ? "bg-slate-950 text-amber-400 shadow-md border border-slate-950 tracking-wide"
                        : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent tracking-wide"
                      }`}
                  >
                    {bhk === "All" ? "Any" : `${bhk} BHK`}
                  </button>
                ))}
              </div>

            </div>
          </Reveal>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mt-6">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 transition-colors py-4 rounded-2xl font-bold text-white shadow-md tracking-wide"
            >
              <SlidersHorizontal size={20} className={activeFilterCount > 0 ? "text-amber-400" : "text-white"} />
              {isMobileFilterOpen ? "Close Filters" : "Advanced Filters"}
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs w-6 h-6 flex items-center justify-center rounded-full ml-2 font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col xl:flex-row gap-10">

        {/* --- LEFT SIDEBAR (SECONDARY FILTERS) --- */}
        <div className={`xl:w-64 flex-shrink-0 ${isMobileFilterOpen ? "block" : "hidden xl:block"}`}>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Status</h3>
              {(activeFilterCount > 0 || searchQuery !== "") && (
                <button onClick={clearFilters} className="text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors">
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {statusOptions.filter(s => s !== "All").map((status) => (
                <label key={status} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 cursor-pointer transition-all group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.status === status ? "bg-slate-950 border-slate-950" : "border-slate-300 group-hover:border-amber-400"}`}>
                    {filters.status === status && <div className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />}
                  </div>
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={filters.status === status}
                    onChange={() => updateFilter('status', filters.status === status ? "All" : status)}
                  />
                  <span className={`text-sm tracking-wide ${filters.status === status ? "text-slate-950 font-bold" : "text-slate-600 font-medium"}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>

            {/* Possession Filter */}
            <div className="mt-10">
              <h3 className="font-black text-slate-900 text-xl mb-5 flex items-center gap-2 tracking-tight">
                <Clock size={20} className="text-amber-500" /> Timeline
              </h3>
              <div className="space-y-4">
                {possessionOptions.map((time) => (
                  <label key={time} className="flex items-center gap-3 cursor-pointer group px-1">
                    <input
                      type="radio"
                      name="possession"
                      className="hidden"
                      checked={filters.possession === time}
                      onChange={() => updateFilter('possession', time)}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.possession === time ? 'border-slate-950' : 'border-slate-300 group-hover:border-amber-500'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${filters.possession === time ? 'bg-slate-950' : 'bg-transparent group-hover:bg-amber-200'}`}></div>
                    </div>
                    <span className={`text-sm tracking-wide ${filters.possession === time ? "text-slate-950 font-bold" : "text-slate-600 font-medium group-hover:text-slate-900"}`}>
                      {time}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- PROPERTIES VIEW SECTION --- */}
        <div className="flex-1">
          {/* Results & View Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {filteredProperties.length} {filteredProperties.length === 1 ? "Property" : "Properties"} <span className="text-slate-400 font-light">Found</span>
            </h2>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all duration-300 ${viewMode === "grid" ? "bg-slate-50 border border-slate-200 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
              >
                <LayoutGrid size={18} /> <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all duration-300 ${viewMode === "list" ? "bg-slate-50 border border-slate-200 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
              >
                <List size={18} /> <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-widest">Active:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (value === "All" || value === "All Prices" || value === "Any Time") return null;

                const clearValue = key === 'priceRange' ? 'All Prices' : key === 'possession' ? 'Any Time' : 'All';

                return (
                  <div key={key} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                    <span className="capitalize text-slate-400 font-medium mr-1">{key === 'priceRange' ? 'Price' : key}:</span> {value}
                    <button onClick={() => updateFilter(key, clearValue)} className="text-slate-400 hover:text-red-500 transition-colors ml-1">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dynamic Render based on viewMode */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" : "flex flex-col gap-6"}>
            {filteredProperties.map((prop, index) => (
              <Reveal key={prop.id} delay={(index % 4) * 0.1}>

                {viewMode === "grid" ? (
                  /* --- GRID VIEW CARD --- */
                  <div className="group relative bg-white border border-slate-100 rounded-[2rem] p-3 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] transition-all duration-500">
                    <div className="rounded-[1.5rem] overflow-hidden h-full">
                      <PropertyCard {...prop} />
                    </div>
                  </div>
                ) : (
                  /* --- LIST VIEW CARD --- */
                  <div className="group flex flex-col md:flex-row bg-white border border-slate-100 rounded-[2rem] p-4 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] transition-all duration-500 gap-6">
                    {/* Image Area placeholder */}
                    <div className="w-full md:w-80 h-64 rounded-2xl bg-slate-100 relative overflow-hidden flex-shrink-0">
                      <Image
                        src={prop.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                        alt={prop.title || "Property image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        priority={false}
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-transparent group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md tracking-wide border border-slate-800/50 ${prop.status === 'Ready to Move' ? 'bg-slate-950/90 text-amber-400' : 'bg-white/90 text-slate-900'}`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-between py-2 pr-2">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 text-slate-500 mb-2 font-medium">
                              <MapPin size={16} className="text-amber-500" />
                              <span className="text-sm tracking-wide">{prop.location}, West Pune</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">{prop.title}</h3>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">Starting from</p>
                            <p className="text-3xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">₹{prop.price}</p>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap items-center gap-3 mt-6">
                          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                            <BedDouble size={18} className="text-slate-400" />
                            <span className="font-bold text-slate-800 text-sm">{prop.bhk} BHK</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                            <Bath size={18} className="text-slate-400" />
                            <span className="font-bold text-slate-800 text-sm">{prop.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                            <Maximize size={18} className="text-slate-400" />
                            <span className="font-bold text-slate-800 text-sm">{prop.area} <span className="text-xs text-slate-500 font-medium">sq.ft</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-6 border-t border-slate-100 gap-4">
                        <p className="text-sm font-medium text-slate-500">
                          <span className="text-slate-900 font-bold uppercase tracking-widest text-xs mr-2">Timeline:</span>
                          {prop.possession}
                        </p>

                        {/* LIST VIEW BUTTON: "Building Rise" Animation */}
                        <Link
                          href={`/properties/${prop.id}`}
                          className="relative overflow-hidden bg-slate-950 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 group/btn inline-block"
                        >
                          <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
                          <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-slate-950 transition-colors duration-300">
                            View Details <ArrowRight size={18} className="text-amber-400 group-hover/btn:text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

              </Reveal>
            ))}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <Reveal>
              <div className="text-center py-32 bg-white border border-dashed border-slate-200 rounded-[3rem] mt-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No properties found</h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto mb-8 font-light">
                  We couldn&apos;t find any properties matching your exact criteria in West Pune. Try adjusting your filters.
                </p>
                {/* EMPTY STATE BUTTON: "Building Rise" Animation */}
                <button
                  onClick={clearFilters}
                  className="relative overflow-hidden bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold tracking-wide transition-all shadow-lg active:scale-95 group"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 block group-hover:text-slate-950 transition-colors duration-300">
                    Clear all filters
                  </span>
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
