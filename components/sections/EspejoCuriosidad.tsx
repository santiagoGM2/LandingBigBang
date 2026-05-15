"use client";

import * as React from "react";
import Image from "next/image";

import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";

/**
 * Sección "Espejo / Curiosidad" — story-scroll de 3 escenas que se apilan.
 * Cada FlowSection se queda pinneada y la siguiente entra rotando 30°→0°
 * (transformOrigin bottom left). Tipografía Nunito de la marca, sin uppercase
 * y con tamaños alineados al resto de la landing para que cada escena entre
 * en un viewport sin scroll interno.
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
          style={{
            backgroundColor: "var(--bb-purple)",
            color: "#ffffff",
            paddingTop: "clamp(1.5rem, 5vw, 3rem)",
            paddingBottom: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          <SceneHeader index="01" tone="light">
            La pregunta incómoda
          </SceneHeader>

          <SceneBody>
            <SceneCopy>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight">
                ¿Por qué algunos se vuelven el{" "}
                <span style={{ color: "var(--bb-lime)" }}>héroe</span>{" "}
                de la familia
                <span className="block text-white/85 font-bold">
                  y otros gastan el doble y nadie recuerda nada?
                </span>
              </h2>
            </SceneCopy>

            <SceneImage
              id="1530103862676-de8c9debad1d"
              alt="Arco de globos colorido en montaje de fiesta"
            />
          </SceneBody>

          <SceneFootline tone="light">
            01 · No es lo que gastás. Es lo que provocás.
          </SceneFootline>
        </FlowSection>

        {/* ─── Escena 02 · bb-pink ───────────────────────────── */}
        <FlowSection
          aria-label="No es el precio, es la emoción"
          style={{
            backgroundColor: "var(--bb-pink)",
            color: "#ffffff",
            paddingTop: "clamp(1.5rem, 5vw, 3rem)",
            paddingBottom: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          <SceneHeader index="02" tone="light">
            Lo que de verdad la hace llorar
          </SceneHeader>

          <SceneBody reverse>
            <SceneImage
              id="1576337631739-92b58dca2c63"
              alt="Mesa de dulces con donas y postres ornamentada"
            />

            <SceneCopy>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight">
                No es el precio lo que la hace{" "}
                <span style={{ color: "var(--bb-lime)" }}>llorar</span>.
                <span className="block text-white/90 font-bold">
                  Es saber qué emoción querías que sintiera.
                </span>
              </h2>
            </SceneCopy>
          </SceneBody>

          <SceneFootline tone="light">
            02 · La emoción se diseña antes de comprar el primer globo.
          </SceneFootline>
        </FlowSection>

        {/* ─── Escena 03 · bb-lime con texto bb-purple + CTA ─── */}
        <FlowSection
          aria-label="No estás comprando globos"
          style={{
            backgroundColor: "var(--bb-lime)",
            color: "var(--bb-purple)",
            paddingTop: "clamp(1.5rem, 5vw, 3rem)",
            paddingBottom: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          <SceneHeader index="03" tone="dark">
            Lo que de verdad estás comprando
          </SceneHeader>

          <SceneBody>
            <SceneCopy>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight">
                No estás comprando globos.
                <span className="block font-bold">
                  <span style={{ color: "var(--bb-pink)" }}>
                    Estás comprando el momento
                  </span>{" "}
                  <span className="text-bb-purple/85">
                    en que se da cuenta de cuánto la amás.
                  </span>
                </span>
              </h2>

              <div className="mt-5 md:mt-6">
                <Button
                  size="lg"
                  variant="default"
                  onClick={() => open()}
                  className="shadow-[0_18px_40px_-18px_rgba(61,26,110,0.55)]"
                >
                  Diseñar mi sorpresa gratis →
                </Button>
              </div>
            </SceneCopy>

            <SceneImage
              id="1492684223066-81342ee5ff30"
              alt="Montaje completo de fiesta con globos"
              dark
            />
          </SceneBody>

          <SceneFootline tone="dark">
            03 · Diseñamos ese momento — gratis, en 60 segundos.
          </SceneFootline>
        </FlowSection>
      </FlowArt>
    </section>
  );
}

/* ─── Sub-piezas ───────────────────────────────────────────── */

function SceneBody({
  children,
  reverse = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`relative grid items-center gap-6 md:gap-10 ${
        reverse
          ? "md:grid-cols-[0.9fr_1.1fr]"
          : "md:grid-cols-[1.1fr_0.9fr]"
      }`}
    >
      {children}
    </div>
  );
}

function SceneCopy({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[36ch] md:max-w-[42ch]">{children}</div>;
}

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] sm:text-xs">
          {index} · Big Bang
        </p>
        <p className="hidden text-[0.7rem] font-bold uppercase tracking-[0.28em] opacity-75 sm:inline sm:text-xs">
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
    <div className="flex flex-col gap-3">
      <hr
        className="border-none border-t"
        style={{ borderTopColor: dividerColor, opacity: 1 }}
      />
      <p
        className="max-w-[55ch] text-sm md:text-base font-medium leading-relaxed"
        style={{ opacity: tone === "light" ? 0.9 : 0.78 }}
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
      className="relative aspect-[4/5] w-full max-w-[260px] justify-self-center overflow-hidden rounded-[2rem] md:max-w-[320px] lg:max-w-[360px]"
      style={{
        boxShadow: dark
          ? "0 24px 50px -22px rgba(61,26,110,0.55)"
          : "0 24px 50px -22px rgba(0,0,0,0.45)",
      }}
    >
      <Image
        src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=900&q=80`}
        alt={alt}
        fill
        sizes="(min-width:1024px) 30vw, (min-width:768px) 35vw, 70vw"
        className="object-cover"
        unoptimized
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? "linear-gradient(180deg, rgba(125,199,32,0) 55%, rgba(61,26,110,0.35) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}
