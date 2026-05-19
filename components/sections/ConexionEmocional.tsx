"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Compass,
  Eye,
  Heart,
  HandHeart,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Emocion {
  key: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

const EMOCIONES: Emocion[] = [
  {
    key: "magia",
    label: "Magia",
    desc: "Que sienta que entró a otro mundo",
    icon: Sparkles,
  },
  {
    key: "aventura",
    label: "Aventura",
    desc: "Que sienta que todo es posible",
    icon: Compass,
  },
  {
    key: "asombro",
    label: "Asombro",
    desc: "Que se quede sin palabras al entrar",
    icon: Eye,
  },
  {
    key: "amor",
    label: "Amor",
    desc: "Que sepa sin dudas cuánto la quieres",
    icon: Heart,
  },
  {
    key: "ternura",
    label: "Ternura",
    desc: "Que sienta que todo fue pensado para esa persona",
    icon: HandHeart,
  },
  {
    key: "orgullo",
    label: "Orgullo",
    desc: "Que sienta que su logro merece celebrarse",
    icon: Trophy,
  },
];

export function ConexionEmocional() {
  const { openInline } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = React.useState<Emocion | null>(null);

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

  const handleCTA = () => {
    if (selected) {
      openInline({ emocion: selected.label });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28"
      style={{
        backgroundImage:
          "radial-gradient(80% 60% at 100% 0%, rgba(233,30,140,0.06), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(125,199,32,0.05), transparent 60%), linear-gradient(180deg, #ffffff 0%, #fefafd 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Imagen con parallax */}
          <div
            ref={imageRef}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30 shadow-bb-soft md:aspect-[4/4]"
          >
            <Image
              src="/decoraciones/elegantes/mama-papa-cumpleanos-tia-rosa-rose-gold-mariposas.jpg"
              alt="Bouquet de cumpleaños con mariposas en rose gold"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/30 via-transparent to-transparent" />
          </div>

          {/* Copy */}
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.05] text-bb-purple">
              No estás eligiendo colores. Estás eligiendo cómo va a{" "}
              <span className="text-bb-pink">sentirse cuando abra esa puerta</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bb-text/80">
              Cada decoración que creamos tiene una intención emocional
              específica. ¿Cuál es la tuya?
            </p>
          </div>
        </div>

        {/* Grid de emociones clickables */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EMOCIONES.map((e) => {
            const Icon = e.icon;
            const isActive = selected?.key === e.key;
            return (
              <motion.button
                key={e.key}
                type="button"
                onClick={() => setSelected(e)}
                whileHover={mounted && !reduced ? { y: -4 } : undefined}
                whileTap={mounted && !reduced ? { scale: 0.98 } : undefined}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex items-start gap-4 rounded-3xl border-2 bg-white p-5 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
                  isActive
                    ? "border-bb-pink shadow-[0_20px_50px_-15px_rgba(233,30,140,0.55)]"
                    : "border-bb-purple/10 hover:border-bb-pink/60 shadow-bb-soft"
                )}
              >
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors",
                    isActive
                      ? "bg-bb-pink text-white"
                      : "bg-bb-pink-soft text-bb-pink group-hover:bg-bb-pink group-hover:text-white"
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden />
                </span>
                <div className="flex-1">
                  <p className="text-lg font-extrabold text-bb-purple">
                    {e.label}
                  </p>
                  <p className="mt-0.5 text-sm text-bb-text/70 leading-snug">
                    {e.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            size="lg"
            onClick={handleCTA}
            disabled={!selected}
            variant={selected ? "default" : "ghost"}
            className={!selected ? "opacity-60 cursor-not-allowed" : undefined}
          >
            {selected
              ? `Quiero que sientan ${selected.label.toLowerCase()} → Diseñar mi sorpresa`
              : "Elegí una emoción para empezar →"}
          </Button>
        </div>
      </div>
    </section>
  );
}
