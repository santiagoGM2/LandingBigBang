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
import { cn } from "@/lib/utils";

// 14 imágenes Unsplash con foco party-decor (refresh respecto al set anterior).
// Cuando el cliente entregue fotografía propia de sus montajes, reemplazar
// estos IDs por archivos en public/portfolio/* y sacar el `unoptimized`.
const IMAGES: Array<{ id: string; alt: string }> = [
  { id: "1530103862676-de8c9debad1d", alt: "Arco de globos rosados" },
  { id: "1513151233558-d860c5398176", alt: "Globos volando en celebración" },
  { id: "1606800052052-a08af7148866", alt: "Arco de globos pastel" },
  { id: "1530538095376-a4936b35b5f0", alt: "Mesa de cumpleaños decorada" },
  { id: "1492684223066-81342ee5ff30", alt: "Niños en fiesta de cumpleaños" },
  { id: "1518621012420-8ab0afd9e0c4", alt: "Setup de fiesta infantil" },
  { id: "1620735692151-26a7e0748429", alt: "Baby shower pastel y bohemio" },
  { id: "1623091410901-00e2d268901f", alt: "Globos coloridos en interior" },
  { id: "1576337631739-92b58dca2c63", alt: "Mesa dulce con donas" },
  { id: "1469371670807-013ccf25f16a", alt: "Cena romántica con velas" },
  { id: "1610890716171-6b1bb98ffd09", alt: "Celebración de grado" },
  { id: "1607344645866-009c320b63e0", alt: "Evento corporativo elegante" },
  { id: "1481253127861-534498168948", alt: "Decoración floral de bautizo" },
  { id: "1481419241566-7b8aac56e95f", alt: "Setup romántico aniversario" },
];

const TAGLINE = "Decoraciones que se convierten en recuerdos";
const DESCRIPTION =
  "Convierte un día común en el hito más importante de su año.";
const CTA_TEXT = "Ser el autor de esta sorpresa";

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
      timer = setTimeout(() => balloonsRef.current?.launchAnimation(), 800);
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
      className="relative isolate overflow-hidden bg-bb-white min-h-[90dvh] flex flex-col"
    >
      <Balloons ref={balloonsRef} />

      {/* Wash radial bb-pink sutil hacia arriba */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(233,30,140,0.08),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-4 pt-16 pb-12 text-center md:pt-20">
        {/* Tagline pill con glassmorphism leve */}
        <span className="inline-flex items-center gap-2 rounded-full border border-bb-purple/15 bg-bb-white/50 px-4 py-1.5 text-sm font-bold text-bb-purple backdrop-blur-sm shadow-bb-soft">
          <span className="h-2 w-2 rounded-full bg-bb-pink" />
          {TAGLINE}
        </span>

        {/* Title — color bb-text con keyword en bb-pink */}
        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.05] text-bb-text md:text-6xl lg:text-7xl">
          ¿Qué dirán de ti cuando
          <br className="hidden md:inline" />{" "}
          <span className="text-bb-pink">abran esa puerta?</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bb-text/70 md:text-xl">
          {DESCRIPTION}
        </p>

        <div className="mt-9 flex justify-center">
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

      {/* Marquee aspect 3/4, rotación alternada -2deg / 5deg, duration 40s */}
      <div className="relative z-10 pb-12 md:pb-16">
        <Marquee
          duration={40}
          className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        >
          {IMAGES.map((img, i) => (
            <HeroTile key={img.id} img={img} index={i} />
          ))}
        </Marquee>
      </div>

      <a
        href="#espejo"
        aria-label="Bajar a la siguiente sección"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-bb-purple/60 hover:text-bb-pink"
      >
        <ChevronDown className="h-7 w-7 animate-bb-float" />
      </a>
    </section>
  );
}

function HeroTile({
  img,
  index,
}: {
  img: { id: string; alt: string };
  index: number;
}) {
  // Aspect 3/4 → ancho 200 × alto 267 (aproximado)
  // Rotación alternada -2deg / 5deg exactamente como pidió el cliente
  const rot = index % 2 === 0 ? -2 : 5;

  return (
    <div
      style={{
        transform: `rotate(${rot}deg)`,
        boxShadow: "0 25px 60px -15px rgba(61, 26, 110, 0.4)",
      }}
      className={cn(
        "relative aspect-[3/4] w-[200px] shrink-0 overflow-hidden rounded-3xl",
        "bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30",
        "ring-1 ring-bb-purple/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:[transform:scale(1.05)_rotate(0deg)] hover:z-10"
      )}
    >
      <Image
        src={`https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&w=520&h=700&q=80`}
        alt={img.alt}
        fill
        sizes="200px"
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
