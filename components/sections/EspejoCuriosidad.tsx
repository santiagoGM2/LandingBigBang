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
  img: { id: string; alt: string };
  text: React.ReactNode;
  /** Atmosphere overlay específica de la escena */
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
      img: {
        id: "1530103862676-de8c9debad1d",
        alt: "Arco de globos colorido en montaje de fiesta",
      },
      text: (
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1]">
          ¿Por qué recordamos algunas fiestas{" "}
          <span className="text-bb-lime">toda la vida</span> y otras las olvidamos al día siguiente?
        </h2>
      ),
    },
    {
      num: "02",
      img: {
        id: "1576337631739-92b58dca2c63",
        alt: "Mesa de dulces con donas y postres ornamentada",
      },
      text: (
        <p className="text-xl md:text-3xl leading-relaxed font-bold text-white/95">
          El cerebro humano olvida las palabras pero guarda para siempre{" "}
          <span className="text-bb-lime">el impacto visual</span> de un momento inesperado.
        </p>
      ),
      // Escena 2: bb-pink suave irradiando del centro
      atmosphere:
        "radial-gradient(60% 60% at 50% 50%, rgba(233,30,140,0.15) 0%, transparent 70%)",
    },
    {
      num: "03",
      img: {
        id: "1492684223066-81342ee5ff30",
        alt: "Montaje completo de fiesta infantil con niños",
      },
      text: (
        <p className="text-xl md:text-3xl leading-relaxed font-extrabold">
          No estás comprando decoraciones. Estás comprando acceso al nivel de{" "}
          <span className="text-bb-lime">anfitrión inolvidable</span>.
        </p>
      ),
      // Escena 3: bb-lime irradiando de abajo
      atmosphere:
        "radial-gradient(70% 60% at 50% 100%, rgba(125,199,32,0.15) 0%, transparent 70%)",
      cta: { label: "Quiero ese nivel", onClick: () => open() },
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

      const shift = (scenes.length - 1) * 100; // 200% para 3 escenas
      const sceneCount = scenes.length;

      // Timeline principal — duration 3 (1 por escena) para que las posiciones
      // absolutas tipo 0.95/1.10 caigan justo en los cruces.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
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

      // Movimiento horizontal del track
      tl.to(
        trackRef.current,
        { xPercent: -shift, duration: sceneCount, ease: "none" },
        0
      );

      // Fade-out de toda la sección en los últimos 13% del timeline
      tl.to(
        sectionRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.in" },
        ">-0.4"
      );

      // Flash transición rápida entre escenas 1→2 y 2→3
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

      // RotateY sutil en cada imagen durante el progreso de su escena
      const images = sectionRef.current.querySelectorAll<HTMLElement>(
        ".bb-espejo-scene-img"
      );
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { rotateY: -8, y: 20 },
          {
            rotateY: 8,
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${(i / sceneCount) * 180}% top`,
              end: `top+=${((i + 1) / sceneCount) * 180}% top`,
              scrub: 1,
            },
          }
        );
      });

      // Entrada de cada número decorativo: scale 0.5 → 1, rotateZ -15° → 0
      const numbers = sectionRef.current.querySelectorAll<HTMLElement>(
        ".bb-espejo-scene-num"
      );
      numbers.forEach((num, i) => {
        gsap.fromTo(
          num,
          { scale: 0.5, rotateZ: -15, opacity: 0.3 },
          {
            scale: 1,
            rotateZ: 0,
            opacity: 1,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${(i / sceneCount) * 180}% top`,
              end: `top+=${(i / sceneCount + 0.3 / sceneCount) * 180}% top`,
              scrub: 1,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  // Mobile guard: si entra mobile renderiza StaticEspejo
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

      {/* Barra de progreso superior */}
      <div className="absolute left-0 right-0 top-0 z-30 h-[3px] bg-bb-pink/20">
        <div
          ref={progressRef}
          className="h-full bg-bb-pink"
          style={{ width: "0%" }}
        />
      </div>

      {/* Overlay de transición — flash purple entre escenas */}
      <div
        ref={transitionOverlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 bg-bb-purple"
        style={{ opacity: 0 }}
      />

      {/* Track horizontal con las 3 escenas */}
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
    <div className="relative flex h-screen w-screen items-center px-6 md:px-16 lg:px-24">
      {/* Atmosphere overlay específico de esta escena */}
      {scene.atmosphere && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: scene.atmosphere }}
        />
      )}

      {/* Número gigante decorativo — animado por GSAP */}
      <span
        aria-hidden
        className="bb-espejo-scene-num pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none text-bb-pink/15 lg:right-12 will-change-transform"
        style={{ fontSize: "clamp(12rem, 32vw, 28rem)" }}
      >
        {scene.num}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Columna texto — sin Quote icon (eliminado) */}
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

        {/* Columna imagen con rotateY animado por GSAP */}
        <div className="relative justify-self-center" style={{ perspective: "1200px" }}>
          <div
            className="bb-espejo-scene-img relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-bb-pink-soft/20 to-bb-purple-soft/40 will-change-transform"
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
