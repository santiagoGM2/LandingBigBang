"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Aplica defaults globales a Framer Motion:
 *  - transition default con easing tasteful cubic-bezier(0.16, 1, 0.3, 1)
 *    (ease-out-expo, recomendado por taste-skill como base).
 *  - reducedMotion: "user" → respeta automáticamente la preferencia del
 *    sistema (prefers-reduced-motion). Cuando está activa, Framer
 *    deshabilita todas las animaciones y solo deja transiciones
 *    instantáneas, sin que cada componente tenga que checkear el flag.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
