import toyota480 from "../assets/kunden/toyota-auris-hybrid-480.webp";
import toyota738 from "../assets/kunden/toyota-auris-hybrid-738.webp";
import focus480 from "../assets/kunden/ford-focus-rs-480.webp";
import focus960 from "../assets/kunden/ford-focus-rs-960.webp";
import octavia480 from "../assets/kunden/skoda-octavia-480.webp";
import octavia960 from "../assets/kunden/skoda-octavia-960.webp";

/* Fotos der Autos zu den Google-Bewertungen. Google liefert über die API keine
   Bilder zu einzelnen Bewertungen, deshalb ordnen wir sie hier von Hand zu.
   Name und Text der Bewertung kommen immer von Google – hier steht nur, welches
   Foto zu welchem Google-Namen gehört.

   Schlüssel: der Name genau so, wie er bei Google steht.
   Bilder: 4:3, als WebP in zwei Breiten (480 und bis zu 960 px), damit der
   Browser die passende lädt. Ohne Eintrag zeigt die Kachel ein gezeichnetes Auto. */

export type Bewertungsbild = {
  /** Breite in px → Datei */
  quellen: [number, string][];
  alt: string;
};

export const BEWERTUNGSBILDER: Record<string, Bewertungsbild> = {
  "Antonio Melle": {
    quellen: [
      [480, toyota480],
      [738, toyota738],
    ],
    alt: "Schwarzer Toyota Auris Hybrid",
  },
  "Nico Ballen": {
    quellen: [
      [480, focus480],
      [960, focus960],
    ],
    alt: "Schwarzer Ford Focus RS",
  },
  "Firat Savas": {
    quellen: [
      [480, octavia480],
      [960, octavia960],
    ],
    alt: "Blauer Škoda Octavia",
  },
};
