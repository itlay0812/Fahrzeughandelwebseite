import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { GOOGLE_BEWERTEN_URL, GOOGLE_PROFIL_URL } from "../firma";
import { Tusche } from "./Tusche";
import { BEWERTUNGSBILDER, type Bewertungsbild } from "../bewertungsbilder";

type Bewertung = {
  autor: string;
  autorUrl: string | null;
  sterne: number | null;
  text: string;
  /** ISO-Datum; daraus wird „vor …“ berechnet, damit auch ein gespeicherter Stand stimmt. */
  datum?: string | null;
  zeit: string;
  url: string | null;
};

type Daten = {
  sterne: number | null;
  anzahl: number;
  profilUrl: string | null;
  reviews: Bewertung[];
};

type Zustand = { art: "laden" } | { art: "fertig"; daten: Daten | null };

/* „vor 3 Wochen“ aus dem Datum – Googles eigener Text veraltet im gespeicherten Stand. */
function vorWann(r: Bewertung) {
  if (!r.datum) return r.zeit;
  const tage = (Date.parse(r.datum) - Date.now()) / 86_400_000;
  if (!Number.isFinite(tage)) return r.zeit;
  const format = new Intl.RelativeTimeFormat("de", { numeric: "auto" });
  if (tage > -1) return "heute";
  if (tage > -7) return format.format(Math.round(tage), "day");
  if (tage > -30) return format.format(Math.round(tage / 7), "week");
  if (tage > -365) return format.format(Math.round(tage / 30.4), "month");
  return format.format(Math.round(tage / 365), "year");
}

/* Foto zum Google-Namen – unempfindlich gegen Groß-/Kleinschreibung und Akzente. */
const normal = (name: string) =>
  name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
function fotoFuer(autor: string): Bewertungsbild | undefined {
  const gesucht = normal(autor);
  const treffer = Object.keys(BEWERTUNGSBILDER).find((name) => normal(name) === gesucht);
  return treffer ? BEWERTUNGSBILDER[treffer] : undefined;
}

function istDaten(json: unknown): json is Daten & { ok: true } {
  const d = json as { ok?: boolean; reviews?: unknown };
  return Boolean(d?.ok && Array.isArray(d.reviews));
}

/* Leicht verdreht und überlappend, damit die Reihe gesetzt wirkt, nicht gestempelt. */
const STERN_DREHUNG = [-7, 4, -3, 6, -2];

function Sterne({
  wert,
  groesse = "h-7 w-7",
  dekorativ = false,
}: {
  wert: number;
  groesse?: string;
  /** Reine Zierde (z. B. im Leerzustand) – dann liest kein Screenreader eine Wertung vor. */
  dekorativ?: boolean;
}) {
  const voll = Math.round(wert);
  return (
    <span
      className="flex items-center -space-x-1"
      role={dekorativ ? undefined : "img"}
      aria-hidden={dekorativ || undefined}
      aria-label={dekorativ ? undefined : `${wert.toLocaleString("de-DE")} von 5 Sternen`}
    >
      {STERN_DREHUNG.map((grad, i) => (
        <span key={i} style={{ transform: `rotate(${grad}deg)` }}>
          <Tusche name="stern" className={`${groesse} ${i < voll ? "text-rosso" : "text-linea"}`} />
        </span>
      ))}
    </span>
  );
}

/* Holt den aktuellen Stand: live über Supabase, bei Ausfall den beim Build
   gesicherten letzten Stand (bewertungen.json). */
function useBewertungen(): Zustand {
  const [zustand, setZustand] = useState<Zustand>({ art: "laden" });

  useEffect(() => {
    /* Nicht ins vorgerenderte HTML übernehmen: Die Sektion zeigt immer den
       Stand zum Zeitpunkt des Besuchs. */
    if (navigator.webdriver) {
      setZustand({ art: "fertig", daten: null });
      return;
    }
    const controller = new AbortController();
    const holen = (url: string, init: RequestInit = {}) =>
      fetch(url, { ...init, signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });

    (async () => {
      try {
        const live = await holen(
          `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/bewertungen`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } },
        );
        /* Supabase antwortet: Das ist der aktuelle Stand, auch wenn er leer ist. */
        if (istDaten(live)) {
          setZustand({ art: "fertig", daten: live });
          return;
        }
      } catch {
        if (controller.signal.aborted) return;
      }
      try {
        const stand = await holen(`${import.meta.env.BASE_URL}bewertungen.json`);
        setZustand({ art: "fertig", daten: istDaten(stand) ? stand : null });
      } catch {
        if (!controller.signal.aborted) setZustand({ art: "fertig", daten: null });
      }
    })();
    return () => controller.abort();
  }, []);

  return zustand;
}

