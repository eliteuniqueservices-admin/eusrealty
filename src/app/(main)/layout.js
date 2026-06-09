import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <WhatsAppChat />
      <Footer />
    </>
  );
}