"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

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

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) return; // mobile usa StaticEspejo via media query check abajo

      const shift = (scenes.length - 1) * 100; // 200% para 3 escenas

      gsap.to(trackRef.current, {
        xPercent: -shift,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Parallax interno sutil por imagen
      const images = sectionRef.current.querySelectorAll<HTMLElement>(
        ".bb-espejo-scene-img"
      );
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${(i / scenes.length) * 400}% top`,
              end: `top+=${((i + 1) / scenes.length) * 400}% top`,
              scrub: 1,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [scenes.length] }
  );

  // Mobile breakpoint guard via JS — si entra mobile renderiza StaticEspejo
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

      {/* Track horizontal con las 3 escenas */}
      <div
        ref={trackRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${scenes.length * 100}vw` }}
      >
        {scenes.map((s, i) => (
          <SceneHorizontal key={s.num} scene={s} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}

function SceneHorizontal({
  scene,
  isFirst,
}: {
  scene: Scene;
  isFirst: boolean;
}) {
  return (
    <div className="relative flex h-screen w-screen items-center px-6 md:px-16 lg:px-24">
      {/* Número gigante decorativo */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none text-bb-pink/15 lg:right-12"
        style={{ fontSize: "clamp(12rem, 32vw, 28rem)" }}
      >
        {scene.num}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Columna texto */}
        <div className="relative">
          {isFirst && (
            <Quote
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-16 h-24 w-24 text-bb-pink opacity-90 md:-left-6 md:-top-20 md:h-32 md:w-32"
              strokeWidth={2.2}
            />
          )}
          {scene.text}
          {scene.cta && (
            <div className="mt-9">
              <Button size="lg" variant="lime" onClick={scene.cta.onClick}>
                {scene.cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Columna imagen con parallax interno */}
        <div className="relative justify-self-center">
          <div
            className="bb-espejo-scene-img relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-bb-pink-soft/20 to-bb-purple-soft/40 will-change-transform"
            style={{
              transform: "rotateY(6deg) rotateX(-3deg)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
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
