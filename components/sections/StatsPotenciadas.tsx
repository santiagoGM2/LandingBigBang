"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PartyPopper, Zap, Palette, Truck, type LucideIcon } from "lucide-react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Stat {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  caption: string;
  micro: string;
}

const STATS: Stat[] = [
  {
    icon: PartyPopper,
    value: 80,
    prefix: "+",
    title: "fiestas decoradas",
    caption: "Cada montaje con su propia historia.",
    micro: "en los últimos 12 meses",
  },
  {
    icon: Zap,
    value: 24,
    prefix: "<",
    suffix: "h",
    title: "respuesta garantizada",
    caption: "Tu primera asesoría sin esperas.",
    micro: "promedio real de los últimos 60 leads",
  },
  {
    icon: Palette,
    value: 50,
    prefix: "+",
    title: "temáticas disponibles",
    caption: "Y todas se personalizan al 100%.",
    micro: "codigo DEC-001 al DEC-050 + a medida",
  },
  {
    icon: Truck,
    value: 100,
    suffix: "%",
    title: "entrega rápida en Cali",
    caption: "Montaje el mismo día del evento.",
    micro: "Yumbo, Palmira y Jamundí con transporte aparte",
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StatsPotenciadas() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced || !mounted || !gridRef.current) return;
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      // Entrance básico: translateY 40 → 0, opacity 0 → 1, stagger 60ms
      tl.from(".bb-stat-card", {
        y: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
      });

      // Flip 3D después del entrance (solo desktop)
      if (!isMobile) {
        tl.from(
          ".bb-stat-card",
          {
            rotateY: -90,
            stagger: 0.08,
            duration: 0.55,
            ease: "back.out(1.2)",
          },
          "-=0.15"
        );
      }
    },
    { scope: gridRef, dependencies: [mounted, reduced] }
  );

  return (
    <section className="relative bg-bb-pink-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-bb-purple leading-tight">
            Lo que hay detrás del recuerdo
          </h2>
          <p className="mt-3 text-bb-text/75">
            Números que se traducen en montajes que se sienten cuidados.
          </p>
        </div>

        <div className="relative mt-12">
          {/* Línea decorativa horizontal (solo desktop) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[140px] z-0 hidden lg:block"
            height="2"
            width="100%"
          >
            <line
              x1="6%"
              x2="94%"
              y1="1"
              y2="1"
              stroke="#E91E8C"
              strokeWidth="2"
              strokeDasharray="2 8"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>

          <div
            ref={gridRef}
            className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: "1500px" }}
          >
            {STATS.map((s, i) => (
              <StatCard key={s.title} stat={s} index={i} reduced={!!reduced} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => open()}>
            Quiero empezar mi historia
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, reduced }: { stat: Stat; index: number; reduced: boolean }) {
  const Icon = stat.icon;
  const mounted = useHasMounted();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });
  // ±10° de tilt — claramente perceptible
  const rotX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  // Glow rotante que sigue al cursor (composed con motion template)
  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233,30,140,0.16), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !mounted) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const enableTilt = mounted && !reduced;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={enableTilt ? { z: 30, scale: 1.03 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={
        enableTilt
          ? {
              transformStyle: "preserve-3d",
              rotateX: rotX,
              rotateY: rotY,
            }
          : { transformStyle: "preserve-3d" }
      }
      className={cn(
        "bb-stat-card group relative isolate rounded-3xl border border-bb-pink/10 p-8",
        "bg-gradient-to-br from-white via-white to-bb-pink/5",
        "shadow-[0_20px_50px_-12px_rgba(61,26,110,0.18)]",
        "hover:shadow-[0_35px_80px_-15px_rgba(61,26,110,0.35)]",
        "transition-shadow duration-300 will-change-transform"
      )}
    >
      {/* Glow rotante en hover (sigue al cursor) */}
      {mounted && (
        <motion.span
          aria-hidden
          style={{ background: glowBg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {/* Numerador decorativo en esquina, plano más cercano al fondo */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 text-xs font-bold text-bb-purple/15"
        style={{ transform: "translateZ(2px)" }}
      >
        0{index + 1}
      </span>

      {/* Capas con translateZ creciente para generar 4 planos de profundidad */}
      <div
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bb-pink-soft text-bb-pink transition-colors group-hover:bg-bb-pink group-hover:text-white"
        style={{ transform: "translateZ(25px)" }}
      >
        <Icon className="h-6 w-6" aria-hidden strokeWidth={2.2} />
      </div>

      <div
        className="relative mt-5 text-5xl font-extrabold leading-none text-bb-purple md:text-6xl"
        style={{ transform: "translateZ(40px)" }}
      >
        <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
      </div>

      <p
        className="relative mt-3 font-bold text-bb-text"
        style={{ transform: "translateZ(15px)" }}
      >
        {stat.title}
      </p>
      <p
        className="relative mt-1 text-sm text-bb-text/65"
        style={{ transform: "translateZ(15px)" }}
      >
        {stat.caption}
      </p>
      <p
        className="relative mt-3 text-[11px] uppercase tracking-wide text-bb-text/45"
        style={{ transform: "translateZ(5px)" }}
      >
        {stat.micro}
      </p>
    </motion.div>
  );
}
