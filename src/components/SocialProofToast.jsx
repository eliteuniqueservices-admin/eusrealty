'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin } from 'lucide-react';

const names = ['Rahul', 'Aditya', 'Sneha', 'Priya', 'Kunal', 'Vikram', 'Pooja', 'Anjali', 'Sameer', 'Neha'];
const actions = ['booked a site visit for', 'requested pricing for', 'downloaded brochure for', 'just enquired about'];
const properties = ['Omega Retreat', 'Lara Solitaire', 'Skyline Villas', 'Godrej Meadows', 'VTP Bluewaters', 'Kolte Patil Life Republic'];
const times = ['just now', '2 mins ago', '5 mins ago', '12 mins ago', '20 mins ago', 'about an hour ago'];

export default function SocialProofToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Show first toast after 5 seconds
    const initialTimer = setTimeout(() => showRandomToast(), 5000);

    // Then show a new toast every 25 seconds
    const interval = setInterval(() => {
      showRandomToast();
    }, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomToast = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const property = properties[Math.floor(Math.random() * properties.length)];
    const time = times[Math.floor(Math.random() * times.length)];

    setToast({ name, action, property, time });

    // Hide toast after 6 seconds
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[60] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-4 max-w-sm flex items-start gap-3 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-500">
            <Bell size={18} className="animate-pulse" />
          </div>
          <div>
            <p className="text-sm text-slate-700 leading-tight">
              <span className="font-bold text-slate-900">{toast.name}</span> {toast.action} <span className="font-bold text-amber-600">{toast.property}</span>
            </p>
            <div className="flex items-center gap-1 mt-1.5 opacity-70">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{toast.time}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
