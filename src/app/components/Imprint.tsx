import { motion } from "motion/react";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { SEO } from "./SEO";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut", delay },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-8 border-t border-linea first:border-0 first:pt-0">
      <h2
        className="text-base text-nero mb-4"
        style={{ fontWeight: 600 }}
      >
        {title}
      </h2>
      <div className="text-asfalto text-sm leading-relaxed space-y-1">{children}</div>
    </div>
  );
}

export function Imprint() {
  return (
    <>
      <SEO
        title="Impressum – GCN Fahrzeughandel GbR"
        description="Impressum der GCN Fahrzeughandel GbR, Sankt Georgen im Schwarzwald."
      />

      <div className="flex-1 min-h-screen bg-crema text-nero py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <motion.div
            {...fadeUp(0)}
            className="border-b border-linea pb-8 mb-10"
          >
            <h1
              className="titolo-pagina text-nero"
            >
              Impressum.
            </h1>
          </motion.div>

          {/* Content Card */}
          <motion.div
            {...fadeUp(0.06)}
            className="bg-crema-chiara border border-linea finestra p-7 sm:p-10 space-y-8"
          >

            <Section title="Angaben gemäß § 5 TMG">
              <p style={{ fontWeight: 600 }} className="text-nero">GCN Fahrzeughandel GbR</p>
              <p>Sommeraurstr. 46</p>
              <p>78112 Sankt Georgen im Schwarzwald</p>
              <p>Deutschland</p>
            </Section>

            <Section title="Vertreten durch">
              <p>Giosue Canobbio</p>
              <p>Christopher Neun</p>
            </Section>

            <Section title="Kontakt">
              <div className="flex flex-col gap-2.5 mt-1">
                <a
                  href="tel:+4917641651086"
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rosso-wash flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-asfalto" />
                  </div>
                  +49 176 41651086
                </a>
                <a
                  href="mailto:gcn-farzeughandel@outlook.de"
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rosso-wash flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-asfalto" />
                  </div>
                  gcn-farzeughandel@outlook.de
                </a>
                <a
                  href="https://www.instagram.com/gcn.fahrzeughandel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rosso-wash flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5 text-asfalto" />
                  </div>
                  @gcn.fahrzeughandel
                </a>
              </div>
            </Section>

            <Section title="Steuernummer">
              <p>Steuer-Nr.: 22191 13691</p>
              <p>Zuständiges Finanzamt: Finanzamt Villingen-Schwenningen</p>
            </Section>

            <Section title="EU-Streitschlichtung">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nero underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
              <p className="mt-2">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </Section>

            <Section title="Haftungsausschluss">
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
                Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              </p>
            </Section>

          </motion.div>
        </div>
      </div>
    </>
  );
}
