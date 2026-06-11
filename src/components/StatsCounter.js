"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatsCounter({ value, suffix = "", prefix = false, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, value, duration]);

  const formattedValue = display >= 1000
    ? (display / 1000).toFixed(display % 1000 === 0 ? 0 : 1) + "k"
    : display.toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tight">
        {prefix ? (
          <>
            <span className="text-amber-500">{suffix}</span>
            {formattedValue}
          </>
        ) : (
          <>
            {formattedValue}
            <span className="text-amber-500">{suffix}</span>
          </>
        )}
      </p>
    </motion.div>
  );
}
