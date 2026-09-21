import { Link } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ShieldCheck,
  Clock,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Phone,
  Users,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Handshake,
} from "lucide-react";
import suchauftragImg from "../../assets/illustrations/suchauftrag.jpg";
import uebergabeImg from "../../assets/illustrations/uebergabe.jpg";
import stellplatzImg from "../../assets/illustrations/stellplatz.jpg";
import vwUpImage from "../../assets/vw-up.jpg";
import giosueImg from "../../assets/Giosue.jpeg";
import christophImg from "../../assets/Christoph.jpeg";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SEO } from "./SEO";
import { CockpitIntro } from "./CockpitIntro";
import { LAST_FRAME } from "../intro/ScrollFilm";
import { HeroContent, HeroVeil } from "./HeroContent";
import { shouldPlayIntro, useIntro } from "../intro/IntroContext";

// ─── DATEN ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "suchauftrag",
    title: "Suchauftrag",
    claim: "Wir finden Ihr Wunschfahrzeug.",
    description:
      "Sie nennen uns Marke, Modell, Budget und Ausstattung. Wir suchen über unser Händlernetzwerk und private Quellen, prüfen jedes Fahrzeug vorab und legen Ihnen nur vor, was die Prüfung besteht. Keine Telefonate mit Fremden, keine vergeblichen Besichtigungen.",
    cta: { label: "Suchauftrag erstellen", path: "/kontakt?type=search" },
    image: suchauftragImg,
    alt: "Illustration: eine Lupe, unter der ein rotes Auto sichtbar wird",
  },
  {
    id: "verkauf",
    title: "Fahrzeugverkauf",
    claim: "Wir verkaufen Ihres zum Bestwert.",
    description:
      "Übergeben Sie uns die Abwicklung: professionelle Inserate, Verhandlungen in Ihrem Namen, Schutz vor unseriösen Interessenten. Von der Bewertung bis zur Schlüsselübergabe bleibt alles in einer Hand – in Ihrer und unserer.",
    cta: { label: "Verkaufsauftrag starten", path: "/kontakt?type=sell" },
    image: uebergabeImg,
    alt: "Illustration: ein Autoschlüssel wird von einer Hand in eine andere gelegt",
  },
];

const INVENTORY = [
  {
    id: "1",
    brand: "Volkswagen",
    model: "up! move up!",
    price: "4.999 €",
    year: "09/2014",
    mileage: "92.000 km",
    fuel: "Benzin",
    transmission: "Schaltgetriebe",
    power: "44 kW (60 PS)",
    image: vwUpImage,
    condition: "Gebraucht",
    mobileLink:
      "https://suchen.mobile.de/fahrzeuge/details.html?id=446353280&secret=b4a0bae92056da4585f40245617943e7",
  },
];

const ADVANTAGES = [
  {
    icon: Users,
    title: "Persönliche Betreuung",
    description:
      "Kein Callcenter, keine Warteschleife. Sie haben einen festen Ansprechpartner, der Ihren Auftrag kennt und Sie durch den gesamten Prozess begleitet.",
  },
  {
    icon: ShieldCheck,
    title: "Mindestens 12 Monate Garantie",
    description:
      "Jedes vermittelte Fahrzeug wird mit mindestens zwölf Monaten Garantie abgesichert. Auch nach der Übergabe stehen wir gerade.",
  },
  {
    icon: Clock,
    title: "Ihre Zeit bleibt Ihre",
    description:
      "Keine Besichtigungstouristen, keine zähen Verhandlungen am Feierabend. Sie entscheiden – den Rest erledigen wir.",
  },
  {
    icon: TrendingUp,
    title: "Der Preis, der drin ist",
    description:
      "Über unser Netzwerk und die tägliche Marktbeobachtung erzielen wir beim Verkauf Spitzenpreise und beim Kauf die besseren Konditionen.",
  },
];

const FOUNDERS = [
  {
    name: "Giosue Canobbio",
    age: 22,
    role: "Mitgründer & Geschäftsführer",
    bio: "Dualer Student im Studiengang Finanzdienstleistungen – verbindet Kundenberatung mit langjähriger Automobil-Leidenschaft.",
    avatar: giosueImg,
  },
  {
    name: "Christopher Neun",
    age: 28,
    role: "Mitgründer & Geschäftsführer",
    bio: "Kaufmann für Versicherungen & Finanzen, dualer Student – strukturiert, verlässlich und klar in der Kommunikation.",
    avatar: christophImg,
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    label: "Transparenz",
    sub: "Klare Kommunikation, keine versteckten Kosten.",
  },
  {
    icon: Users,
    label: "Persönlich",
    sub: "Ein fester Ansprechpartner von der Anfrage bis zur Übergabe.",
  },
  {
    icon: Handshake,
    label: "Fairness",
    sub: "Faire Preise und ehrliche Beratung, auch wenn sie gegen den Abschluss spricht.",
  },
];

