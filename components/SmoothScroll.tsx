"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth scroll global con Lenis + integración con GSAP ScrollTrigger.
 * Desactivado en mobile (<768px) y bajo prefers-reduced-motion.
 *
 * La integración con GSAP garantiza que ScrollTrigger.update() se llame
 * en cada paso de Lenis (clave para que el pin/scrub de Espejo no se
 * desincronice). El ticker de GSAP también maneja el raf loop, así no
 * mantenemos un raf manual paralelo.
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
    };
  }, [reduced]);

  return null;
}
