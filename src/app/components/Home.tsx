import { Link } from "react-router";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import {
  Search,
  CarFront,
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
import heroBg from "../../assets/6ca19209d42aea8c15819f803e558f77243107be.png";
import vwUpImage from "../../assets/a73f31ab97428181cb471f206b6a5d44e6e6087a.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SEO } from "./SEO";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "suchauftrag",
    label: "01 — Suchauftrag",
    title: "Wir finden Ihr Wunschfahrzeug.",
    description:
      "Sie nennen uns Ihre Wünsche – Marke, Modell, Budget, Ausstattung. Wir übernehmen die vollständige Suche über unser Händlernetzwerk sowie private Quellen. Keine Telefonate mit Fremden, keine unnötigen Besichtigungen. Wir prüfen jedes Fahrzeug vorab und präsentieren Ihnen nur vorqualifizierte Angebote.",
    cta: { label: "Suchauftrag erstellen", path: "/kontakt?type=search" },
    image:
      "https://images.unsplash.com/photo-1768760819947-f6772ae3f433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwY2luZW1hdGljJTIwYXV0b21vdGl2ZXxlbnwxfHx8fDE3NzUxNjIzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "verkauf",
    label: "02 — Fahrzeugverkauf",
    title: "Wir verkaufen Ihr Fahrzeug zum Bestwert.",
    description:
      "Übergeben Sie uns die Abwicklung Ihres Fahrzeugverkaufs. Wir erstellen professionelle Inserate, führen Verhandlungen in Ihrem Namen und schützen Sie vor unseriösen Interessenten. Von der Bewertung bis zur Schlüsselübergabe – alles aus einer Hand.",
    cta: { label: "Verkaufsauftrag starten", path: "/kontakt?type=sell" },
    image:
      "https://images.unsplash.com/photo-1761264889465-67be9fc1b77e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBrZXlzJTIwaGFuZG92ZXIlMjBwZXJzb25hbCUyMHNlcnZpY2V8ZW58MXx8fHwxNzc1MTYyNDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

// Single entry — carousel ready for more cars later
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
    number: "01",
    icon: Users,
    title: "Persönliche Betreuung",
    description:
      "Kein Callcenter, kein Wartezimmer. Sie haben einen festen Ansprechpartner, der Ihren Auftrag kennt und Sie durch den gesamten Prozess begleitet.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Garantie (min. 12 Monate)",
    description:
      "Jedes vermittelte Fahrzeug wird mit mindestens 12 Monaten Garantie abgesichert – für maximale Sicherheit und ein gutes Gefühl nach dem Kauf.",
  },
  {
    number: "03",
    icon: Clock,
    title: "Volle Zeitersparnis",
    description:
      "Keine Besichtigungstouristen, keine endlosen Verhandlungen. Sie lehnen sich zurück – wir erledigen den Rest vollständig für Sie.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Maximale Preiserzielung",
    description:
      "Durch unser Netzwerk und Markterfahrung erzielen wir beim Verkauf Spitzenpreise und beim Kauf die besten verfügbaren Konditionen.",
  },
];

const FOUNDERS = [
  {
    name: "Giosue Canobbio",
    age: 22,
    role: "Mitgründer & Geschäftsführer",
    bio: "Dualer Student im Studiengang Finanzdienstleistungen – verbindet Kundenberatung mit langjähriger Automobil-Leidenschaft.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
  },
  {
    name: "Christopher Neun",
    age: 28,
    role: "Mitgründer & Geschäftsführer",
    bio: "Kaufmann für Versicherungen & Finanzen, dualer Student – strukturiert, verlässlich und klar in der Kommunikation.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    label: "Transparenz",
    sub: "Klare Kommunikation ohne versteckte Kosten oder Überraschungen.",
  },
  {
    icon: Users,
    label: "Persönlich",
    sub: "Ein fester Ansprechpartner – von der Anfrage bis zur Übergabe.",
  },
  {
    icon: Handshake,
    label: "Fairness",
    sub: "Faire Preise und ehrliche Beratung, immer in Ihrem Interesse.",
  },
];

// ─── CAROUSEL ──────────────────────────────────────────────────────────────────

function InventoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div>
      {/* Controls — always visible, ready for more cars */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex gap-2">
          {INVENTORY.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-6 bg-black" : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${
              canPrev
                ? "border-black/20 text-black hover:bg-black hover:text-white hover:border-black"
                : "border-black/8 text-black/20 cursor-default"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${
              canNext
                ? "border-black/20 text-black hover:bg-black hover:text-white hover:border-black"
                : "border-black/8 text-black/20 cursor-default"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">
          {INVENTORY.map((car) => (
            <div
              key={car.id}
              className="flex-none w-full sm:w-[420px] md:w-[380px] lg:w-[360px]"
            >
              <div className="bg-white rounded-3xl overflow-hidden border border-black/8 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-black text-xs px-3 py-1.5 rounded-full border border-black/8">
                      {car.condition}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-black/6">
                    <div>
                      <h3 className="text-base text-black" style={{ fontWeight: 600 }}>
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-400 text-sm">{car.power}</p>
                    </div>
                    <span className="text-black text-base ml-2 shrink-0" style={{ fontWeight: 600 }}>
                      {car.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-sm text-gray-500 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      {car.year}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      {car.mileage}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      {car.fuel}
                    </div>
                  </div>

                  {/* Primary action */}
                  <a
                    href={car.mobileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-black hover:bg-gray-900 text-white text-sm rounded-2xl transition-colors text-center mt-auto active:scale-[0.98]"
                  >
                    Auf Mobile.de ansehen
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, ease: "easeOut", delay },
});

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export function Home() {
  return (
    <>
      <SEO
        title="Autohandel in St. Georgen im Schwarzwald – GCN Fahrzeughandel GbR"
        description="Ihr persoenlicher Fahrzeugexperte und Autohandel in St. Georgen im Schwarzwald. Suchauftrag, Fahrzeugverkauf und Bestand fuer Kunden aus St. Georgen, Triberg, Villingen-Schwenningen, Furtwangen und Umgebung."
        keywords="Autohandel St. Georgen, Fahrzeughandel Schwarzwald, Gebrauchtwagen Triberg, Auto verkaufen Villingen-Schwenningen, Auto kaufen Furtwangen, Suchauftrag"
        ogType="website"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          autoPlay muted loop playsInline poster={heroBg}
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55 pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-6 sm:mb-8"
          >
            GCN Fahrzeughandel GbR · Sankt Georgen im Schwarzwald
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 sm:mb-8"
            style={{ fontWeight: 300, lineHeight: 1.08 }}
          >
            Ihr persönlicher
            <br />
            <span style={{ fontWeight: 700 }}>Fahrzeugexperte.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.16 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 sm:mb-14 max-w-2xl mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.75 }}
          >
            Wir übernehmen Suche und Verkauf Ihres Fahrzeugs – vollständig,
            diskret und zu besten Konditionen.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2"
          >
            {/* PRIMARY — most important action */}
            <Link
              to="/kontakt?type=search"
              className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-8 py-4 rounded-2xl text-sm tracking-wide hover:bg-gray-100 transition-colors active:scale-[0.98] shadow-lg"
            >
              <Search className="w-4 h-4 shrink-0" />
              Auftrag erstellen
            </Link>
            {/* SECONDARY — supporting action */}
            <Link
              to="/bestand"
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 text-white border border-white/25 px-8 py-4 rounded-2xl text-sm tracking-wide hover:bg-white/15 hover:border-white/40 transition-colors active:scale-[0.98] backdrop-blur-sm"
            >
              <CarFront className="w-4 h-4 shrink-0" />
              Bestand ansehen
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-35">
          <div className="w-px h-10 bg-white animate-pulse mx-auto" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — LEISTUNGEN
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white text-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-24 pb-6">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/8 pb-8">
            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Unsere Leistungen</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-black" style={{ fontWeight: 300, lineHeight: 1.1 }}>
                Was wir für Sie tun.
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Zwei klar definierte Dienstleistungen, die Ihnen Zeit, Nerven und Geld sparen.
            </p>
          </motion.div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                {...fadeUp(i * 0.08)}
                className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">{service.label}</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black mb-4" style={{ fontWeight: 400, lineHeight: 1.25 }}>
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-7 flex-1">{service.description}</p>
                  {/* SECONDARY button */}
                  <Link
                    to={service.cta.path}
                    className="inline-flex items-center gap-2 text-sm text-black border border-black/15 rounded-2xl px-5 py-3 w-fit hover:bg-black hover:text-white hover:border-black transition-all group"
                  >
                    {service.cta.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — FAHRZEUGBESTAND (Carousel)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f7f7f7] border-t border-black/6 text-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-12 border-b border-black/8 pb-8">
            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Direktkauf</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-black" style={{ fontWeight: 300, lineHeight: 1.1 }}>
                Fahrzeuge im <span style={{ fontWeight: 700 }}>Sofortbestand.</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Neben unserem Auftragsservice führen wir auch eigene Fahrzeuge im Bestand, die Sie direkt erwerben können.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.06)}>
            <InventoryCarousel />
          </motion.div>

          {/* TERTIARY link — lowest visual weight */}
          <motion.div {...fadeUp(0.1)} className="mt-8 sm:mt-10 text-center">
            <Link
              to="/bestand"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors group"
            >
              Gesamten Bestand ansehen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — WARUM GCN (Vorteile)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-black/6 text-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <motion.div {...fadeUp(0)} className="border-b border-black/8 pb-8 mb-10 sm:mb-14">
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Warum GCN</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-black max-w-2xl" style={{ fontWeight: 300, lineHeight: 1.1 }}>
              Vertrauen durch <span style={{ fontWeight: 700 }}>persönliche Betreuung.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADVANTAGES.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={adv.number}
                  {...fadeUp(i * 0.07)}
                  className="bg-[#f7f7f7] rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-gray-300 tracking-widest">{adv.number}</span>
                    <div className="w-9 h-9 rounded-xl bg-black/6 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg text-black" style={{ fontWeight: 600, lineHeight: 1.3 }}>
                    {adv.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{adv.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* BLACK CTA BANNER — entfernt, jetzt in Section 6 ganz unten */}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — WER WIR SIND
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f7f7f7] border-t border-black/6 text-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/8 pb-8 mb-10 sm:mb-14">
            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Wer wir sind</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-black" style={{ fontWeight: 300, lineHeight: 1.1 }}>
                Zwei Experten.<br /><span style={{ fontWeight: 700 }}>Eine Leidenschaft.</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Hinter GCN stehen zwei leidenschaftliche Automobil-Experten aus dem Schwarzwald – persönlich, transparent und fair.
            </p>
          </motion.div>

          {/* Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
            {FOUNDERS.map((founder, i) => (
              <motion.div
                key={founder.name}
                {...fadeUp(i * 0.09)}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 flex items-center gap-5 sm:gap-7 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
                  <ImageWithFallback
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base text-black mb-0.5" style={{ fontWeight: 600 }}>
                    {founder.name} ({founder.age})
                  </h3>
                  <p className="text-xs tracking-wide text-gray-400 uppercase mb-2">{founder.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{founder.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Values row */}
          <motion.div {...fadeUp(0.06)} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.label}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col gap-3 border border-black/6"
                >
                  <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1" style={{ fontWeight: 600 }}>{v.label}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{v.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* TERTIARY link to full about page */}
          <motion.div {...fadeUp(0.1)} className="text-center mb-0">
            <Link
              to="/ueber-uns"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors group"
            >
              Mehr über uns erfahren
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — CTA BANNER (ganz unten)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-black/6 text-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <motion.div {...fadeUp(0)} className="bg-black text-white rounded-3xl p-8 sm:p-12 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">Jetzt starten</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl text-white max-w-lg" style={{ fontWeight: 300, lineHeight: 1.3 }}>
                Sprechen Sie mit uns –{" "}
                <span style={{ fontWeight: 700 }}>unverbindlich & kostenlos.</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              {/* PRIMARY on dark bg */}
              <a
                href="tel:+4917641651086"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-2xl text-sm hover:bg-gray-100 transition-colors whitespace-nowrap active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 shrink-0" />
                0176 41651086
              </a>
              {/* SECONDARY on dark bg */}
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-2xl text-sm hover:border-white/40 hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                Kontakt aufnehmen
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}