/**
 * Kundenstimmen unter „Vertrauen entsteht durch persönliche Betreuung“:
 * Sterne und Anzahl aus dem Google-Profil (alle Bewertungen), darunter die
 * geschriebenen 5-Sterne-Bewertungen als Kacheln, dazu der Aufruf zum Bewerten.
 * Ohne Bewertungen bleibt die Sektion stehen und lädt zur ersten ein.
 */
export function GoogleBewertungen() {
  const zustand = useBewertungen();
  const daten = zustand.art === "fertig" ? zustand.daten : null;
  const reviews = daten?.reviews ?? [];
  const wertung = daten && daten.sterne !== null && daten.anzahl > 0 ? daten.sterne : null;

  return (
    <section className="bg-crema" aria-labelledby="kundenstimmen">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-linea pb-9 md:flex-row md:items-end">
          <h2 id="kundenstimmen" className="max-w-xl">
            Das sagen unsere Kunden.
          </h2>

          {zustand.art === "laden" && (
            <div className="h-14 w-56 animate-pulse rounded-2xl bg-crema-scura" aria-hidden="true" />
          )}
          {wertung !== null && daten && (
            <div className="flex items-center gap-4">
              <span
                className="numeri leading-none text-nero"
                style={{ fontSize: "clamp(2.4rem, 1.8rem + 2vw, 3.4rem)", fontWeight: 700 }}
              >
                {wertung.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <div>
                <Sterne wert={wertung} groesse="h-8 w-8" />
                <p className="mt-1.5 text-sm text-asfalto">
                  <span className="numeri text-nero" style={{ fontWeight: 700 }}>
                    {daten.anzahl}
                  </span>{" "}
                  {daten.anzahl === 1 ? "Bewertung" : "Bewertungen"} auf Google
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Kacheln */}
        {zustand.art === "laden" ? (
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="finestra h-[26rem] animate-pulse border border-linea bg-crema-chiara" />
            ))}
          </ul>
        ) : reviews.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((r, i) => {
              const foto = fotoFuer(r.autor);
              return (
                <li
                  key={`${r.autor}-${i}`}
                  className="finestra flex flex-col overflow-hidden border border-linea bg-crema-chiara"
                >
                  {/* Das Auto zur Bewertung – ohne Foto ein gezeichnetes */}
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-linea bg-crema-scura">
                    {foto ? (
                      <img
                        src={foto.quellen[0][1]}
                        srcSet={foto.quellen.map(([b, url]) => `${url} ${b}w`).join(", ")}
                        sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                        width={foto.quellen[0][0]}
                        height={Math.round((foto.quellen[0][0] * 3) / 4)}
                        alt={foto.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center" aria-hidden="true">
                        <Tusche name="auto" className="h-20 w-52 text-nero/70" />
                        <span className="mt-1 h-[2px] w-52 rounded-full bg-nero/15" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <Sterne wert={r.sterne ?? 5} />
                    <blockquote className="mt-5 flex-1">
                      <p className="line-clamp-[8] text-lg leading-relaxed text-nero">„{r.text}“</p>
                    </blockquote>
                    <p className="mt-6 border-t border-linea-chiara pt-5 text-[15px] text-nero" style={{ fontWeight: 600 }}>
                      {r.autorUrl ? (
                        <a href={r.autorUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {r.autor}
                        </a>
                      ) : (
                        r.autor
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-alluminio">{vorWann(r)} auf Google</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="finestra mt-10 border border-linea bg-crema-chiara p-7 sm:p-9">
            <Sterne wert={5} dekorativ />
            <p className="mt-4 text-[17px] text-nero" style={{ fontWeight: 700 }}>
              Ihre Stimme könnte die erste hier sein.
            </p>
            <p className="mt-1.5 max-w-xl text-asfalto">
              Sie haben mit uns ein Fahrzeug gesucht, gekauft oder verkauft? Dann freuen wir uns
              über ein paar Sätze auf Google – das hilft anderen bei der Entscheidung.
            </p>
          </div>
        )}

        {/* Aufruf zum Bewerten */}
        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={GOOGLE_BEWERTEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-rosso px-6 py-3.5 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
            >
              <Tusche name="fueller" className="h-5 w-5 shrink-0" />
              Bewertung schreiben
            </a>
            <a
              href={daten?.profilUrl ?? GOOGLE_PROFIL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 text-sm text-asfalto transition-colors hover:text-nero"
            >
              Alle Bewertungen auf Google
              <Tusche name="pfeil" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          {reviews.length > 0 && (
            <p className="max-w-md text-xs leading-relaxed text-asfalto md:text-right">
              Wir zeigen nur 5-Sterne-Bewertungen mit Text. Durchschnitt und Anzahl umfassen alle
              Bewertungen. Wir prüfen nicht, ob die Verfasser Kunden von uns waren.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
