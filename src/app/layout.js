import "./globals.css";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "EusRealty | Pune's Premier Luxury Real Estate",
  description: "Discover Pune's most exclusive residences. Zero brokerage, direct-builder pricing, RERA verified projects. Get priority access to pre-launch inventory from Pune's top developers.",
  keywords: "Pune real estate, luxury apartments Pune, pre-launch properties, RERA verified, zero brokerage",
  openGraph: {
    title: "EusRealty | Pune's Premier Luxury Real Estate",
    description: "Zero brokerage. Direct-builder pricing. RERA verified. Discover Pune's finest properties.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "EusRealty",
    "image": "https://eusrealty.com/icon.png",
    "@id": "https://eusrealty.com/#realestateagent",
    "url": "https://eusrealty.com",
    "telephone": "+917620733613",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Baner Road, near Balewadi High Street",
      "addressLocality": "Pune",
      "postalCode": "411045",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5596,
      "longitude": 73.7799
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.facebook.com/eusrealty",
      "https://www.instagram.com/eusrealty",
      "https://www.linkedin.com/company/eusrealty"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Baner, Pune"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Wakad, Pune"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Hinjewadi, Pune"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Kothrud, Pune"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Koregaon Park, Pune"
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased relative">
        {children}
      </body>
    </html>
  );
}