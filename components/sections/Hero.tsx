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

// 20 fotos reales del portafolio Big Bang (mix curado de las 6 categorías).
// El orden alterna categorías para que el carrusel no muestre dos imágenes
// muy parecidas adyacentes y se sienta variado al loopear.
const IMAGES: Array<{ src: string; alt: string }> = [
  {
    src: "/decoraciones/infantiles/hijo-cumpleanos-spiderman-3.jpg",
    alt: "Bouquet temático de Spider-Man",
  },
  {
    src: "/decoraciones/elegantes/pareja-cumpleanos-35-oro-rosa-burbuja.jpg",
    alt: "Burbuja oro rosa para 35 años",
  },
  {
    src: "/decoraciones/minis/alguien-especial-cumpleanos-burbuja-mariposas-rose-gold.jpg",
    alt: "Mini burbuja con mariposas rose gold",
  },
  {
    src: "/decoraciones/romanticos/pareja-aniversario-amor-oso-ruby.png",
    alt: "Decoración romántica con oso Ruby",
  },
  {
    src: "/decoraciones/tematicos/alguien-especial-cumpleanos-tematica-fiesta-mexicana.png",
    alt: "Decoración fiesta mexicana",
  },
  {
    src: "/decoraciones/infantiles/hija-cumpleanos-burbuja-princesa-neon.png",
    alt: "Burbuja princesa neón",
  },
  {
    src: "/decoraciones/elegantes/mama-papa-cumpleanos-tia-rosa-rose-gold-mariposas.jpg",
    alt: "Bouquet rose gold con mariposas",
  },
  {
    src: "/decoraciones/anchetas/hijo-hija-cumpleanos-caja-regalo-mono-arcoiris.png",
    alt: "Caja regalo con mono arcoíris",
  },
  {
    src: "/decoraciones/minis/alguien-especial-cumpleanos-estrella-lila.jpg",
    alt: "Mini decoración con estrella lila",
  },
  {
    src: "/decoraciones/romanticos/pareja-otra-ocasion-propuesta-matrimonio-rojo.jpg",
    alt: "Decoración propuesta matrimonio en rojo",
  },
  {
    src: "/decoraciones/infantiles/hijo-hija-cumpleanos-harry-potter-lechuza.jpg",
    alt: "Decoración Harry Potter con lechuza",
  },
  {
    src: "/decoraciones/elegantes/alguien-especial-cumpleanos-hbd-negro-corona-plata.jpg",
    alt: "HBD negro y plata con corona",
  },
  {
    src: "/decoraciones/tematicos/alguien-especial-cumpleanos-tematica-casino.jpg",
    alt: "Decoración temática casino",
  },
  {
    src: "/decoraciones/minis/alguien-especial-cumpleanos-burbuja-elegante-dorado.jpg",
    alt: "Mini burbuja elegante dorada",
  },
  {
    src: "/decoraciones/infantiles/hijo-cumpleanos-granja-vaca-gallo.jpg",
    alt: "Decoración temática granja",
  },
  {
    src: "/decoraciones/romanticos/pareja-aniversario-duo-burbujas-verde-blanco.png",
    alt: "Dúo de burbujas verde y blanco",
  },
  {
    src: "/decoraciones/elegantes/mama-papa-cumpleanos-abuela-99-oro-rosa.png",
    alt: "Bouquet 99 años en oro rosa",
  },
  {
    src: "/decoraciones/minis/alguien-especial-cumpleanos-burbuja-rosa-lettering.png",
    alt: "Mini burbuja rosa con lettering",
  },
  {
    src: "/decoraciones/tematicos/hijo-cumpleanos-futbol-america-pepsi-9.jpg",
    alt: "Decoración temática fútbol América",
  },
  {
    src: "/decoraciones/anchetas/pareja-aniversario-ancheta-cerveza-heineken.jpg",
    alt: "Ancheta cervecera de aniversario",
  },
];

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
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-bb-white"
    >
      <Balloons ref={balloonsRef} />

      {/* Wash radial bb-pink sutil hacia arriba */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(233,30,140,0.08),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-12 pb-2 text-center sm:pt-16 md:pt-20 lg:pt-16 lg:pb-4">
        {/* Tagline pill con glassmorphism leve */}
        <span className="inline-flex items-center gap-2 rounded-full border border-bb-purple/15 bg-bb-white/50 px-4 py-1.5 text-xs sm:text-sm font-bold text-bb-purple backdrop-blur-sm shadow-bb-soft">
          <span className="h-2 w-2 rounded-full bg-bb-pink" />
          {TAGLINE}
        </span>

        {/* Title — color bb-text con keyword en bb-pink */}
        <h1 className="mt-4 max-w-4xl text-[22px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.12] tracking-tight text-bb-text">
          ¿Por qué algunas personas se convierten en el{" "}
          <span className="text-bb-pink">héroe de la familia</span> con una sola
          sorpresa… y otras gastan el doble y nadie recuerda nada?
        </h1>

        <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-bb-text/70">
          {DESCRIPTION}
        </p>

        <div className="mt-6 flex justify-center">
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

      {/* Marquee aspect 3/4, rotación alternada -2deg / 5deg.
          py vertical le da espacio a las tarjetas rotadas para que no se
          recorten en el clip horizontal del marquee. */}
      <div className="relative z-10 flex-shrink-0 py-6 sm:py-8 md:py-10">
        <Marquee
          duration={30}
          className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
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
        "relative aspect-[3/4] w-[160px] sm:w-[180px] md:w-[200px] shrink-0 overflow-hidden rounded-3xl",
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
  );
}
