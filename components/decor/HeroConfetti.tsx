"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useHasMounted } from "@/lib/use-has-mounted";

// react-confetti necesita window; lo cargamos solo en cliente
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface Props {
  /** Referencia a la sección Hero (para vincular con inView) */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Si la sección está en viewport (manejado por el padre vía useInView) */
  active: boolean;
}

/**
 * Confeti lento y continuo del Hero. ~40 piezas desktop / 15 mobile.
 * Pausa cuando active === false (el padre maneja inView).
 * Desactivado bajo prefers-reduced-motion.
 */
export function HeroConfetti({ containerRef, active }: Props) {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

  React.useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mounted, containerRef]);

  if (!mounted || reduced || !active || size.w === 0) return null;

  const isMobile = size.w < 768;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Confetti
        width={size.w}
        height={size.h}
        numberOfPieces={isMobile ? 15 : 40}
        gravity={0.05}
        wind={0.005}
        recycle
        tweenDuration={4000}
        colors={["#E91E8C", "#7DC720", "#3D1A6E", "#FFD93D", "#FCE4F1"]}
        // tamaño chico para no saturar
        confettiSource={{ x: 0, y: 0, w: size.w, h: 0 }}
      />
    </div>
  );
}
