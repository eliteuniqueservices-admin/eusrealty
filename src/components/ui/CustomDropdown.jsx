"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CustomDropdown({
  value,
  onChange,
  options, // Array of strings or objects { label, value }
  placeholder = "Select option",
  icon: Icon,
  className,
  displayValueMap = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format options normalized to { label, value }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { label: displayValueMap[opt] || opt, value: opt };
    }
    return { label: opt.label, value: opt.value ?? opt.label };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    label: displayValueMap[value] || value || placeholder,
    value,
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full group", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between pl-12 pr-5 py-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 hover:border-slate-300 rounded-2xl cursor-pointer text-slate-700 hover:text-slate-900 transition-all font-semibold text-left select-none outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 tracking-wide relative",
          isOpen && "border-amber-500 ring-4 ring-amber-500/10 bg-white"
        )}
      >
        {Icon && (
          <Icon
            size={18}
            className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-amber-500 transition-colors",
              isOpen && "text-amber-500"
            )}
          />
        )}
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform duration-300 shrink-0 ml-2 group-hover:text-slate-600",
            isOpen && "transform rotate-180 text-amber-500"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-2xl p-1.5 max-h-60 overflow-y-auto origin-top"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold rounded-xl text-left transition-all cursor-pointer select-none mb-0.5 last:mb-0 outline-none",
                    isSelected
                      ? "bg-slate-950 text-amber-400 shadow-md"
                      : "text-slate-700 hover:bg-amber-50/50 hover:text-amber-600 focus:bg-amber-50/30"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={16} className="shrink-0 ml-2 text-amber-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
