"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const WhatsAppChat = dynamic(() => import("./WhatsAppChat"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup"), { ssr: false });
const AiPropertyConsultant = dynamic(() => import("./AiPropertyConsultant"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <CustomCursor />
      <WhatsAppChat />
      <ExitIntentPopup />
      <AiPropertyConsultant />
    </>
  );
}
