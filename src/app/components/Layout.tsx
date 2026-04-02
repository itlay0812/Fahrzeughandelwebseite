import { Outlet, Link, useLocation } from "react-router";
import logoImg from "figma:asset/87104b765c1a1399e8e4b2a45f3225515652a099.png";
import { Mail, Phone, Instagram, Menu, X, MapPin } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Suchauftrag & Verkauf", path: "/kontakt" },
    { name: "Fahrzeugbestand", path: "/bestand" },
    { name: "Über uns", path: "/ueber-uns" },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black selection:bg-black selection:text-white">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="bg-white fixed top-0 left-0 right-0 z-50"
        style={{ boxShadow: "0 2px 20px 0 rgba(0,0,0,0.10)" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center relative">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 z-10 transition-opacity hover:opacity-70"
          >
            <img
              src={logoImg}
              alt="GCN Fahrzeughandel GbR"
              className="h-[67px] md:h-[78px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav – absolutely centered */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[15px] tracking-wide transition-colors whitespace-nowrap pb-0.5 ${
                  isActive(link.path)
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400 hover:text-black border-b-2 border-transparent"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto p-2.5 text-gray-500 hover:text-black transition-colors rounded-xl bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl rounded-b-3xl overflow-hidden">
            <nav className="flex flex-col px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-4 px-3 text-base transition-colors border-b border-gray-50 last:border-0 rounded-xl my-0.5 ${
                    isActive(link.path)
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col pt-[76px] md:pt-[90px]">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#111] border-t border-white/8 pt-14 pb-8 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">

            {/* Brand */}
            <div className="flex flex-col gap-5">
              <Link to="/" className="w-fit transition-opacity hover:opacity-70">
                <div className="bg-white rounded-xl px-3 py-2 w-fit">
                  <img src={logoImg} alt="GCN Fahrzeughandel GbR" className="h-8 w-auto object-contain" />
                </div>
              </Link>
              <div>
                <p className="text-white text-sm">GCN Fahrzeughandel GbR</p>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Sankt Georgen im Schwarzwald</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Ihr persönlicher Fahrzeugexperte für Ankauf, Verkauf und Fahrzeugsuche im Schwarzwald und bundesweit.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-5">Navigation</p>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                ))}
                <Link to="/impressum" className="text-gray-400 hover:text-white transition-colors text-sm">Impressum</Link>
                <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors text-sm">Datenschutz</Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-5">Kontakt</p>
              <div className="flex flex-col gap-3">
                <a href="tel:+4917641651086" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm group">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  +49 176 41651086
                </a>
                <a href="mailto:gcn-farzeughandel@outlook.de" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm group">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  gcn-farzeughandel@outlook.de
                </a>
                <a href="https://www.instagram.com/gcn.fahrzeughandel/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <span className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    @gcn.fahrzeughandel
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} GCN Fahrzeughandel GbR. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/impressum" className="text-gray-600 hover:text-gray-300 transition-colors text-xs">Impressum</Link>
              <Link to="/datenschutz" className="text-gray-600 hover:text-gray-300 transition-colors text-xs">Datenschutz</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}