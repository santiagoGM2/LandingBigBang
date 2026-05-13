"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Hammer, PartyPopper, Star, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PartySticker } from "@/components/decor/PartySticker";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Paso {
  num: string;
  icon: LucideIcon;
  titulo: string;
  cuerpo: string;
}

const PASOS: Paso[] = [
  {
    num: "01",
    icon: Sparkles,
    titulo: "Eliges la identidad",
    cuerpo:
      "60 segundos con nuestro quiz interactivo. Nos cuentas qué quieres que sientan al entrar.",
  },
  {
    num: "02",
    icon: Hammer,
    titulo: "Nosotros montamos el escenario",
    cuerpo:
      "Diseñamos, producimos y entregamos. Tú solo abres la puerta el día del evento.",
  },
  {
    num: "03",
    icon: PartyPopper,
    titulo: "Tú te llevas el crédito",
    cuerpo:
      "Sonreís en las fotos. Recibís los abrazos. Te conviertes en el anfitrión que todos recordarán.",
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
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: entrance 2D liviano
        gsap.from(".como-card", {
          y: 32,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        return;
      }

      // Desktop: flip 3D dramático por card con stagger 0.18s
      gsap.from(".como-card", {
        rotateY: -90,
        z: -200,
        opacity: 0,
        stagger: 0.18,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Números gigantes detrás: entrada con yPercent y rotate sutil
      gsap.from(".como-num", {
        yPercent: 50,
        opacity: 0,
        rotate: -8,
        duration: 0.8,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // SVG path draw scrubbed por scroll
      gsap.to(".como-path", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [enableMotion] }
  );

  return (
    <section className="relative bg-bb-gray py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-bb-purple leading-tight">
            Tres pasos. Cero estrés.
          </h2>
          <p className="mt-3 text-bb-text/75">
            Lo único que tenés que hacer vos es abrir la puerta.
          </p>
        </div>

        <div
          ref={sectionRef}
          className="relative mt-16"
          style={{ perspective: "1400px" }}
        >
          <PartySticker
            icon={Star}
            size={44}
            color="#FFD93D"
            rotation={20}
            delay={0.5}
            className="absolute right-12 -top-6 z-30 hidden lg:block"
          />

          {/* SVG curve animado conectando los 3 pasos */}
          <svg
            aria-hidden
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
          >
            <path
              className="como-path"
              d="M 20 12 C 55 12, 55 40, 80 40 C 55 40, 55 68, 20 68"
              fill="none"
              stroke="#E91E8C"
              strokeWidth="0.35"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>

          {/* Layout alternated izq/der */}
          <div className="relative z-10 flex flex-col gap-10 md:gap-16">
            {PASOS.map((p, i) => {
              const Icon = p.icon;
              const isOdd = i % 2 === 1;
              return (
                <motion.div
                  key={p.num}
                  whileHover={enableMotion ? { y: -8, scale: 1.02 } : undefined}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={cn(
                    "como-card w-full will-change-transform md:w-[48%]",
                    isOdd ? "md:self-end" : "md:self-start"
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-3xl p-8 md:p-10",
                      "bg-gradient-to-br from-white via-white to-bb-pink/5",
                      "border border-bb-pink/10",
                      "shadow-[0_18px_40px_-15px_rgba(61,26,110,0.18)]",
                      "transition-shadow duration-300",
                      "hover:shadow-[0_30px_60px_-15px_rgba(233,30,140,0.35)]"
                    )}
                  >
                    {/* Número gigante con depth real (animado por GSAP) */}
                    <span
                      aria-hidden
                      className="como-num pointer-events-none absolute -right-3 -top-12 select-none text-[10rem] font-black leading-none text-bb-pink-soft"
                      style={{ transform: "translateZ(-80px)" }}
                    >
                      {p.num}
                    </span>

                    <div className="relative">
                      <div className="grid h-24 w-24 place-items-center rounded-full bg-bb-lime-soft text-bb-purple transition-transform duration-300 group-hover:rotate-[8deg]">
                        <Icon className="h-12 w-12" aria-hidden strokeWidth={2} />
                      </div>
                      <h3 className="mt-7 text-xl md:text-2xl font-extrabold text-bb-purple">
                        {p.titulo}
                      </h3>
                      <p className="mt-2 text-bb-text/75 leading-relaxed">
                        {p.cuerpo}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Button size="lg" onClick={() => open()}>
            Empezar mi quiz de 60 segundos
          </Button>
        </div>
      </div>
    </section>
  );
}
