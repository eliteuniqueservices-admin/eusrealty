import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from '@next/third-parties/google';

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
  metadataBase: new URL("https://eusrealty.co.in"),
  title: "EusRealty | Premium Luxury Properties in Pune | 0% Brokerage",
  description: "Discover Pune's exclusive luxury residences with zero brokerage, direct-builder pricing, and 100% RERA-verified projects. Get priority pre-launch access.",
  keywords: "Pune real estate, luxury apartments Pune, pre-launch properties, RERA verified, zero brokerage, Baner luxury homes, Wakad penthouses, Koregaon Park villas",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "EusRealty | Premium Luxury Properties in Pune | 0% Brokerage",
    description: "Discover Pune's most exclusive residences. Zero brokerage, direct-builder pricing, RERA verified projects.",
    url: "https://eusrealty.co.in",
    siteName: "EusRealty",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EusRealty | Premium Luxury Properties in Pune",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EusRealty | Premium Luxury Properties in Pune | 0% Brokerage",
    description: "Get priority access to pre-launch luxury deals from Pune's top builders with zero brokerage and direct builder pricing.",
    images: ["/og-image.jpg"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "EusRealty",
    "image": "https://eusrealty.co.in/icon.png",
    "@id": "https://eusrealty.co.in/#realestateagent",
    "url": "https://eusrealty.co.in",
    "telephone": "+917620733613",
    "priceRange": "$$$$",
    "customIdentifier": "MahaRERA Agent Number: A041262501741",
    "description": "EusRealty is a MahaRERA registered real estate strategic partner (Registration No. A041262501741) advising on luxury properties and pre-launch deals in Pune with zero brokerage fee.",
    "founder": [
      {
        "@type": "Person",
        "name": "Rahul Upadhyay"
      },
      {
        "@type": "Person",
        "name": "Kunal Verma"
      }
    ],
    "foundingDate": "2021",
    "knowsAbout": [
      "Pune Real Estate",
      "MahaRERA Compliance",
      "Real Estate Investment ROI",
      "Home Loan Advisory",
      "Luxury Penthouses & Villas"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+917620733613",
      "contactType": "Sales Advisory Desk",
      "areaServed": "Pune",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    },
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
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1056"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "EusRealty Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Zero Brokerage Luxury Property Buying Consultation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pre-Launch Direct Builder Pricing & Desk Access"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Comparative Property Analytics Reports"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "MahaRERA & Legal Document Verification Service"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://plus.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://randomuser.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager - Head */}
        {GTM_ID && (
          /* Google Tag Manager injected via next/third-parties */ null
        )}
      </head>
      <body className="font-sans antialiased relative">
        {/* Google Tag Manager - Body noscript fallback */}
        {/* Next.js third-parties automatically handles noscript fallback if necessary */}
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        {children}
      </body>
    </html>
  );
}