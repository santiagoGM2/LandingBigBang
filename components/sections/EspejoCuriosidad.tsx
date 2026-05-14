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
import { cn } from "@/lib/utils";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Scene {
  num: string;
  className: string;
  img: { id: string; alt: string };
  text: React.ReactNode;
  atmosphere?: string;
  cta?: { label: string; onClick: () => void };
}

export function EspejoCuriosidad() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const { open } = useQuiz();

  const scenes: Scene[] = [
    {
      num: "01",
      className: "bb-escena-1",
      img: {
        id: "1530103862676-de8c9debad1d",
        alt: "Arco de globos colorido en montaje de fiesta",
      },
      text: (
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1]">
          ¿Por qué hay personas que con una sola sorpresa se convierten en el{" "}
          <span className="text-bb-lime">héroe de la familia</span>… y otras
          gastan el doble y nadie recuerda nada?
        </h2>
      ),
    },
    {
      num: "02",
      className: "bb-escena-2",
      img: {
        id: "1576337631739-92b58dca2c63",
        alt: "Mesa de dulces con donas y postres ornamentada",
      },
      text: (
        <p className="text-xl md:text-3xl leading-relaxed font-bold text-white/95">
          No es el precio lo que hace que alguien llore al abrir esa puerta. Es
          saber exactamente{" "}
          <span className="text-bb-lime">qué emoción querías</span> que sintiera.
        </p>
      ),
      atmosphere:
        "radial-gradient(60% 60% at 50% 50%, rgba(233,30,140,0.15) 0%, transparent 70%)",
    },
    {
      num: "03",
      className: "bb-escena-3",
      img: {
        id: "1492684223066-81342ee5ff30",
        alt: "Montaje completo de fiesta con globos",
      },
      text: (
        <p className="text-xl md:text-3xl leading-relaxed font-extrabold">
          No estás comprando globos. Estás comprando el momento en que esa
          persona se da cuenta de{" "}
          <span className="text-bb-lime">cuánto la amas</span>.
        </p>
      ),
      atmosphere:
        "radial-gradient(70% 60% at 50% 100%, rgba(125,199,32,0.15) 0%, transparent 70%)",
      cta: {
        label: "Quiero crear ese momento — Diseñar mi sorpresa gratis",
        onClick: () => open(),
      },
    },
  ];

  if (!mounted || reduced) {
    return <StaticEspejo scenes={scenes} />;
  }
  return <HorizontalEspejo scenes={scenes} />;
}

