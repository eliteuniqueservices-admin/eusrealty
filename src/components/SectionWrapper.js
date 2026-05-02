"use client";

export default function SectionWrapper({ 
  children, 
  gradient = "from-[#F8FAFC] to-white",
  theme = "light", // "light" | "dark"
  className = "",
  id,
  showOrbs = true
}) {
  // Dynamically set fade colors based on the theme to prevent ugly white fades on dark sections
  const topFadeColor = theme === "dark" ? "from-gray-950/80" : "from-white/80";
  const bottomFadeColor = theme === "dark" ? "from-gray-950/80" : "from-white/80";
  
  // Adjust orb opacity based on theme (dark needs slightly stronger opacity to be visible)
  const orbOpacity = theme === "dark" ? "opacity-30" : "opacity-50";

  return (
    <section 
      id={id} 
      className={`relative overflow-hidden bg-gradient-to-b ${gradient} ${className}`}
    >
      
      {/* --- Ambient Background Orbs (Animated) --- */}
      {showOrbs && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Orb */}
          <div 
            className={`absolute top-0 left-0 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-blue-500/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-[pulse_8s_ease-in-out_infinite] mix-blend-multiply ${theme === 'dark' && 'mix-blend-screen'} ${orbOpacity}`} 
          />
          {/* Bottom Right Orb */}
          <div 
            className={`absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-500/20 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 animate-[pulse_10s_ease-in-out_infinite_reverse] mix-blend-multiply ${theme === 'dark' && 'mix-blend-screen'} ${orbOpacity}`} 
          />
        </div>
      )}

      {/* --- Smooth Edge Dissolves --- */}
      <div className={`pointer-events-none absolute top-0 left-0 w-full h-24 bg-gradient-to-b ${topFadeColor} to-transparent z-10`} />
      <div className={`pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t ${bottomFadeColor} to-transparent z-10`} />

      {/* --- Content Payload --- */}
      <div className="relative z-20">
        {children}
      </div>
    </section>
  );
}