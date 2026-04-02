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
  title = "GCN Fahrzeughandel GbR - Gebrauchtwagen kaufen & verkaufen",
  description = "GCN Fahrzeughandel GbR - Ihr zuverlässiger Partner für Gebrauchtwagen. Wir finden Ihr Traumfahrzeug oder kaufen Ihren Gebrauchten. Faire Preise, persönliche Beratung.",
  keywords = "Gebrauchtwagen, Fahrzeughandel, Auto kaufen, Auto verkaufen, GCN, Gebrauchtwagen Ankauf, Fahrzeugsuche, Autohandel",
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
          "description": "Gebrauchtwagen Handel - Ankauf und Verkauf",
          "telephone": "+49-176-41651086",
          "email": "gcn-fahrzeughandel@outlook.de",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE",
            "addressLocality": "Deutschland"
          },
          "url": siteUrl,
          "priceRange": "€€",
          "openingHours": "Mo-Fr 09:00-18:00",
          "paymentAccepted": "Cash, Bank Transfer",
          "areaServed": {
            "@type": "Country",
            "name": "Deutschland"
          }
        })}
      </script>
    </Helmet>
  );
}
