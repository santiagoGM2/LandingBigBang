"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "footer" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
  /** Texto accesible (default: "Big Bang Cali") */
  label?: string;
  /** Carga prioritaria (no aplica al SVG inline, se mantiene por compat) */
  priority?: boolean;
}

/**
 * Logo Big Bang oficial renderizado inline como SVG. Garantiza fondo
 * transparente y permite cambiar colores sin trucos de filter:invert (que
 * pintaba un cuadrado blanco cuando el PNG no tenía alpha limpio).
 *
 *  - default / compact: rosa relleno + outline lime + drop-shadow purple
 *  - footer:            mismo trazo en blanco puro, drop-shadow translúcido
 */
export function BigBangLogo({
  variant = "default",
  className,
  label = "Big Bang Cali",
}: Props) {
  const sizeClass =
    variant === "compact" ? "h-8 w-auto" : "h-20 w-auto";

  const isFooter = variant === "footer";
  const fill = isFooter ? "#ffffff" : "#E91E8C";
  const stroke = isFooter ? "#ffffff" : "#7DC720";
  const shadowMatrix = isFooter
    ? "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
    : "0 0 0 0 0.239  0 0 0 0 0.102  0 0 0 0 0.431  0 0 0 1 0";

  return (
    <svg
      viewBox="0 0 280 200"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", sizeClass, className)}
    >
      <defs>
        <filter id="bb-shadow" x="-10%" y="-10%" width="120%" height="125%">
          <feOffset dx="0" dy="4" />
          <feColorMatrix type="matrix" values={shadowMatrix} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        filter="url(#bb-shadow)"
        fontFamily="Nunito, system-ui, sans-serif"
        fontWeight={900}
        textAnchor="middle"
        paintOrder="stroke"
      >
        <text
          x={140}
          y={88}
          fontSize={84}
          stroke={stroke}
          strokeWidth={6}
          strokeLinejoin="round"
          fill={fill}
        >
          BIG
        </text>
        <text
          x={140}
          y={170}
          fontSize={84}
          stroke={stroke}
          strokeWidth={6}
          strokeLinejoin="round"
          fill={fill}
        >
          BANG
        </text>
      </g>
    </svg>
  );
}
