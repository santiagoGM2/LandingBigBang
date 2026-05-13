"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useHasMounted } from "@/lib/use-has-mounted";

/**
 * Orbe degradado bb-pink-soft fijo en pantalla que parallaxea con scroll
 * de -10% top a 110% top a lo largo del documento. Aporta vida continua
 * en fondos planos. Solo desktop, oculto bajo reduce-motion.
 */
export function BackgroundOrb() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-30%", "20%", "-20%"]);

  if (!mounted || reduced) return null;

  return (
    <motion.span
      aria-hidden
      style={{ y, x }}
      className="pointer-events-none fixed left-1/2 top-0 -z-10 hidden h-[420px] w-[420px] rounded-full bg-bb-pink-soft opacity-50 blur-[110px] md:block"
    />
  );
}
