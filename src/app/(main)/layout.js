import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRestorer from "@/components/ScrollRestorer";
import ClientWidgets from "@/components/ClientWidgets";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function MainLayout({ children }) {
  return (
    <FavoritesProvider>
      <ClientWidgets />
      <ScrollRestorer />
      <Navbar />
      {children}
      <Footer />
    </FavoritesProvider>
  );
}