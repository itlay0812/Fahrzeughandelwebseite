import { Link } from "react-router";
import { ArrowRight, MapPin, ShieldCheck, Users } from "lucide-react";

/**
 * Der Hero-Text. Die Intro-Bühne zeigt ihn als letzten Frame, die echte
 * Hero-Sektion darunter zeigt ihn erneut – gleiches Markup, damit beim Lösen
 * des Sticky nichts springt. Nur das Überschriften-Tag unterscheidet sich:
 * die h1 gehört der echten Sektion.
 */
export function HeroContent({ as = "h1" }: { as?: "h1" | "p" }) {
  const Heading = as;
  return (
    <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-12">
      <div className="max-w-3xl">
        <Heading
          className="text-nero"
          style={
            as === "p"
              ? {
                  fontSize: "clamp(2.1rem, 1.3rem + 3.6vw, 4.5rem)",
                  overflowWrap: "break-word",
                  fontWeight: 700,
                  fontStretch: "112%",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.04,
                  textWrap: "balance",
                }
              : undefined
          }
        >
          Ihr persönlicher Fahrzeugexperte.
        </Heading>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-asfalto sm:text-xl">
          Wir suchen, prüfen und verhandeln Ihr nächstes Fahrzeug – oder
          verkaufen Ihr aktuelles. Sie treffen die Entscheidung, den Rest
          übernehmen wir.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/kontakt?type=search"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-rosso px-8 py-4 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
          >
            Auftrag erstellen
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <Link
            to="/bestand"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-nero/20 bg-crema-chiara/70 px-8 py-4 text-sm text-nero backdrop-blur-sm transition-colors hover:border-nero/40 hover:bg-crema-chiara active:scale-[0.98]"
          >
            Fahrzeugbestand ansehen
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-asfalto">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-rosso" aria-hidden="true" />
            Mindestens 12 Monate Garantie
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-rosso" aria-hidden="true" />
            Ein fester Ansprechpartner
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-rosso" aria-hidden="true" />
            St. Georgen im Schwarzwald, bundesweit tätig
          </li>
        </ul>
      </div>
    </div>
  );
}

/** Der Creme-Schleier, der den Text von der Kulisse abhebt. */
export function HeroVeil() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-crema via-crema/80 to-transparent sm:w-[62%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-crema/85 to-transparent"
      />
    </>
  );
}
