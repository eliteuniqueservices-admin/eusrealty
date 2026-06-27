"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const WhatsAppChat = dynamic(() => import("./WhatsAppChat"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup"), { ssr: false });
const MobileStickyBar = dynamic(() => import("./MobileStickyBar"), { ssr: false });
const SocialProofToast = dynamic(() => import("./SocialProofToast"), { ssr: false });
const FloatingShortlistBar = dynamic(() => import("./FloatingShortlistBar"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <CustomCursor />
      <WhatsAppChat />
      <ExitIntentPopup />
      <MobileStickyBar />
      <SocialProofToast />
      <FloatingShortlistBar />
    </>
  );
}
