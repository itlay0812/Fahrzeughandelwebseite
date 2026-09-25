import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { markIntroSeen, useIntro } from "../intro/IntroContext";
import { ScrollFilm } from "../intro/ScrollFilm";
import { Ladefahrt } from "../intro/Ladefahrt";
import { HeroContent, HeroVeil } from "./HeroContent";

/* Die Fahrt in Scroll-Anteilen – sie folgt dem Film:
   0.00 – 0.28  im Cockpit, die Straße läuft entgegen
   0.28 – 0.55  die Kamera steigt aus dem Wagen
   0.55 – 0.85  der Wagen fährt die Schwarzwaldstraße entlang
   0.85 – 1.00  die Fahrt rollt aus, der Hero steht */

type Beat = {
  id: string;
  heading: string;
  body?: string;
  points?: string[];
  range: [number, number, number, number];
};

const BEATS: Beat[] = [
  {
    id: "cockpit",
    heading: "Am Ende sitzen Sie hier.",
    body: "Alles davor nehmen wir Ihnen ab: suchen, prüfen, verhandeln, abwickeln.",
    range: [0.02, 0.06, 0.18, 0.24],
  },
  {
    id: "wer",
    heading: "GCN Fahrzeughandel",
    body: "Zwei Fahrzeugexperten aus St. Georgen im Schwarzwald. Ein fester Ansprechpartner, von der ersten Frage bis zur Schlüsselübergabe.",
    range: [0.3, 0.36, 0.48, 0.54],
  },
  {
    id: "was",
    heading: "Zwei Aufträge, die wir übernehmen.",
    points: [
      "Suchauftrag: Wir finden und prüfen Ihr Wunschfahrzeug.",
      "Verkaufsauftrag: Wir verkaufen Ihr Fahrzeug zum fairen Marktpreis.",
      "Jedes Fahrzeug aus unserem Verkauf: Garantie über ProGarant.",
    ],
    range: [0.6, 0.66, 0.76, 0.82],
  },
];

function useBeat(progress: MotionValue<number>, range: Beat["range"]) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [26, 0, 0, -20]);
  return { opacity, y };
}

export function CockpitIntro({ onSkip }: { onSkip: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { setPhase } = useIntro();

  /* Ladebildschirm: Wer vor dem Laden aller Bilder scrollt, sieht die Fahrt
     ruckeln. Kommen die Bilder aus dem Cache, bleibt er ganz weg. */
  const ladung = useMotionValue(0);
  const [lader, setLader] = useState<"warten" | "an" | "aus">("warten");

  useEffect(() => {
    const id = window.setTimeout(() => setLader(ladung.get() < 1 ? "an" : "aus"), 180);
    return () => window.clearTimeout(id);
  }, [ladung]);

  useEffect(() => {
    if (lader !== "an") return;
    const html = document.documentElement;
    const vorher = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      html.style.overflow = vorher;
    };
  }, [lader]);

  /* Fortschritt über die Bühne selbst rechnen: useScroll mit target liefert
     hier den Fortschritt des gesamten Dokuments. Die Geometrie wird gecacht,
     damit pro Frame kein Layout gelesen wird. */
  const geom = useRef({ start: 0, dist: 1 });
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (y) => {
    const { start, dist } = geom.current;
    return Math.min(1, Math.max(0, (y - start) / dist));
  });

  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      geom.current = {
        start: section.offsetTop,
        dist: Math.max(1, section.offsetHeight - window.innerHeight),
      };
    };
    measure();
    const later = window.setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(later);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Der Film läuft nicht linear zum Scroll: Die Ausfahrt aus dem Cockpit
     ist zügig, die Fahrt über die Schwarzwaldstraße bekommt den langen Weg. */
  const filmProgress = useTransform(
    scrollYProgress,
    [0, 0.34, 0.55, 1],
    [0, 0.5, 0.66, 1],
  );

  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.26, 0.31, 0.56, 0.61, 0.84, 0.88],
    [0.7, 1, 1, 0.45, 1, 1, 0.4, 1],
  );
  const heroOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const chromeOpacity = useTransform(scrollYProgress, [0.86, 0.93], [1, 0]);

  const beats = [
    useBeat(scrollYProgress, BEATS[0].range),
    useBeat(scrollYProgress, BEATS[1].range),
    useBeat(scrollYProgress, BEATS[2].range),
  ];

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setPhase(value > 0.9 ? "arrived" : "running");
    if (value > 0.96) markIntroSeen();
  });

  return (
    <section
      ref={sectionRef}
      id="intro-sequenz"
      aria-label="GCN Fahrzeughandel – Einführung"
      className="relative bg-crema"
      style={{
        /* Eigener Stapelkontext: Die Ebenen der Bühne bleiben unter der
           fixierten Kopfzeile, statt sie zu überdecken. */
        isolation: "isolate",
        zIndex: 0,
        /* Die Bühne beginnt bündig an der Bildschirmkante, nicht unter dem
           ausgeblendeten Header – sonst springt das Layout am Ende. */
        marginTop: "calc(-1 * var(--header-h))",
        height: "calc(940vh + var(--header-h))",
      }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-crema">
        <ScrollFilm progress={filmProgress} onProgress={(anteil) => ladung.set(anteil)} />

        {/* Schleier: hält den Text auf jedem Bild lesbar */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[60]"
          style={{ opacity: veilOpacity }}
        >
          <HeroVeil />
        </motion.div>

        {/* Erzähltext während der Fahrt */}
        <div className="pointer-events-none absolute inset-0 z-[70]">
          {BEATS.map((beat, i) => (
            <motion.div
              key={beat.id}
              style={{ opacity: beats[i].opacity }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
            >
              <motion.div
                style={{ y: beats[i].y }}
                className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12"
              >
                <div className="max-w-[34rem]">
                  <p
                    className="text-nero"
                    style={{
                      fontSize: "clamp(1.9rem, 1.2rem + 2.6vw, 3.25rem)",
                      fontWeight: 700,
                      fontStretch: "108%",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.05,
                      textWrap: "balance",
                    }}
                  >
                    {beat.heading}
                  </p>
                  {beat.body && (
                    <p className="mt-4 text-[15px] leading-relaxed text-nero/85 sm:text-base">
                      {beat.body}
                    </p>
                  )}
                  {beat.points && (
                    <ul className="mt-5 space-y-2.5">
                      {beat.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-[15px] leading-relaxed text-nero sm:text-base"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.62em] h-[3px] w-5 shrink-0 bg-rosso"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Letzter Frame: der Hero steht, bevor das Sticky sich löst */}
        <motion.div
          className="absolute inset-0 z-[90]"
          style={{ opacity: heroOpacity }}
        >
          <HeroContent as="p" />
        </motion.div>

        {/* Bedienelemente */}
        <motion.div
          className="absolute inset-0 z-[95]"
          style={{ opacity: chromeOpacity }}
        >
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-asfalto"
          >
            <span className="text-xs tracking-[0.2em]">Scrollen</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </motion.div>

          <button
            type="button"
            onClick={() => {
              markIntroSeen();
              setPhase("arrived");
              onSkip();
            }}
            className="absolute right-4 top-4 rounded-full border border-nero/15 bg-crema-chiara/80 px-4 py-2 text-xs tracking-wide text-nero backdrop-blur-sm transition-colors hover:bg-crema-chiara sm:right-8 sm:top-6"
          >
            Intro überspringen
          </button>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lader === "an" && (
            <Ladefahrt key="ladefahrt" fortschritt={ladung} onFertig={() => setLader("aus")} />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
