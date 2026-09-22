import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "motion/react";
import { markIntroSeen } from "./IntroContext";
import { ScrollFilm } from "./ScrollFilm";

/* Die Fahrt für Handy und Tablet: dieselben Bilder wie die Scroll-Bühne,
   aber zeitgesteuert abgespielt – einmal durch, dann steht das letzte Bild. */
const DURATION = 7;

export function HeroFilm({ onEnd }: { onEnd: () => void }) {
  const progress = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  /* Lädt das Netz zu langsam, startet die Fahrt trotzdem – ScrollFilm zeigt
     dann das nächste bereits geladene Bild. */
  useEffect(() => {
    const fallback = window.setTimeout(() => setReady(true), 4000);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const controls = animate(progress, 1, {
      duration: DURATION,
      ease: [0.3, 0, 0.3, 1],
      onComplete: () => {
        markIntroSeen();
        onEndRef.current();
      },
    });
    return () => controls.stop();
  }, [ready, progress]);

  return <ScrollFilm progress={progress} onAllFrames={() => setReady(true)} />;
}
