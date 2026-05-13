"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BigBangLogo } from "@/components/BigBangLogo";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bb-loaded";
export const LOADING_COMPLETE_EVENT = "bb:loading-complete";

type Phase = "loading" | "revealing" | "done";

/**
 * Pantalla de carga full-screen, una sola vez por sesión. Logo entra con
 * scale 0 → 1 + rotateY -360° → 0 en 1.2s (overshoot spring). A los 1.5s
 * empieza un reveal upward por clip-path en 800ms. Al terminar dispara el
 * evento `bb:loading-complete` para que el Hero sincronice sus globos.
 *
 * Skippea entera bajo prefers-reduced-motion.
 */
export function LoadingScreen() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("loading");

  React.useEffect(() => {
    const dispatchDone = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new CustomEvent(LOADING_COMPLETE_EVENT));
      // Recalcular triggers (el clip-path del loading puede desalinear)
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignore — ScrollTrigger puede no estar registrado todavía */
      }
    };

    // Skip si reduce-motion o si ya cargó en esta sesión
    if (reduced) {
      setPhase("done");
      dispatchDone();
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setPhase("done");
        dispatchDone();
        return;
      }
    } catch {
      /* ignore — proceed con animación */
    }

    const t1 = window.setTimeout(() => setPhase("revealing"), 1500);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      dispatchDone();
    }, 2300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      style={{
        clipPath:
          phase === "revealing" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: "clip-path 800ms cubic-bezier(0.83, 0, 0.17, 1)",
      }}
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden",
        "bg-bb-purple"
      )}
    >
      {/* mesh + noise reutilizando el lenguaje de Espejo para coherencia */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 25% 35%, rgba(94,58,140,0.55) 0%, transparent 60%), radial-gradient(45% 55% at 80% 70%, rgba(20,7,46,0.6) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10 animate-bb-loading-logo" style={{ perspective: "800px" }}>
        <BigBangLogo variant="footer" className="h-28 md:h-36" />
      </div>
    </div>
  );
}
