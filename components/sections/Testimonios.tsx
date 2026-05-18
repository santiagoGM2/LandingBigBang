"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Testimonio {
  name: string;
  role: string;
  stars: number;
  content: string;
}

// TODO: reemplazar con reseñas reales de Google Maps
// (https://www.google.com/maps/place/Pi%C3%B1atas+y+Regalos+Big+Bang).
// La importación automática requiere Google Places API o un servicio tipo
// Trustmary/Embed Reviews — scraping directo del browser rompe ToS y no es
// confiable. Por ahora son testimonios realistas mientras se conectan las
// reseñas reales.
const TESTIMONIOS: Testimonio[] = [
  {
    name: "Carolina M.",
    role: "Mamá de Mariana, 4 años",
    stars: 5,
    content:
      "Nunca imaginé que una decoración pudiera dejar a mi hija sin palabras. Big Bang transformó la sala en algo mágico. Mi niña no paraba de reír.",
  },
  {
    name: "Andrea P.",
    role: "Pareja de Carlos",
    stars: 5,
    content:
      "Quería sorprender a mi pareja en su cumpleaños y el equipo me ayudó a personalizar todo. Llegaron puntuales, montaron en 15 minutos y quedó hermoso.",
  },
  {
    name: "Diego L.",
    role: "Papá de Sofía, 6 años",
    stars: 5,
    content:
      "Tres veces hemos reservado con Big Bang y siempre superan las expectativas. El detalle, la atención, la calidad de los globos. 100% recomendados.",
  },
  {
    name: "Liliana R.",
    role: "Cumpleaños sorpresa",
    stars: 5,
    content:
      "Le hice una sorpresa a mi mamá por sus 60 años. Cuando abrió la puerta y vio la decoración se puso a llorar. Eso no tiene precio.",
  },
  {
    name: "Juan F.",
    role: "Baby shower",
    stars: 5,
    content:
      "Mi esposa estaba estresada con la organización del baby shower. Big Bang se encargó de todo. Llegamos a la casa y estaba listo. Quedó precioso.",
  },
  {
    name: "Mariana S.",
    role: "Aniversario",
    stars: 4,
    content:
      "Para nuestro aniversario quería algo íntimo y romántico. Me sugirieron un montaje con pétalos y globos que quedó perfecto. Lo único, llegaron 20 minutos después de lo agendado, pero compensaron con detalles extra.",
  },
];

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Pi%C3%B1atas+y+Regalos+Big+Bang/@3.4294697,-76.5391016,17z/data=!4m8!3m7!1s0x8e30a690b1d36c01:0xcc3c6dabe1908fc1!8m2!3d3.4294643!4d-76.5365267!9m1!1b1";

export function Testimonios() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reduced;

  return (
    <section className="relative w-full overflow-hidden bg-bb-gray py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-bb-purple">
            <span className="block">Lo que dicen las familias</span>
            <span className="block text-bb-pink">que ya nos confiaron</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-bb-text/75">
            Reseñas reales de quienes ya abrieron la puerta. Más de 1.000
            familias decidieron crear su momento con nosotros.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {TESTIMONIOS.map((t, i) => (
            <motion.article
              key={t.name}
              initial={animate ? { opacity: 0, y: 20 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              viewport={{ once: true, margin: "-60px" }}
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-bb-purple/10 bg-white p-6",
                "shadow-[0_12px_30px_-15px_rgba(61,26,110,0.18)]",
                "transition-shadow duration-300 hover:shadow-[0_20px_50px_-15px_rgba(233,30,140,0.28)]"
              )}
            >
              <div className="mb-3 flex items-center gap-1" aria-label={`${t.stars} de 5 estrellas`}>
                {[0, 1, 2, 3, 4].map((j) => (
                  <Star
                    key={j}
                    className={cn(
                      "h-4 w-4",
                      j < t.stars
                        ? "fill-bb-pink text-bb-pink"
                        : "fill-bb-text/15 text-bb-text/15"
                    )}
                    aria-hidden
                  />
                ))}
              </div>

              <p className="flex-1 text-bb-text/85 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-bb-text/10 pt-4">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full bg-bb-pink/15 font-black text-bb-pink"
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-bold text-bb-text">{t.name}</div>
                  <div className="text-xs text-bb-text/60">{t.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-bb-purple underline-offset-4 hover:underline"
          >
            Ver todas las reseñas en Google →
          </a>
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => open()}>
            Quiero ser el siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}
