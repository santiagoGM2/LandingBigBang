"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Sparkles } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";
import { BalloonsRain } from "@/components/decor/BalloonsRain";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useIsDesktop } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX = 8;
const TILT_MAX = 4; // grados rotateX/Y

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export function CTAFinal() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const desktop = useIsDesktop();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const animate = mounted && !reduced;
  const enable3D = animate && desktop;

  // Magnetic translate
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 14 });
  const sy = useSpring(my, { stiffness: 240, damping: 14 });

  // Tilt 3D basado en posición del cursor dentro del botón
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 200, damping: 18 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(tiltX, [-1, 1], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(tiltY, [-1, 1], [-TILT_MAX, TILT_MAX]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    // Magnetic pull
    if (dist > MAGNETIC_RADIUS) {
      mx.set(0);
      my.set(0);
    } else {
      const factor = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_MAX;
      mx.set((dx / dist) * factor);
      my.set((dy / dist) * factor);
    }

    // Tilt cuando el cursor está sobre el botón
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      tiltYRaw.set((dx / (rect.width / 2)));
      tiltXRaw.set((dy / (rect.height / 2)));
    } else {
      tiltXRaw.set(0);
      tiltYRaw.set(0);
    }
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  // Regla globos v4: solo en mount inicial y submit exitoso de form.
  // Este click abre el modal (no es submit) → directo, sin globos.
  const handleClick = () => open();

  return (
    <section className="relative overflow-hidden bg-bb-pink py-24 md:py-32 text-white">
      {/* Lluvia continua de globos cayendo (reemplaza los Ribbons + FloatingBalloons) */}
      <BalloonsRain count={14} />

      {/* Color shift: tinte purpura sutil que pulsa cada 8s */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-bb-purple mix-blend-multiply animate-bb-cta-tint"
      />
      {/* Noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-bb-lime/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-bb-purple/40 blur-3xl"
      />

      <div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.h2
          initial={animate ? { opacity: 0, y: 24 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]"
        >
          Tu próxima gran historia empieza con un click
        </motion.h2>
        <motion.p
          initial={animate ? { opacity: 0, y: 18 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
        >
          60 segundos. Quiz interactivo. Cero compromiso. Te contactamos en
          menos de 24 horas.
        </motion.p>

        <motion.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 inline-block"
        >
          <div className="relative isolate inline-block" style={{ perspective: "1000px" }}>
            <motion.button
              ref={btnRef}
              type="button"
              onClick={handleClick}
              whileTap={animate ? { scale: 0.97 } : undefined}
              whileHover={enable3D ? { z: 20 } : undefined}
              style={
                enable3D
                  ? {
                      x: sx,
                      y: sy,
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }
                  : undefined
              }
              className={cn(
                "group relative z-10 inline-flex items-center gap-2.5 rounded-full bg-white px-10 py-5 text-lg md:text-xl",
                "font-bold text-bb-pink will-change-transform",
                "shadow-[0_10px_30px_rgba(61,26,110,0.25)] hover:shadow-[0_25px_60px_rgba(61,26,110,0.55)]",
                "transition-shadow duration-300",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              )}
            >
              <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
              Empezar mi quiz ahora
            </motion.button>
            <BorderBeam duration={3.5} colorFrom="#FFFFFF" colorTo="#7DC720" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
