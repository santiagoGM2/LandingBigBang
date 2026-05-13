"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  /** Velocidad. Default 40s para un ciclo completo. */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Espacio entre items duplicados */
  gap?: string;
  /** Loop vertical (las tarjetas bajan/suben) */
  vertical?: boolean;
  className?: string;
}

/**
 * Marquee infinito con duplicado interno para loop seamless. CSS-only para
 * que no exija JS en runtime y respete prefers-reduced-motion vía globals.css.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
  gap = "1.5rem",
  vertical = false,
  className,
}: MarqueeProps) {
  const trackAnim = vertical
    ? reverse
      ? "animate-marquee-y-rev"
      : "animate-marquee-y"
    : reverse
      ? "animate-marquee-rev"
      : "animate-marquee";

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        vertical ? "h-full flex-col" : "flex-row",
        pauseOnHover && "[&_.bb-marquee-track:hover]:[animation-play-state:paused]",
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "bb-marquee-track flex shrink-0",
          vertical ? "flex-col" : "flex-row",
          trackAnim
        )}
        style={{ animationDuration: `${duration}s`, gap }}
      >
        <div className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")} style={{ gap }}>
          {children}
        </div>
        <div className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")} style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
