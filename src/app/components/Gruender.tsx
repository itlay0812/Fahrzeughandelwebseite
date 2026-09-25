import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tusche, type TuscheName } from "./Tusche";

export type Gruender = {
  name: string;
  age: number;
  role: string;
  bio: string;
  avatar: string;
};

export type Wert = { icon: TuscheName; label: string; text: string };

/**
 * „Zwei Experten, eine Leidenschaft.“ – Startseite und „Über uns“.
 * Links ein Bild mit beiden Gründern, rechts der Text zu beiden, darunter die
 * Werte ohne Kästen. Auf „Über uns“ ist die Überschrift die h1 der Seite.
 */
export function GruenderSektion({
  gruender,
  werte,
  ueberschrift = "h2",
  einleitung = "Hinter GCN stehen zwei Automobil-Experten aus dem Schwarzwald – ohne Verkaufsdruck, dafür mit einer klaren Einschätzung.",
  mehrLink = false,
}: {
  gruender: Gruender[];
  werte: Wert[];
  ueberschrift?: "h1" | "h2";
  einleitung?: string;
  mehrLink?: boolean;
}) {
  const Titel = ueberschrift;
  return (
    <>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Ein Bild: beide Gründer in einem gemeinsamen Rahmen. */}
        <figure className="lg:col-span-5">
          <div className="finestra grid grid-cols-2 gap-[3px] overflow-hidden bg-crema-chiara">
            {gruender.map((g) => (
              <ImageWithFallback
                key={g.name}
                src={g.avatar}
                alt={g.name}
                loading="lazy"
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ))}
          </div>
          <figcaption className="mt-3 grid grid-cols-2 gap-[3px] text-xs text-asfalto">
            {gruender.map((g) => (
              <span key={g.name}>{g.name.split(" ")[0]}</span>
            ))}
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <Titel
            id="wer"
            className={ueberschrift === "h1" ? "titolo-pagina max-w-2xl" : "max-w-xl"}
          >
            Zwei Experten, eine Leidenschaft.
          </Titel>
          <p className="mt-5 max-w-xl text-lg text-asfalto">{einleitung}</p>

          <div className="mt-9 border-t border-linea">
            {gruender.map((g) => (
              <article key={g.name} className="border-b border-linea py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[19px]">
                    {g.name}{" "}
                    <span className="numeri text-asfalto" style={{ fontWeight: 400 }}>
                      ({g.age})
                    </span>
                  </h3>
                  <p className="text-sm text-rosso">{g.role}</p>
                </div>
                <p className="mt-2 max-w-xl leading-relaxed text-asfalto">{g.bio}</p>
              </article>
            ))}
          </div>

          {mehrLink && (
            <Link
              to="/ueber-uns"
              className="group mt-7 inline-flex items-center gap-2 text-sm text-asfalto transition-colors hover:text-nero"
            >
              Mehr über uns erfahren
              <Tusche
                name="pfeil"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Werte – ohne Kästen, nur durch Luft und eine Linie getrennt */}
      <ul
        className={`mt-16 grid grid-cols-1 gap-x-12 gap-y-9 border-t border-linea pt-10 sm:mt-20 sm:grid-cols-2 ${
          werte.length === 4 ? "lg:grid-cols-4 lg:gap-x-10" : "lg:grid-cols-3"
        }`}
      >
        {werte.map((w) => (
          <li key={w.label} className="flex items-start gap-5">
            <Tusche name={w.icon} className="h-12 w-12 text-nero" />
            <div>
              <p className="text-[17px] leading-snug text-nero" style={{ fontWeight: 700 }}>
                {w.label}
              </p>
              <p className="mt-1.5 leading-relaxed text-asfalto">{w.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
