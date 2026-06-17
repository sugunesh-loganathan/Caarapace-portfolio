"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    // Always start at the top on (re)load — opt out of the browser restoring
    // the previous scroll position, which would land mid-section.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const instance = new Lenis({
      duration: reduceMotion ? 0.4 : 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    instance.scrollTo(0, { immediate: true });

    ref.current = instance;
    setLenis(instance);

    function update(time: number) {
      instance.raf(time * 1000);
    }

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      ref.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}

export function useScrollTo() {
  const lenis = useLenis();

  return (target: string, options?: { offset?: number; duration?: number }) => {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };
}
