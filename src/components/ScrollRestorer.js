"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Instantly scrolls to top whenever the route changes.
// Placed in layout so it runs on every page navigation.
export default function ScrollRestorer() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
