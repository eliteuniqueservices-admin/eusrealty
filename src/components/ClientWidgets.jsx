"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const WhatsAppChat = dynamic(() => import("./WhatsAppChat"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup"), { ssr: false });
const MobileStickyBar = dynamic(() => import("./MobileStickyBar"), { ssr: false });
const SocialProofToast = dynamic(() => import("./SocialProofToast"), { ssr: false });
const FloatingShortlistBar = dynamic(() => import("./FloatingShortlistBar"), { ssr: false });

export default function ClientWidgets() {
  const [loadDeferred, setLoadDeferred] = useState(false);

  useEffect(() => {
    const triggerDeferredLoading = () => {
      setLoadDeferred(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", triggerDeferredLoading);
      window.removeEventListener("mousemove", triggerDeferredLoading);
      window.removeEventListener("keydown", triggerDeferredLoading);
      window.removeEventListener("touchstart", triggerDeferredLoading);
      clearTimeout(timeoutId);
    };

    // Fallback: load after 4 seconds of idle time
    const timeoutId = setTimeout(triggerDeferredLoading, 4000);

    window.addEventListener("scroll", triggerDeferredLoading, { passive: true });
    window.addEventListener("mousemove", triggerDeferredLoading, { passive: true });
    window.addEventListener("keydown", triggerDeferredLoading, { passive: true });
    window.addEventListener("touchstart", triggerDeferredLoading, { passive: true });

    return cleanup;
  }, []);

  return (
    <>
      <CustomCursor />
      {loadDeferred && (
        <>
          <WhatsAppChat />
          <ExitIntentPopup />
          <SocialProofToast />
          <FloatingShortlistBar />
        </>
      )}
      <MobileStickyBar />
    </>
  );
}
