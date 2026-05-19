"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

interface Testimonio {
  name: string;
  avatar: string;
  stars: number;
  content: string;
}

// Reseñas reales de Google Maps (Big Bang Piñatas y Regalos, Cali).
// Avatars provistos por el cliente desde sus reseñas públicas en Google.
const TESTIMONIOS: Testimonio[] = [
  {
    name: "Catalina Ordoñez",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjUMXPpKAVr1vzvsu6fwEnUGd33sRRmJ-sGHrAmgvLFdBY-A-jZt=w72-h72-p-rp-mo-ba2-br100",
    stars: 5,
    content:
      "Tiene todo lo que necesitas. Encontré todos mis accesorios para la fiesta neón que estoy organizando.",
  },
  {
    name: "Nicolás Gil",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjX7R0kyvlMgbcAsmGIzG_pYmxsSR83pZZ5A5kfq9E6IJpLIDiqKkA=w72-h72-p-rp-mo-ba2-br100",
    stars: 5,
    content:
      "Excelente, se encuentran todo tipo de productos de decoración, dulcería, bebidas, disfraces de halloween, decoración por temporadas, navidad, juguetes y hasta cosas para el hogar.",
  },
  {
    name: "David Parra",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjUGQmqkLpfWGZA_rr3oVgmPmg9CV1ckFqcH51m7Jjll0YWKmVgycQ=w72-h72-p-rp-mo-ba3-br100",
    stars: 5,
    content:
      "El precio de piñatería y demás para decoración de fiestas me parece estándar a los demás, cuentan con gran variedad de productos. Me gusta siempre adquirir los regalos para los premios que realizo en mis celebraciones de cumpleaños y su atención es buena.",
  },
  {
    name: "Linda L",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjXfPLAtuW3kguB28FPwP9GUDkb_ZI4oO6ISsFY1GIptS2gB6QkO=w72-h72-p-rp-mo-ba4-br100",
    stars: 5,
    content:
      "Siempre encuentro lo que necesito en cuanto a temáticas para fiestas o reuniones, los precios son asequibles, los moños y las decoraciones son lindas. Súper recomendadísimo.",
  },
  {
    name: "Jorge Alberto Garzón Ramírez",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjWPzWhvP_dZckT_Agew2iYOtOYguktlET0q3okpDaURO-Qjd98nPQ=w72-h72-p-rp-mo-ba3-br100",
    stars: 5,
    content: "Encuentras de todo para decoración y eventos a buen precio.",
  },
  {
    name: "Mario Andrés Osorio Zambrano",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjUuSczQHmLr4yU4J8oPeY6ClIkkoYm2z77mucp5nzTMSOwSR0yJ8A=w72-h72-p-rp-mo-ba4-br100",
    stars: 4,
    content:
      "Es un buen lugar para comprar decoración de fiestas de todo tipo, desde cumpleaños hasta bautizos. Tienen un buen surtido de elementos, acomodados cuidadosamente por color, facilitando su elección.",
  },
];

const INITIAL_VISIBLE = 3;

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Pi%C3%B1atas+y+Regalos+Big+Bang/@3.4294697,-76.5391016,17z/data=!4m8!3m7!1s0x8e30a690b1d36c01:0xcc3c6dabe1908fc1!8m2!3d3.4294643!4d-76.5365267!9m1!1b1";

export function Testimonios() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reduced;
  const [expanded, setExpanded] = React.useState(false);

  const visible = expanded ? TESTIMONIOS : TESTIMONIOS.slice(0, INITIAL_VISIBLE);
  const remaining = TESTIMONIOS.length - INITIAL_VISIBLE;

  return (
    <section className="relative w-full overflow-hidden bg-bb-gray py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-bb-purple">
            <span className="block">Lo que dicen las familias</span>
            <span className="block text-bb-pink">que ya nos confiaron</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-bb-text/75">
            Reseñas reales de Google Maps. Más de 1.000 familias decidieron
            crear su momento con nosotros.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {visible.map((t, i) => (
              <motion.article
                key={t.name}
                layout
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                exit={animate ? { opacity: 0, y: 20 } : undefined}
                transition={{
                  duration: 0.45,
                  delay: i >= INITIAL_VISIBLE ? (i - INITIAL_VISIBLE) * 0.08 : (i % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-bb-purple/10 bg-white p-6",
                  "shadow-[0_12px_30px_-15px_rgba(61,26,110,0.18)]",
                  "transition-shadow duration-300 hover:shadow-[0_20px_50px_-15px_rgba(233,30,140,0.28)]"
                )}
              >
                <div
                  className="mb-3 flex items-center gap-1"
                  aria-label={`${t.stars} de 5 estrellas`}
                >
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
                  {/* Wrapper externo SIN overflow-hidden: el badge G se sale del
                      círculo del avatar y necesita estar fuera del clip. */}
                  <div className="relative inline-block flex-shrink-0">
                    {/* Avatar: clip circular vive solo en este nivel */}
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white shadow-[0_2px_6px_-2px_rgba(61,26,110,0.25)]">
                      <Image
                        src={t.avatar}
                        alt={`Foto de perfil de ${t.name}`}
                        fill
                        sizes="48px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    {/* Badge G fuera del clip del avatar */}
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-white shadow-[0_2px_6px_-1px_rgba(0,0,0,0.18)] ring-1 ring-bb-text/10"
                    >
                      <GoogleGlyph className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-bb-text">
                      {t.name}
                    </div>
                    <div className="text-xs text-bb-text/60">
                      Reseña verificada en Google
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {remaining > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 border-bb-purple/15 bg-white px-6 py-3",
                "text-sm font-bold text-bb-purple",
                "transition-all duration-200",
                "hover:border-bb-pink hover:bg-bb-pink-soft hover:text-bb-pink",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30"
              )}
            >
              {expanded
                ? "Mostrar menos"
                : `Ver ${remaining} reseñas más`}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  expanded && "rotate-180"
                )}
              />
            </button>
          </div>
        )}

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

/** Glifo Google "G" mini para etiqueta de reseña verificada. */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.7 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.7 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.5 34.6 26.9 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.4 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.8 5.5l6.6 5.6C42.4 36 44 30.4 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
