"use client";

import * as React from "react";
import Image from "next/image";

import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";

/**
 * Sección "Espejo / Curiosidad" — story-scroll de 3 escenas que se apilan.
 * Cada FlowSection se queda pinneada al fondo y la siguiente entra rotando
 * desde 30° hasta 0° (transformOrigin bottom left). Usa los colores de marca
 * Big Bang (purple, pink, lime) y conserva los textos originales.
 */
export function EspejoCuriosidad() {
  const { open } = useQuiz();

  return (
    <section
      id="espejo"
      className="relative overflow-hidden"
      aria-label="Por qué importa cómo se siente"
    >
      <FlowArt aria-label="Tres preguntas que cambian cómo elegís una sorpresa">
        {/* ─── Escena 01 · bb-purple ─────────────────────────── */}
        <FlowSection
          aria-label="Por qué algunos se vuelven el héroe"
          style={{ backgroundColor: "var(--bb-purple)", color: "#ffffff" }}
        >
          <SceneHeader index="01" tone="light">
            La pregunta incómoda
          </SceneHeader>

          <div className="relative grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
            <h2
              className="font-extrabold uppercase leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              ¿Por qué algunos se vuelven el{" "}
              <span style={{ color: "var(--bb-lime)" }}>héroe</span>{" "}
              de la familia
              <br />
              <span className="text-white/85">
                y otros gastan el doble y nadie recuerda nada?
              </span>
            </h2>

            <SceneImage
              id="1530103862676-de8c9debad1d"
              alt="Arco de globos colorido en montaje de fiesta"
            />
          </div>

          <SceneFootline tone="light">
            01 · No es lo que gastás. Es lo que provocás.
          </SceneFootline>
        </FlowSection>

        {/* ─── Escena 02 · bb-pink ───────────────────────────── */}
        <FlowSection
          aria-label="No es el precio, es la emoción"
          style={{ backgroundColor: "var(--bb-pink)", color: "#ffffff" }}
        >
          <SceneHeader index="02" tone="light">
            Lo que de verdad la hace llorar
          </SceneHeader>

          <div className="relative grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
            <SceneImage
              id="1576337631739-92b58dca2c63"
              alt="Mesa de dulces con donas y postres ornamentada"
            />

            <h2
              className="font-extrabold uppercase leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              No es el precio
              <br />
              lo que la hace{" "}
              <span style={{ color: "var(--bb-lime)" }}>llorar</span>.
              <br />
              <span className="text-white/90">
                Es saber qué emoción querías que sintiera.
              </span>
            </h2>
          </div>

          <SceneFootline tone="light">
            02 · La emoción se diseña antes de comprar el primer globo.
          </SceneFootline>
        </FlowSection>

        {/* ─── Escena 03 · bb-lime con texto bb-purple + CTA ─── */}
        <FlowSection
          aria-label="No estás comprando globos"
          style={{ backgroundColor: "var(--bb-lime)", color: "var(--bb-purple)" }}
        >
          <SceneHeader index="03" tone="dark">
            Lo que de verdad estás comprando
          </SceneHeader>

          <div className="relative grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
            <h2
              className="font-extrabold uppercase leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              No estás comprando globos.
              <br />
              <span style={{ color: "var(--bb-pink)" }}>
                Estás comprando el momento
              </span>{" "}
              <span className="text-bb-purple/85">
                en que se da cuenta de cuánto la amás.
              </span>
            </h2>

            <SceneImage
              id="1492684223066-81342ee5ff30"
              alt="Montaje completo de fiesta con globos"
              dark
            />
          </div>

          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <SceneFootline tone="dark">
              03 · Diseñamos ese momento — gratis, en 60 segundos.
            </SceneFootline>

            <Button
              size="lg"
              variant="default"
              onClick={() => open()}
              className="shadow-[0_18px_40px_-18px_rgba(61,26,110,0.55)]"
            >
              Quiero crear ese momento — Diseñar mi sorpresa gratis →
            </Button>
          </div>
        </FlowSection>
      </FlowArt>
    </section>
  );
}

/* ─── Sub-piezas ───────────────────────────────────────────── */

function SceneHeader({
  index,
  tone,
  children,
}: {
  index: string;
  tone: "light" | "dark";
  children: React.ReactNode;
}) {
  const dividerColor =
    tone === "light" ? "rgba(255,255,255,0.45)" : "rgba(61,26,110,0.35)";
  return (
    <div className="flex flex-col gap-[2vw]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] sm:text-xs">
          {index} · Big Bang
        </p>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] opacity-75 sm:text-xs">
          {children}
        </p>
      </div>
      <hr
        className="border-none border-t"
        style={{ borderTopColor: dividerColor, opacity: 1 }}
      />
    </div>
  );
}

function SceneFootline({
  tone,
  children,
}: {
  tone: "light" | "dark";
  children: React.ReactNode;
}) {
  const dividerColor =
    tone === "light" ? "rgba(255,255,255,0.45)" : "rgba(61,26,110,0.35)";
  return (
    <div className="flex flex-col gap-[2vw]">
      <hr
        className="border-none border-t"
        style={{ borderTopColor: dividerColor, opacity: 1 }}
      />
      <p
        className="max-w-[55ch] text-[clamp(0.95rem,1.6vw,1.3rem)] font-medium leading-relaxed"
        style={{ opacity: tone === "light" ? 0.92 : 0.78 }}
      >
        {children}
      </p>
    </div>
  );
}

function SceneImage({
  id,
  alt,
  dark = false,
}: {
  id: string;
  alt: string;
  dark?: boolean;
}) {
  return (
    <div
      className="relative aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden rounded-[2.5rem]"
      style={{
        boxShadow: dark
          ? "0 30px 60px -20px rgba(61,26,110,0.55)"
          : "0 30px 60px -20px rgba(0,0,0,0.45)",
      }}
    >
      <Image
        src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=1100&q=80`}
        alt={alt}
        fill
        sizes="(min-width:768px) 40vw, 90vw"
        className="object-cover"
        unoptimized
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? "linear-gradient(180deg, rgba(125,199,32,0.0) 55%, rgba(61,26,110,0.35) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
