'use client';
import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);
  const requestRef = useRef(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const laggingPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (!isVisible) setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target;
      const clickable = target.closest('a, button, input, select, [role="button"]');

      // Simply toggle true/false if we are over a clickable element
      setIsHovering(!!clickable);
    };

    const animate = () => {
      // The smooth latency math (closing the gap by 8% each frame)
      // Because we removed the magnetic pull, it simply follows the mouse at all times.
      laggingPos.current.x += (mousePos.current.x - laggingPos.current.x) * 0.08;
      laggingPos.current.y += (mousePos.current.y - laggingPos.current.y) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${laggingPos.current.x}px, ${laggingPos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updateMousePosition);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference hidden md:block overflow-hidden">
      
      <div 
        ref={cursorRef} 
        className="absolute top-0 left-0"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-out flex items-center justify-center
            ${isHovering 
              // Hover State: Fades out and shrinks slightly so it looks like it dissolves
              ? 'w-2.5 h-2.5 opacity-0 scale-50' 
              // Normal State: Small white circle, fully visible
              : 'w-2.5 h-2.5 opacity-100 scale-100' 
            }`}
        />
      </div>
      
    </div>
  );
}