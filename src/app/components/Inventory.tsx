import { useState } from "react";
import { Search, Calendar, Fuel, Settings2, Gauge, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import vwUpImage from "../../assets/vw-up.jpg";
import stellplatzImg from "../../assets/illustrations/stellplatz.jpg";
import { SEO } from "./SEO";
import { CarInquiryModal } from "./CarInquiryModal";

const INVENTORY = [
  {
    id: "1",
    brand: "Volkswagen",
    model: "up! move up!",
    price: "4.999 €",
    year: "09/2014",
    mileage: "92.000 km",
    fuel: "Benzin",
    transmission: "Schaltgetriebe",
    power: "44 kW (60 PS)",
    image: vwUpImage,
    condition: "Gebraucht",
    tags: ["Klimaanlage", "HU neu"],
    mobileLink:
      "https://suchen.mobile.de/fahrzeuge/details.html?id=446353280&secret=b4a0bae92056da4585f40245617943e7",
  },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inquiryCar, setInquiryCar] = useState<(typeof INVENTORY)[0] | null>(null);

  const query = searchTerm.trim().toLowerCase();
  const filteredInventory = INVENTORY.filter(
    (car) =>
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query),
  );

  return (
    <>
      <SEO
        title="Fahrzeugbestand – Gebrauchtwagen sofort verfügbar"
        description="Entdecken Sie unsere aktuellen Gebrauchtwagen im Bestand. Geprüfte Fahrzeuge zu fairen Preisen. Kontakt: 0176 41651086."
        keywords="Gebrauchtwagen Bestand, Auto sofort verfügbar, Gebrauchtwagen kaufen, Fahrzeuge auf Lager"
      />

      <div className="min-h-screen flex-1 bg-crema text-nero">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-linea pb-9 md:flex-row md:items-end">
            <div>
              <h1 className="titolo-pagina">Fahrzeugbestand</h1>
              <p className="mt-3 text-asfalto">
                <span className="numeri">{INVENTORY.length}</span>{" "}
                {INVENTORY.length === 1 ? "Fahrzeug" : "Fahrzeuge"} sofort
                verfügbar. Was nicht dabei ist, finden wir über unseren
                Suchauftrag.
              </p>
            </div>

            <div className="relative w-full md:max-w-xs lg:max-w-sm">
              <label htmlFor="bestand-suche" className="sr-only">
                Bestand nach Marke oder Modell durchsuchen
              </label>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-alluminio"
                aria-hidden="true"
              />
              <input
                id="bestand-suche"
                type="search"
                className="block w-full rounded-2xl border border-linea bg-crema-chiara py-3.5 pl-11 pr-4 text-sm text-nero transition-colors placeholder:text-alluminio focus:border-nero/30"
                placeholder="Marke oder Modell"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filteredInventory.map((car) => (
                <article
                  key={car.id}
                  className="finestra group flex flex-col overflow-hidden border border-linea bg-crema-chiara transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(26,21,18,0.5)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-crema-scura">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex items-start justify-between gap-4 border-b border-linea-chiara pb-4">
                      <div>
                        <h2 className="text-[19px] leading-snug" style={{ fontWeight: 700 }}>
                          {car.brand} {car.model}
                        </h2>
                        <p className="mt-1 text-sm text-asfalto">
                          {car.power} · {car.condition}
                        </p>
                      </div>
                      <p className="numeri shrink-0 text-xl" style={{ fontWeight: 700 }}>
                        {car.price}
                      </p>
                    </div>

                    <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-asfalto">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                        <dt className="sr-only">Erstzulassung</dt>
                        <dd className="numeri">EZ {car.year}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                        <dt className="sr-only">Laufleistung</dt>
                        <dd className="numeri">{car.mileage}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                        <dt className="sr-only">Getriebe</dt>
                        <dd>{car.transmission}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-3.5 w-3.5 shrink-0 text-alluminio" aria-hidden="true" />
                        <dt className="sr-only">Kraftstoff</dt>
                        <dd className="truncate">{car.fuel}</dd>
                      </div>
                    </dl>

                    {car.tags.length > 0 && (
                      <ul className="mb-6 flex flex-wrap gap-2">
                        {car.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-linea px-3 py-1 text-xs text-asfalto"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => setInquiryCar(car)}
                      className="mb-2.5 mt-auto w-full rounded-full bg-rosso py-3.5 text-center text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro active:scale-[0.99]"
                    >
                      Interesse anmelden
                    </button>
                    <a
                      href={car.mobileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-linea py-3 text-center text-sm text-asfalto transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara"
                    >
                      Auf mobile.de ansehen
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="finestra overflow-hidden border border-linea bg-crema-chiara md:flex">
              <img
                src={stellplatzImg}
                alt="Illustrierter leerer Stellplatz mit frischen Reifenspuren"
                className="h-56 w-full object-cover md:h-auto md:w-1/2"
                loading="lazy"
              />
              <div className="p-7 sm:p-10 md:w-1/2">
                <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                  {query ? "Dazu steht gerade nichts bei uns." : "Gerade steht nichts bei uns."}
                </h2>
                <p className="mt-3 text-asfalto">
                  {query
                    ? "Unser Bestand wechselt schnell. Sagen Sie uns, was Sie suchen – wir melden uns, sobald das passende Fahrzeug da ist."
                    : "Der Bestand ist aktuell leer. Über einen Suchauftrag finden wir Ihr Wunschfahrzeug über unser Händlernetzwerk."}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/kontakt?type=search"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rosso px-6 py-3.5 text-sm text-crema-chiara transition-colors hover:bg-rosso-scuro"
                  >
                    Suchauftrag erstellen
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {query && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center justify-center rounded-full border border-linea px-6 py-3.5 text-sm text-nero transition-colors hover:border-nero"
                    >
                      Suche zurücksetzen
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CarInquiryModal car={inquiryCar} onClose={() => setInquiryCar(null)} />
    </>
  );
}
