import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export function SEO({
  title = "GCN Fahrzeughandel GbR - Autohandel in St. Georgen im Schwarzwald",
  description = "GCN Fahrzeughandel GbR - Ihr Autohandel in St. Georgen im Schwarzwald. Gebrauchtwagen kaufen und verkaufen mit persoenlicher Beratung in St. Georgen, Triberg, Villingen-Schwenningen, Furtwangen, Schonach und Umgebung.",
  keywords = "Autohandel St. Georgen, Fahrzeughandel St. Georgen, Gebrauchtwagen kaufen Schwarzwald, Auto verkaufen Triberg, Auto kaufen Villingen-Schwenningen, Furtwangen, Schonach, GCN Fahrzeughandel",
  ogImage = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=630&fit=crop",
  ogType = "website",
  canonical
}: SEOProps) {
  const fullTitle = title.includes("GCN") ? title : `${title} | GCN Fahrzeughandel`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical || currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content="GCN Fahrzeughandel GbR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical || currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="German" />
      <meta name="author" content="GCN Fahrzeughandel GbR" />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Structured Data - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          "name": "GCN Fahrzeughandel GbR",
          "description": "Autohandel in St. Georgen im Schwarzwald - Ankauf und Verkauf von Gebrauchtwagen in der Region.",
          "telephone": "+49-176-41651086",
          "email": "gcn-fahrzeughandel@outlook.de",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE",
            "addressLocality": "St. Georgen im Schwarzwald"
          },
          "url": siteUrl,
          "priceRange": "€€",
          "openingHours": "Mo-Fr 09:00-18:00",
          "paymentAccepted": "Cash, Bank Transfer",
          "areaServed": [
            {
              "@type": "City",
              "name": "St. Georgen im Schwarzwald"
            },
            {
              "@type": "City",
              "name": "Triberg"
            },
            {
              "@type": "City",
              "name": "Villingen-Schwenningen"
            },
            {
              "@type": "City",
              "name": "Furtwangen"
            },
            {
              "@type": "City",
              "name": "Schonach"
            }
          ]
        })}
      </script>
    </Helmet>
  );
}
