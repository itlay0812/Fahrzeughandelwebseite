import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Home, Phone } from "lucide-react";
import { SEO } from "./SEO";
import { Schwarzwaldfahrt } from "../game/Schwarzwaldfahrt";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const, delay },
});

export function NotFound() {
  return (
    <>
      <SEO
        title="Seite nicht gefunden – GCN Fahrzeughandel GbR"
        description="Diese Adresse führt ins Leere. Zurück zur Startseite von GCN Fahrzeughandel in St. Georgen im Schwarzwald."
        robots="noindex, follow"
      />

      <div className="flex-1 bg-crema px-4 py-14 text-nero sm:px-6 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Die Auskunft */}
          <motion.div {...fadeUp(0)}>
            <p className="numeri text-sm tracking-[0.3em] text-rosso">FEHLER 404</p>
            <h1 className="titolo-pagina mt-4 max-w-[15ch]">
              Diese Adresse steht nicht im Navi.
            </h1>
            <p className="mt-5 max-w-md text-asfalto">
              Die Seite, die Sie aufgerufen haben, gibt es nicht – vielleicht ein
              Tippfehler in der Adresse, vielleicht haben wir sie umgeparkt. Von
              hier aus kommen Sie in beide Richtungen weiter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rosso px-7 py-4 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98]"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Zur Startseite
              </Link>
              <Link
                to="/kontakt"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-nero/20 px-7 py-4 text-sm text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara"
              >
                Suchauftrag & Verkauf
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-10 border-t border-linea pt-7">
              <p className="text-sm text-asfalto">
                Sie suchen etwas Bestimmtes? Ein Anruf ist oft der kürzeste Weg.
              </p>
              <a
                href="tel:+4917641651086"
                className="group mt-3 inline-flex items-center gap-3 text-sm text-nero transition-colors hover:text-rosso"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rosso-wash text-rosso transition-colors group-hover:bg-rosso group-hover:text-crema-chiara">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="numeri">+49 176 41651086</span>
              </a>
            </div>
          </motion.div>

          {/* Die Wartezeit – ohne Kasten, die Straße sitzt direkt auf der Seite. */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-full max-w-[20.5rem] justify-self-center lg:w-[20.5rem] lg:justify-self-end"
          >
            <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-asfalto">
              Wenn Sie schon hier sind
            </p>
            <Schwarzwaldfahrt />
          </motion.div>
        </div>
      </div>
    </>
  );
}