// ─── BAUSTEINE ────────────────────────────────────────────────────────────────

function InventoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const hasControls = INVENTORY.length > 1;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (INVENTORY.length === 0) {
    return (
      <div className="finestra overflow-hidden border border-linea bg-crema-chiara">
        <img
          src={stellplatzImg}
          alt="Illustrierter leerer Stellplatz mit frischen Reifenspuren"
          className="h-56 w-full object-cover sm:h-72"
          loading="lazy"
        />
        <div className="p-6 sm:p-8">
          <h3>Gerade steht nichts bei uns.</h3>
          <p className="mt-3 max-w-md text-asfalto">
            Unser Bestand wechselt schnell. Sagen Sie uns, was Sie suchen – wir
            melden uns, sobald das passende Fahrzeug da ist.
          </p>
          <Link
            to="/kontakt?type=search"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-rosso px-6 py-3.5 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro"
          >
            Suchauftrag erstellen
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {hasControls && (
        <div className="mb-6 flex justify-end gap-2 sm:mb-8">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Vorheriges Fahrzeug"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara disabled:cursor-default disabled:border-linea-chiara disabled:text-alluminio disabled:hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Nächstes Fahrzeug"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara disabled:cursor-default disabled:border-linea-chiara disabled:text-alluminio disabled:hover:bg-transparent"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">
          {INVENTORY.map((car) => (
            <article
              key={car.id}
              className="finestra group flex w-full flex-none flex-col overflow-hidden border border-linea bg-crema-chiara transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(26,21,18,0.5)] sm:w-[420px] md:w-[380px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-crema-scura">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-linea-chiara pb-4">
                  <div>
                    <h3>
                      {car.brand} {car.model}
                    </h3>
                    <p className="mt-1 text-sm text-asfalto">
                      {car.power} · {car.condition}
                    </p>
                  </div>
                  <p className="numeri shrink-0 text-xl" style={{ fontWeight: 700 }}>
                    {car.price}
                  </p>
                </div>

                <dl className="mb-6 grid grid-cols-2 gap-2.5 text-sm text-asfalto">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                    <dt className="sr-only">Erstzulassung</dt>
                    <dd className="numeri">{car.year}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                    <dt className="sr-only">Laufleistung</dt>
                    <dd className="numeri">{car.mileage}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Settings2 className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                    <dt className="sr-only">Getriebe</dt>
                    <dd>{car.transmission}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fuel className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                    <dt className="sr-only">Kraftstoff</dt>
                    <dd>{car.fuel}</dd>
                  </div>
                </dl>

                <a
                  href={car.mobileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full rounded-full bg-nero py-3.5 text-center text-sm text-crema-chiara transition-colors hover:bg-rosso active:scale-[0.99]"
                >
                  Auf mobile.de ansehen
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export function Home() {
  const { setPhase } = useIntro();
  const [introOn] = useState(() => shouldPlayIntro());
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (introOn) {
      setPhase("running");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    return () => setPhase("off");
  }, [introOn, setPhase]);

  const skipIntro = () => {
    const section = document.getElementById("intro-sequenz");
    if (!section) return;
    /* Ans Ende der Fahrt, nicht dahinter: Dort steht der Hero. */
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight - window.innerHeight,
      behavior: "auto",
    });
  };

  return (
    <>
      <SEO
        title="Autohandel in St. Georgen im Schwarzwald – GCN Fahrzeughandel GbR"
        description="Ihr persönlicher Fahrzeugexperte und Autohandel in St. Georgen im Schwarzwald. Suchauftrag, Fahrzeugverkauf und Bestand für Kunden aus St. Georgen, Triberg, Villingen-Schwenningen, Furtwangen und Umgebung."
        keywords="Autohandel St. Georgen, Fahrzeughandel Schwarzwald, Gebrauchtwagen Triberg, Auto verkaufen Villingen-Schwenningen, Auto kaufen Furtwangen, Suchauftrag"
        ogType="website"
      />

      {introOn && <CockpitIntro onSkip={skipIntro} />}

      {/* ── Hero ────────────────────────────────────────────────────
          Lief das Intro, steht der Hero bereits als letzter Frame der
          Fahrt – dann entfällt er hier, sonst sähe man ihn zweimal. */}
      {!introOn && (
        <section
          ref={heroRef}
          className="relative h-[100svh] min-h-[600px] overflow-hidden bg-crema"
        >
          <img
            src={LAST_FRAME}
            alt="Illustration: Coupé auf einer Schwarzwaldstraße zwischen Tannen"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 z-[60]" aria-hidden="true">
            <HeroVeil />
          </div>
          <div className="absolute inset-0 z-[70]">
            <HeroContent as="h1" />
          </div>
        </section>
      )}

      {/* ── Leistungen ────────────────────────────────────────────── */}
      <section className="bg-crema" aria-labelledby="leistungen">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 border-b border-linea pb-9 md:flex-row md:items-end">
            <h2 id="leistungen" className="max-w-xl">
              Zwei Aufträge, die wir übernehmen.
            </h2>
            <p className="max-w-sm text-asfalto">
              Beide sparen Ihnen dasselbe: Zeit, Nerven und den Preis, den man
              zahlt, wenn man den Markt nicht täglich beobachtet.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
            {SERVICES.map((service) => (
              <article
                key={service.id}
                className="finestra flex flex-col overflow-hidden border border-linea bg-crema-chiara"
              >
                <div className="aspect-[16/9] overflow-hidden bg-crema-scura">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3>{service.title}</h3>
                  <p className="mt-2 text-lg text-nero">{service.claim}</p>
                  <p className="mb-8 mt-4 flex-1 text-asfalto">
                    {service.description}
                  </p>
                  <Link
                    to={service.cta.path}
                    className="group inline-flex w-fit items-center gap-2 rounded-full border border-nero/20 px-6 py-3.5 text-sm text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara"
                  >
                    {service.cta.label}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestand ───────────────────────────────────────────────── */}
      <section className="border-t border-linea bg-crema-chiara" aria-labelledby="bestand">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-linea pb-9 md:flex-row md:items-end">
            <h2 id="bestand" className="max-w-xl">
              Fahrzeuge im Sofortbestand.
            </h2>
            <p className="max-w-sm text-asfalto">
              Neben dem Auftragsservice führen wir eigene Fahrzeuge, die Sie
              direkt kaufen können.
            </p>
          </div>

          <InventoryCarousel />

          <div className="mt-10 text-center">
            <Link
              to="/bestand"
              className="group inline-flex items-center gap-2 text-sm text-asfalto transition-colors hover:text-nero"
            >
              Gesamten Bestand ansehen
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Warum GCN ─────────────────────────────────────────────── */}
      <section className="bg-crema" aria-labelledby="warum">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
          <h2 id="warum" className="max-w-2xl border-b border-linea pb-9">
            Vertrauen entsteht durch persönliche Betreuung.
          </h2>

          <dl className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {ADVANTAGES.map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  className="flex gap-5 border-b border-linea-chiara py-8"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rosso-wash text-rosso"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <dt className="text-[17px] leading-snug text-nero" style={{ fontWeight: 700 }}>
                      {adv.title}
                    </dt>
                    <dd className="mt-2 text-asfalto">{adv.description}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ── Wer wir sind ──────────────────────────────────────────── */}
      <section className="border-t border-linea bg-crema-chiara" aria-labelledby="wer">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 border-b border-linea pb-9 md:flex-row md:items-end">
            <h2 id="wer" className="max-w-xl">
              Zwei Experten, eine Leidenschaft.
            </h2>
            <p className="max-w-sm text-asfalto">
              Hinter GCN stehen zwei Automobil-Experten aus dem Schwarzwald – ohne
              Verkaufsdruck, dafür mit einer klaren Einschätzung.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            {FOUNDERS.map((founder) => (
              <article
                key={founder.name}
                className="finestra flex items-start gap-5 border border-linea bg-crema p-6 sm:gap-7 sm:p-7"
              >
                <div className="finestra-sm h-20 w-20 shrink-0 overflow-hidden bg-crema-scura sm:h-24 sm:w-24">
                  <ImageWithFallback
                    src={founder.avatar}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px]">
                    {founder.name}{" "}
                    <span className="numeri text-asfalto">({founder.age})</span>
                  </h3>
                  <p className="mt-0.5 text-sm text-rosso">{founder.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-asfalto">
                    {founder.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <li
                  key={v.label}
                  className="finestra flex items-start gap-4 border border-linea bg-crema p-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rosso-wash text-rosso"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-nero" style={{ fontWeight: 700 }}>
                      {v.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-asfalto">
                      {v.sub}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 text-center">
            <Link
              to="/ueber-uns"
              className="group inline-flex items-center gap-2 text-sm text-asfalto transition-colors hover:text-nero"
            >
              Mehr über uns erfahren
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Abschluss ─────────────────────────────────────────────── */}
      <section className="bg-crema">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
          <div className="finestra relative overflow-hidden bg-nero p-8 text-crema-chiara sm:p-12 md:p-14">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h2 className="max-w-xl text-crema-chiara">
                  Sprechen Sie mit uns, bevor Sie inserieren.
                </h2>
                <p className="mt-4 max-w-md text-crema/80">
                  Ein Anruf, eine ehrliche Einschätzung – unverbindlich und
                  kostenlos.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
                <a
                  href="tel:+4917641651086"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-rosso px-7 py-4 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="numeri">0176 41651086</span>
                </a>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-crema/25 px-7 py-4 text-sm text-crema-chiara transition-colors hover:border-crema/60 hover:bg-crema/10 active:scale-[0.98]"
                >
                  Nachricht schreiben
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
