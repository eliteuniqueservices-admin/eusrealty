'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Home, Key, ArrowUpRight } from 'lucide-react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState('none'); // 'none' | 'link' | 'property' | 'action'
  const [isMobile, setIsMobile] = useState(true);

  // Refs to avoid closures stale state and prevent redundant state sets / re-renders
  const hoverTypeRef = useRef('none');
  const isVisibleRef = useRef(false);
  const isMobileRef = useRef(true);

  const updateHoverType = (newType) => {
    if (hoverTypeRef.current !== newType) {
      hoverTypeRef.current = newType;
      setHoverType(newType);
    }
  };

  const updateIsVisible = (visible) => {
    if (isVisibleRef.current !== visible) {
      isVisibleRef.current = visible;
      setIsVisible(visible);
    }
  };

  const updateIsMobile = (mobile) => {
    if (isMobileRef.current !== mobile) {
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    }
  };

  // Mouse coordinates using MotionValues for smooth framer-motion springs
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics configuration for the outer ring trailing effect
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    let touchTimer;
    let isTouchMode = false;

    // Abort setting up expensive listeners if device primarily uses touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateIsMobile(true);
      return;
    }

    // Detect direct touch input (tap/swipe) and fallback to native browser behaviors
    const handleTouchStart = () => {
      isTouchMode = true;
      updateIsMobile(true);
      document.documentElement.classList.remove('has-custom-cursor');
      
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        isTouchMode = false;
      }, 1000);
    };

    const handleMouseMove = (e) => {
      if (isTouchMode) return;

      // Enable custom cursor and apply the CSS override class
      updateIsMobile(false);
      document.documentElement.classList.add('has-custom-cursor');
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      updateIsVisible(true);

      // Event delegation: scan target element hierarchy
      const target = e.target;
      if (!target) return;

      const isPropertyCard = target.closest('.group') || target.closest('[data-cursor="property"]');
      const isClickable = target.closest('a') || target.closest('button') || target.closest('.cursor-pointer') || target.closest('select') || target.closest('input');
      const isAction = target.closest('[data-cursor="action"]');

      if (isAction) {
        updateHoverType('action');
      } else if (isPropertyCard) {
        updateHoverType('property');
      } else if (isClickable) {
        updateHoverType('link');
      } else {
        updateHoverType('none');
      }
    };

    const handleMouseLeave = () => {
      updateIsVisible(false);
      document.documentElement.classList.remove('has-custom-cursor');
    };

    const handleMouseEnter = () => {
      updateIsVisible(true);
      if (!isTouchMode) {
        document.documentElement.classList.add('has-custom-cursor');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(touchTimer);
    };
  }, [cursorX, cursorY]);

  // Render standard cursor on mobile
  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* 1. Inner House Pointer Cursor - Locks exactly to coordinates (peak of roof is hot-spot) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-10%', // Peak of the roof matches the exact mouse coordinate
        }}
        className="fixed top-0 left-0 pointer-events-none z-[999999] text-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] will-change-transform"
        animate={{
          scale: hoverType === 'link' ? 1.45 : hoverType === 'property' ? 1.35 : hoverType === 'action' ? 1.25 : 1,
          rotate: hoverType === 'link' ? 12 : hoverType === 'action' ? -12 : 0,
          color: hoverType !== 'none' ? '#fbbf24' : '#f59e0b',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <Home size={18} className="stroke-[2.5] fill-amber-500/20" />
      </motion.div>

      {/* 2. Outer Ring trailing cursor - Smooth fluid follower */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[999998] flex items-center justify-center border border-amber-500/40 bg-amber-500/5 will-change-transform"
        animate={{
          scale: hoverType === 'property' ? 2.5 : hoverType === 'link' ? 1.6 : hoverType === 'action' ? 1.96 : 1,
          backgroundColor: hoverType === 'property' ? 'rgba(245, 158, 11, 0.12)' : hoverType === 'link' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.03)',
          borderColor: hoverType !== 'none' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.4)',
          boxShadow: hoverType === 'property' ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.5 }}
      >
        {/* Render contextual icons inside the outer follower */}
        {hoverType === 'property' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 0.45, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-amber-400 flex flex-col items-center justify-center"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">View</span>
          </motion.div>
        )}

        {hoverType === 'link' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 0.7, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-amber-400"
          >
            <ArrowUpRight size={14} className="stroke-[2.5]" />
          </motion.div>
        )}

        {hoverType === 'action' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 0.55, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-amber-400 flex flex-col items-center justify-center"
          >
            <Key size={16} className="stroke-[2.5]" />
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
