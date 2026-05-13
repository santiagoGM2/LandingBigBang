"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useHasMounted } from "@/lib/use-has-mounted";

const COLORS = ["#E91E8C", "#7DC720", "#3D1A6E", "#FFD93D"] as const;

interface BalloonConfig {
  top: string;
  left: string;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

/** Posiciones deterministicas spread por el viewport. */
const PRESETS: BalloonConfig[] = [
  { top: "8%",  left: "4%",  size: 72, color: COLORS[0], delay: 0,   duration: 7.2 },
  { top: "22%", left: "88%", size: 54, color: COLORS[1], delay: 1.3, duration: 8.4 },
  { top: "62%", left: "2%",  size: 82, color: COLORS[2], delay: 2.4, duration: 9.1 },
  { top: "78%", left: "92%", size: 46, color: COLORS[3], delay: 0.6, duration: 6.6 },
  { top: "42%", left: "72%", size: 60, color: COLORS[0], delay: 1.8, duration: 7.8 },
  { top: "85%", left: "38%", size: 50, color: COLORS[1], delay: 3.0, duration: 8.2 },
  { top: "14%", left: "55%", size: 64, color: COLORS[3], delay: 2.2, duration: 9.4 },
  { top: "55%", left: "26%", size: 42, color: COLORS[2], delay: 1.0, duration: 10.2 },
];

interface Props {
  /** Cuántos globos mostrar en desktop (default 6, max 8) */
  count?: number;
  /** Cuántos en mobile (default 3) */
  mobileCount?: number;
  /** Opacidad uniforme (default 0.18) */
  opacity?: number;
}

export function FloatingBalloons({ count = 6, mobileCount = 3, opacity = 0.18 }: Props) {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  if (!mounted || reduced) return null;

  const desktopSet = PRESETS.slice(0, Math.min(count, PRESETS.length));
  const mobileSet = PRESETS.slice(0, Math.min(mobileCount, PRESETS.length));

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      >
        {desktopSet.map((b, i) => (
          <FloatingBalloon key={`d-${i}`} {...b} idx={i} opacity={opacity} />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden"
      >
        {mobileSet.map((b, i) => (
          <FloatingBalloon key={`m-${i}`} {...b} idx={i} opacity={opacity} />
        ))}
      </div>
    </>
  );
}

function FloatingBalloon({
  top,
  left,
  size,
  color,
  delay,
  duration,
  idx,
  opacity,
}: BalloonConfig & { idx: number; opacity: number }) {
  return (
    <motion.span
      style={{
        top,
        left,
        width: size,
        height: Math.round(size * 1.4),
        opacity,
      }}
      className="absolute"
      animate={{ y: [-20, 20, -20], rotate: [-3, 3, -3] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <BalloonSvg color={color} idx={idx} />
    </motion.span>
  );
}

function BalloonSvg({ color, idx }: { color: string; idx: number }) {
  const gradId = `bb-balloon-${idx}-${color.slice(1)}`;
  return (
    <svg
      viewBox="0 0 100 140"
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      <defs>
        <radialGradient id={gradId} cx="32%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="55%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="38" ry="48" fill={color} />
      <ellipse cx="50" cy="50" rx="38" ry="48" fill={`url(#${gradId})`} />
      <path d="M 45 95 L 50 102 L 55 95 Z" fill={color} />
      <path
        d="M 50 102 Q 47 120 51 138"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
