import auto from "../../assets/icons/auto.svg";
import betreuung from "../../assets/icons/betreuung.svg";
import brief from "../../assets/icons/brief.svg";
import fueller from "../../assets/icons/fueller.svg";
import garantie from "../../assets/icons/garantie.svg";
import handschlag from "../../assets/icons/handschlag.svg";
import haus from "../../assets/icons/haus.svg";
import kamera from "../../assets/icons/kamera.svg";
import lupe from "../../assets/icons/lupe.svg";
import pfeil from "../../assets/icons/pfeil.svg";
import preis from "../../assets/icons/preis.svg";
import schluessel from "../../assets/icons/schluessel.svg";
import standort from "../../assets/icons/standort.svg";
import stern from "../../assets/icons/stern.svg";
import telefon from "../../assets/icons/telefon.svg";
import uhr from "../../assets/icons/uhr.svg";

/* Gezeichnete Icons im Tusche-Stil der Illustrationen. Die SVGs liegen als
   eigene Dateien vor und werden als CSS-Maske eingeblendet: So färbt sie
   `currentColor` (text-nero, text-rosso …), und jede Seite lädt nur, was sie
   zeigt. Feine Motive wie „betreuung“ und „handschlag“ erst ab etwa 40 px. */
const ICONS = {
  auto,
  betreuung,
  brief,
  fueller,
  garantie,
  handschlag,
  haus,
  kamera,
  lupe,
  pfeil,
  preis,
  schluessel,
  standort,
  stern,
  telefon,
  uhr,
} as const;

export type TuscheName = keyof typeof ICONS;

export function Tusche({
  name,
  className = "h-6 w-6",
  label,
}: {
  name: TuscheName;
  className?: string;
  /** Nur setzen, wenn das Icon allein Bedeutung trägt – sonst bleibt es dekorativ. */
  label?: string;
}) {
  const maske = `url("${ICONS[name]}")`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: maske,
        WebkitMaskImage: maske,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
