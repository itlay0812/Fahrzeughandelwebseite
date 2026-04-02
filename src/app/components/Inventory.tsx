import { useState } from "react";
import { Search, Calendar, Fuel, Settings2, Gauge, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import vwUpImage from "figma:asset/a73f31ab97428181cb471f206b6a5d44e6e6087a.png";
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
    tags: ["Klimaanlage", "HU Neu"],
    mobileLink:
      "https://suchen.mobile.de/fahrzeuge/details.html?id=446353280&secret=b4a0bae92056da4585f40245617943e7",
  },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inquiryCar, setInquiryCar] = useState<(typeof INVENTORY)[0] | null>(null);

  const filteredInventory = INVENTORY.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Fahrzeugbestand – Gebrauchtwagen sofort verfügbar"
        description="Entdecken Sie unsere aktuellen Gebrauchtwagen im Bestand. Geprüfte Fahrzeuge zu fairen Preisen. Kontakt: 0176 41651086."
        keywords="Gebrauchtwagen Bestand, Auto sofort verfügbar, Gebrauchtwagen kaufen, Fahrzeuge auf Lager"
      />

      <div className="flex-1 min-h-screen bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Header & Search */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-12 border-b border-black/8 pb-8 sm:pb-10"
          >
            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Direktkauf</p>
              <h1 className="text-3xl sm:text-4xl tracking-tight text-black" style={{ fontWeight: 300 }}>
                Fahrzeugbestand
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Aktuell {INVENTORY.length} {INVENTORY.length === 1 ? "Fahrzeug" : "Fahrzeuge"} verfügbar
              </p>
            </div>

            <div className="relative w-full md:max-w-xs lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 border border-black/10 rounded-2xl bg-[#f7f7f7] text-black placeholder:text-gray-400 focus:outline-none focus:border-black/25 text-sm transition-all"
                placeholder="Marke oder Modell..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Grid */}
          {filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredInventory.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, ease: "easeOut", delay: i * 0.07 }}
                  className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow border border-black/5"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span className="bg-white/90 backdrop-blur-sm text-black text-xs px-3 py-1.5 rounded-full border border-black/8">
                        {car.condition}
                      </span>
                      {car.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/80 backdrop-blur-sm text-black text-xs px-3 py-1.5 rounded-full border border-black/8"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-black/6">
                      <div>
                        <h3 className="text-base sm:text-lg text-black" style={{ fontWeight: 600 }}>
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-gray-400 text-sm">{car.power}</p>
                      </div>
                      <div className="text-black text-base sm:text-lg shrink-0 ml-2" style={{ fontWeight: 600 }}>
                        {car.price}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-gray-500 mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span>EZ {car.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span>{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="truncate">{car.fuel}</span>
                      </div>
                    </div>

                    {/* Primary: Interesse anmelden */}
                    <button
                      onClick={() => setInquiryCar(car)}
                      className="w-full py-3.5 bg-black hover:bg-gray-900 text-white text-sm rounded-2xl transition-colors mt-auto text-center active:scale-[0.98] mb-2.5"
                    >
                      Interesse anmelden
                    </button>

                    {/* Secondary: Mobile.de */}
                    <a
                      href={car.mobileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 border border-black/12 hover:border-black/25 text-black text-sm rounded-2xl transition-colors text-center inline-flex items-center justify-center gap-1.5 text-gray-500 hover:text-black"
                    >
                      Ansehen auf Mobile.de
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 sm:py-28 bg-[#f7f7f7] rounded-3xl border border-black/6"
            >
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-black" style={{ fontWeight: 400 }}>
                Keine Fahrzeuge gefunden
              </h3>
              <p className="text-gray-400 text-sm mt-2">Versuchen Sie es mit einem anderen Suchbegriff.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      <CarInquiryModal car={inquiryCar} onClose={() => setInquiryCar(null)} />
    </>
  );
}