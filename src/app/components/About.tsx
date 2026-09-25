import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import giosueImg from "../../assets/Giosue.jpeg";
import christophImg from "../../assets/Christoph.jpeg";
import { SEO } from "./SEO";
import { Tusche, type TuscheName } from "./Tusche";
import { PROVISION } from "../firma";

const VALUES: { icon: TuscheName; title: string; description: string }[] = [
  {
    icon: "lupe",
    title: "Transparenz",
    description:
      `Keine versteckten Mängel, keine versteckten Kosten. Unsere Provision beträgt ${PROVISION} und wird vor Auftragsbeginn schriftlich vereinbart.`,
  },
  {
    icon: "betreuung",
    title: "Persönlich",
    description:
      "Jeder Auftrag ist anders. Wir beraten individuell und auf Augenhöhe – ohne Verkaufsdruck.",
  },
  {
    icon: "handschlag",
    title: "Fairness",
    description:
      "Ob Kauf oder Verkauf: Wir arbeiten mit marktgerechten Preisen und sagen auch mal ab.",
  },
  {
    icon: "garantie",
    title: "Garantie über ProGarant",
    description:
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
        <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <header className="mb-12 border-b border-linea pb-9 sm:mb-16">
            <h1 className="titolo-pagina max-w-2xl">Zwei Experten, eine Leidenschaft.</h1>
            <p className="mt-5 max-w-xl text-lg text-asfalto">
              Wir kaufen Fahrzeuge nach Ihren Wünschen ein und verkaufen sie mit
              Garantie weiter – transparent und unkompliziert, aus St. Georgen im
              Schwarzwald für Kunden in der Region und bundesweit.
            </p>
          </header>

          <div className="mb-12 grid grid-cols-1 gap-5 sm:mb-16 sm:gap-6 md:grid-cols-2">
            {FOUNDERS.map((founder) => (
              <article
                key={founder.name}
                className="finestra flex flex-col border border-linea bg-crema-chiara p-7 sm:p-8"
              >
                <div className="finestra-sm mb-5 h-24 w-24 overflow-hidden bg-crema-scura sm:h-28 sm:w-28">
                  <ImageWithFallback
                    src={founder.avatar}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-xl" style={{ fontWeight: 700 }}>
                  {founder.name}{" "}
                  <span className="numeri text-asfalto">({founder.age})</span>
                </h2>
                <p className="mt-1 text-sm text-rosso">{founder.role}</p>
                <p className="mt-4 text-asfalto">{founder.bio}</p>
              </article>
            ))}
          </div>

          <section className="mb-12 sm:mb-16" aria-labelledby="philosophie">
            <h2 id="philosophie" className="border-b border-linea pb-7">
              Woran wir uns messen lassen.
            </h2>
            <dl className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
              {VALUES.map((val) => (
                <div key={val.title} className="flex gap-6 border-b border-linea-chiara py-7">
                  <Tusche name={val.icon} className="h-14 w-14 text-nero" />
                  <div>
                    <dt className="text-[17px] leading-snug" style={{ fontWeight: 700 }}>
                      {val.title}
                    </dt>
                    <dd className="mt-2 text-asfalto">{val.description}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

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
