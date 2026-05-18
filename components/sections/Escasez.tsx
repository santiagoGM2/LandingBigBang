"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartyParticles } from "@/components/decor/PartyParticles";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

interface Props {
  /** Cuántos cupos ya están ocupados esta semana */
  cuposOcupados?: number;
  /** Total de cupos por semana */
  cuposTotal?: number;
}

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

interface Countdown {
  h: number;
  m: number;
  s: number;
}

const STORAGE_KEY = "bb-escasez-deadline";
const WINDOW_MS = 60 * 60 * 1000;

function useCountdown(): Countdown | null {
  const [diff, setDiff] = React.useState<Countdown | null>(null);

  React.useEffect(() => {
    let deadline: number;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const parsed = stored ? parseInt(stored, 10) : NaN;
      if (Number.isFinite(parsed) && parsed > Date.now()) {
        deadline = parsed;
      } else {
        deadline = Date.now() + WINDOW_MS;
        sessionStorage.setItem(STORAGE_KEY, String(deadline));
      }
    } catch {
      deadline = Date.now() + WINDOW_MS;
    }

    // ref-shaped wrapper para que `tick` pueda referenciar el id antes de que
    // setInterval lo asigne (mantiene la closure simple sin un `let` que eslint
    // marca como "never reassigned").
    const handle: { id: ReturnType<typeof setInterval> | null } = { id: null };
    const tick = () => {
      const ms = deadline - Date.now();
      if (ms <= 0) {
        setDiff({ h: 0, m: 0, s: 0 });
        if (handle.id) clearInterval(handle.id);
        return;
      }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setDiff({ h, m, s });
    };

    tick();
    handle.id = setInterval(tick, 1000);
    return () => {
      if (handle.id) clearInterval(handle.id);
    };
  }, []);

  return diff;
}

export function Escasez({ cuposOcupados = 2, cuposTotal = 3 }: Props) {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const restantes = Math.max(0, cuposTotal - cuposOcupados);
  const cd = useCountdown();
  const animate = mounted && !reduced;

  const cuposLabel =
    restantes === 0
      ? "0 cupos disponibles esta semana"
      : restantes === 1
      ? "Queda solo 1 cupo esta semana"
      : `Quedan ${restantes} cupos esta semana`;

  return (
    <section className="relative w-full overflow-hidden bg-bb-purple py-16 sm:py-20 md:py-24 text-white">
      {/* Noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />

      {/* Partículas party-themed glyphs flotando de fondo */}
      <PartyParticles count={28} variant="white" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={animate ? { opacity: 0, y: 24 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-bb-lime/15 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-bb-lime">
            <CalendarClock className="h-4 w-4" />
            Cupos esta semana
          </span>

          <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-balance">
            Solo aceptamos {cuposTotal} montajes de alta gama por semana
          </h2>

          <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg text-white/80 text-balance">
            Para garantizar que cada sorpresa tenga la atención que merece.
            Cerramos cupos cada lunes.
          </p>

          {cd && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-bb-lime">
                Cierra en
              </p>
              <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3">
                <CountdownCell label="horas" value={cd.h} />
                <CountdownCell label="minutos" value={cd.m} />
                <CountdownCell label="segundos" value={cd.s} pulse />
              </div>
            </div>
          )}

          <div className="mt-10">
            <Button size="lg" variant="lime" onClick={() => open()}>
              Reservar mi cupo ahora →
            </Button>
            <p className="mt-3 text-sm text-white/70">{cuposLabel}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CountdownCell({
  label,
  value,
  pulse = false,
}: {
  label: string;
  value: number;
  pulse?: boolean;
}) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 px-2 py-3 sm:py-4">
      {pulse ? (
        <motion.span
          key={padded}
          initial={{ scale: 1.18, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-black leading-none tabular-nums text-white"
        >
          {padded}
        </motion.span>
      ) : (
        <span className="text-3xl sm:text-4xl md:text-5xl font-black leading-none tabular-nums text-white">
          {padded}
        </span>
      )}
      <span className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-white/70">
        {label}
      </span>
    </div>
  );
}
