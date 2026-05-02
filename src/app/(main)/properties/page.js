"use client";
import { useState, useMemo, useCallback } from 'react';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, 
  MapPin, Home as HomeIcon, BedDouble, Wallet, 
  Clock, X, ChevronDown, Award, ArrowRight, Bath, Maximize
} from 'lucide-react';

// --- 1. STATIC DATA (Moved OUTSIDE component to prevent re-allocations on render) ---
const allProperties = [
  { id: 1, title: "Eus Heights", location: "Baner", price: "2.5 Cr", priceVal: 2.5, bhk: "3", baths: "3", area: "1450", type: "Apartments", status: "Ready to Move", possession: "Immediate" },
  { id: 2, title: "The Azure Wing", location: "Balewadi", price: "4.2 Cr", priceVal: 4.2, bhk: "4", baths: "4", area: "2100", type: "Apartments", status: "Under Construction", possession: "Dec 2026" },
  { id: 3, title: "Skyline Villas", location: "Wakad", price: "8.9 Cr", priceVal: 8.9, bhk: "5", baths: "6", area: "4500", type: "Villas", status: "Ready to Move", possession: "Immediate" },
  { id: 4, title: "Marina Bay Estates", location: "Hinjewadi", price: "1.5 Cr", priceVal: 1.5, bhk: "2", baths: "2", area: "1200", type: "Apartments", status: "Under Construction", possession: "Mar 2027" },
  { id: 5, title: "Green Valley", location: "Bavdhan", price: "1.2 Cr", priceVal: 1.2, bhk: "2", baths: "2", area: "950", type: "Apartments", status: "Ready to Move", possession: "Immediate" },
  { id: 6, title: "The Penthouse", location: "Kothrud", price: "15.0 Cr", priceVal: 15.0, bhk: "5", baths: "7", area: "5500", type: "Penthouses", status: "Ready to Move", possession: "Immediate" },
  { id: 7, title: "Oasis Gardens", location: "Tathawade", price: "3.5 Cr", priceVal: 3.5, bhk: "3", baths: "3", area: "1600", type: "Apartments", status: "Under Construction", possession: "Jan 2027" },
  { id: 8, title: "Tech Park Residences", location: "Mahalunge", price: "1.8 Cr", priceVal: 1.8, bhk: "2", baths: "2", area: "1100", type: "Apartments", status: "Ready to Move", possession: "Immediate" },
];

const locations = ["All", ...new Set(allProperties.map(p => p.location))];
const propertyTypes = ["All", "Apartments", "Villas", "Penthouses"];
const bhkOptions = ["All", "2", "3", "4", "5"];
const statusOptions = ["All", "Ready to Move", "Under Construction"];
const possessionOptions = ["Any Time", "Within 6 Months", "Within 1 Year", "2027 & Beyond"];

const priceRanges = [
  { label: "All Prices", min: 0, max: 100 },
  { label: "Under 2 Cr", min: 0, max: 2 },
  { label: "2 Cr - 5 Cr", min: 2, max: 5 },
  { label: "5 Cr - 10 Cr", min: 5, max: 10 },
  { label: "Above 10 Cr", min: 10, max: 100 },
];

