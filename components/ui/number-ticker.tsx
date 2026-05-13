"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  /** Símbolo prefijo (ej. "+") */
  prefix?: string;
  /** Símbolo sufijo (ej. "%", "h") */
  suffix?: string;
  /** Duración en segundos */
  duration?: number;
  className?: string;
}

/**
 * Contador animado que arranca cuando entra al viewport. Usa useMotionValue
 * fuera del ciclo de render para no provocar re-renders en cada frame.
 */
export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, motionValue, rounded, duration]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display.toLocaleString("es-CO")}
      {suffix}
    </motion.span>
  );
}
