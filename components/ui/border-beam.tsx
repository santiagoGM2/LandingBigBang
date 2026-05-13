"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * Glow rotante alrededor del CTA principal. El padre necesita `relative`
 * (típicamente un wrapper con `overflow-hidden rounded-full` para enmarcar
 * el resplandor). Decorativo, aria-hidden.
 */
export function BorderBeam({
  className,
  duration = 6,
  colorFrom = "#E91E8C",
  colorTo = "#7DC720",
}: BorderBeamProps) {
  return (
    <span
      aria-hidden
      style={{
        background: `conic-gradient(from 0deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        animationDuration: `${duration}s`,
        animationName: "bb-beam-spin",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }}
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[140%]",
        "rounded-full opacity-60 blur-xl",
        className
      )}
    />
  );
}
