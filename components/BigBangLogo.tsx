"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Variant = "default" | "footer" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
  /** Texto accesible (default: "Big Bang Cali") */
  label?: string;
  /** Carga prioritaria (LoadingScreen, Hero) */
  priority?: boolean;
}

// Phase P: URL nueva del logo del cliente. CDN primario, fallback local si el
// CDN falla (caching o downtime). El dominio está whitelisted en next.config.
const LOGO_CDN =
  "https://assets.cdn.filesafe.space/cmpzRjKz3Lb2QJBXQTJw/media/6a0631e2e92818f121b6044a.png";
const LOGO_LOCAL = "/logo-big-bang.png";
const INTRINSIC_W = 382;
const INTRINSIC_H = 217;

/**
 * Logo Big Bang oficial.
 *  - default: usa el PNG con sus colores (rosa + outline lime + sombra purple)
 *  - footer:  el mismo PNG pero invertido a blanco vía CSS filter
 *  - compact: igual al default pero más chico para navs y FABs
 *
 * Estrategia de carga: intenta el CDN del cliente primero; si falla, cae al
 * PNG local en /public como red de seguridad.
 */
export function BigBangLogo({
  variant = "default",
  className,
  label = "Big Bang Cali",
  priority = false,
}: Props) {
  const [src, setSrc] = React.useState<string>(LOGO_CDN);

  const sizeClass =
    variant === "compact"
      ? "h-8 w-auto"
      : variant === "footer"
        ? "h-20 w-auto"
        : "h-20 w-auto";

  const invertFilter =
    variant === "footer" ? { filter: "brightness(0) invert(1)" } : undefined;

  return (
    <Image
      src={src}
      alt={label}
      width={INTRINSIC_W}
      height={INTRINSIC_H}
      priority={priority}
      style={invertFilter}
      className={cn("select-none", sizeClass, className)}
      onError={() => {
        if (src !== LOGO_LOCAL) setSrc(LOGO_LOCAL);
      }}
    />
  );
}
