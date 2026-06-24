'use client';

import { motion } from 'framer-motion';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
        {/* Header */}
        <div className="mb-10 sm:mb-14 space-y-4 max-w-2xl">
          <div className="w-32 h-7 rounded-full skeleton-shimmer" />
          <div className="h-10 w-[75%] rounded-2xl skeleton-shimmer" />
          <div className="h-4 w-[60%] rounded-lg skeleton-shimmer" />
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-44 skeleton-shimmer" />
              
              <div className="p-5 space-y-3">
                {/* Category + date */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 rounded skeleton-shimmer" />
                  <div className="h-4 w-24 rounded skeleton-shimmer" />
                </div>
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-5 w-full rounded-lg skeleton-shimmer" />
                  <div className="h-5 w-[65%] rounded-lg skeleton-shimmer" />
                </div>
                {/* Excerpt */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded skeleton-shimmer" />
                  <div className="h-3 w-[80%] rounded skeleton-shimmer" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
