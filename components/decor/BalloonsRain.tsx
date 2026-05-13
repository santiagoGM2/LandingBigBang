"use client";

import { useReducedMotion } from "framer-motion";
import { useHasMounted } from "@/lib/use-has-mounted";

interface Props {
  count?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ["#E91E8C", "#7DC720", "#3D1A6E", "#FFD93D"];

/**
 * Lluvia continua de globos que caen desde arriba del viewport hacia abajo.
 * SVG simple por globo. Posiciones, tamaños, velocidades y delays deterministas
 * (no Math.random) para SSR safety: el server y el primer render del cliente
 * producen el mismo árbol.
 *
 * Va dentro de una section con overflow-hidden y position relative.
 * Decorativo, pointer-events-none, oculto bajo reduce-motion.
 */
export function BalloonsRain({ count = 14, colors = DEFAULT_COLORS }: Props) {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  if (!mounted || reduced) return null;

  const balloons = Array.from({ length: count }, (_, i) => ({
    left: (i * 17 + 7) % 100,
    size: 30 + ((i * 13) % 40),
    duration: 8 + ((i * 7) % 6),
    delay: (i * 0.7) % 5,
    color: colors[i % colors.length],
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {balloons.map((b, i) => (
        <svg
          key={i}
          width={b.size}
          height={Math.round(b.size * 1.3)}
          viewBox="0 0 60 80"
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: "-100px",
            animation: `bb-balloon-fall ${b.duration}s linear ${b.delay}s infinite`,
            opacity: 0,
          }}
        >
          <ellipse cx="30" cy="28" rx="22" ry="26" fill={b.color} />
          <ellipse cx="22" cy="20" rx="6" ry="4" fill="white" opacity="0.4" />
          <path d="M30 54 L28 78 L32 78 Z" fill={b.color} />
          <path
            d="M30 78 Q28 90 30 100"
            stroke={b.color}
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      ))}
    </div>
  );
}
