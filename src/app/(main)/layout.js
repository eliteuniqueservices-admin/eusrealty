import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import ScrollRestorer from "@/components/ScrollRestorer";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CustomCursor from "@/components/CustomCursor";

export default function MainLayout({ children }) {
  return (
    <>
      <CustomCursor />
      <ScrollRestorer />
      <Navbar />
      {children}
      <WhatsAppChat />
      <ExitIntentPopup />
      <Footer />
    </>
  );
}