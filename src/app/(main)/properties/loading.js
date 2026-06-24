'use client';

import { motion } from 'framer-motion';

export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Filters bar skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded-xl skeleton-shimmer" style={{ width: `${80 + i * 15}px` }} />
          ))}
        </div>
      </div>

      {/* Property cards grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="h-48 sm:h-56 skeleton-shimmer" />
              
              <div className="p-5 space-y-3">
                {/* Badge row */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-md skeleton-shimmer" />
                  <div className="h-5 w-20 rounded-md skeleton-shimmer" />
                </div>
                {/* Title */}
                <div className="h-5 w-[80%] rounded-lg skeleton-shimmer" />
                {/* Location */}
                <div className="h-3.5 w-[50%] rounded skeleton-shimmer" />
                {/* Price + details */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="h-6 w-28 rounded-lg skeleton-shimmer" />
                  <div className="h-4 w-20 rounded skeleton-shimmer" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
