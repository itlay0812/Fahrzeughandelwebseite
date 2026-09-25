import { Link } from "react-router";
import giosueImg from "../../assets/Giosue.jpeg";
import christophImg from "../../assets/Christoph.jpeg";
import { SEO } from "./SEO";
import { Tusche } from "./Tusche";
import { GruenderSektion, type Wert } from "./Gruender";
import { GoogleBewertungen } from "./GoogleBewertungen";
import { PROVISION } from "../firma";

const VALUES: Wert[] = [
  {
    icon: "lupe",
    label: "Transparenz",
    text:
      `Keine versteckten Mängel, keine versteckten Kosten. Unsere Provision beträgt ${PROVISION} und wird vor Auftragsbeginn schriftlich vereinbart.`,
  },
  {
    icon: "betreuung",
    label: "Persönlich",
    text:
      "Jeder Auftrag ist anders. Wir beraten individuell und auf Augenhöhe – ohne Verkaufsdruck.",
  },
  {
    icon: "handschlag",
    label: "Fairness",
    text:
      "Ob Kauf oder Verkauf: Wir arbeiten mit marktgerechten Preisen und sagen auch mal ab.",
  },
  {
    icon: "garantie",
    label: "Garantie über ProGarant",
    text:
      "Jedes Fahrzeug, das wir verkaufen, ist über eine Gebrauchtwagengarantie von ProGarant abgesichert. Die Garantiebedingungen erhalten Sie vor dem Kauf. Auch nach der Übergabe bleiben wir Ihr Ansprechpartner.",
  },
];

const FOUNDERS = [
  {
    name: "Giosuè Canobbio",
    age: 22,
    role: "Mitgründer & Gesellschafter",
    bio: "Als dualer Student im Studiengang Finanzdienstleistungen verbindet Giosuè an seinen Standorten Sankt Georgen und Lörrach berufliche Erfahrung in der Kundenberatung mit einer langjährigen Leidenschaft für Autos. Dieses tiefe Interesse ermöglicht es ihm, Marktpreise, technische Details und Fahrzeugqualitäten für Sie optimal und realistisch einzuschätzen.",
    avatar: giosueImg,
  },
  {
    name: "Christopher Neun",
    age: 28,
    role: "Mitgründer & Gesellschafter",
    bio: "Als gelernter Kaufmann für Versicherungen und Finanzen sowie dualer Student (Finanzdienstleistungen) bringt Christopher ein ausgeprägtes Verständnis für strukturierte Abläufe mit. Von seinen Standorten Singen und Lörrach aus liegt sein Fokus darauf, Prozesse klar zu gestalten und Sie als Kunden sachlich und verlässlich zu begleiten.",
    avatar: christophImg,
  },
];

export function About() {
  return (
    <>
      <SEO
        title="Über uns – Zwei leidenschaftliche Automobil-Experten"
        description="Giosuè Canobbio und Christopher Neun – Ihre Experten für transparenten und fairen Fahrzeughandel. Erfahren Sie mehr über unser Team und unsere Philosophie."
        keywords="Über GCN, Team Fahrzeughandel, Giosuè Canobbio, Christopher Neun, Autohändler Team, Gebrauchtwagen Experten"
      />

      <div className="min-h-screen flex-1 bg-crema text-nero">
        <section
          className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-12"
          aria-labelledby="wer"
        >
          <GruenderSektion
            gruender={FOUNDERS}
            werte={VALUES}
            ueberschrift="h1"
            einleitung="Wir kaufen Fahrzeuge nach Ihren Wünschen ein und verkaufen sie mit Garantie weiter – transparent und unkompliziert, aus St. Georgen im Schwarzwald für Kunden in der Region und bundesweit."
          />
        </section>

        <GoogleBewertungen />

        <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-12">
          <section className="finestra relative overflow-hidden bg-nero p-8 text-crema-chiara sm:p-12">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <h2 className="max-w-md text-crema-chiara">
                  Lernen Sie uns kennen.
                </h2>
                <p className="mt-4 max-w-md text-crema/80">
                  Ein kurzes Gespräch genügt, um zu klären, ob wir der richtige
                  Partner für Ihr Vorhaben sind.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
                <a
                  href="tel:+4917641651086"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-rosso px-7 py-4 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro"
                >
                  <Tusche name="telefon" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="numeri">0176 41651086</span>
                </a>
                <Link
                  to="/kontakt"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-crema/25 px-7 py-4 text-sm text-crema-chiara transition-colors hover:border-crema/60 hover:bg-crema/10"
                >
                  Nachricht schreiben
                  <Tusche name="pfeil" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
