'use client';

import { motion } from 'framer-motion';

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-24 pb-16">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow badge */}
          <div className="w-36 h-8 rounded-full skeleton-shimmer" />
          
          {/* Heading lines */}
          <div className="space-y-3">
            <div className="h-10 sm:h-14 w-[85%] rounded-2xl skeleton-shimmer" />
            <div className="h-10 sm:h-14 w-[60%] rounded-2xl skeleton-shimmer" />
          </div>

          {/* Subtitle */}
          <div className="space-y-2.5 max-w-lg">
            <div className="h-4 w-full rounded-lg skeleton-shimmer" />
            <div className="h-4 w-[90%] rounded-lg skeleton-shimmer" />
            <div className="h-4 w-[70%] rounded-lg skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 space-y-4"
            >
              {/* Icon placeholder */}
              <div className="w-14 h-14 rounded-2xl skeleton-shimmer" />
              {/* Title */}
              <div className="h-5 w-[70%] rounded-lg skeleton-shimmer" />
              {/* Description lines */}
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded skeleton-shimmer" />
                <div className="h-3.5 w-[85%] rounded skeleton-shimmer" />
                <div className="h-3.5 w-[60%] rounded skeleton-shimmer" />
              </div>
              {/* Bottom bar */}
              <div className="h-px w-full bg-slate-100 mt-2" />
              <div className="h-3 w-[40%] rounded skeleton-shimmer" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
