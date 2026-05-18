"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Hammer,
  PartyPopper,
  Star,
  Gift,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Paso {
  num: string;
  icon: LucideIcon;
  decor: LucideIcon;
  titulo: string;
  cuerpo: string;
}

const PASOS: Paso[] = [
  {
    num: "01",
    icon: Sparkles,
    decor: Star,
    titulo: "Eliges la identidad",
    cuerpo:
      "60 segundos con nuestro quiz interactivo. Nos cuentas qué quieres que sientan al entrar.",
  },
  {
    num: "02",
    icon: Hammer,
    decor: Sparkles,
    titulo: "Montamos el escenario",
    cuerpo:
      "Diseñamos, producimos y entregamos. Tú solo abres la puerta el día del evento.",
  },
  {
    num: "03",
    icon: PartyPopper,
    decor: Gift,
    titulo: "Te llevas el crédito",
    cuerpo:
      "Sonreís en las fotos. Recibís los abrazos. Te convertís en el anfitrión que todos recordarán.",
  },
];

export function ComoFunciona() {
  const { open } = useQuiz();
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const enableMotion = mounted && !reduced;

  useGSAP(
    () => {
      if (!enableMotion || !sectionRef.current) return;

      gsap.from(".como-funciona-card", {
        y: 60,
        rotate: -3,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(".como-funciona-path", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 55%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [enableMotion, mounted, reduced] }
  );

  return (
    <section className="relative w-full overflow-hidden bg-bb-gray py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-bb-purple">
            <span className="block">Tres pasos.</span>
            <span className="block text-bb-pink">Cero estrés.</span>
          </h2>
          <p className="mt-3 text-bb-text/75">
            Lo único que tenés que hacer vos es abrir la puerta.
          </p>
        </div>

        <div ref={sectionRef} className="relative mt-14 md:mt-20">
          {/* Conector SVG entre cards (solo desktop) */}
          <svg
            aria-hidden
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 top-1/2 hidden h-14 w-full -translate-y-1/2 lg:block"
          >
            <defs>
              <linearGradient
                id="como-funciona-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#E91E8C" />
                <stop offset="50%" stopColor="#3D1A6E" />
                <stop offset="100%" stopColor="#7DC720" />
              </linearGradient>
            </defs>
            <path
              className="como-funciona-path"
              d="M 100 50 Q 350 10 600 50 T 1100 50"
              stroke="url(#como-funciona-gradient)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              fill="none"
              strokeLinecap="round"
              pathLength="1"
              strokeDashoffset="1"
              opacity="0.65"
            />
          </svg>

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {PASOS.map((p) => {
              const Icon = p.icon;
              const Decor = p.decor;
              return (
                <div
                  key={p.num}
                  className={cn(
                    "como-funciona-card group relative overflow-hidden p-6 sm:p-7 lg:p-8",
                    "rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl",
                    "bg-white border border-bb-pink/10",
                    "shadow-[0_18px_40px_-15px_rgba(61,26,110,0.18)]",
                    "hover:shadow-[0_30px_60px_-15px_rgba(233,30,140,0.35)]",
                    "transition-shadow duration-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-4xl sm:text-5xl lg:text-6xl font-black leading-none text-bb-pink/25">
                      {p.num}
                    </span>
                    <div className="grid h-12 w-12 lg:h-14 lg:w-14 flex-shrink-0 place-items-center rounded-full bg-bb-lime-soft text-bb-purple transition-transform duration-300 group-hover:rotate-[8deg]">
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2} aria-hidden />
                    </div>
                  </div>

                  <h3 className="relative mt-5 text-lg md:text-xl lg:text-2xl font-extrabold leading-tight text-bb-purple">
                    {p.titulo}
                  </h3>
                  <p className="relative mt-2 text-bb-text/75 leading-relaxed">
                    {p.cuerpo}
                  </p>

                  {/* Decoración party-themed en esquina inferior derecha */}
                  <Decor
                    aria-hidden
                    className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-20 text-bb-pink/10"
                    strokeWidth={1.5}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Button size="lg" onClick={() => open()}>
            Quiero abrir esa puerta →
          </Button>
          <p className="mt-3 text-sm text-bb-text/65">
            Gratis · Sin compromiso · Respuesta en menos de 15 minutos
          </p>
        </div>
      </div>
    </section>
  );
}
