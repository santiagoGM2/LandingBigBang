"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Props {
  /** Cuántos cupos ya están ocupados esta semana */
  cuposOcupados?: number;
  /** Total de cupos por semana */
  cuposTotal?: number;
}

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

function nextMondayMidnight(): Date {
  const now = new Date();
  const result = new Date(now);
  const day = now.getDay(); // 0=dom, 1=lun
  const daysUntil = day === 1 ? 7 : (8 - day) % 7;
  result.setDate(now.getDate() + daysUntil);
  result.setHours(0, 0, 0, 0);
  return result;
}

interface Countdown {
  d: number;
  h: number;
  m: number;
  s: number;
  /** En el último día mostramos segundos */
  useSeconds: boolean;
}

function useCountdown(): Countdown | null {
  const [diff, setDiff] = React.useState<Countdown | null>(null);

  React.useEffect(() => {
    const target = nextMondayMidnight().getTime();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) {
        setDiff({ d: 0, h: 0, m: 0, s: 0, useSeconds: false });
        return;
      }
      const d = Math.floor(ms / 86_400_000);
      const h = Math.floor((ms % 86_400_000) / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      const useSeconds = d === 0;
      setDiff({ d, h, m, s, useSeconds });

      // Tick cada segundo en último día, cada minuto en otros casos
      const next = useSeconds ? 1000 : 60_000;
      timeoutId = setTimeout(tick, next);
    };

    tick();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return diff;
}

export function Escasez({ cuposOcupados = 2, cuposTotal = 3 }: Props) {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const restantes = Math.max(0, cuposTotal - cuposOcupados);
  const cupos = Array.from({ length: cuposTotal }, (_, i) => i < cuposOcupados);
  const cd = useCountdown();
  const animate = mounted && !reduced;

  return (
    <section className="relative overflow-hidden bg-bb-purple py-20 md:py-24 text-white">
      {/* Noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-60 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-bb-pink/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-bb-lime/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={animate ? { opacity: 0, y: 24 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-bb-lime">
              <CalendarClock className="h-4 w-4" /> Cupos esta semana
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-[1.05]">
              Solo aceptamos {cuposTotal} montajes de alta gama por semana
            </h2>
            <p className="mt-5 max-w-lg text-white/85 leading-relaxed">
              Para asegurar que cada detalle sea perfecto, cerramos cupos cada
              lunes. Si tu fecha es este o el próximo fin de semana, esto es
              urgente.
            </p>
            {cd && (
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-bb-lime">
                Cierra en
                {cd.useSeconds ? (
                  <>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.h}h</span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.m}m</span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.s}s</span>
                  </>
                ) : (
                  <>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.d}d</span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.h}h</span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-white tabular-nums">{cd.m}m</span>
                  </>
                )}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white/8 ring-1 ring-white/15 p-7 backdrop-blur-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-bb-lime">
              Disponibilidad
            </p>
            <div className="mt-4 flex items-center gap-3">
              {cupos.map((ocupado, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-4 transition-all",
                    ocupado ? "border-bb-pink" : "border-bb-lime"
                  )}
                  aria-label={ocupado ? "Cupo ocupado" : "Cupo disponible"}
                >
                  {ocupado ? (
                    <motion.div
                      aria-hidden
                      initial={animate ? { y: "100%" } : false}
                      whileInView={animate ? { y: 0 } : undefined}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 0.6,
                        delay: 0.12 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute inset-0 bg-bb-pink"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-bb-lime/0 animate-bb-pulse-soft"
                    />
                  )}
                  <span
                    className={cn(
                      "relative text-xs font-bold uppercase",
                      ocupado ? "text-white" : "text-bb-lime"
                    )}
                  >
                    {ocupado ? "Lleno" : "Libre"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-2xl font-extrabold">
              {restantes === 0
                ? "0 cupos disponibles"
                : restantes === 1
                ? "Queda 1 cupo"
                : `Quedan ${restantes} cupos`}
            </p>
            <Button
              size="lg"
              variant="lime"
              onClick={() => open()}
              className="mt-5 w-full"
            >
              Consultar disponibilidad de mi fecha
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
