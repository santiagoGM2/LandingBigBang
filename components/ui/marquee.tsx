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

  // Para que el loop sea seamless, la distancia entre el primer item de la
  // copia 1 y el primer item de la copia 2 debe ser exactamente el 50% del
  // ancho del track. Logramos eso poniendo el gap SOLO entre items dentro
  // de cada copia y agregando un padding-end del mismo tamaño a cada copia
  // (que actúa como separador hacia la siguiente). Sin esto, un gap en el
  // track padre genera un offset que produce un micro-jump al loopear.
  const innerStyle = vertical
    ? { gap, paddingBottom: gap }
    : { gap, paddingRight: gap };

  return (
    <div
      className={cn(
        "group relative flex w-full",
        // overflow-x-clip permite que contenido rotado/escalado extienda
        // verticalmente sin ser cortado, mientras que el scroll horizontal
        // del marquee sigue oculto.
        vertical ? "overflow-y-clip h-full flex-col" : "overflow-x-clip flex-row",
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
        style={{ animationDuration: `${duration}s`, willChange: "transform" }}
      >
        <div
          className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
          style={innerStyle}
        >
          {children}
        </div>
        <div
          className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
          style={innerStyle}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}
