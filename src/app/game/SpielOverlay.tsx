import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/* Das Spiel wird erst geladen, wenn jemand es öffnet. */
const Schwarzwaldfahrt = lazy(() =>
  import("./Schwarzwaldfahrt").then((m) => ({ default: m.Schwarzwaldfahrt })),
);

/* Das Fundstück aus dem Footer öffnet sich hier – klein, ohne Seitenwechsel,
   und mit Escape wieder zu. */
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
            aria-label="Die Schwarzwaldstraße – Minispiel"
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="finestra max-h-[92dvh] w-full max-w-[24rem] overflow-y-auto border border-linea bg-crema-chiara p-5 shadow-2xl outline-none sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-asfalto">
                    Gefunden
                  </p>
                  <h2 className="mt-0.5 text-lg text-nero" style={{ fontWeight: 700 }}>
                    Eine Proberunde
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Schließen"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-linea text-asfalto transition-colors hover:border-nero hover:bg-nero hover:text-crema-chiara"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <Suspense fallback={null}>
                <Schwarzwaldfahrt />
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
