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
    <div className="pt-8 border-t border-black/6 first:border-0 first:pt-0">
      <h2
        className="text-base text-black mb-4"
        style={{ fontWeight: 600 }}
      >
        {title}
      </h2>
      <div className="text-gray-500 text-sm leading-relaxed space-y-1">{children}</div>
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

      <div className="flex-1 min-h-screen bg-white text-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <motion.div
            {...fadeUp(0)}
            className="border-b border-black/8 pb-8 mb-10"
          >
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Rechtliches</p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-black"
              style={{ fontWeight: 300, lineHeight: 1.1 }}
            >
              Impressum.
            </h1>
          </motion.div>

          {/* Content Card */}
          <motion.div
            {...fadeUp(0.06)}
            className="bg-[#f7f7f7] border border-black/8 rounded-3xl p-7 sm:p-10 space-y-8"
          >

            <Section title="Angaben gemäß § 5 TMG">
              <p style={{ fontWeight: 600 }} className="text-black">GCN Fahrzeughandel GbR</p>
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
                  className="inline-flex items-center gap-2.5 text-gray-600 hover:text-black transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-black/6 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  +49 176 41651086
                </a>
                <a
                  href="mailto:gcn-farzeughandel@outlook.de"
                  className="inline-flex items-center gap-2.5 text-gray-600 hover:text-black transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-black/6 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  gcn-farzeughandel@outlook.de
                </a>
                <a
                  href="https://www.instagram.com/gcn.fahrzeughandel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-gray-600 hover:text-black transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-black/6 flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5 text-gray-500" />
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
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
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
