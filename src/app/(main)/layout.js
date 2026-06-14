import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRestorer from "@/components/ScrollRestorer";
import ClientWidgets from "@/components/ClientWidgets";

export default function MainLayout({ children }) {
  return (
    <>
      <ClientWidgets />
      <ScrollRestorer />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}