/* ─── Versión estática (SSR + reduce-motion + mobile fallback) ─── */
function StaticEspejo({ scenes }: { scenes: Scene[] }) {
  return (
    <section
      id="espejo"
      className="relative overflow-hidden bg-bb-purple text-white py-24 md:py-32"
    >
      <BackgroundLayers />
      <div className="relative z-10 mx-auto max-w-6xl px-6 space-y-24 md:space-y-32">
        {scenes.map((s, i) => (
          <SceneStatic key={s.num} scene={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function SceneStatic({ scene, index }: { scene: Scene; index: number }) {
  const isOdd = index % 2 === 1;
  return (
    <div
      className={cn(
        "relative grid items-center gap-10 md:grid-cols-2 md:gap-12",
        isOdd && "md:[&>div:first-child]:order-2"
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 select-none text-[10rem] md:text-[14rem] font-black leading-none text-bb-pink/15"
      >
        {scene.num}
      </span>
      <div className="relative z-10">
        {scene.text}
        {scene.cta && (
          <div className="mt-8">
            <Button size="lg" variant="lime" onClick={scene.cta.onClick}>
              {scene.cta.label}
            </Button>
          </div>
        )}
      </div>
      <div
        className="relative z-10 aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden rounded-3xl bg-gradient-to-br from-bb-pink-soft/20 to-bb-purple-soft/40"
        style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
      >
        <Image
          src={`https://images.unsplash.com/photo-${scene.img.id}?auto=format&fit=crop&w=720&h=900&q=80`}
          alt={scene.img.alt}
          fill
          sizes="(min-width:768px) 40vw, 90vw"
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}

/* ─── Versión dinámica con horizontal sticky scroll ───────────── */
function HorizontalEspejo({ scenes }: { scenes: Scene[] }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const transitionOverlayRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) return;

      const shift = (scenes.length - 1) * 100;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=160%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Movimiento principal del track horizontal (duration 3 = 1 por escena)
      tl.to(
        trackRef.current,
        { xPercent: -shift, duration: 3, ease: "none" },
        0
      );

      // Animación por escena DENTRO del timeline principal: garantiza que
      // las 3 escenas se animan, sin depender de ScrollTriggers anidados
      // que se rompen cuando el contenedor está pinned.
      // Escena 1 (0 - 1)
      tl.from(
        ".bb-escena-1 .bb-numero",
        { scale: 0.5, rotate: -15, opacity: 0, duration: 0.4 },
        0
      ).from(
        ".bb-escena-1 .bb-imagen",
        { y: 30, opacity: 0, rotateY: -10, duration: 0.4 },
        0.1
      );

      // Escena 2 (1 - 2)
      tl.from(
        ".bb-escena-2 .bb-numero",
        { scale: 0.5, rotate: -15, opacity: 0, duration: 0.4 },
        1
      ).from(
        ".bb-escena-2 .bb-imagen",
        { y: 30, opacity: 0, rotateY: -10, duration: 0.4 },
        1.1
      );

      // Escena 3 (2 - 3)
      tl.from(
        ".bb-escena-3 .bb-numero",
        { scale: 0.5, rotate: -15, opacity: 0, duration: 0.4 },
        2
      ).from(
        ".bb-escena-3 .bb-imagen",
        { y: 30, opacity: 0, rotateY: -10, duration: 0.4 },
        2.1
      );

      // Flash entre escenas 1→2 y 2→3
      if (transitionOverlayRef.current) {
        tl.to(
          transitionOverlayRef.current,
          { opacity: 0.6, duration: 0.08, ease: "power2.in" },
          0.95
        )
          .to(
            transitionOverlayRef.current,
            { opacity: 0, duration: 0.08, ease: "power2.out" },
            1.05
          )
          .to(
            transitionOverlayRef.current,
            { opacity: 0.6, duration: 0.08, ease: "power2.in" },
            1.95
          )
          .to(
            transitionOverlayRef.current,
            { opacity: 0, duration: 0.08, ease: "power2.out" },
            2.05
          );
      }

      // Fade-out de toda la sección al final del timeline → libera pin limpio
      tl.to(
        sectionRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        ">-0.3"
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  // Mobile guard
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return <StaticEspejo scenes={scenes} />;
  }

  return (
    <section
      id="espejo"
      ref={sectionRef}
      className="relative overflow-hidden bg-bb-purple text-white"
      style={{ height: "100vh" }}
    >
      <BackgroundLayers />

      <div className="absolute left-0 right-0 top-0 z-30 h-[3px] bg-bb-pink/20">
        <div
          ref={progressRef}
          className="h-full bg-bb-pink"
          style={{ width: "0%" }}
        />
      </div>

      <div
        ref={transitionOverlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 bg-bb-purple"
        style={{ opacity: 0 }}
      />

      <div
        ref={trackRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${scenes.length * 100}vw` }}
      >
        {scenes.map((s) => (
          <SceneHorizontal key={s.num} scene={s} />
        ))}
      </div>
    </section>
  );
}

function SceneHorizontal({ scene }: { scene: Scene }) {
  return (
    <div
      className={cn(
        "relative flex h-screen w-screen items-center px-6 md:px-16 lg:px-24",
        scene.className
      )}
    >
      {scene.atmosphere && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: scene.atmosphere }}
        />
      )}

      <span
        aria-hidden
        className="bb-numero pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none text-bb-pink/15 lg:right-12 will-change-transform"
        style={{ fontSize: "clamp(12rem, 32vw, 28rem)" }}
      >
        {scene.num}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
        <div className="relative">
          {scene.text}
          {scene.cta && (
            <div className="mt-9">
              <Button size="lg" variant="lime" onClick={scene.cta.onClick}>
                {scene.cta.label}
              </Button>
            </div>
          )}
        </div>

        <div
          className="relative justify-self-center"
          style={{ perspective: "1200px" }}
        >
          <div
            className="bb-imagen relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-bb-pink-soft/20 to-bb-purple-soft/40 will-change-transform"
            style={{
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={`https://images.unsplash.com/photo-${scene.img.id}?auto=format&fit=crop&w=720&h=900&q=80`}
              alt={scene.img.alt}
              fill
              sizes="40vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundLayers() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 25% 35%, rgba(94,58,140,0.55) 0%, transparent 60%), radial-gradient(45% 55% at 80% 70%, rgba(20,7,46,0.6) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />
    </>
  );
}
