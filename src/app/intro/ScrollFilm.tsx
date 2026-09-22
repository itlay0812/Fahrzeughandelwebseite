import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/* Die Fahrt liegt als Einzelbildfolge vor, nicht als <video>: Nur so lässt
   sich jede Scroll-Position exakt und ruckfrei auf ein Bild abbilden –
   currentTime-Scrubbing springt zwischen den Keyframes. */
const FRAME_URLS = Object.entries(
  import.meta.glob("../../assets/frames/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
  }) as Record<string, string>,
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

export const FRAME_COUNT = FRAME_URLS.length;
/** Das Standbild, auf dem die Fahrt endet – der Hero zeigt genau dieses. */
export const LAST_FRAME = FRAME_URLS[FRAME_URLS.length - 1];

export function ScrollFilm({
  progress,
  className = "",
  onFirstFrame,
  onAllFrames,
}: {
  progress: MotionValue<number>;
  className?: string;
  onFirstFrame?: () => void;
  onAllFrames?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<Array<HTMLImageElement | null>>([]);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const [loaded, setLoaded] = useState(0);

  /* Auf schmalen Geräten reicht jedes zweite Bild – halbe Datenmenge,
     bei Scroll-Geschwindigkeit kaum zu unterscheiden. */
  const urls = useRef<string[]>([]);
  if (urls.current.length === 0) {
    const step =
      typeof window !== "undefined" && window.innerWidth < 760 ? 2 : 1;
    urls.current = FRAME_URLS.filter((_, i) => i % step === 0);
  }

  const paint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const count = urls.current.length;
    const index = Math.round(current.current * (count - 1));
    let img = frames.current[index];
    if (!img) {
      // Noch nicht geladen: das nächstgelegene vorhandene Bild zeigen.
      for (let d = 1; d < count; d++) {
        img = frames.current[index - d] ?? frames.current[index + d] ?? null;
        if (img) break;
      }
    }
    if (!img) return;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  const tick = () => {
    const diff = target.current - current.current;
    /* Weiches Nachziehen: auch ruckartiges Scrollen läuft als Fahrt. */
    current.current += diff * 0.22;
    if (Math.abs(diff) < 0.0004) {
      current.current = target.current;
      paint();
      raf.current = 0;
      return;
    }
    paint();
    raf.current = requestAnimationFrame(tick);
  };

  const request = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  useMotionValueEvent(progress, "change", (value) => {
    target.current = Math.min(1, Math.max(0, value));
    request();
  });

  /* Bilder laden: erst die ersten, dann der Rest im Hintergrund. */
  useEffect(() => {
    let cancelled = false;
    frames.current = new Array(urls.current.length).fill(null);
    let done = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          frames.current[i] = img;
          done += 1;
          if (done === 1) {
            paint();
            onFirstFrame?.();
          }
          if (done % 8 === 0 || done === urls.current.length) setLoaded(done);
          if (done === urls.current.length) onAllFrames?.();
          paint();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = urls.current[i];
      });

    (async () => {
      const first = urls.current.slice(0, 6).map((_, i) => load(i));
      await Promise.all(first);
      for (let i = 6; i < urls.current.length; i += 4) {
        if (cancelled) return;
        await Promise.all(
          [i, i + 1, i + 2, i + 3]
            .filter((n) => n < urls.current.length)
            .map((n) => load(n)),
        );
      }
    })();

    return () => {
      cancelled = true;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Auflösung an Anzeige und Gerät anpassen. */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      paint();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = loaded > 5 || loaded === urls.current.length;

  return (
    <div className={`absolute inset-0 bg-crema ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      {!ready && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
          <span className="rounded-full bg-crema-chiara/80 px-4 py-2 text-xs text-asfalto backdrop-blur-sm">
            Fahrt wird geladen …
          </span>
        </div>
      )}
    </div>
  );
}
