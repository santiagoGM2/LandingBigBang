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
  /** Carga prioritaria (LoadingScreen / Hero) */
  priority?: boolean;
}

/**
 * Logo Big Bang oficial. Renderiza el PNG en `/public/logo-big-bang.png` —
 * el cliente entregó esa ilustración como activo definitivo. El render
 * anterior era un SVG de texto plano que no representaba el logo real.
 *
 * Variantes:
 *  - default / compact: PNG tal como viene (alpha transparente).
 *  - footer: el PNG se sirve igual; el fondo del footer es bb-purple así
 *    que la ilustración con sus colores de marca queda legible. No usamos
 *    filter:invert porque ensucia los bordes si el alpha no es perfecto.
 */
export function BigBangLogo({
  variant = "default",
  className,
  label = "Big Bang Cali",
  priority = false,
}: Props) {
  const sizeClass =
    variant === "compact" ? "h-8 w-auto" : "h-20 w-auto";

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "relative inline-block select-none",
        sizeClass,
        className
      )}
      style={{ aspectRatio: "280 / 200" }}
    >
      <Image
        src="/logo-big-bang.png"
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) 224px, 160px"
        className="object-contain"
      />
    </span>
  );
}
