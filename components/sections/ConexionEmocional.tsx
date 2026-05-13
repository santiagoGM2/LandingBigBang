"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

const EMOCIONES = ["Magia", "Aventura", "Asombro", "Amor", "Ternura", "Orgullo"];

export function ConexionEmocional() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const ref = React.useRef<HTMLDivElement>(null);
  // Pasamos target solo post-mount para evitar el warning de scroll offset
  // que ocurre cuando framer intenta medir un ref antes de que esté en DOM.
  const { scrollYProgress } = useScroll({
    target: mounted ? ref : undefined,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const enableParallax = mounted && !reduced;

  return (
    <section ref={ref} className="relative bg-bb-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Imagen con parallax sutil — gated post-mount */}
        <motion.div
          style={enableParallax ? { y } : undefined}
          className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30 shadow-bb-soft md:aspect-[4/4]"
        >
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&h=1100&q=80"
            alt="Manos abriendo un regalo en una fiesta de cumpleaños"
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/30 via-transparent to-transparent" />
        </motion.div>

        {/* Copy */}
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.05] text-bb-purple">
            No eliges una foto.<br />
            <span className="text-bb-pink">Eliges una emoción.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-bb-text/80">
            Cada código representa un{" "}
            <span className="font-bold text-bb-pink">sentimiento específico</span>{" "}
            que queremos que tus invitados sientan al entrar. Tú eliges qué
            quieres que <span className="font-bold text-bb-pink">recuerden</span>{" "}
            de tu fiesta dentro de 20 años. La{" "}
            <span className="font-bold text-bb-pink">magia</span> no es la decoración,
            es la huella que deja.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {EMOCIONES.map((e) => (
              <li
                key={e}
                className="rounded-full bg-bb-pink-soft px-4 py-1.5 text-sm font-bold text-bb-pink"
              >
                {e}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Button size="lg" onClick={() => open()}>
              Elegir mi emoción
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
