import "./globals.css";
import WhatsAppChat from "@/components/WhatsAppChat";

export const metadata = {
  title: "EusRealty | Premium Real Estate",
  description: "Find your dream home directly with builders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppChat />
      </body>
    </html>
  );
}