export default function PropertiesPage() {
  // --- 2. STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Added "possession" to the core state
  const [filters, setFilters] = useState({
    type: "All",
    bhk: "All",
    status: "All",
    location: "All",
    priceRange: "All Prices", // Matched with exact label
    possession: "Any Time"
  });

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
      // 1. Text Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
                            p.title.toLowerCase().includes(searchLower) || 
                            p.location.toLowerCase().includes(searchLower);

      // 2. Exact Match Filters
      const matchesType = filters.type === "All" || p.type === filters.type;
      const matchesBhk = filters.bhk === "All" || p.bhk === filters.bhk;
      const matchesStatus = filters.status === "All" || p.status === filters.status;
      const matchesLocation = filters.location === "All" || p.location === filters.location;
      
      // 3. Price Logic
      let matchesPrice = true;
      if (filters.priceRange !== "All Prices") {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range) {
          matchesPrice = p.priceVal >= range.min && p.priceVal <= range.max;
        }
      }

      // 4. Time/Possession Logic
      let matchesPossession = true;
      if (filters.possession !== "Any Time") {
        if (p.possession === "Immediate") {
           // Immediate properties pass all "within X time" filters
           matchesPossession = true; 
        } else {
          // Parse "Dec 2026" style strings
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
  }, [searchQuery, filters]);

  // Calculate active filters to show the pill counter
  const activeFilterCount = Object.entries(filters).filter(([key, v]) => {
    return v !== "All" && v !== "All Prices" && v !== "Any Time";
  }).length;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 font-sans selection:bg-blue-500 selection:text-white relative">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-white border-b border-gray-200/60 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Award size={14} className="text-blue-600" /> Authorized Channel Partner
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                  Prime living in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">West Pune</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-xl font-light">
                  Your trusted local experts. Browse {allProperties.length} verified builder-direct premium assets across Baner, Wakad, Balewadi, and beyond.
                </p>
              </div>

              {/* Main Search Input */}
              <div className="relative w-full md:w-[400px] group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Search size={22} />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project or neighborhood..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm text-gray-800 font-medium placeholder:font-normal placeholder:text-gray-400"
                />
              </div>
            </div>
          </Reveal>

          {/* --- ADVANCED FILTER PANEL (DESKTOP) --- */}
          <Reveal delay={0.1}>
            <div className="hidden lg:flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-xl border border-gray-200/80 p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              
              {/* Filter: Location */}
              <div className="flex-1 min-w-[200px] relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-gray-700 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc === "All" ? "All West Pune Locations" : loc}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter: Property Type */}
              <div className="flex-1 min-w-[180px] relative">
                <HomeIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-gray-700 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  {propertyTypes.map(type => <option key={type} value={type}>{type === "All" ? "Property Type" : type}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter: Price Range */}
              <div className="flex-1 min-w-[180px] relative">
                <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium text-gray-700 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={filters.priceRange}
                  onChange={(e) => updateFilter('priceRange', e.target.value)}
                >
                  {priceRanges.map(range => <option key={range.label} value={range.label}>{range.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-10 bg-gray-200 mx-2 hidden xl:block"></div>

              {/* Filter: BHK Chips */}
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <div className="pl-3 pr-2 text-gray-400"><BedDouble size={18}/></div>
                {bhkOptions.map(bhk => (
                  <button
                    key={bhk}
                    onClick={() => updateFilter('bhk', bhk)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      filters.bhk === bhk 
                      ? "bg-white text-blue-600 shadow-sm border border-gray-200" 
                      : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 border border-transparent"
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
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-4 rounded-2xl font-bold text-gray-700 shadow-sm"
            >
              <SlidersHorizontal size={20} className={activeFilterCount > 0 ? "text-blue-600" : "text-gray-500"} />
              {isMobileFilterOpen ? "Close Filters" : "Advanced Filters"}
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full ml-2">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col xl:flex-row gap-10">
        
        {/* --- LEFT SIDEBAR (SECONDARY FILTERS) --- */}
        <div className={`xl:w-64 flex-shrink-0 ${isMobileFilterOpen ? "block" : "hidden xl:block"}`}>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-200/60 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Status</h3>
              {(activeFilterCount > 0 || searchQuery !== "") && (
                <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:underline">
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {statusOptions.filter(s => s !== "All").map((status) => (
                <label key={status} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.status === status ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                    {filters.status === status && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <input 
                    type="radio" 
                    name="status" 
                    className="hidden" 
                    checked={filters.status === status}
                    onChange={() => updateFilter('status', filters.status === status ? "All" : status)}
                  />
                  <span className={`text-sm font-medium ${filters.status === status ? "text-gray-900" : "text-gray-600"}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>

            {/* Possession Filter (Now connected to state!) */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gray-400"/> Possession
              </h3>
              <div className="space-y-3">
                {possessionOptions.map((time) => (
                  <label key={time} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="possession" 
                      className="hidden" 
                      checked={filters.possession === time}
                      onChange={() => updateFilter('possession', time)}
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                       <div className={`w-2 h-2 rounded-full transition-colors ${filters.possession === time ? 'bg-blue-600' : 'bg-transparent group-hover:bg-blue-200'}`}></div>
                    </div>
                    <span className={`text-sm font-medium ${filters.possession === time ? "text-gray-900 font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
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
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} {filteredProperties.length === 1 ? "Property" : "Properties"} <span className="text-gray-400 font-light">Found</span>
            </h2>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200/60 shadow-sm w-fit">
               <button 
                 onClick={() => setViewMode("grid")}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 ${viewMode === "grid" ? "bg-gray-50 border border-gray-200 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
               >
                 <LayoutGrid size={18}/> <span className="hidden sm:inline">Grid</span>
               </button>
               <button 
                 onClick={() => setViewMode("list")}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 ${viewMode === "list" ? "bg-gray-50 border border-gray-200 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
               >
                 <List size={18}/> <span className="hidden sm:inline">List</span>
               </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm font-medium text-gray-500 mr-2">Active Filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (value === "All" || value === "All Prices" || value === "Any Time") return null;
                
                // Allow defaulting back based on the key type
                const clearValue = key === 'priceRange' ? 'All Prices' : key === 'possession' ? 'Any Time' : 'All';
                
                return (
                  <div key={key} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    <span className="capitalize text-gray-400 mr-1">{key === 'priceRange' ? 'Price' : key}:</span> {value}
                    <button onClick={() => updateFilter(key, clearValue)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dynamic Render based on viewMode */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
            {filteredProperties.map((prop, index) => (
              <Reveal key={prop.id} delay={(index % 4) * 0.1}>
                
                {viewMode === "grid" ? (
                  /* --- GRID VIEW CARD --- */
                  <div className="group relative bg-white border border-gray-200/60 rounded-[2rem] p-3 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] hover:border-blue-200 transition-all duration-500">
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                        {prop.type}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md ${prop.status === 'Ready to Move' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                        {prop.status}
                      </span>
                    </div>
                    <div className="rounded-[1.5rem] overflow-hidden">
                      <PropertyCard {...prop} />
                    </div>
                  </div>
                ) : (
                  /* --- LIST VIEW CARD --- */
                  <div className="group flex flex-col md:flex-row bg-white border border-gray-200/60 rounded-[2rem] p-4 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] hover:border-blue-200 transition-all duration-500 gap-6">
                    {/* Image Area placeholder */}
                    <div className="w-full md:w-80 h-56 rounded-2xl bg-gray-100 relative overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                         <span className={`px-3 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md ${prop.status === 'Ready to Move' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                           {prop.status}
                         </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{prop.title}</h3>
                            <div className="flex items-center gap-2 text-gray-500 mt-1 font-medium">
                              <MapPin size={16} className="text-blue-500"/> {prop.location}, West Pune
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400 font-medium mb-1">Starting from</p>
                            <p className="text-2xl font-black text-blue-600">₹{prop.price}</p>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap items-center gap-4 mt-6">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <BedDouble size={18} className="text-gray-400"/>
                            <span className="font-bold text-gray-700">{prop.bhk} BHK</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Bath size={18} className="text-gray-400"/>
                            <span className="font-bold text-gray-700">{prop.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Maximize size={18} className="text-gray-400"/>
                            <span className="font-bold text-gray-700">{prop.area} sq.ft</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-500">
                          <span className="text-gray-900 font-bold">Possession:</span> {prop.possession}
                        </p>
                        <button className="flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300">
                          View Details <ArrowRight size={18} />
                        </button>
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
              <div className="text-center py-32 bg-white border border-dashed border-gray-300 rounded-[3rem] mt-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No properties found</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto mb-8 font-light">
                  We couldn't find any properties matching your exact criteria in West Pune. Try adjusting your filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-gray-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                >
                  Clear all filters
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}