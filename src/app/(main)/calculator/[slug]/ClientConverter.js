// c:\Users\rahul\eusrealty\src\app\(main)\calculator\[slug]\ClientConverter.js

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

export default function ClientConverter({
  initialFromVal,
  initialToVal,
  fromUnit,
  toUnit,
  fromKey,
  toKey,
  type,
  conversionRate,
  unitsDict
}) {
  const router = useRouter();
  // Derive display values from the current conversion props so we avoid
  // calling setState synchronously inside an effect (react-hooks/set-state-in-effect)
  const defaultFromValue = useMemo(() => "1", []);
  const defaultToValue = useMemo(
    () => String(conversionRate.toFixed(6).replace(/\.?0+$/, "")),
    [conversionRate]
  );

  const [fromValue, setFromValue] = useState(defaultFromValue);
  const [toValue, setToValue] = useState(defaultToValue);

  // Sync input values whenever the route changes (new unit pair)
  useEffect(() => {
    setFromValue(defaultFromValue);
    setToValue(defaultToValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromKey, toKey, conversionRate]);

  const handleFromChange = (val) => {
    setFromValue(val);
    const num = parseFloat(val);
    if (isNaN(num)) {
      setToValue("");
    } else {
      const result = num * conversionRate;
      setToValue(String(result.toFixed(6).replace(/\.?0+$/, "")));
    }
  };

  const handleToChange = (val) => {
    setToValue(val);
    const num = parseFloat(val);
    if (isNaN(num)) {
      setFromValue("");
    } else {
      const result = num / conversionRate;
      setFromValue(String(result.toFixed(6).replace(/\.?0+$/, "")));
    }
  };

  const handleSwap = () => {
    router.push(`/calculator/${toKey}-to-${fromKey}`);
  };

  const handleUnitSelect = (newFrom, newTo) => {
    if (newFrom === newTo) {
      // Find another unit to swap with or just swap them
      router.push(`/calculator/${newTo}-to-${newFrom}`);
      return;
    }
    router.push(`/calculator/${newFrom}-to-${newTo}`);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.08)]">
      
      {/* Type badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-bold text-amber-700 uppercase tracking-widest">
          {type === "area" ? "📐 Area Converter" : "📏 Length Converter"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-9 gap-6 items-center">
        
        {/* Input Left: From */}
        <div className="md:col-span-4 space-y-2">
          <label htmlFor="from-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            From Unit
          </label>
          <div className="relative group/input border border-slate-200 focus-within:border-amber-400/80 bg-[#FAFAFB] rounded-2xl p-4 transition-all duration-300">
            <div className="flex items-center justify-between gap-3 mb-2">
              <select
                id="from-unit-select"
                value={fromKey}
                onChange={(e) => handleUnitSelect(e.target.value, toKey)}
                className="bg-transparent text-slate-800 font-extrabold text-base md:text-lg outline-none cursor-pointer pr-4 hover:text-amber-600 transition-colors"
              >
                {Object.entries(unitsDict).map(([key, item]) => (
                  <option key={`from-opt-${key}`} value={key} className="text-slate-800 font-medium">
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>
            <input
              id="from-input"
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-full bg-transparent text-2xl md:text-3xl font-black text-slate-900 outline-none placeholder:text-slate-300"
              placeholder="0"
            />
          </div>
        </div>

        {/* Swap button column */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
          <button
            type="button"
            onClick={handleSwap}
            id="swap-units-btn"
            className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center border-4 border-white shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 hover:rotate-180 group active:scale-95"
            aria-label="Swap Units"
          >
            <ArrowLeftRight size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Input Right: To */}
        <div className="md:col-span-4 space-y-2">
          <label htmlFor="to-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            To Unit
          </label>
          <div className="relative group/input border border-slate-200 focus-within:border-amber-400/80 bg-[#FAFAFB] rounded-2xl p-4 transition-all duration-300">
            <div className="flex items-center justify-between gap-3 mb-2">
              <select
                id="to-unit-select"
                value={toKey}
                onChange={(e) => handleUnitSelect(fromKey, e.target.value)}
                className="bg-transparent text-slate-800 font-extrabold text-base md:text-lg outline-none cursor-pointer pr-4 hover:text-amber-600 transition-colors"
              >
                {Object.entries(unitsDict).map(([key, item]) => (
                  <option key={`to-opt-${key}`} value={key} className="text-slate-800 font-medium">
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>
            <input
              id="to-input"
              type="number"
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              className="w-full bg-transparent text-2xl md:text-3xl font-black text-slate-900 outline-none placeholder:text-slate-300"
              placeholder="0"
            />
          </div>
        </div>

      </div>

      {/* Reciprocal ratios details */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-slate-400">
        <div>
          1 {fromUnit.name} = <span className="text-slate-700 font-extrabold">{conversionRate.toFixed(6).replace(/\.?0+$/, "")} {toUnit.plural}</span>
        </div>
        <div className="hidden sm:block text-slate-200 font-light">|</div>
        <div>
          1 {toUnit.name} = <span className="text-slate-700 font-extrabold">{(1 / conversionRate).toFixed(6).replace(/\.?0+$/, "")} {fromUnit.plural}</span>
        </div>
      </div>

    </div>
  );
}
