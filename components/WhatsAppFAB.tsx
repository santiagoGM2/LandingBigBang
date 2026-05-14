"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { waLink } from "@/lib/utils";
import { trackWaClick } from "@/lib/analytics";
import { useHasMounted } from "@/lib/use-has-mounted";

const DEFAULT_MSG =
  "Hola, vi su página y me gustaría asesoría para crear una sorpresa inolvidable.";

const SCROLL_HINT_KEY = "bb-whatsapp-hinted";
const SCROLL_HINT_DURATION = 4_000;
const SCROLL_TRIGGER_RATIO = 0.3;
const WA_GREEN = "#25D366";

/** Icono oficial de WhatsApp en SVG inline (Lucide no lo trae por marca) */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function WhatsAppFAB() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const enableMotion = mounted && !reduced;
  const [hintOpen, setHintOpen] = React.useState(false);

  // Burbuja al primer scroll > 30% del viewport, una sola vez por sesión
  React.useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SCROLL_HINT_KEY)) return;
    } catch {
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let triggered = false;

    const onScroll = () => {
      if (triggered) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const ratio = window.scrollY / total;
      if (ratio < SCROLL_TRIGGER_RATIO) return;

      triggered = true;
      setHintOpen(true);
      try {
        sessionStorage.setItem(SCROLL_HINT_KEY, "1");
      } catch {
        /* ignore */
      }
      hideTimer = setTimeout(() => setHintOpen(false), SCROLL_HINT_DURATION);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [mounted]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {hintOpen && (
          <motion.div
            initial={enableMotion ? { opacity: 0, y: 10, scale: 0.95 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={enableMotion ? { opacity: 0, y: 10, scale: 0.95 } : undefined}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative max-w-[260px] rounded-2xl bg-white px-4 py-3 text-sm font-bold text-bb-purple shadow-bb-soft ring-1 ring-bb-purple/10"
          >
            Pregunta lo que necesites
            <button
              onClick={() => setHintOpen(false)}
              aria-label="Cerrar sugerencia"
              type="button"
              className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-bb-purple text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white ring-1 ring-bb-purple/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={waLink(DEFAULT_MSG)}
        target="_blank"
        rel="noopener"
        aria-label="Hablar por WhatsApp con Big Bang Cali"
        onClick={() => trackWaClick("fab")}
        whileHover={enableMotion ? { scale: 1.08 } : undefined}
        whileTap={enableMotion ? { scale: 0.95 } : undefined}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{ backgroundColor: WA_GREEN }}
        className="group relative grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.45)]"
      >
        {/* Pulse ring: late, espera, late, espera. Phase R lo sutilizó para
            no competir con el contenido en secciones de fondo oscuro. */}
        {enableMotion && (
          <motion.span
            aria-hidden
            style={{ backgroundColor: WA_GREEN }}
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.25], opacity: [0.25, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 1.5,
            }}
          />
        )}
        <WhatsAppIcon className="relative h-6 w-6" />
      </motion.a>
    </div>
  );
}
