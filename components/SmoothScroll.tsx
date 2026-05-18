"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth scroll global con Lenis + integración con GSAP ScrollTrigger.
 * Desactivado en mobile (<768px) y bajo prefers-reduced-motion.
 *
 * Expone la instancia en `window.__lenis` para que componentes externos
 * (ej. QuizModal) puedan pausar el smooth scroll mientras un modal está
 * abierto, evitando que Lenis robe los eventos wheel del modal.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, [reduced]);

  return null;
}
