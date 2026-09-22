import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import {
  FARBE,
  autoZeichnen,
  lochZeichnen,
  rehZeichnen,
  schluesselZeichnen,
  tanneZeichnen,
} from "./zeichnen";

/* ── Die Schwarzwaldstraße ──────────────────────────────────────────────────
   Eine Proberunde zum Zeitvertreib: Der rote Wagen fährt die Landstraße hoch,
   Rehe, Schlaglöcher und Gegenverkehr wollen ihm ans Blech.

   Gerechnet wird in einem festen Koordinatensystem (320 × 480). Der Canvas
   skaliert es auf seine tatsächliche Größe – so fährt sich das Spiel auf dem
   Telefon genau wie am Schreibtisch, und die Spielbalance hängt nicht an der
   Fenstergröße. */

const W = 320;
const H = 480;
const SPUREN = [85, 160, 235];
const AUTO_Y = H - 92;
const RAND = 48; // Fahrbahnkante links; rechts spiegelbildlich

const TEMPO_START = 175;
const TEMPO_MAX = 430;
const TEMPO_ZUWACHS = 24; // px/s pro Sekunde
const METER_JE_PIXEL = 0.32;
const LEBEN = 3;
const SCHUTZ_DAUER = 1.5; // Sekunden Unverwundbarkeit nach einem Treffer
const SCHLUESSEL_BONUS = 150; // Meter
const GEGENVERKEHR = 1.28; // Tempozuschlag für entgegenkommende Wagen

const BESTWERT_KEY = "gcn:schwarzwaldfahrt:bestwert";

type Art = "reh" | "loch" | "gegenverkehr";
type Hindernis = { art: Art; spur: number; y: number; weg: boolean };
type Schluessel = { spur: number; y: number };
type Funke = { x: number; y: number; t: number };
type Phase = "bereit" | "fahrt" | "ende";

type Welt = {
  zeit: number;
  tempo: number;
  meter: number;
  leben: number;
  spur: number;
  x: number;
  schutz: number;
  strich: number;
  hindernisse: Hindernis[];
  schluessel: Schluessel[];
  funken: Funke[];
  baeume: { x: number; y: number; s: number }[];
  bisHindernis: number;
  bisSchluessel: number;
  freieSpur: number;
};

/* Die Trefferflächen sind etwas kleiner als die Bilder: Ein Spiel, das knapp
   vorbei als Treffer wertet, fühlt sich ungerecht an. */
const MASSE: Record<Art, { w: number; h: number }> = {
  reh: { w: 30, h: 20 },
  loch: { w: 30, h: 14 },
  gegenverkehr: { w: 26, h: 48 },
};

/* Die Tannen stehen im Grünstreifen, nie auf der Fahrbahn: Ein Baum, den die
   Straße halb abschneidet, sieht nach Fehler aus, nicht nach Wald. */
function baumplatz() {
  const s = 0.55 + Math.random() * 0.35;
  const abstand = 8 + Math.random() * (RAND - 22);
  return {
    x: Math.random() < 0.5 ? abstand : W - abstand,
    s,
  };
}

function neueWelt(): Welt {
  const baeume: Welt["baeume"] = [];
  for (let i = 0; i < 14; i++) {
    baeume.push({
      ...baumplatz(),
      y: Math.random() * (H + 60) - 30,
    });
  }
  return {
    zeit: 0,
    tempo: TEMPO_START,
    meter: 0,
    leben: LEBEN,
    spur: 1,
    x: SPUREN[1],
    schutz: 0,
    strich: 0,
    hindernisse: [],
    schluessel: [],
    funken: [],
    baeume,
    bisHindernis: 1.5,
    bisSchluessel: 2.6,
    freieSpur: 1,
  };
}

function kmText(meter: number) {
  return `${(meter / 1000).toFixed(1).replace(".", ",")} km`;
}

function bestwertLesen() {
  try {
    const roh = window.localStorage.getItem(BESTWERT_KEY);
    return roh ? Number(roh) || 0 : 0;
  } catch {
    return 0;
  }
}

