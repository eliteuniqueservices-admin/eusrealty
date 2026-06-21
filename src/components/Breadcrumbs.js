'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs({ items, theme = 'light' }) {
  const pathname = usePathname();
  
  const textCol = theme === 'dark' ? 'text-slate-300' : 'text-slate-500';
  const textHover = theme === 'dark' ? 'hover:text-amber-400' : 'hover:text-amber-600';
  const textActive = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const chevronCol = theme === 'dark' ? 'text-slate-500' : 'text-slate-300';
  
  // Base schema for BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://eusrealty.co.in"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://eusrealty.co.in${item.href}`
      }))
    ]
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className={`mb-4 flex items-center overflow-x-auto whitespace-nowrap text-xs md:text-sm ${textCol}`}>
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className={`flex items-center transition-colors ${textHover}`}>
              <Home size={14} className="mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={item.href} className="flex items-center space-x-2">
                <ChevronRight size={14} className={`flex-shrink-0 ${chevronCol}`} />
                {isLast ? (
                  <span className={`font-semibold truncate max-w-[150px] sm:max-w-[250px] md:max-w-none ${textActive}`} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={`transition-colors truncate max-w-[100px] sm:max-w-none ${textHover}`}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
