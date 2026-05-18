"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Cake,
  Baby,
  Sparkles,
  GraduationCap,
  Gift,
  MessageCircle,
  Target,
  MapPin,
  CreditCard,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface OcasionOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const OCASIONES: OcasionOption[] = [
  { value: "Su cumpleaños", label: "Su cumpleaños", icon: Cake },
  { value: "Nuestro aniversario", label: "Nuestro aniversario", icon: Heart },
  { value: "Está esperando un bebé", label: "Está esperando un bebé", icon: Baby },
  { value: "Se acaba de graduar", label: "Se acaba de graduar", icon: GraduationCap },
  { value: "Sorpresa sin motivo", label: "Quiero sorprenderla sin motivo", icon: Gift },
  { value: "Otra ocasión especial", label: "Otra ocasión especial", icon: Sparkles },
];

interface Bullet {
  icon: LucideIcon;
  text: string;
}

const BULLETS: Bullet[] = [
  {
    icon: Target,
    text: "Diseñado exactamente para la persona que quieres sorprender",
  },
  { icon: MapPin, text: "Entrega en tu puerta o recoge en tienda. Tú decides" },
  { icon: CreditCard, text: "Sin pago adelantado para reservar tu fecha" },
];

export function QuizInline() {
  const { openInline } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reduced;

  const handlePick = (ocasion: string) => {
    openInline({ ocasion });
  };

  return (
    <section id="empezar" className="bg-bb-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 items-start">
          {/* ─── Columna copy ─────────────────────────────────────── */}
          <div className="lg:pt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-bb-pink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              <Sparkles className="h-3.5 w-3.5" /> 60 segundos
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold leading-[1.05] text-bb-purple">
              Esa persona todavía no sabe lo que le espera
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-bb-text/80">
              60 segundos. 7 preguntas. Y nosotros nos encargamos del resto.
            </p>

            <ul className="mt-7 space-y-3 text-bb-text">
              {BULLETS.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bb-lime-soft text-bb-purple">
                      <Icon className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                    <span className="font-bold text-bb-purple/90">{b.text}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-7 text-sm text-bb-text/65 leading-relaxed">
              No te pedimos tarjeta. No te pedimos email. Solo cuéntanos a quién
              quieres dejar sin palabras.
            </p>
          </div>

          {/* ─── Columna form (card) ───────────────────────────────── */}
          <motion.div
            initial={animate ? { opacity: 0, y: 24 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative rounded-[24px] border-2 border-bb-pink-soft bg-white p-7 md:p-9",
              "shadow-[0_20px_60px_-20px_rgba(233,30,140,0.25)]"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-bb-purple/60">
                Paso 2 de 7
              </span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bb-pink-soft">
                <div className="h-full w-[28%] rounded-full bg-bb-pink" />
              </div>
            </div>

            <h3 className="mt-5 text-2xl md:text-3xl font-extrabold text-bb-purple leading-tight">
              ¿Qué está a punto de vivir esa persona?
            </h3>
            <p className="mt-1.5 text-sm text-bb-text/65">
              Elegí una y seguimos con el resto en un mini quiz de 60s.
            </p>

            <motion.div
              initial={animate ? "hidden" : false}
              whileInView={animate ? "visible" : undefined}
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                },
              }}
              className="mt-6 grid grid-cols-1 gap-2.5 md:grid-cols-2"
            >
              {OCASIONES.map((o) => {
                const Icon = o.icon;
                return (
                  <motion.button
                    key={o.value}
                    variants={
                      animate
                        ? {
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0 },
                          }
                        : undefined
                    }
                    whileTap={animate ? { scale: 0.97 } : undefined}
                    type="button"
                    onClick={() => handlePick(o.value)}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-2xl border-2 border-bb-purple/12 bg-white px-3 py-3.5",
                      "text-left font-bold text-bb-purple text-sm md:text-[15px] leading-tight",
                      "transition-all duration-200 hover:-translate-y-0.5",
                      "hover:border-bb-pink hover:bg-bb-pink-soft/40 hover:shadow-bb-pink",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30"
                    )}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-bb-pink-soft text-bb-pink transition-colors group-hover:bg-bb-pink group-hover:text-white">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
                    </span>
                    <span className="flex-1">{o.label}</span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-bb-purple/30 transition-all group-hover:translate-x-0.5 group-hover:text-bb-pink"
                      aria-hidden
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-bb-pink">
              Empezar a diseñar su sorpresa →
            </p>
            <p className="mt-1.5 text-xs text-bb-text/55">
              Gratis · Sin compromiso · Respuesta en menos de 15 minutos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
