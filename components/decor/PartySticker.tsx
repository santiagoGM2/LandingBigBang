"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  size?: number;
  color?: string;
  rotation?: number;
  delay?: number;
  className?: string;
}

/**
 * Sticker decorativo: icono Lucide con rotación leve, sombra coloreada y
 * entrada spring-bouncy al entrar al viewport.
 *
 * SSR + primer paint: <span> plano en estado FINAL (rotation aplicada, opacidad 1, scale 1).
 * Post-mount: motion.span con entrance spring.
 */
export function PartySticker({
  icon: Icon,
  size = 40,
  color = "#E91E8C",
  rotation = 0,
  delay = 0,
  className,
}: Props) {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();

  const sharedStyle: React.CSSProperties = {
    color,
    width: size,
    height: size,
    filter: `drop-shadow(0 6px 14px ${color}66)`,
  };

  if (!mounted || reduced) {
    return (
      <span
        aria-hidden
        style={{ ...sharedStyle, transform: `rotate(${rotation}deg)` }}
        className={cn(
          "pointer-events-none inline-flex items-center justify-center",
          className
        )}
      >
        <Icon className="h-full w-full" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden
      initial={{ scale: 0, rotate: rotation - 18, opacity: 0 }}
      whileInView={{ scale: 1, rotate: rotation, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 11, delay }}
      style={sharedStyle}
      className={cn(
        "pointer-events-none inline-flex items-center justify-center",
        className
      )}
    >
      <Icon className="h-full w-full" strokeWidth={2} aria-hidden />
    </motion.span>
  );
}
