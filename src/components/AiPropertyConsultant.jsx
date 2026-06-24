"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, ShieldCheck, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import PropertyCard from "./PropertyCard";

export default function AiPropertyConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      type: "assistant",
      text: "Welcome to EUS Realty! ✦ I am your AI Property Consultant. Describe your dream home in Pune (e.g. *'3 BHK under 2 Crore in Baner'* or *'projects with high rental yield in Wakad'*), and I will analyze our portfolio to match you with the perfect pre-launch and verified developer deals."
    }
  ]);
  const [matches, setMatches] = useState([]);
  const chatEndRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Focus trigger from HeroSearchBar
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener("open-ai-search", handleTrigger);
    return () => window.removeEventListener("open-ai-search", handleTrigger);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLog, loading]);

  const handleSend = async (customQuery) => {
    const activeQuery = customQuery || query.trim();
    if (!activeQuery || loading) return;

    if (!customQuery) setQuery("");

    setChatLog((prev) => [...prev, { type: "user", text: activeQuery }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery })
      });

      if (res.ok) {
        const data = await res.json();
        setChatLog((prev) => [...prev, { type: "assistant", text: data.advice }]);
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);
        } else {
          setMatches([]);
        }
      } else {
        throw new Error("Search failed");
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        {
          type: "assistant",
          text: "I encountered a minor connection error. However, we have direct pre-launch deals available. Please let me connect you directly to our sales desk."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (text = "") => {
    return text.split("\n").map((line, idx) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={idx} className="text-base font-black text-amber-400 mt-4 mb-1.5">{trimmed.replace("###", "").trim()}</h3>;
      }
      if (trimmed.startsWith("##")) {
        return <h2 key={idx} className="text-lg font-black text-white mt-4 mb-2">{trimmed.replace("##", "").trim()}</h2>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return <li key={idx} className="ml-4 list-disc text-slate-300 font-light text-xs sm:text-sm pl-1">{trimmed.substring(1).trim()}</li>;
      }
      // Bold text replacements
      const parts = trimmed.split(/\*\*([^*]+)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed my-1.5">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-amber-400">{part}</strong> : part)}
          </p>
        );
      }
      return trimmed ? <p key={idx} className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed my-1.5">{trimmed}</p> : <div key={idx} className="h-1.5" />;
    });
  };

  const samplePrompts = [
    "3 BHK in Baner under 2 Cr",
    "High appreciation projects in Wakad",
    "Ready to move flats in Pune"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-6 z-[999] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-3 rounded-full flex items-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.4)] border border-amber-400/20 cursor-pointer"
      >
        <Sparkles size={16} className="animate-pulse" />
        <span>Ask AI Advisor ✦</span>
      </motion.button>

      {/* Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl h-[80vh] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                    <Sparkles size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white leading-none flex items-center gap-2">
                      EUS AI Real Estate Advisor
                    </h2>
                    <span className="text-[9px] text-emerald-400 font-bold block mt-1">● Strategic Agent A041262501741</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat log & Results container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatLog.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        chat.type === "user"
                          ? "bg-amber-500 text-slate-950 font-bold text-sm"
                          : "bg-slate-950/40 border border-slate-850 text-slate-200"
                      }`}
                    >
                      {chat.type === "user" ? (
                        <p>{chat.text}</p>
                      ) : (
                        parseMarkdown(chat.text)
                      )}
                    </div>
                  </div>
                ))}

                {/* Display matched properties horizontally */}
                {matches.length > 0 && !loading && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest pl-1">Matching Project Matches</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                      {matches.map((item, idx) => (
                        <div key={idx} className="w-[280px] shrink-0 snap-start scale-95 hover:scale-100 transition-transform duration-300">
                          <PropertyCard
                            id={item._id}
                            title={item.name}
                            location={item.location}
                            price={item.price}
                            bhk={item.bhk}
                            baths={item.baths}
                            area={item.area}
                            image={item.image}
                            badge={item.badge}
                            rera={item.rera}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
                      <Loader2 size={16} className="text-amber-500 animate-spin" />
                      <span className="text-xs text-slate-400 font-light animate-pulse">Analyzing portfolio database...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Sample prompts */}
              {chatLog.length === 1 && (
                <div className="px-6 py-2 flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-full border border-slate-750 hover:text-white transition-all cursor-pointer"
                    >
                      ✦ {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Form Input */}
              <div className="p-4 border-t border-slate-850 bg-slate-950/20">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about Baner, Wakad pricing, rental yields..."
                    className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl px-4 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
