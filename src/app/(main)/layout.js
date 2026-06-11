import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import ScrollRestorer from "@/components/ScrollRestorer";

export default function MainLayout({ children }) {
  return (
    <>
      <ScrollRestorer />
      <Navbar />
      {children}
      <WhatsAppChat />
      <Footer />
    </>
  );
}