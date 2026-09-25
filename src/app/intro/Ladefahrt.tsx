import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue } from "motion/react";
import { FIRST_FRAME } from "./ScrollFilm";

/**
 * Ladebildschirm vor der Scroll-Fahrt: ein kleiner Wagen auf einem Strich,
 * dahinter der erste Frame der Fahrt, unscharf. Der Wagen fährt so weit, wie
 * die Bilder tatsächlich geladen sind. Steht er am Ende des Strichs, blendet
 * die Unschärfe weg – darunter steht derselbe Frame scharf.
 *
 * Bewegung läuft über Refs in einer rAF-Schleife, React rendert dabei nicht.
 */

const HOECHSTDAUER = 10; // s – danach fährt er durch, auch ohne volle Ladung
const ROLLEN = 0.25; // so viel vom Strich rollt er, während noch geladen wird
const GLAETTUNG = 0.35; // s – glättet die paketweise ankommenden Bilder
const SPRINT = 1.5; // s – vom Ende des Ladens bis ins Ziel
const K = 3.4; // Steilheit der Beschleunigung

/* Exponentielles Ease-in: langsam anrollen, dann immer schneller bis ins Ziel. */
const kurve = (u: number) => (Math.exp(K * u) - 1) / (Math.exp(K) - 1);
const steigung = (u: number) => (K * Math.exp(K * u)) / (Math.exp(K) - 1);

function Wagen({
  radHintenRef,
  radVorneRef,
}: {
  radHintenRef: React.Ref<SVGGElement>;
  radVorneRef: React.Ref<SVGGElement>;
}) {
  const rad = (cx: number, ref: React.Ref<SVGGElement>) => (
    <g>
      <circle cx={cx} cy="66" r="17" fill="#17120f" />
      <g ref={ref}>
        <circle cx={cx} cy="66" r="9.5" fill="#d9d2c4" />
        {[0, 72, 144, 216, 288].map((w) => (
          <rect
            key={w}
            x={cx - 1.6}
            y="57.5"
            width="3.2"
            height="8.5"
            rx="1.4"
            fill="#6b6356"
            transform={`rotate(${w} ${cx} 66)`}
          />
        ))}
      </g>
    </g>
  );

  return (
    <svg viewBox="0 0 240 83" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path d="M30 66 a24 24 0 0 1 48 0 Z M166 66 a24 24 0 0 1 48 0 Z" fill="#1a1512" />
      <path
        d="M10 66 L8 55 Q9 46 26 44 L66 40 Q90 22 122 20 Q150 19 166 33 L180 42 Q216 44 229 51 Q235 55 233 63 L231 66 L214 66 a22 22 0 0 0 -48 0 L78 66 a22 22 0 0 0 -48 0 Z"
        fill="#c8102e"
      />
      <path d="M76 40 Q96 26 122 25 Q144 25 158 38 L160 40 Z" fill="#fbf7f0" opacity="0.92" />
      <path d="M121 25 L124 40" stroke="#c8102e" strokeWidth="3.5" />
      <path d="M222 49 Q230 51 231 55 L222 54 Z" fill="#fbf7f0" />
      <rect x="8.5" y="48" width="6" height="5" rx="1.5" fill="#5c0614" />
      {rad(54, radHintenRef)}
      {rad(190, radVorneRef)}
    </svg>
  );
}

