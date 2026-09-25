import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { SITE_URL } from '../seiten';
import ogFallback from '../../assets/illustrations/hero.jpg';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  /** Fehlerseiten gehören nicht in den Index. */
  robots?: string;
}

export function SEO({
  title = "GCN Fahrzeughandel GbR - Autohandel in St. Georgen im Schwarzwald",
  description = "GCN Fahrzeughandel GbR - Ihr Autohandel in St. Georgen im Schwarzwald. Gebrauchtwagen kaufen und verkaufen mit persönlicher Beratung in St. Georgen, Triberg, Villingen-Schwenningen, Furtwangen, Schonach und Umgebung.",
  keywords = "Autohandel St. Georgen, Fahrzeughandel St. Georgen, Gebrauchtwagen kaufen Schwarzwald, Auto verkaufen Triberg, Auto kaufen Villingen-Schwenningen, Furtwangen, Schonach, GCN Fahrzeughandel",
  ogImage,
  ogType = "website",
  canonical,
  robots = "index, follow"
}: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = title.includes("GCN") ? title : `${title} | GCN Fahrzeughandel`;
  const indexierbar = !robots.includes('noindex');
  const pfad = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const canonicalUrl = canonical ?? (indexierbar ? `${SITE_URL}${pfad}` : undefined);
  const currentUrl = canonicalUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
  // Eigenes Bild statt Stockfoto – und absolut, wie es Open Graph verlangt.
  const shareImage = ogImage ?? `${SITE_URL}${ogFallback}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content="GCN Fahrzeughandel GbR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />

      {/* Additional SEO */}
      <meta name="robots" content={robots} />
      <meta name="language" content="German" />
      <meta name="author" content="GCN Fahrzeughandel GbR" />
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
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
            "streetAddress": "Sommeraurstr. 46",
            "postalCode": "78112",
            "addressLocality": "St. Georgen im Schwarzwald",
            "addressRegion": "Baden-Württemberg",
            "addressCountry": "DE"
          },
          "url": SITE_URL,
          "logo": `${SITE_URL}/favicon.png`,
          "image": shareImage,
          "founder": [
            { "@type": "Person", "name": "Giosue Canobbio" },
            { "@type": "Person", "name": "Christopher Neun" }
          ],
          "sameAs": ["https://www.instagram.com/gcn.fahrzeughandel/"],
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
