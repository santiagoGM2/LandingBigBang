"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

const SHOW_AFTER_PX = 600;
const HIDE_NEAR_BOTTOM_PX = 300;

/**
 * Mini CTA flotante en la base del viewport que aparece después de ~600px
 * de scroll y se oculta al volver al hero o cuando estamos cerca del CTA
 * Final (para no competir con él). Usa useScroll de Framer en vez de
 * window.addEventListener para respetar la guía de la skill ("never use
 * window.addEventListener scroll").
 *
 * Respeta prefers-reduced-motion: aparece sin animación de transform.
 */
export function ScrollCTA() {
  const { open } = useQuiz();
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (typeof window === "undefined") return;
    const docH =
      document.documentElement.scrollHeight - window.innerHeight;
    const nearBottom = docH - y < HIDE_NEAR_BOTTOM_PX;
    setVisible(y > SHOW_AFTER_PX && !nearBottom);
  });

  if (!mounted) return null;

  const initial = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 24, scale: 0.96 };
  const animate = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 };
  const exit = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 24, scale: 0.96 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-cta"
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:bottom-6"
        >
          <motion.button
            type="button"
            onClick={() => open()}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            whileHover={reduced ? undefined : { y: -1 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-bb-pink px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-12px_rgba(233,30,140,0.55)] ring-1 ring-bb-pink/40 hover:bg-bb-pink/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/35 sm:text-base"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Diseñar mi sorpresa →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
