import { Users, ShieldCheck, Handshake, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import carPassion1 from "figma:asset/4ac31d9b72adda06dd32f483a379f070be76398f.png";
import carPassion2 from "figma:asset/a786cbfb8d2e28889a626c9df9c05677c5df86ee.png";
import { SEO } from "./SEO";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparenz",
    description: "Keine versteckten Mängel oder Kosten. Wir legen alle Fakten offen auf den Tisch.",
  },
  {
    icon: Users,
    title: "Persönlich",
    description: "Jeder Kunde ist einzigartig. Wir beraten Sie individuell und auf Augenhöhe.",
  },
  {
    icon: Handshake,
    title: "Fairness",
    description: "Egal ob Kauf oder Verkauf – wir garantieren marktgerechte und faire Preise.",
  },
  {
    icon: BadgeCheck,
    title: "Garantie (min. 12 Monate)",
    description: "Jedes vermittelte Fahrzeug wird mit mindestens 12 Monaten Garantie abgesichert – für maximale Sicherheit.",
  },
];

const FOUNDERS = [
  {
    name: "Giosue Canobbio",
    age: 22,
    role: "Mitgründer & Geschäftsführer",
    bio: "Als dualer Student im Studiengang Finanzdienstleistungen verbindet Giosue an seinen Standorten Sankt Georgen und Lörrach berufliche Erfahrung in der Kundenberatung mit einer langjährigen Leidenschaft für Autos. Dieses tiefe Interesse ermöglicht es ihm, Marktpreise, technische Details und Fahrzeugqualitäten für Sie optimal und realistisch einzuschätzen.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
  },
  {
    name: "Christopher Neun",
    age: 28,
    role: "Mitgründer & Geschäftsführer",
    bio: "Als gelernter Kaufmann für Versicherungen und Finanzen sowie dualer Student (Finanzdienstleistungen) bringt Christopher ein ausgeprägtes Verständnis für strukturierte Abläufe mit. Von seinen Standorten Singen und Lörrach aus liegt sein Fokus darauf, Prozesse klar zu gestalten und Sie als Kunden sachlich und verlässlich zu begleiten.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256",
  },
];

export function About() {
  return (
    <>
      <SEO
        title="Über uns – Zwei leidenschaftliche Automobil-Experten"
        description="Giosue Canobbio und Christopher Neun – Ihre Experten für transparenten und fairen Fahrzeughandel. Erfahren Sie mehr über unser Team und unsere Philosophie."
        keywords="Über GCN, Team Fahrzeughandel, Giosue Canobbio, Christopher Neun, Autohändler Team, Gebrauchtwagen Experten"
      />

      <div className="flex-1 min-h-screen bg-white text-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="border-b border-black/8 pb-8 mb-12 sm:mb-16"
          >
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Über uns</p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-black max-w-2xl"
              style={{ fontWeight: 300, lineHeight: 1.1 }}
            >
              Zwei Experten.{" "}
              <span style={{ fontWeight: 700 }}>Eine Leidenschaft.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mt-4 max-w-xl">
              Wir sind zwei leidenschaftliche Automobil-Experten mit einem klaren Ziel: Den Fahrzeugkauf und -verkauf für Sie transparent, sicher und unkompliziert zu machen.
            </p>
          </motion.div>

          {/* Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {FOUNDERS.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.38, ease: "easeOut", delay: i * 0.09 }}
                className="bg-[#f7f7f7] rounded-3xl p-7 sm:p-8 border border-black/6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-5 bg-gray-200">
                  <ImageWithFallback
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg text-black mb-1" style={{ fontWeight: 600 }}>
                  {founder.name} ({founder.age})
                </h3>
                <p className="text-xs tracking-wide text-gray-400 uppercase mb-4">{founder.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{founder.bio}</p>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="bg-[#f7f7f7] rounded-3xl p-8 sm:p-12 border border-black/6 mb-12 sm:mb-16"
          >
            <div className="border-b border-black/8 pb-6 mb-8">
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Unsere Werte</p>
              <h2
                className="text-2xl sm:text-3xl text-black"
                style={{ fontWeight: 300, lineHeight: 1.2 }}
              >
                Unsere <span style={{ fontWeight: 700 }}>Philosophie.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {VALUES.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.38, ease: "easeOut", delay: i * 0.08 }}
                    className="flex flex-col items-center text-center gap-4"
                  >
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-base text-black" style={{ fontWeight: 600 }}>
                      {val.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Passion Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="border-b border-black/8 pb-6 mb-8"
            >
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Leidenschaft</p>
              <h2
                className="text-2xl sm:text-3xl text-black"
                style={{ fontWeight: 300, lineHeight: 1.2 }}
              >
                Faszination <span style={{ fontWeight: 700 }}>Automobil.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { src: carPassion1, alt: "Schwarzer Ford Focus RS", caption: "Liebe zum Detail" },
                { src: carPassion2, alt: "Gelber Audi Front", caption: "Faszination Automobil" },
              ].map((img, i) => (
                <motion.div
                  key={img.alt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.38, ease: "easeOut", delay: i * 0.08 }}
                  className="rounded-3xl overflow-hidden relative aspect-[4/3] group bg-gray-100 border border-black/6"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 rounded-3xl">
                    <p className="text-white text-sm" style={{ fontWeight: 500 }}>
                      {img.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}