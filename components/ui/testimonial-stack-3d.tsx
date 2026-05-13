"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/lib/use-media-query";
import { useHasMounted } from "@/lib/use-has-mounted";

export interface Testimonial {
  id: number | string;
  name: string;
  avatar: string;
  description: string;
}

interface Props {
  items: Testimonial[];
  className?: string;
}

const SWIPE_THRESHOLD = 100;
const FLING_DURATION = 0.5;
const FLING_DISTANCE = 620;

/**
 * Stack 3D real. La card frontal en Z=0, las siguientes en Z=-80 y Z=-160.
 * Drag horizontal: si supera 100px, fling con duración 800ms (rotateY 25° +
 * Z+200 + opacity 0). Las traseras avanzan en profundidad. Si no supera,
 * spring-back. En mobile cae a swipe horizontal 2D, sin Z.
 */
export function TestimonialStack3D({ items, className }: Props) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const mounted = useHasMounted();
  const enableMotion = mounted && !reduced;
  const enable3D = enableMotion && desktop;

  // order[0] siempre es el id del frontal. Avanzar = shift left.
  const [order, setOrder] = React.useState<Array<string | number>>(() =>
    items.map((t) => t.id)
  );
  const [exitingId, setExitingId] = React.useState<string | number | null>(null);

  const advance = React.useCallback(() => {
    setOrder((o) => [...o.slice(1), o[0]]);
    setExitingId(null);
  }, []);

  // Auto-rotate cada 8s si no está exitiendo
  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (exitingId === null) {
        setOrder((o) => [...o.slice(1), o[0]]);
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, [reduced, exitingId]);

  const frontId = order[0];
  const frontIndex = items.findIndex((t) => t.id === frontId);
  const currentNumber = frontIndex + 1;

  return (
    <div
      className={cn("relative mx-auto w-full max-w-2xl", className)}
      style={enable3D ? { perspective: "1200px" } : undefined}
    >
      {/* Indicador "X de N" */}
      <div className="absolute -top-2 right-0 z-30 rounded-full bg-bb-purple px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-bb-soft">
        {currentNumber} <span className="opacity-60">de {items.length}</span>
      </div>

      <div className="relative h-80 md:h-72">
        {items.map((t) => {
          const position = order.indexOf(t.id);
          return (
            <StackCard
              key={t.id}
              testimonial={t}
              position={position}
              desktop={desktop}
              enableMotion={enableMotion}
              isExiting={exitingId === t.id}
              onFling={() => setExitingId(t.id)}
              onFlingDone={advance}
            />
          );
        })}
      </div>
    </div>
  );
}

function StackCard({
  testimonial,
  position,
  desktop,
  enableMotion,
  isExiting,
  onFling,
  onFlingDone,
}: {
  testimonial: Testimonial;
  position: number;
  desktop: boolean;
  enableMotion: boolean;
  isExiting: boolean;
  onFling: () => void;
  onFlingDone: () => void;
}) {
  const mounted = useHasMounted();
  const isFront = position === 0;
  const x = useMotionValue(0);
  // Pequeña inclinación visual al arrastrar (no afecta el target final)
  const dragRotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);

  // SSR + primer paint: solo el front renderiza, sin inline transform.
  // Post-mount: el stack 3D entero con sus motion values.
  if (!mounted) {
    if (!isFront) return null;
    return (
      <div className="absolute inset-0">
        <CardContent t={testimonial} />
      </div>
    );
  }

  // Targets por posición (desktop 3D, mobile 2D fade-only)
  const targetZ = desktop ? (position === 0 ? 0 : position === 1 ? -80 : -160) : 0;
  const targetOpacity = position === 0 ? 1 : desktop ? (position === 1 ? 0.5 : 0.3) : 0;
  const targetScale = desktop ? (position === 0 ? 1 : position === 1 ? 0.94 : 0.88) : 1;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isFront || !enableMotion) return;
    if (Math.abs(info.offset.x) < SWIPE_THRESHOLD) {
      // Spring back
      animate(x, 0, { type: "spring", stiffness: 380, damping: 32 });
      return;
    }
    const dir = info.offset.x > 0 ? 1 : -1;
    onFling();
    // Fling 800ms — equivalente a gsap.to con power2.in
    const controls = animate(x, FLING_DISTANCE * dir, {
      duration: FLING_DURATION,
      ease: [0.4, 0, 0.6, 1],
    });
    controls.then(() => {
      // Reset transform antes de que React renderice esta card como back
      x.set(0);
      onFlingDone();
    });
  };

  return (
    <motion.div
      animate={{
        z: targetZ,
        opacity: targetOpacity,
        scale: targetScale,
        rotateY: isExiting ? 25 : 0,
      }}
      style={{
        x,
        rotate: desktop && isFront ? dragRotate : 0,
        zIndex: 10 - position,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      drag={isFront && !isExiting && enableMotion ? "x" : false}
      dragMomentum={false}
      dragElastic={0.45}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute inset-0 will-change-transform",
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      )}
    >
      <CardContent t={testimonial} />
    </motion.div>
  );
}

function CardContent({ t }: { t: Testimonial }) {
  return (
    <div className="grid h-full place-items-center px-2 md:px-4">
      <div className="rounded-3xl bg-white p-8 md:p-10 shadow-bb-soft border border-bb-purple/10 text-center max-w-2xl">
        <div className="mx-auto mb-5 h-16 w-16 rounded-full overflow-hidden ring-4 ring-bb-pink-soft">
          <Image
            src={t.avatar}
            alt={t.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <blockquote className="text-base md:text-lg leading-relaxed text-bb-text">
          <span className="text-bb-pink text-3xl font-extrabold leading-none">&ldquo;</span>
          {t.description}
          <span className="text-bb-pink text-3xl font-extrabold leading-none">&rdquo;</span>
        </blockquote>
        <p className="mt-4 font-bold text-bb-purple">{t.name}</p>
      </div>
    </div>
  );
}
