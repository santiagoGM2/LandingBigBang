"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Balloons, type BalloonsHandle } from "@/components/ui/balloons";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { LOADING_COMPLETE_EVENT } from "@/components/LoadingScreen";
import { CODIGOS_DEC, type Categoria } from "@/lib/codigos-dec";
import { cn } from "@/lib/utils";

/**
 * Interleave de las 54 fotos del portafolio: round-robin por categoría
 * para que el marquee nunca muestre dos imágenes muy parecidas pegadas.
 * El orden es determinístico (no Math.random) → SSR-safe y consistente.
 */
function buildHeroImages(): Array<{ src: string; alt: string }> {
  const byCat: Record<Categoria, Array<{ src: string; alt: string }>> = {
    infantiles: [],
    elegantes: [],
    tematicos: [],
    romanticos: [],
    anchetas: [],
    minis: [],
  };
  CODIGOS_DEC.forEach((c) => byCat[c.categoria].push({ src: c.img, alt: c.alt }));

  const order: Categoria[] = [
    "infantiles",
    "elegantes",
    "romanticos",
    "minis",
    "tematicos",
    "anchetas",
  ];
  const maxLen = Math.max(...Object.values(byCat).map((a) => a.length));
  const out: Array<{ src: string; alt: string }> = [];
  for (let i = 0; i < maxLen; i++) {
    for (const cat of order) {
      const item = byCat[cat][i];
      if (item) out.push(item);
    }
  }
  return out;
}

const IMAGES = buildHeroImages();

const TAGLINE = "Decoraciones que se convierten en recuerdos";
const DESCRIPTION =
  "No es el presupuesto. Es saber exactamente qué hace que un momento se grabe para siempre.";
const CTA_TEXT = "Diseñar mi sorpresa ahora →";

export function Hero() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const balloonsRef = React.useRef<BalloonsHandle>(null);

  /* ─── Globos al cargar: cada visita, sin localStorage ──────────
     Si la LoadingScreen está activa, esperamos a su evento de cierre.
     Si ya cargó en la sesión (o no hay loading screen), disparamos a +800ms
     del mount. */
  React.useEffect(() => {
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const launch = () => {
      timer = setTimeout(() => balloonsRef.current?.launchAnimation(), 500);
    };

    const alreadyLoaded =
      typeof window !== "undefined" &&
      (() => {
        try {
          return sessionStorage.getItem("bb-loaded") === "1";
        } catch {
          return false;
        }
      })();

    if (alreadyLoaded) {
      launch();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    window.addEventListener(LOADING_COMPLETE_EVENT, launch, { once: true });
    return () => {
      window.removeEventListener(LOADING_COMPLETE_EVENT, launch);
      if (timer) clearTimeout(timer);
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-x-clip bg-bb-white"
    >
      <Balloons ref={balloonsRef} />

      {/* Wash radial bb-pink sutil hacia arriba */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(233,30,140,0.08),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-6 pb-2 text-center sm:pt-12 md:pt-20 lg:pt-16 lg:pb-4">
        {/* Tagline pill con glassmorphism leve */}
        <span className="inline-flex items-center gap-2 rounded-full border border-bb-purple/15 bg-bb-white/50 px-3 py-1 text-[11px] sm:text-sm font-bold text-bb-purple backdrop-blur-sm shadow-bb-soft">
          <span className="h-2 w-2 rounded-full bg-bb-pink" />
          {TAGLINE}
        </span>

        {/* Title — color bb-text con keyword en bb-pink */}
        <h1 className="mt-3 max-w-4xl text-[20px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight text-bb-text sm:mt-4">
          ¿Por qué algunas personas se convierten en el{" "}
          <span className="text-bb-pink">héroe de la familia</span> con una sola
          sorpresa… y otras gastan el doble y nadie recuerda nada?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bb-text/70 sm:mt-4 sm:text-base md:text-lg">
          {DESCRIPTION}
        </p>

        <div className="mt-5 flex justify-center sm:mt-6">
          <Button
            size="xl"
            onClick={() => open()}
            className="bg-bb-pink hover:bg-bb-pink/90 focus:ring-bb-pink/40"
          >
            <Sparkles className="h-5 w-5" />
            {CTA_TEXT}
          </Button>
        </div>
      </div>

      {/* Marquee. py-* generoso para que las tarjetas rotadas -2/+5 grados
          tengan espacio vertical y NO se recorten al rotar.
          overflow-y-visible permite que los extremos rotados salgan del
          tile sin que la section los corte (section ya es overflow-x-clip
          solamente, no overflow-hidden). */}
      <div className="relative z-10 flex-shrink-0 py-10 sm:py-12 md:py-14">
        <Marquee
          duration={30}
          className="!overflow-x-clip overflow-y-visible [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        >
          {IMAGES.map((img, i) => (
            <HeroTile key={img.src} img={img} index={i} />
          ))}
        </Marquee>
      </div>

      <a
        href="#espejo"
        aria-label="Bajar a la siguiente sección"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-bb-purple/60 hover:text-bb-pink"
      >
        <ChevronDown className="h-6 w-6 animate-bb-float" />
      </a>
    </section>
  );
}

function HeroTile({
  img,
  index,
}: {
  img: { src: string; alt: string };
  index: number;
}) {
  // Rotación alternada -2deg / +5deg. La rotación se aplica al hijo
  // interno; el wrapper externo lleva py-4 px-1 para absorber el bounding
  // box visual extra que genera el rotate() y EVITAR que los bordes se
  // recorten por el clip horizontal del marquee. Sin este buffer, las
  // esquinas superiores e inferiores quedaban cortadas con una línea
  // horizontal visible.
  const rot = index % 2 === 0 ? -2 : 5;

  return (
    <div className="shrink-0 px-1 py-4">
      <div
        style={{
          transform: `rotate(${rot}deg)`,
          boxShadow: "0 25px 60px -15px rgba(61, 26, 110, 0.4)",
        }}
        className={cn(
          "relative aspect-[3/4] w-[160px] overflow-hidden rounded-3xl sm:w-[180px] md:w-[200px]",
          "bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30",
          "ring-1 ring-bb-purple/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:[transform:scale(1.05)_rotate(0deg)] hover:z-10"
        )}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width:768px) 200px, 180px"
          className="object-cover"
          priority={index < 6}
        />
      </div>
    </div>
  );
}
