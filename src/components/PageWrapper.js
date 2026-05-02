"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children, className = "" }) {
  const pathname = usePathname();
  
  // 1. Accessibility: Detect if the user has requested reduced motion in their OS settings
  const shouldReduceMotion = useReducedMotion();

  // 2. Define variants for cleaner code and dynamic logic
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 24, // Skip vertical movement if reduced motion is on
      filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" // Premium blur effect
    },
    enter: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)"
    },
    exit: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -24,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)"
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ 
          duration: 0.6, 
          // Apple's standard spring-like easing curve for UI elements
          ease: [0.22, 1, 0.36, 1] 
        }}
        // Ensure the wrapper doesn't collapse and takes full necessary width/height
        className={`w-full min-h-screen flex flex-col ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}