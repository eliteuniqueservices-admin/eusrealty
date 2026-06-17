'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';

const CATEGORIES = ['All', 'Market Trends', 'Buying Guides', 'Investment ROI', 'Lifestyle'];

export default function BlogPageClient({ initialBlogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter posts dynamically
  const filteredBlogs = useMemo(() => {
    return (initialBlogs || []).filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory =
        activeCategory === 'All' ||
        post.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, initialBlogs]);

  // The first published blog post is highlighted as Featured if no filters are active
  const featuredPost = useMemo(() => {
    if (searchTerm || activeCategory !== 'All' || !initialBlogs || initialBlogs.length === 0) {
      return null;
    }
    return initialBlogs[0];
  }, [searchTerm, activeCategory, initialBlogs]);

  // Normal feed excludes the featured post if displayed
  const feedBlogs = useMemo(() => {
    if (featuredPost) {
      return filteredBlogs.filter(p => p._id !== featuredPost._id);
    }
    return filteredBlogs;
  }, [featuredPost, filteredBlogs]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen bg-[#030305] text-[#ededf0] py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-white font-sans relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16 pt-10 relative z-10">
        
        {/* Header Block */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles size={12} />
              Real Estate Intelligence Hub
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              EUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Insights</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-slate-400 font-light text-base sm:text-lg md:text-xl leading-relaxed">
              Stay ahead in Pune's fast-moving property corridors. Access verified investment analyses, micro-market projections, and direct-builder updates.
            </p>
          </Reveal>
        </header>

        {/* Filter Controls (Search + Categories) */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 bg-[#07070d]/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/5 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Search topics, tags, or articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-14 pr-4 py-3 text-white placeholder-slate-600 font-medium focus:outline-none rounded-2xl"
              />
            </div>
            <div className="w-px bg-slate-800 hidden md:block"></div>
            <div className="flex flex-wrap gap-2 items-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                      : 'bg-[#101018] text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post Panel */}
        {featuredPost && (
          <Reveal delay={0.3}>
            <section className="group relative bg-[#07070d]/80 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
              <Link href={`/blog/${featuredPost.slug}`} className="absolute inset-0 z-10" />
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                {/* Left Panel: Cover Photo */}
                <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={featuredPost.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80"}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-103 transition-transform duration-700 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#07070d]/20 to-[#07070d] hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent lg:hidden" />
                </div>
                
                {/* Right Panel: Content details */}
                <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 relative z-20">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg">
                      Featured · {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                      <Clock size={12} /> {featuredPost.readTime || 5} min read
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight group-hover:text-amber-500 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-slate-400 font-light leading-relaxed line-clamp-3 text-sm sm:text-base">
                    {featuredPost.summary}
                  </p>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
                        <Image
                          src={featuredPost.author.image || "/uploads/Rahul.jpeg"}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{featuredPost.author.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline">
                      Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* Blog Posts Grid Feed */}
        <section className="space-y-10">
          <AnimatePresence mode="wait">
            {feedBlogs.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {feedBlogs.map((post) => {
                  const tags = post.tags || [];
                  const formattedDate = post.createdAt 
                    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : "Published Recently";

                  return (
                    <motion.div
                      key={post._id || post.slug}
                      variants={cardVariant}
                      className="group bg-[#07070d] border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Image */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                          <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                          <Image
                            src={post.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&auto=format&fit=crop&q=80"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest bg-slate-950/80 backdrop-blur-md text-amber-500 border border-amber-500/20 px-3.5 py-1.5 rounded-lg z-20">
                            {post.category}
                          </span>
                        </div>

                        {/* Card Details */}
                        <div className="p-6.5 space-y-4">
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {formattedDate}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime || 4} min read</span>
                          </div>

                          <Link href={`/blog/${post.slug}`} className="block group-hover:text-amber-500 transition-colors">
                            <h3 className="text-xl font-extrabold text-white leading-tight tracking-tight line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-slate-400 font-light text-sm leading-relaxed line-clamp-3">
                            {post.summary}
                          </p>

                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] text-slate-500 font-semibold bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-6.5 pt-0 mt-2 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
                            <Image
                              src={post.author.image || "/uploads/Rahul.jpeg"}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white leading-none">{post.author.name}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-none">{post.author.role}</p>
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug}`} className="text-amber-500 text-xs font-black flex items-center gap-1.5 group-hover:underline">
                          Read <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-[#07070d] rounded-[2.5rem] border border-white/5"
              >
                <BookOpen size={40} className="text-slate-600 mx-auto mb-4 animate-bounce" />
                <p className="text-slate-400 font-light text-lg">No articles found matching your query.</p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                  className="mt-4 text-amber-500 font-bold hover:text-amber-400 transition-colors text-xs uppercase tracking-widest"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
