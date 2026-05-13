"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EMOCIONES = ["Magia", "Aventura", "Asombro", "Amor", "Ternura", "Orgullo"];

export function ConexionEmocional() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);

  // Parallax vía GSAP ScrollTrigger (en vez de Framer useScroll) — evita
  // el warning de scroll offset porque GSAP no requiere ancestro positioned.
  useGSAP(
    () => {
      if (reduced || !mounted || !imageRef.current) return;

      gsap.fromTo(
        imageRef.current,
        { y: -30 },
        {
          y: 30,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [mounted, reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-bb-white py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Imagen con parallax via GSAP (post-mount, sin reduce-motion) */}
        <div
          ref={imageRef}
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
        </div>

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
