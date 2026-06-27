"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function MobileStickyBar() {
  const whatsappNumber = "917620733613";
  const whatsappMsg = encodeURIComponent("Hi, I am looking for property investment advisory.");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] flex md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2.5 bg-white text-[#25D366] font-bold active:bg-slate-50 transition-colors"
      >
        <MessageCircle size={22} className="mb-0.5" />
        <span className="text-[10px] uppercase tracking-wider text-slate-600">WhatsApp</span>
      </a>
      <a 
        href={`tel:+${whatsappNumber}`}
        className="flex-1 flex flex-col items-center justify-center py-2.5 bg-slate-950 text-white font-bold active:bg-slate-900 transition-colors"
      >
        <Phone size={20} className="mb-0.5" />
        <span className="text-[10px] uppercase tracking-wider">Call Now</span>
      </a>
    </div>
  );
}
