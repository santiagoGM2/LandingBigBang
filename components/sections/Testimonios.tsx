"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  TestimonialStack3D,
  type Testimonial,
} from "@/components/ui/testimonial-stack-3d";
import { Button } from "@/components/ui/button";
import { PartySticker } from "@/components/decor/PartySticker";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

const TESTIMONIOS: Testimonial[] = [
  {
    id: 1,
    name: "María José, mamá de Emiliano (3 años)",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    description:
      "Pensé que un cumpleaños temático era solo para Instagram. Cuando Emiliano abrió la puerta y vio el Spider-Man, lloró de felicidad. Mi mamá no lo creía. Ese día entendí que Big Bang no decora fiestas, regala recuerdos.",
  },
  {
    id: 2,
    name: "Andrea, pareja de Carlos",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    description:
      "Quería sorprender a mi pareja en nuestro aniversario y no sabía cómo. Les mandé el código DEC-039, contesté el quiz y a los 20 minutos ya estaban diseñando algo único. Carlos todavía habla de esa noche.",
  },
  {
    id: 3,
    name: "Innovex SAS · Lanzamiento de producto",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    description:
      "Nos cotizaron en 3 lugares. Big Bang fue el único que entendió que no buscábamos globos, buscábamos que el cliente sintiera que estaba entrando a algo nuevo. El espacio quedó increíble. Lo repetimos.",
  },
];

const BLOB_VARIANTS = [
  "M421,300 Q393,374 320,397 Q247,420 174,381 Q101,342 95,265 Q89,188 158,141 Q227,94 304,107 Q381,120 411,193 Q441,266 421,300 Z",
  "M431,275 Q400,360 320,388 Q240,416 170,374 Q100,332 102,251 Q104,170 175,131 Q246,92 322,109 Q398,126 425,194 Q452,262 431,275 Z",
  "M411,310 Q390,380 315,402 Q240,424 165,385 Q90,346 94,266 Q98,186 165,141 Q232,96 310,107 Q388,118 420,192 Q452,266 411,310 Z",
];

export function Testimonios() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const enableMotion = mounted && !reduced;

  return (
    <section className="relative overflow-hidden bg-bb-gray py-20 md:py-28">
      {/* Blob morphing detrás del carrusel */}
      <svg
        aria-hidden
        viewBox="0 0 500 500"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl md:h-[820px] md:w-[820px]"
      >
        <motion.path
          fill="#E91E8C"
          animate={enableMotion ? { d: BLOB_VARIANTS } : undefined}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          d={BLOB_VARIANTS[0]}
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          {/* Corazón decorativo al lado del título */}
          <PartySticker
            icon={Heart}
            size={36}
            color="#E91E8C"
            rotation={-12}
            delay={0.3}
            className="absolute -left-2 -top-4 md:-left-12 md:-top-6"
          />
          <h2 className="text-3xl md:text-5xl font-extrabold text-bb-purple leading-tight">
            Lo que dicen los que ya cruzaron la puerta
          </h2>
          <p className="mt-3 text-bb-text/75">
            Tres historias reales. La próxima podría ser la tuya.
          </p>
        </div>

        <div className="mt-16">
          <TestimonialStack3D items={TESTIMONIOS} />
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => open()}>
            Quiero ser el siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}
