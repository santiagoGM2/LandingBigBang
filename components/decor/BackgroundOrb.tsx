"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHasMounted } from "@/lib/use-has-mounted";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Orbe degradado bb-pink-soft fijo en pantalla que parallaxea con el scroll
 * del documento entero. Aporta vida continua en fondos planos. Solo desktop,
 * oculto bajo reduce-motion.
 *
 * Usamos GSAP ScrollTrigger (no Framer's useScroll) para evitar el warning
 * "Please ensure that the container has a non-static position" cuando se
 * mide el document element sin tener position relative.
 */
export function BackgroundOrb() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const orbRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!mounted || reduced || !orbRef.current) return;

      gsap.to(orbRef.current, {
        yPercent: 120,
        xPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    { dependencies: [mounted, reduced] }
  );

  if (!mounted || reduced) return null;

  return (
    <span
      ref={orbRef}
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-0 -z-10 hidden h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-bb-pink-soft opacity-50 blur-[110px] md:block"
    />
  );
}
