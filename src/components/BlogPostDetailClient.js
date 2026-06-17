'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageCircle, ChevronDown, CheckCircle2, ChevronRight, HelpCircle, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogPostDetailClient({ post, relatedPosts }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState({});

  const contentRef = useRef(null);

  // Monitor page scroll to update reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse HTML content on mount to generate Table of Contents (TOC)
  useEffect(() => {
    if (contentRef.current) {
      const headingElements = contentRef.current.querySelectorAll('h2, h3');
      const items = Array.from(headingElements).map((el, index) => {
        // If element doesn't have an ID, assign one dynamically
        const id = el.id || `heading-${index}`;
        el.id = id;
        return {
          id,
          text: el.innerText,
          level: el.tagName.toLowerCase(),
        };
      });
      setHeadings(items);
    }
  }, [post.content]);

  // Track active heading on scroll
  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    });

    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll('h2, h3');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [headings]);

  const toggleFaq = (index) => {
    setExpandedFaq((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = (platform) => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const faqsList = post.faqs || [];
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently Published';

  return (
    <>
      {/* Reading Progress Line */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-900 z-[9999] pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="min-h-screen bg-[#030305] text-[#ededf0] py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-white font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[8%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-amber-500/5 via-amber-600/0 to-transparent blur-[160px] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10 pt-8">
          
          {/* Back Trigger */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 font-bold mb-10 hover:text-amber-500 transition-colors duration-300 group tracking-wide text-sm"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-500/40 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-white" />
            </div>
            Back to Insights
          </Link>

          {/* Article Wrapper Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left/Middle: Post content (8 Columns) */}
            <article className="lg:col-span-8 space-y-10">
              
              {/* Header block */}
              <header className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-lg inline-block">
                  {post.category}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                  {post.title}
                </h1>

                <p className="text-slate-400 font-light text-base sm:text-lg md:text-xl leading-relaxed">
                  {post.summary}
                </p>

                {/* Author row */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
                      <Image
                        src={post.author.image || "/uploads/Rahul.jpeg"}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white leading-none">{post.author.name}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-none">{post.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime || 5} min read</span>
                  </div>
                </div>
              </header>

              {/* Cover Photo */}
              <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900">
                <Image
                  src={post.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80"}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Body Content */}
              <div
                ref={contentRef}
                className="prose prose-invert max-w-none text-slate-300 font-light text-base sm:text-lg leading-[1.8] space-y-6 prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:pt-8 prose-h3:text-xl sm:prose-h3:text-2xl prose-strong:text-amber-400 prose-strong:font-bold prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* FAQ Section */}
              {faqsList.length > 0 && (
                <section className="border-t border-white/10 pt-12">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                    <HelpCircle className="text-amber-500" size={26} />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqsList.map((faq, index) => {
                      const isOpen = !!expandedFaq[index];
                      return (
                        <div
                          key={index}
                          className="bg-[#07070d] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                          >
                            <span className="font-extrabold text-white text-base sm:text-lg flex items-start gap-2.5">
                              <span className="text-xs uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-black mt-1">Q</span>
                              {faq.q}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : ''}`}
                            />
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <div className="px-6 pb-6 pt-2 text-slate-400 font-light text-sm sm:text-base leading-relaxed pl-12">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Footer Share widgets */}
              <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Share Article:</span>
                  <div className="flex gap-2">
                    {[
                      { icon: <Facebook size={16} />, click: () => handleShare('facebook'), label: 'Facebook', color: 'hover:bg-blue-600 hover:border-blue-600' },
                      { icon: <Twitter size={16} />, click: () => handleShare('twitter'), label: 'Twitter', color: 'hover:bg-sky-500 hover:border-sky-500' },
                      { icon: <Linkedin size={16} />, click: () => handleShare('linkedin'), label: 'LinkedIn', color: 'hover:bg-blue-700 hover:border-blue-700' },
                      { icon: <MessageCircle size={16} />, click: () => handleShare('whatsapp'), label: 'WhatsApp', color: 'hover:bg-emerald-500 hover:border-emerald-500' }
                    ].map(sh => (
                      <button
                        key={sh.label}
                        onClick={sh.click}
                        className={`w-9 h-9 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center justify-center transition-all duration-300 ${sh.color} hover:text-white`}
                        title={sh.label}
                      >
                        {sh.icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  MahaRERA Reg No: A041262501741
                </div>
              </footer>

            </article>

            {/* Right: Sidebar Table of Contents & Related Posts (4 Columns) */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              
              {/* Table of Contents card */}
              {headings.length > 0 && (
                <div className="bg-[#07070d]/60 backdrop-blur-md p-6 border border-white/5 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-amber-500" />
                    Table of Contents
                  </h3>
                  <div className="h-px bg-white/10" />
                  <nav className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 select-none">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                          setActiveHeading(h.id);
                        }}
                        className={`block text-xs font-bold leading-tight transition-all duration-300 hover:text-amber-400 ${
                          h.level === 'h3' ? 'pl-4 text-slate-500' : 'text-slate-400'
                        } ${activeHeading === h.id ? 'text-amber-500 scale-102 origin-left font-black' : ''}`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related/Next Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Star size={16} className="text-amber-500" />
                    Related Insights
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((rel) => (
                      <div
                        key={rel._id || rel.slug}
                        className="group bg-[#07070d]/40 p-4 border border-white/5 rounded-2xl hover:border-amber-500/20 hover:shadow-lg transition-all duration-300 relative flex gap-4"
                      >
                        <Link href={`/blog/${rel.slug}`} className="absolute inset-0 z-10" />
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <Image
                            src={rel.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80"}
                            alt={rel.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-white leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                            {rel.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-3xl border border-amber-500/15 text-center space-y-4">
                <CheckCircle2 size={24} className="text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Ready for builder-direct terms?</h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  Connect with a senior advisory analyst for custom brochures, pricing prospectuses, and zero brokerage bookings.
                </p>
                <Link href="/contact" className="block w-full bg-amber-500 text-slate-950 text-xs font-black py-3 rounded-xl hover:bg-amber-400 transition-colors">
                  Contact Local Advisor
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </main>
    </>
  );
}
