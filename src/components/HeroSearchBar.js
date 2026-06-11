"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";

const QUICK_AREAS = ["Baner", "Wakad", "Kothrud", "Hinjewadi", "Koregaon Park"];

export default function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = query.trim();
    router.push(q ? `/properties?search=${encodeURIComponent(q)}` : "/properties");
  };

  const handleAreaClick = (area) => {
    setQuery(area);
    router.push(`/properties?search=${encodeURIComponent(area)}`);
  };

  return (
    <div className="relative z-20 w-full max-w-3xl group">
      {/* Glow ring on focus */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 via-amber-500/20 to-amber-400/30 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

      <form
        onSubmit={handleSearch}
        className="relative bg-white backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] rounded-[2rem] sm:rounded-full p-2 flex flex-col sm:flex-row gap-2 items-stretch focus-within:border-amber-300/80 transition-all duration-500"
      >
        <div className="flex items-center gap-3 flex-1 px-5 py-3.5 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3.5 sm:pb-0 group/input">
          <MapPin className="text-amber-500 shrink-0 group-focus-within/input:animate-bounce" size={22} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area, project or builder..."
            className="w-full bg-transparent outline-none text-slate-800 text-base placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="submit"
          className="relative overflow-hidden flex-shrink-0 w-full sm:w-auto bg-slate-950 text-white px-7 py-3.5 rounded-full font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] group/btn"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 origin-bottom scale-y-0 group-hover/btn:scale-y-100 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center justify-center gap-2.5 group-hover/btn:text-slate-950 transition-colors duration-300">
            <Search size={18} className="group-hover/btn:rotate-12 transition-transform duration-300" />
            Find Properties
          </span>
        </button>
      </form>

      {/* Quick search area tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {QUICK_AREAS.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => handleAreaClick(area)}
            className="text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all duration-200"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}
