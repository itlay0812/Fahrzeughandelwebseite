import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/* Das Spiel wird erst geladen, wenn jemand es öffnet. */
const Schwarzwaldfahrt = lazy(() =>
  import("./Schwarzwaldfahrt").then((m) => ({ default: m.Schwarzwaldfahrt })),
);

/* Das GCN-Minispiel aus dem Footer öffnet sich hier – ohne Seitenwechsel,
   immer komplett sichtbar, mit Escape wieder zu. */
export function SpielOverlay({
  offen,
  onClose,
}: {
  offen: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offen) return;
    const onTaste = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onTaste);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = vorher;
      window.removeEventListener("keydown", onTaste);
    };
  }, [offen, onClose]);

  return (
    <AnimatePresence>
      {offen && (
        <>
          <motion.div
            key="schleier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] bg-nero/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="fenster"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="GCN-Minispiel"
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="finestra relative w-full max-w-[24rem] border border-linea bg-crema-chiara p-4 shadow-2xl outline-none sm:p-5"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Minispiel schließen"
                className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-linea bg-crema-chiara text-asfalto shadow-md transition-colors hover:border-nero hover:bg-nero hover:text-crema-chiara"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Das Spielfeld bekommt die Höhe, die nach Rahmen, Anzeige und
                  Lenkung übrig bleibt – so passt alles ohne Scrollen ins Fenster. */}
              <Suspense fallback={null}>
                <Schwarzwaldfahrt hoehe="calc(100dvh - 12.5rem)" />
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