export function Ladefahrt({
  fortschritt,
  onFertig,
}: {
  /** Tatsächlich geladener Anteil der Filmbilder, 0–1. */
  fortschritt: MotionValue<number>;
  onFertig: () => void;
}) {
  const strichRef = useRef<HTMLDivElement>(null);
  const spurRef = useRef<HTMLDivElement>(null);
  const wagenRef = useRef<HTMLDivElement>(null);
  const radHintenRef = useRef<SVGGElement>(null);
  const radVorneRef = useRef<SVGGElement>(null);
  const onFertigRef = useRef(onFertig);
  onFertigRef.current = onFertig;
  const [ansage, setAnsage] = useState(0); // für Screenreader, in Vierteln

  useEffect(() => {
    const start = performance.now();
    let letzte = start;
    let raf = 0;
    let rollen = 0; // geglätteter Ladestand, 0–1
    let sprintStart = 0; // Zeitpunkt, ab dem alles geladen ist
    let sprintVon = 0; // Anteil, von dem aus der Sprint beginnt
    let radWinkel = 0;
    let angekommen = false;
    let letzteAnsage = 0;

    let breite = strichRef.current?.clientWidth ?? 300;
    let wagenBreite = wagenRef.current?.offsetWidth ?? 64;
    const messen = () => {
      breite = strichRef.current?.clientWidth ?? 300;
      wagenBreite = wagenRef.current?.offsetWidth ?? 64;
    };
    window.addEventListener("resize", messen);

    const schritt = (jetzt: number) => {
      const dt = Math.min(0.05, (jetzt - letzte) / 1000);
      letzte = jetzt;
      const alles = fortschritt.get() >= 1 || (jetzt - start) / 1000 > HOECHSTDAUER;

      /* Phase 1: Während geladen wird, rollt der Wagen langsam an – geglättet,
         damit die in Paketen eintreffenden Bilder kein Stottern erzeugen. */
      rollen += (Math.min(1, fortschritt.get()) - rollen) * (1 - Math.exp(-dt / GLAETTUNG));
      let anteil = ROLLEN * rollen;
      let tempoAnteil = 0; // Strecken-Anteil pro Sekunde, für die Räder

      /* Phase 2: Alles geladen – ab hier exponentiell schneller bis ins Ziel. */
      if (alles && !sprintStart) {
        sprintStart = jetzt;
        sprintVon = anteil;
      }
      let u = 0;
      if (sprintStart) {
        u = Math.min(1, (jetzt - sprintStart) / 1000 / SPRINT);
        anteil = sprintVon + (1 - sprintVon) * kurve(u);
        tempoAnteil = ((1 - sprintVon) * steigung(u)) / SPRINT;
      } else {
        tempoAnteil = ((Math.min(1, fortschritt.get()) - rollen) * ROLLEN) / GLAETTUNG;
      }

      /* Die Nase des Wagens zeigt den Anteil: bei 100 % steht sie am Strichende. */
      const bahn = Math.max(0, breite - wagenBreite);
      const x = anteil * bahn;
      const tempoPx = angekommen ? 0 : tempoAnteil * bahn;
      const radPx = (17 / 240) * wagenBreite;
      radWinkel = (radWinkel + ((tempoPx * dt) / (2 * Math.PI * radPx)) * 360) % 360;
      const wippen = angekommen ? 0 : Math.sin(jetzt / 55) * Math.min(0.6, tempoPx / 900);

      if (wagenRef.current) wagenRef.current.style.transform = `translate3d(${x}px, ${wippen}px, 0)`;
      radHintenRef.current?.setAttribute("transform", `rotate(${radWinkel} 54 66)`);
      radVorneRef.current?.setAttribute("transform", `rotate(${radWinkel} 190 66)`);
      if (spurRef.current && breite) {
        spurRef.current.style.transform = `scaleX(${Math.min(1, (x + wagenBreite) / breite)})`;
      }

      const viertel = Math.floor(anteil * 4);
      if (viertel !== letzteAnsage) {
        letzteAnsage = viertel;
        setAnsage(viertel);
      }

      /* Am Strichende: sofort ausblenden, die Bewegung geht in den Fokuszug über. */
      if (!angekommen && sprintStart && u >= 1) {
        angekommen = true;
        onFertigRef.current();
      }

      raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", messen);
    };
  }, [fortschritt]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Die Fahrt wird geladen"
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-crema"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.3 }}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {`${ansage * 25} Prozent geladen.`}
      </p>

      {/* Erster Frame der Fahrt, unscharf */}
      <img
        src={FIRST_FRAME}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        style={{ filter: "blur(22px) saturate(0.9)" }}
      />
      <div className="absolute inset-0 bg-crema/45" aria-hidden="true" />

      {/* Der Strich mit dem Wagen */}
      <div className="relative w-[min(340px,70vw)]">
        <div
          ref={wagenRef}
          className="absolute bottom-full left-0 will-change-transform"
          style={{ width: "clamp(52px, 5vw, 68px)" }}
        >
          <Wagen radHintenRef={radHintenRef} radVorneRef={radVorneRef} />
        </div>
        <div ref={strichRef} className="relative h-[2px] w-full overflow-hidden rounded-full bg-nero/20">
          <div
            ref={spurRef}
            className="absolute inset-0 origin-left rounded-full bg-rosso"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
