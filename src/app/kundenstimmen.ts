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
   2. Eintrag unten ergänzen: Name, Fahrzeug, Sterne und Text.
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
    name: "Antonio Melle",
    fahrzeug: "Toyota Auris Hybrid",
    text: "",
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
    name: "Nico Ballen",
    fahrzeug: "Ford Focus RS",
    text: "",
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
    name: "Firat Savas",
    fahrzeug: "Škoda Octavia",
    text: "",
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
