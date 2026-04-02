import { motion } from "motion/react";
import { SEO } from "./SEO";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut", delay },
});

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="pt-8 border-t border-black/6">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs text-gray-300 tracking-widest shrink-0">{number}</span>
        <h2 className="text-base text-black" style={{ fontWeight: 600 }}>
          {title}
        </h2>
      </div>
      <div className="text-gray-500 text-sm leading-relaxed space-y-4 pl-6">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-black text-sm mb-1.5" style={{ fontWeight: 600 }}>{title}</h3>
      <div className="text-gray-500 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export function Privacy() {
  return (
    <>
      <SEO
        title="Datenschutz – GCN Fahrzeughandel GbR"
        description="Datenschutzerklärung der GCN Fahrzeughandel GbR gemäß DSGVO."
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
              Datenschutzerklärung.
            </h1>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Informationen gemäß Art. 13, 14 DSGVO zum Umgang mit Ihren personenbezogenen Daten.
            </p>
          </motion.div>

          {/* Content Card */}
          <motion.div
            {...fadeUp(0.06)}
            className="bg-[#f7f7f7] border border-black/8 rounded-3xl p-7 sm:p-10 space-y-0"
          >

            <Section number="01" title="Datenschutz auf einen Blick">
              <SubSection title="Allgemeine Hinweise">
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                  Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                  werden können.
                </p>
              </SubSection>

              <SubSection title="Datenerfassung auf dieser Website">
                <p>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                  Dessen Kontaktdaten können Sie dem Impressum entnehmen.
                </p>
              </SubSection>
            </Section>

            <Section number="02" title="Allgemeine Hinweise und Pflichtinformationen">
              <SubSection title="Datenschutz">
                <p>
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                  ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                  der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </SubSection>

              <SubSection title="Verantwortliche Stelle">
                <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                <div className="bg-white border border-black/6 rounded-2xl p-4 mt-2">
                  <p className="text-black" style={{ fontWeight: 600 }}>GCN Fahrzeughandel GbR</p>
                  <p>Sommeraurstr. 46</p>
                  <p>78112 Sankt Georgen im Schwarzwald</p>
                  <p className="mt-2">Telefon: +49 176 41651086</p>
                  <a
                    href="mailto:gcn-farzeughandel@outlook.de"
                    className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                  >
                    gcn-farzeughandel@outlook.de
                  </a>
                </div>
              </SubSection>

              <SubSection title="Speicherdauer">
                <p>
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer
                  genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck
                  für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen
                  geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden
                  Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für
                  die Speicherung haben.
                </p>
              </SubSection>
            </Section>

            <Section number="03" title="Datenerfassung auf dieser Website">
              <SubSection title="Server-Log-Dateien">
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in
                  Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="mt-2">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
                  vorgenommen.
                </p>
              </SubSection>

              <SubSection title="Kontaktformular">
                <p>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
                  aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                  zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
                  gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
                <p>
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                  DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder
                  zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen
                  Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der
                  effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
                  DSGVO).
                </p>
              </SubSection>
            </Section>

            <Section number="04" title="Ihre Rechte">
              <p>
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden
                personenbezogenen Daten:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-2">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
                <a
                  href="mailto:gcn-farzeughandel@outlook.de"
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  gcn-farzeughandel@outlook.de
                </a>
              </p>
              <p>
                Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über
                die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
              </p>
            </Section>

          </motion.div>

          {/* Last updated */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-center text-gray-400 text-xs mt-6"
          >
            Stand: April 2026
          </motion.p>
        </div>
      </div>
    </>
  );
}
