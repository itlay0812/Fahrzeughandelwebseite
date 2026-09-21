import { Outlet, Link, useLocation } from "react-router";
import logoSvg from "../../assets/gcn-logo.svg";
import logoSvgHell from "../../assets/gcn-logo-hell.svg";
import { Mail, Phone, Instagram, Menu, X, MapPin, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import GisslerBranding from "./GisslerBranding";
import { useEffect, useState } from "react";
import { IntroProvider, useIntro } from "../intro/IntroContext";

const NAV_LINKS = [
  { name: "Startseite", path: "/" },
  { name: "Fahrzeugbestand", path: "/bestand" },
  { name: "Suchauftrag & Verkauf", path: "/kontakt" },
  { name: "Über uns", path: "/ueber-uns" },
];

export function Layout() {
  return (
    <IntroProvider>
      <Chrome />
    </IntroProvider>
  );
}

function Chrome() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { phase, registerLogo } = useIntro();

  /* Während der Kamerafahrt gehört der Bildschirm dem Auto. */
  const chromeHidden = phase === "running";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col bg-crema font-sans text-nero">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-nero focus:px-5 focus:py-3 focus:text-sm focus:text-crema-chiara"
      >
        Zum Inhalt springen
      </a>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-[100] border-b border-linea bg-crema-chiara/92 backdrop-blur-md"
        aria-hidden={chromeHidden}
        style={{
          opacity: chromeHidden ? 0 : 1,
          visibility: chromeHidden ? "hidden" : "visible",
          transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-10">
          <Link
            to="/"
            className="z-10 flex shrink-0 items-center transition-opacity hover:opacity-70"
            aria-label="GCN Fahrzeughandel GbR – zur Startseite"
          >
            <img
              ref={registerLogo}
              src={logoSvg}
              alt="GCN Fahrzeughandel GbR"
              className="h-[32px] w-auto object-contain md:h-[38px]"
              width={1043}
              height={447}
            />
          </Link>

          <nav
            aria-label="Hauptnavigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex lg:gap-9"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`whitespace-nowrap border-b-2 pb-0.5 text-[15px] transition-colors ${
                  isActive(link.path)
                    ? "border-rosso text-nero"
                    : "border-transparent text-asfalto hover:text-nero"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+4917641651086"
              className="hidden items-center gap-2 rounded-full border border-linea px-4 py-2.5 text-sm text-nero transition-colors hover:border-nero/30 hover:bg-crema sm:inline-flex"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="numeri">0176 41651086</span>
            </a>
            <Link
              to="/kontakt?type=search"
              className="hidden items-center gap-2 rounded-full bg-rosso px-5 py-2.5 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.98] lg:inline-flex"
            >
              Auftrag erstellen
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>

            <a
              href="tel:+4917641651086"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rosso text-crema-chiara transition-colors hover:bg-rosso-scuro sm:hidden"
              aria-label="GCN anrufen"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-colors hover:bg-crema md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </header>


      {/* ── Vollbild-Menü ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[110] bg-crema-chiara md:hidden"
            initial={{ clipPath: "circle(0px at calc(100% - 2.2rem) 2.2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.2rem) 2.2rem)" }}
            exit={{ clipPath: "circle(0px at calc(100% - 2.2rem) 2.2rem)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
          >
            <div className="flex h-full flex-col px-5 pb-8 pt-4">
              <div className="flex items-center justify-between">
                <img
                  src={logoSvg}
                  alt="GCN Fahrzeughandel GbR"
                  className="h-[40px] w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Menü schließen"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-linea text-nero transition-colors hover:bg-crema"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Hauptnavigation" className="mt-12 flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -44 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.15 } }}
                    transition={{
                      delay: 0.12 + i * 0.07,
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive(link.path) ? "page" : undefined}
                      className={`flex items-baseline gap-4 border-b border-linea-chiara py-5 transition-colors ${
                        isActive(link.path) ? "text-rosso" : "text-nero"
                      }`}
                      style={{
                        fontSize: "clamp(1.9rem, 1.3rem + 3vw, 2.6rem)",
                        fontWeight: 700,
                        fontStretch: "108%",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {isActive(link.path) && (
                        <span aria-hidden="true" className="h-[3px] w-6 self-center bg-rosso" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + NAV_LINKS.length * 0.07, duration: 0.5 }}
                className="mt-auto flex flex-col gap-4"
              >
                <Link
                  to="/kontakt?type=search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rosso px-6 py-4 text-sm text-crema-chiara"
                >
                  Auftrag erstellen
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <div className="flex flex-col gap-3 text-sm">
                  <a
                    href="tel:+4917641651086"
                    className="flex items-center gap-3 text-nero"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rosso-wash text-rosso">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="numeri">0176 41651086</span>
                  </a>
                  <a
                    href="mailto:gcn-farzeughandel@outlook.de"
                    className="flex items-center gap-3 text-nero"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rosso-wash text-rosso">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    gcn-farzeughandel@outlook.de
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="inhalt" className="flex flex-grow flex-col">
        {/* Platzhalter für die fixierte Kopfzeile. Bleibt konstant, damit das
            Intro am Ende nichts verschiebt – es zieht sich selbst darüber. */}
        <div style={{ height: "var(--header-h)" }} aria-hidden="true" />
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-nero pb-8 pt-14 text-crema">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-5">
              <Link to="/" className="w-fit transition-opacity hover:opacity-70">
                <img
                  src={logoSvgHell}
                  alt="GCN Fahrzeughandel GbR"
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
              </Link>
              <div>
                <p className="text-sm text-crema-chiara">GCN Fahrzeughandel GbR</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-crema/75">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Sankt Georgen im Schwarzwald</span>
                </div>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-crema/80">
                Ihr persönlicher Fahrzeugexperte für Ankauf, Verkauf und
                Fahrzeugsuche im Schwarzwald und bundesweit.
              </p>
            </div>

            <div>
              <h2 className="mb-5 text-sm text-crema-chiara">Navigation</h2>
              <nav aria-label="Footer-Navigation" className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="w-fit text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/impressum"
                  className="w-fit text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                >
                  Impressum
                </Link>
                <Link
                  to="/datenschutz"
                  className="w-fit text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                >
                  Datenschutz
                </Link>
              </nav>
            </div>

            <div>
              <h2 className="mb-5 text-sm text-crema-chiara">Kontakt</h2>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+4917641651086"
                  className="group flex w-fit items-center gap-3 text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crema/10 transition-colors group-hover:bg-rosso">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="numeri">+49 176 41651086</span>
                </a>
                <a
                  href="mailto:gcn-farzeughandel@outlook.de"
                  className="group flex w-fit items-center gap-3 text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crema/10 transition-colors group-hover:bg-rosso">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  gcn-farzeughandel@outlook.de
                </a>
                <a
                  href="https://www.instagram.com/gcn.fahrzeughandel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-3 text-sm text-crema/80 transition-colors hover:text-crema-chiara"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crema/10 transition-colors group-hover:bg-rosso">
                    <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  @gcn.fahrzeughandel
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-crema/10 pt-7 sm:flex-row">
            <p className="text-xs text-crema/75">
              © {new Date().getFullYear()} GCN Fahrzeughandel GbR. Alle Rechte
              vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/impressum"
                className="text-xs text-crema/75 transition-colors hover:text-crema-chiara"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                className="text-xs text-crema/75 transition-colors hover:text-crema-chiara"
              >
                Datenschutz
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-crema/75">
              <span>Erstellt von</span>
              <GisslerBranding href="https://ga-webdesign.de" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
