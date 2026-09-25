import toyota480 from "../assets/kunden/toyota-auris-hybrid-480.webp";
import toyota738 from "../assets/kunden/toyota-auris-hybrid-738.webp";
import focus480 from "../assets/kunden/ford-focus-rs-480.webp";
import focus960 from "../assets/kunden/ford-focus-rs-960.webp";
import octavia480 from "../assets/kunden/skoda-octavia-480.webp";
import octavia960 from "../assets/kunden/skoda-octavia-960.webp";

/* Kundenstimmen auf der Startseite – fest hinterlegt, jeweils mit Foto des
   Autos. Nichts davon wird live geladen.

   Neue Stimme:
   1. Foto als WebP (4:3) in zwei Breiten nach src/assets/kunden/ legen und
      oben importieren (480 px und bis zu 960 px).
   2. Eintrag unten ergänzen: Vorname und abgekürzter Nachname („Max M.“),
      Fahrzeug, Sterne und Text.
   Eine Stimme ohne Text wird nicht angezeigt. Vor der Veröffentlichung die
   Zustimmung der Person einholen (Name und Foto ihres Autos). */

export type Kundenstimme = {
  name: string;
  /** Modell, erscheint unter dem Namen */
  fahrzeug: string;
  text: string;
  sterne: number;
  foto: {
    /** Breite in px → Datei */
    quellen: [number, string][];
    alt: string;
  };
};

export const KUNDENSTIMMEN: Kundenstimme[] = [
  {
    name: "Antonio M.",
    fahrzeug: "Toyota Auris Hybrid",
    text: "Absolut empfehlenswert!\nIch bin rundum zufrieden mit dem gesamten Ablauf. Das Team von GCN-Fahrzeughandel hat mir mein Wunschauto besorgt und sich um alles zuverlässig und unkompliziert gekümmert. Besonders beeindruckt hat mich der persönliche Service – das Fahrzeug wurde mir sogar bis direkt vor die Haustür geliefert.\n\nVon der ersten Kontaktaufnahme bis zur Übergabe hat einfach alles gepasst. Freundlich, zuverlässig, ehrlich und absolut kundenorientiert – genau so wünscht man sich einen Autohändler.\n\nVielen Dank für den tollen Service! Ich würde jederzeit wieder ein Fahrzeug bei euch kaufen und kann GCN-Fahrzeughandel uneingeschränkt weiterempfehlen. 🚗👍🏼",
    sterne: 5,
    foto: {
      quellen: [
        [480, toyota480],
        [738, toyota738],
      ],
      alt: "Schwarzer Toyota Auris Hybrid",
    },
  },
  {
    name: "Nico B.",
    fahrzeug: "Ford Focus RS",
    text: "Super Händler, ich habe mein erstes Auto bei ihnen gekauft. Kontakt lief super, Auto war perfekt und es wurde aufbereitet und bis zu mir geliefert! Mein nächstes Auto wird hoffentlich wieder hier gekauft!! 😎",
    sterne: 5,
    foto: {
      quellen: [
        [480, focus480],
        [960, focus960],
      ],
      alt: "Schwarzer Ford Focus RS",
    },
  },
  {
    name: "Firat S.",
    fahrzeug: "Škoda Octavia",
    text: "Super Service, von der Autosuche bis hin zur Übergabe war alles unkompliziert und angenehm, die Kollegen haben meine Wünsche und Anliegen ernst genommen und mir ein wunderschönes Auto gefunden, abgeholt, aufbereitet und ausgeliefert.\nKann ich nur weiterempfehlen!",
    sterne: 5,
    foto: {
      quellen: [
        [480, octavia480],
        [960, octavia960],
      ],
      alt: "Blauer Škoda Octavia",
    },
  },
];