export function Schwarzwaldfahrt({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buehneRef = useRef<HTMLDivElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const welt = useRef<Welt>(neueWelt());
  const raf = useRef(0);
  const zuletzt = useRef(0);
  const phaseRef = useRef<Phase>("bereit");

  const [phase, setPhaseState] = useState<Phase>("bereit");
  const [leben, setLeben] = useState(LEBEN);
  const [ergebnis, setErgebnis] = useState(0);
  const [bestwert, setBestwert] = useState(0);

  useEffect(() => setBestwert(bestwertLesen()), []);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  // ── Zeichnen ──────────────────────────────────────────────────────────────

  const zeichne = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = welt.current;

    ctx.fillStyle = FARBE.umland;
    ctx.fillRect(0, 0, W, H);

    // Bäume hinter der Fahrbahnkante
    for (const baum of w.baeume) tanneZeichnen(ctx, baum.x, baum.y, baum.s);

    ctx.fillStyle = FARBE.strasse;
    ctx.fillRect(RAND, 0, W - RAND * 2, H);

    // Randlinien
    ctx.fillStyle = "rgba(242,234,218,0.5)";
    ctx.fillRect(RAND + 5, 0, 2, H);
    ctx.fillRect(W - RAND - 7, 0, 2, H);

    // Mittelstreifen – ihr Lauf macht das Tempo sichtbar.
    ctx.fillStyle = "rgba(242,234,218,0.62)";
    for (const x of [123, 197]) {
      for (let y = (w.strich % 56) - 56; y < H; y += 56) {
        ctx.fillRect(x - 1.5, y, 3, 30);
      }
    }

    for (const s of w.schluessel) schluesselZeichnen(ctx, SPUREN[s.spur], s.y, w.zeit);

    for (const h of w.hindernisse) {
      const x = SPUREN[h.spur];
      if (h.art === "reh") rehZeichnen(ctx, x, h.y);
      else if (h.art === "loch") lochZeichnen(ctx, x, h.y);
      else autoZeichnen(ctx, x, h.y, FARBE.alluminio, true);
    }

    // Der eigene Wagen blinkt, solange der Schutz nach einem Treffer läuft.
    const sichtbar = w.schutz <= 0 || Math.floor(w.zeit * 12) % 2 === 0;
    if (sichtbar) autoZeichnen(ctx, w.x, AUTO_Y, FARBE.rosso);

    for (const f of w.funken) {
      ctx.strokeStyle = `rgba(200,16,46,${Math.max(0, 1 - f.t * 2.4)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 8 + f.t * 60, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  // ── Ein Schritt der Fahrt ─────────────────────────────────────────────────

  const schritt = useCallback(
    (dt: number) => {
      const w = welt.current;
      w.zeit += dt;
      w.tempo = Math.min(TEMPO_MAX, w.tempo + TEMPO_ZUWACHS * dt);
      const weg = w.tempo * dt;
      w.meter += weg * METER_JE_PIXEL;
      w.strich += weg;
      if (w.schutz > 0) w.schutz -= dt;

      if (kmRef.current) kmRef.current.textContent = kmText(w.meter);

      // Der Wagen zieht weich auf seine Spur, statt zu springen.
      const ziel = SPUREN[w.spur];
      w.x += (ziel - w.x) * Math.min(1, dt * 14);

      for (const baum of w.baeume) {
        baum.y += weg;
        if (baum.y > H + 30) {
          Object.assign(baum, baumplatz(), { y: -30 - Math.random() * 40 });
        }
      }

      /* Gegenverkehr kommt uns entgegen und ist darum schneller da. Viel mehr
         als dieser Zuschlag geht nicht: Sonst holt eine Welle die vorige ein
         und stellt zwei Sperren gleichzeitig vor den Wagen. */
      for (const h of w.hindernisse) h.y += h.art === "gegenverkehr" ? weg * GEGENVERKEHR : weg;
      for (const s of w.schluessel) s.y += weg;
      for (const f of w.funken) f.t += dt;

      // Kollisionen
      if (w.schutz <= 0) {
        for (const h of w.hindernisse) {
          if (h.weg) continue;
          const m = MASSE[h.art];
          const dx = Math.abs(SPUREN[h.spur] - w.x);
          const dy = Math.abs(h.y - AUTO_Y);
          if (dx < (m.w + 24) / 2 && dy < (m.h + 44) / 2) {
            h.weg = true;
            w.schutz = SCHUTZ_DAUER;
            w.leben -= 1;
            w.funken.push({ x: w.x, y: AUTO_Y, t: 0 });
            setLeben(w.leben);
            if (w.leben <= 0) {
              const gefahren = Math.round(w.meter);
              setErgebnis(gefahren);
              setPhase("ende");
              if (gefahren > bestwertLesen()) {
                try {
                  window.localStorage.setItem(BESTWERT_KEY, String(gefahren));
                } catch {
                  /* Privater Modus: dann eben ohne Bestwert. */
                }
                setBestwert(gefahren);
              }
            }
            break;
          }
        }
      }

      for (let i = w.schluessel.length - 1; i >= 0; i--) {
        const s = w.schluessel[i];
        if (Math.abs(SPUREN[s.spur] - w.x) < 26 && Math.abs(s.y - AUTO_Y) < 34) {
          w.meter += SCHLUESSEL_BONUS;
          w.funken.push({ x: SPUREN[s.spur], y: s.y, t: 0 });
          w.schluessel.splice(i, 1);
        }
      }

      w.hindernisse = w.hindernisse.filter((h) => h.y < H + 70 && !h.weg);
      w.schluessel = w.schluessel.filter((s) => s.y < H + 40);
      w.funken = w.funken.filter((f) => f.t < 0.42);

      // Nachschub
      w.bisHindernis -= dt;
      if (w.bisHindernis <= 0) {
        /* Die freie Spur wandert höchstens um eine Position weiter. So bleibt
           jede Welle erreichbar, auch wenn das Tempo schon hoch ist. */
        const schritte = [-1, 0, 1][Math.floor(Math.random() * 3)];
        w.freieSpur = Math.max(0, Math.min(2, w.freieSpur + schritte));

        const belegt = [0, 1, 2].filter((s) => s !== w.freieSpur);
        const anzahl = Math.random() < 0.42 ? 2 : 1;
        const arten: Art[] = ["reh", "loch", "gegenverkehr"];
        for (let i = 0; i < anzahl; i++) {
          const spur = belegt.splice(Math.floor(Math.random() * belegt.length), 1)[0];
          if (spur === undefined) break;
          w.hindernisse.push({
            art: arten[Math.floor(Math.random() * arten.length)],
            spur,
            y: -60 - i * 26,
            weg: false,
          });
        }
        /* Abstand in Strecke denken, nicht in Zeit – sonst rückt bei steigendem
           Tempo alles zusammen. Der Mindestwert ist so gewählt, dass selbst eine
           Gegenverkehrswelle bei Höchsttempo noch rund vier Zehntel nach ihrer
           Vorgängerin ankommt – genug für einen Spurwechsel. */
        w.bisHindernis = (250 + Math.random() * 130) / w.tempo;
      }

      w.bisSchluessel -= dt;
      if (w.bisSchluessel <= 0) {
        w.schluessel.push({ spur: w.freieSpur, y: -40 });
        w.bisSchluessel = 3.4 + Math.random() * 3.6;
      }
    },
    [setPhase],
  );

  // ── Schleife ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "fahrt") return;
    zuletzt.current = performance.now();
    const lauf = (jetzt: number) => {
      const dt = Math.min(0.034, (jetzt - zuletzt.current) / 1000);
      zuletzt.current = jetzt;
      schritt(dt);
      zeichne();
      if (phaseRef.current === "fahrt") raf.current = requestAnimationFrame(lauf);
    };
    raf.current = requestAnimationFrame(lauf);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, schritt, zeichne]);

  /* Wer den Tab wechselt, soll nicht blind gegen ein Reh fahren. */
  useEffect(() => {
    const onSicht = () => {
      if (document.hidden && phaseRef.current === "fahrt") setPhase("bereit");
    };
    document.addEventListener("visibilitychange", onSicht);
    return () => document.removeEventListener("visibilitychange", onSicht);
  }, [setPhase]);

  // ── Maßstab ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anpassen = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const breite = canvas.clientWidth || W;
      const hoehe = canvas.clientHeight || H;
      canvas.width = Math.round(breite * dpr);
      canvas.height = Math.round(hoehe * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      zeichne();
    };
    anpassen();
    const beobachter = new ResizeObserver(anpassen);
    beobachter.observe(canvas);
    return () => beobachter.disconnect();
  }, [zeichne]);

  // ── Steuerung ─────────────────────────────────────────────────────────────

  const lenken = useCallback((richtung: -1 | 1) => {
    const w = welt.current;
    if (phaseRef.current !== "fahrt") return;
    w.spur = Math.max(0, Math.min(2, w.spur + richtung));
  }, []);

  const starten = useCallback(() => {
    welt.current = neueWelt();
    setLeben(LEBEN);
    if (kmRef.current) kmRef.current.textContent = kmText(0);
    setPhase("fahrt");
    buehneRef.current?.focus();
  }, [setPhase]);

  useEffect(() => {
    const onTaste = (e: KeyboardEvent) => {
      /* Tasten nur abfangen, wenn sie dem Spiel gelten – sonst nimmt die
         Proberunde der Seite das Scrollen weg. */
      const gilt =
        phaseRef.current === "fahrt" ||
        (buehneRef.current?.contains(document.activeElement) ?? false);
      if (!gilt) return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        lenken(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        lenken(1);
      } else if (e.key === " " || e.key === "Enter") {
        if (phaseRef.current !== "fahrt") {
          e.preventDefault();
          starten();
        }
      }
    };
    window.addEventListener("keydown", onTaste);
    return () => window.removeEventListener("keydown", onTaste);
  }, [lenken, starten]);

  /* Auf dem Telefon wird getippt: linke Hälfte links, rechte Hälfte rechts. */
  const onTipp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== "fahrt") return;
    const rect = e.currentTarget.getBoundingClientRect();
    lenken(e.clientX - rect.left < rect.width / 2 ? -1 : 1);
  };

  const laeuft = phase === "fahrt";

  return (
    <div className={className}>
      {/* Armaturenbrett */}
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-asfalto">
            Kilometerstand
          </p>
          <p className="numeri text-2xl text-nero" style={{ fontWeight: 700 }}>
            <span ref={kmRef}>{kmText(phase === "ende" ? ergebnis : 0)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-asfalto">Blech</p>
          <div className="mt-1.5 flex justify-end gap-1.5" aria-label={`${leben} von ${LEBEN} Leben`}>
            {Array.from({ length: LEBEN }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i < leben ? "bg-rosso" : "bg-nero/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={buehneRef}
        tabIndex={0}
        role="application"
        aria-label="Die Schwarzwaldstraße – Minispiel. Mit den Pfeiltasten ausweichen, Leertaste startet."
        className="finestra relative overflow-hidden border border-linea bg-crema-scura outline-none focus-visible:ring-2 focus-visible:ring-rosso"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onTipp}
          className="block w-full touch-manipulation"
          style={{ aspectRatio: `${W} / ${H}` }}
          aria-hidden="true"
        />

        {/* Start- und Schlussbild liegen über der Straße, nicht auf ihr. */}
        {!laeuft && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-nero/72 px-6 text-center backdrop-blur-[2px]">
            {phase === "bereit" ? (
              <>
                <div>
                  <p
                    className="text-crema-chiara"
                    style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    Die Schwarzwaldstraße
                  </p>
                  <p className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-crema/80">
                    Rehen, Schlaglöchern und Gegenverkehr ausweichen. Schlüssel
                    bringen Extrakilometer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={starten}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rosso px-6 py-3 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Losfahren
                </button>
              </>
            ) : (
              <>
                <div aria-live="polite">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-crema/70">
                    Stehengeblieben nach
                  </p>
                  <p
                    className="numeri mt-1 text-crema-chiara"
                    style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {kmText(ergebnis)}
                  </p>
                  {bestwert > 0 && (
                    <p className="numeri mt-1 text-sm text-crema/75">
                      Bestwert: {kmText(bestwert)}
                      {ergebnis >= bestwert && " – neuer Rekord."}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={starten}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rosso px-6 py-3 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Nochmal
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Lenkung: auf dem Telefon der eigentliche Weg, am Schreibtisch der Hinweis. */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => lenken(-1)}
            disabled={!laeuft}
            aria-label="Nach links ausweichen"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara disabled:cursor-default disabled:border-linea-chiara disabled:text-alluminio disabled:hover:bg-transparent disabled:hover:text-alluminio"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => lenken(1)}
            disabled={!laeuft}
            aria-label="Nach rechts ausweichen"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara disabled:cursor-default disabled:border-linea-chiara disabled:text-alluminio disabled:hover:bg-transparent disabled:hover:text-alluminio"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="text-right text-xs text-asfalto">Tippen oder Pfeiltasten</p>
      </div>
    </div>
  );
}
