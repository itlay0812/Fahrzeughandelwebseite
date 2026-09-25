import { motion } from "motion/react";
import { SEO } from "./SEO";

/* Gemeinsames Gerüst für Datenschutz, AGB und Widerrufsbelehrung. */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut", delay },
});

export const LINK_KLASSE =
  "text-nero underline underline-offset-2 transition-opacity hover:opacity-60";

export function Rechtsseite({
  titel,
  seoTitel,
  seoBeschreibung,
  einleitung,
  stand,
  children,
}: {
  titel: string;
  seoTitel: string;
  seoBeschreibung: string;
  einleitung?: React.ReactNode;
  stand: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SEO title={seoTitel} description={seoBeschreibung} />

      <div className="flex-1 min-h-screen bg-crema text-nero py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)} className="border-b border-linea pb-8 mb-10">
            <h1 className="titolo-pagina text-nero hyphens-auto" lang="de">
              {titel}
            </h1>
            {einleitung && (
              <p className="text-asfalto text-sm mt-4 leading-relaxed">{einleitung}</p>
            )}
          </motion.div>

          <motion.div
            {...fadeUp(0.06)}
            className="bg-crema-chiara border border-linea finestra p-7 sm:p-10 space-y-0"
          >
            {children}
          </motion.div>

          <motion.p {...fadeUp(0.1)} className="text-center text-asfalto text-xs mt-6">
            Stand: {stand}
          </motion.p>
        </div>
      </div>
    </>
  );
}

export function Abschnitt({
  nummer,
  titel,
  id,
  ebene = "h2",
  children,
}: {
  nummer: string;
  titel: string;
  id?: string;
  /** h3, wenn der Abschnitt unter einer Teil-Überschrift steht (AGB). */
  ebene?: "h2" | "h3";
  children: React.ReactNode;
}) {
  const Titel = ebene;
  return (
    <section id={id} className="pt-8 border-t border-linea first:border-0 first:pt-0 [&:not(:first-child)]:mt-8">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="numeri text-xs text-rosso tracking-widest shrink-0">{nummer}</span>
        <Titel className="text-base text-nero" style={{ fontWeight: 600 }}>
          {titel}
        </Titel>
      </div>
      <div className="text-asfalto text-sm leading-relaxed space-y-4 pl-6">{children}</div>
    </section>
  );
}

export function Unterabschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-nero text-sm mb-1.5" style={{ fontWeight: 600 }}>
        {titel}
      </h3>
      <div className="text-asfalto text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/* Anschrift als Kasten, wie sie in Datenschutz und Widerruf gebraucht wird. */
export function AnschriftKasten({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-crema border border-linea rounded-2xl p-4 mt-2">
      <p className="text-nero" style={{ fontWeight: 600 }}>
        GCN Fahrzeughandel GbR
      </p>
      <p>Sommeraurstr. 46</p>
      <p>78112 Sankt Georgen im Schwarzwald</p>
      {children}
    </div>
  );
}
