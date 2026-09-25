import { motion } from "motion/react";
import { SEO } from "./SEO";
import { Tusche } from "./Tusche";
import { EMAIL, INSTAGRAM_URL, TELEFON_INTERNATIONAL, TELEFON_LINK, UST_ID, W_ID } from "../firma";

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

            <Section title="Angaben gemäß § 5 DDG">
              <p style={{ fontWeight: 600 }} className="text-nero">GCN Fahrzeughandel GbR</p>
              <p>Sommeraurstr. 46</p>
              <p>78112 Sankt Georgen im Schwarzwald</p>
              <p>Deutschland</p>
            </Section>

            <Section title="Vertreten durch die Gesellschafter">
              <p>Giosuè Canobbio</p>
              <p>Christopher Neun</p>
            </Section>

            <Section title="Kontakt">
              <div className="flex flex-col gap-2.5 mt-1">
                <a
                  href={TELEFON_LINK}
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <Tusche name="telefon" className="h-6 w-6 text-nero" />
                  {TELEFON_INTERNATIONAL}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <Tusche name="brief" className="h-6 w-6 text-nero" />
                  {EMAIL}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-asfalto hover:text-nero transition-colors group"
                >
                  <Tusche name="kamera" className="h-6 w-6 text-nero" />
                  @gcn.fahrzeughandel
                </a>
              </div>
            </Section>

            {(UST_ID || W_ID) && (
              <Section title="Steuerliche Angaben">
                {UST_ID && (
                  <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {UST_ID}</p>
                )}
                {W_ID && <p>Wirtschafts-Identifikationsnummer gemäß § 139c Abgabenordnung: {W_ID}</p>}
              </Section>
            )}

            <Section title="Verbraucherstreitbeilegung">
              <p>
                Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor
                einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
              </p>
            </Section>

            <Section title="Haftung für Inhalte">
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
                Gewähr übernehmen. Für eigene Inhalte auf diesen Seiten sind wir nach den
                allgemeinen Gesetzen verantwortlich.
              </p>
            </Section>

          </motion.div>
        </div>
      </div>
    </>
  );
}
