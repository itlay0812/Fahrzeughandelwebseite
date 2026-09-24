import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type IntroPhase = "off" | "running" | "arrived";

type IntroValue = {
  /** "off" = kein Intro auf dieser Seite, "running" = Kamera ist noch im Auto,
   *  "arrived" = das Auto ist im Header gelandet, die Navigation gehört wieder der Seite. */
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  /** Der Header meldet sein Logo an, damit das Intro weiß, wohin das Auto fliegt. */
  registerLogo: (el: HTMLElement | null) => void;
  measureLogo: () => DOMRect | null;
};

const IntroContext = createContext<IntroValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("off");
  const logoRef = useRef<HTMLElement | null>(null);

  const registerLogo = useCallback((el: HTMLElement | null) => {
    logoRef.current = el;
  }, []);

  const measureLogo = useCallback(
    () => logoRef.current?.getBoundingClientRect() ?? null,
    [],
  );

  const value = useMemo(
    () => ({ phase, setPhase, registerLogo, measureLogo }),
    [phase, registerLogo, measureLogo],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro muss innerhalb von IntroProvider verwendet werden.");
  }
  return ctx;
}

/* Läuft nur im Speicher: Ein Reload zeigt die Fahrt erneut, ein Wechsel
   zwischen Unterseiten innerhalb derselben Sitzung nicht. */
let introDoneThisLoad = false;

export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (introDoneThisLoad) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function markIntroSeen() {
  introDoneThisLoad = true;
}

/* Handy und Tablet bekommen keine Fahrt, sondern direkt den Hero: Auf
   Touch-Geräten fühlt sich das Scroll-Scrubbing zäh an und die 940vh lange
   Strecke steht dem Inhalt im Weg. */
export function prefersStaticHero() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}
