"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyStackProps {
  children: React.ReactNode;
  className?: string;
  /** Altura total del scroll (en svh) durante el cual el bloque queda sticky */
  height?: string;
}

/**
 * Contenedor sticky con efecto parallax sutil sobre el contenido.
 * Pensado para la sección "Espejo de curiosidad".
 */
export function StickyStack({ children, className, height = "180svh" }: StickyStackProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.2]);

  return (
    <section ref={ref} className={cn("relative", className)} style={{ height }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ y, opacity }} className="flex h-full w-full items-center">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
