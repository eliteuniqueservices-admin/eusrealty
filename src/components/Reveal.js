"use client";
import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useMemo, Children, isValidElement } from "react";

/**
 * Enhanced Reveal Animation Component
 * * Features premium, hardware-accelerated animations including Apple-style blur fades,
 * robust staggering, accessibility (reduced motion detection), and dynamic HTML tags.
 * * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.variant="fade-up"] - "fade-up", "fade-down", "fade-left", "fade-right", "zoom", "scale", "spring-up", "bounce"
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {number} [props.duration=0.8] - Animation duration in seconds
 * @param {number} [props.distance=40] - Movement distance in pixels
 * @param {number} [props.opacity=0] - Initial opacity
 * @param {boolean} [props.blur=true] - Applies a modern blur effect during the reveal
 * @param {boolean} [props.once=true] - Animate only once per scroll
 * @param {number|string} [props.amount="some"] - Viewport visibility threshold (0-1 or "some"/"all")
 * @param {number} [props.staggerChildren=0] - Delay between children animations
 * @param {string} [props.easing="apple"] - "apple", "smooth", "sharp", "bounce", "elastic"
 * @param {string} [props.as="div"] - The HTML element to render (e.g., "span", "section", "li")
 * @param {string} [props.className=""] - CSS class name
 */
const Reveal = forwardRef(({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  distance = 40,
  opacity = 0,
  blur = true,
  once = true,
  amount = "some", 
  staggerChildren = 0,
  easing = "apple",
  as = "div",
  className = "",
  ...rest
}, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const [animType, direction = "up"] = variant.split("-");

  // Create a dynamic Framer Motion component based on the 'as' prop
  const MotionComponent = motion[as] || motion.div;

  // Premium easing curves
  const easingMap = {
    apple: [0.16, 1, 0.3, 1],               // Ultra-smooth, Apple-like easing
    smooth: [0.25, 0.46, 0.45, 0.94],       // Standard smooth easing
    sharp: [0.34, 1.56, 0.64, 1],           // Snappy with slight overshoot
    bounce: [0.5, 1.2, 0.5, 1],             // Playful bounce
    elastic: [0.175, 0.885, 0.32, 1.275],   // Exaggerated elastic bounce
  };

  const selectedEasing = easingMap[easing] || easingMap.apple;

  // Optimize state calculations
  const getAnimationStates = useMemo(() => {
    // 1. Accessibility Override
    if (prefersReducedMotion) {
      return {
        initial: { opacity },
        animate: { opacity: 1, filter: "blur(0px)" },
        transition: { duration: 0.3, delay, ease: "linear" }
      };
    }

    // 2. Base States
    const baseInitial = {
      opacity,
      filter: blur ? "blur(12px)" : "blur(0px)",
    };

    const baseAnimate = {
      opacity: 1,
      filter: "blur(0px)",
    };

    const movementMap = {
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const movement = movementMap[direction] || movementMap.up;

    // 3. Transitions
    const isSpring = animType === "spring" || animType === "bounce";
    const transition = isSpring 
      ? { type: "spring", damping: 20, stiffness: 100, mass: 1, delay }
      : { duration, delay, ease: selectedEasing };

    // 4. Variant Compilation
    switch (animType) {
      case "fade":
        return {
          initial: baseInitial,
          animate: baseAnimate,
          transition,
        };
      case "zoom":
        return {
          initial: { ...baseInitial, scale: 0.9 },
          animate: { ...baseAnimate, scale: 1 },
          transition,
        };
      case "scale":
        return {
          initial: { ...baseInitial, scale: 1.1 }, // Scale down into place (premium feel)
          animate: { ...baseAnimate, scale: 1 },
          transition,
        };
      case "spring":
      case "bounce":
        return {
          initial: { ...baseInitial, ...movement, scale: 0.95 },
          animate: { ...baseAnimate, x: 0, y: 0, scale: 1 },
          transition,
        };
      default: // fade-up, fade-down, fade-left, fade-right
        return {
          initial: { ...baseInitial, ...movement },
          animate: { ...baseAnimate, x: 0, y: 0 },
          transition,
        };
    }
  }, [animType, direction, distance, opacity, blur, prefersReducedMotion, delay, duration, selectedEasing]);

  // Viewport Trigger Configuration
  const viewportConfig = {
    once,
    amount,
    margin: "0px 0px -10% 0px", // Use percentage for better cross-device scaling
  };

  // --- RENDER LOGIC: Staggered vs Single ---
  
  // If staggering children is requested
  if (staggerChildren > 0) {
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerChildren,
          delayChildren: delay,
        },
      },
    };

    const itemVariants = {
      hidden: getAnimationStates.initial,
      show: getAnimationStates.animate,
    };

    return (
      <MotionComponent
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
        {...rest}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          // Wrap valid React elements in a motion div to apply item variants
          return (
            <motion.div variants={itemVariants} transition={getAnimationStates.transition}>
              {child}
            </motion.div>
          );
        })}
      </MotionComponent>
    );
  }

  // Standard single element render
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={getAnimationStates.initial}
      whileInView={getAnimationStates.animate}
      viewport={viewportConfig}
      transition={getAnimationStates.transition}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
});

Reveal.displayName = "Reveal";
export default Reveal;