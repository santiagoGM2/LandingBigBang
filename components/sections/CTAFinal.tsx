"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BorderBeam } from "@/components/ui/border-beam";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useIsDesktop } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX = 8;
const TILT_MAX = 4;

const VIDEO_SRC =
  "https://cdn.coverr.co/videos/coverr-balloons-rising-in-the-sky-6262/1080p.mp4";
const VIDEO_FALLBACK =
  "https://videos.pexels.com/video-files/3796535/3796535-hd_1920_1080_30fps.mp4";
const VIDEO_POSTER =
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&h=900&q=70";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export function CTAFinal() {
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const desktop = useIsDesktop();
  const sectionRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const animate = mounted && !reduced;
  const enable3D = animate && desktop;
  const [videoSrc, setVideoSrc] = React.useState(VIDEO_SRC);

  // Magnetic translate
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 14 });
  const sy = useSpring(my, { stiffness: 240, damping: 14 });

  // Tilt 3D del botón con cursor
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 200, damping: 18 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(tiltX, [-1, 1], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(tiltY, [-1, 1], [-TILT_MAX, TILT_MAX]);

  // Scroll-driven entrada 3D + parallax del video
  useGSAP(
    () => {
      if (!animate || !sectionRef.current) return;

      // Parallax sutil en el video (15% en eje Y)
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Entrada 3D scroll-driven del contenido. rotateX 15° → 0, translateZ
      // -100 → 0, opacity 0 → 1, con stagger entre h2/p/cta.
      const ctx = gsap.context(() => {
        gsap.from(".bb-cta-anim", {
          opacity: 0,
          rotateX: 15,
          z: -100,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [animate] }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > MAGNETIC_RADIUS) {
      mx.set(0);
      my.set(0);
    } else {
      const factor = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_MAX;
      mx.set((dx / dist) * factor);
      my.set((dy / dist) * factor);
    }

    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      tiltYRaw.set(dx / (rect.width / 2));
      tiltXRaw.set(dy / (rect.height / 2));
    } else {
      tiltXRaw.set(0);
      tiltYRaw.set(0);
    }
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  const handleClick = () => open();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bb-purple py-24 md:py-32 text-white"
    >
      {/* Video background loop. Parallax via GSAP. */}
      <video
        ref={videoRef}
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={VIDEO_POSTER}
        onError={() => {
          if (videoSrc !== VIDEO_FALLBACK) setVideoSrc(VIDEO_FALLBACK);
        }}
        className="pointer-events-none absolute inset-0 z-0 h-[115%] w-full object-cover -top-[7.5%]"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay morado para legibilidad */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bb-purple/80 via-bb-purple/70 to-bb-purple/90"
      />
      {/* Noise sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ perspective: enable3D ? "1200px" : undefined }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h2
          className="bb-cta-anim text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] will-change-transform"
          style={{ transformStyle: enable3D ? "preserve-3d" : undefined }}
        >
          Esa persona todavía no sabe lo que se viene.
        </h2>
        <p className="bb-cta-anim mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto will-change-transform">
          60 segundos. 7 preguntas. Y nosotros nos encargamos de que cuando
          abra esa puerta, no pueda contener las lágrimas.
        </p>

        <div className="bb-cta-anim mt-10 inline-block will-change-transform">
          <div
            className="relative isolate inline-block"
            style={{ perspective: "1000px" }}
          >
            <motion.button
              ref={btnRef}
              type="button"
              onClick={handleClick}
              whileTap={animate ? { scale: 0.97 } : undefined}
              whileHover={enable3D ? { z: 20 } : undefined}
              style={
                enable3D
                  ? {
                      x: sx,
                      y: sy,
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }
                  : undefined
              }
              className={cn(
                "group relative z-10 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg md:text-xl",
                "font-bold text-bb-pink will-change-transform",
                "shadow-[0_10px_30px_rgba(61,26,110,0.25)] hover:shadow-[0_25px_60px_rgba(61,26,110,0.55)]",
                "transition-shadow duration-300",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              )}
            >
              Crear esa sorpresa ahora →
            </motion.button>
            <BorderBeam duration={3.5} colorFrom="#FFFFFF" colorTo="#7DC720" />
          </div>
          <p className="mt-4 text-sm md:text-base text-white/80">
            Gratis · Sin compromiso · Te respondemos en menos de 15 minutos
          </p>
        </div>
      </div>
    </section>
  );
}
