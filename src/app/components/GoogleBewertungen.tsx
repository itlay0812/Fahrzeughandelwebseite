import { useLayoutEffect, useRef, useState } from "react";
import { GOOGLE_BEWERTEN_URL, GOOGLE_PROFIL_URL } from "../firma";
import { KUNDENSTIMMEN, type Kundenstimme } from "../kundenstimmen";
import { Tusche } from "./Tusche";

/* Leicht verdreht und überlappend, damit die Reihe gesetzt wirkt, nicht gestempelt. */
const STERN_DREHUNG = [-7, 4, -3, 6, -2];

function Sterne({ wert, dekorativ = false }: { wert: number; dekorativ?: boolean }) {
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
          <Tusche name="stern" className={`h-7 w-7 ${i < voll ? "text-rosso" : "text-linea"}`} />
        </span>
      ))}
    </span>
  );
}

function Kachel({ stimme }: { stimme: Kundenstimme }) {
  const [klein] = stimme.foto.quellen;
  /* Lange Bewertungen werden gekürzt, damit die Kacheln gleich hoch bleiben.
     Der Knopf erscheint nur, wenn der Text wirklich abgeschnitten ist. */
  const textRef = useRef<HTMLParagraphElement>(null);
  const [offen, setOffen] = useState(false);
  const [gekuerzt, setGekuerzt] = useState(false);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || offen) return;
    const pruefen = () => setGekuerzt(el.scrollHeight > el.clientHeight + 2);
    pruefen();
    const beobachter = new ResizeObserver(pruefen);
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [offen]);
  return (
    <li className="finestra flex flex-col overflow-hidden border border-linea bg-crema-chiara">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-linea bg-crema-scura">
        <img
          src={klein[1]}
          srcSet={stimme.foto.quellen.map(([b, url]) => `${url} ${b}w`).join(", ")}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          width={klein[0]}
          height={Math.round((klein[0] * 3) / 4)}
          alt={stimme.foto.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <figure className="flex flex-1 flex-col p-7 sm:p-8">
        <Sterne wert={stimme.sterne} />
        <blockquote className="mt-5 flex-1">
          <p
            ref={textRef}
            id={`stimme-${stimme.name.replace(/\s+/g, "-")}`}
            className={`whitespace-pre-line text-[17px] leading-relaxed text-nero ${offen ? "" : "line-clamp-6"}`}
          >
            „{stimme.text}“
          </p>
          {(gekuerzt || offen) && (
            <button
              type="button"
              onClick={() => setOffen(!offen)}
              aria-expanded={offen}
              aria-controls={`stimme-${stimme.name.replace(/\s+/g, "-")}`}
              className="mt-3 text-sm text-rosso underline underline-offset-4 transition-colors hover:text-rosso-scuro"
            >
              {offen ? "Weniger anzeigen" : "Ganze Bewertung lesen"}
            </button>
          )}
        </blockquote>
        <figcaption className="mt-6 border-t border-linea-chiara pt-5">
          <p className="text-[15px] text-nero" style={{ fontWeight: 600 }}>
            {stimme.name}
          </p>
          <p className="mt-0.5 text-sm text-alluminio">{stimme.fahrzeug}</p>
        </figcaption>
      </figure>
    </li>
  );
}

/**
 * Kundenstimmen unter „Unser Versprechen an Sie“ –
 * fest hinterlegt in kundenstimmen.ts, jeweils mit Foto des Autos. Darunter
 * der Aufruf, selbst eine Bewertung auf Google zu schreiben.
 */
export function GoogleBewertungen() {
  const stimmen = KUNDENSTIMMEN.filter((k) => k.text.trim());

  return (
    <section className="bg-crema-chiara" aria-labelledby="kundenstimmen">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-12">
        <h2 id="kundenstimmen" className="max-w-xl border-b border-linea pb-9">
          Das sagen unsere Kunden.
        </h2>

        {stimmen.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stimmen.map((stimme) => (
              <Kachel key={stimme.name} stimme={stimme} />
            ))}
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
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={GOOGLE_BEWERTEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-rosso px-6 py-3.5 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
          >
            <Tusche
              name="fueller"
              className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
            />
            Bewertung schreiben
          </a>
          <a
            href={GOOGLE_PROFIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 text-sm text-asfalto transition-colors hover:text-nero"
          >
            Alle Bewertungen auf Google
            <Tusche
              name="pfeil"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
