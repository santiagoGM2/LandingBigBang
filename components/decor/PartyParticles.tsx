"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  glyph: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

const GLYPHS = ["✦", "✧", "✩", "★"];

interface Props {
  count?: number;
  /** Color de las partículas. "pink" para fondos claros, "white" para fondos oscuros. */
  variant?: "pink" | "white";
  className?: string;
}

/**
 * Capa decorativa: glyphs unicode (✦ ✧ ✩ ★) flotando con animación leve
 * de translateY + opacidad + rotación. Pure-frontend, sin imágenes, sin
 * emojis. Respeta prefers-reduced-motion (no renderiza nada).
 */
export function PartyParticles({
  count = 22,
  variant = "pink",
  className,
}: Props) {
  const reduced = useReducedMotion();
  const mounted = useHasMounted();

  // Pseudo-random determinístico basado en el índice: produce el mismo
  // resultado en cada render (sin Math.random impuro). Suficiente para una
  // capa decorativa que solo necesita "verse random".
  const particles = React.useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = Math.sin((i + 1) * 12.9898) * 43758.5453;
      const b = Math.sin((i + 1) * 78.233) * 43758.5453;
      const c = Math.sin((i + 1) * 39.346) * 43758.5453;
      const d = Math.sin((i + 1) * 91.5147) * 43758.5453;
      const r = (n: number) => n - Math.floor(n);
      return {
        id: i,
        glyph: GLYPHS[i % GLYPHS.length],
        x: r(a) * 100,
        y: r(b) * 100,
        size: 10 + r(c) * 16,
        duration: 7 + r(d) * 6,
        delay: r(a + b) * 4,
        drift: 20 + r(c + d) * 20,
      };
    });
  }, [count]);

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={cn(
            "absolute select-none",
            variant === "white" ? "text-white/35" : "text-bb-pink/35"
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -p.drift, 0],
            opacity: [0, 0.85, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.glyph}
        </motion.span>
      ))}
    </div>
  );
}
