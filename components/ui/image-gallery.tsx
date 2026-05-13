"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageGalleryItem {
  src: string;
  alt: string;
  label: string;
  count?: number;
  onClick?: () => void;
}

interface ImageGalleryProps {
  items: ImageGalleryItem[];
  className?: string;
  height?: string;
  /** Clase extra para cada card, útil para targeting de GSAP */
  itemClassName?: string;
}

/**
 * Expanding image gallery (patrón 21st.dev). Cards angostas en row que
 * crecen a `flex-[5]` en hover o focus, mientras las otras se comprimen.
 *
 * Solo para desktop / tablet ≥ 768px. En mobile usar MobileGallery con
 * scroll-snap horizontal.
 */
export function ImageGallery({
  items,
  className,
  height = "h-[480px]",
  itemClassName,
}: ImageGalleryProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-6xl items-stretch gap-2 mx-auto",
        className
      )}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          type="button"
          aria-label={`Explorar categoría ${item.label}`}
          className={cn(
            "group relative flex-grow w-44 overflow-hidden rounded-2xl cursor-pointer transition-all",
            "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:flex-[5] focus-visible:flex-[5]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-pink focus-visible:ring-offset-2",
            height,
            itemClassName
          )}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 240px, (max-width: 1280px) 30vw, 20vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105"
            unoptimized
          />

          {/* Gradient overlay base */}
          <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/95 via-bb-purple/40 to-transparent" />

          {/* Sombra interna inferior para contraste extra del label */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 -40px 80px -40px rgba(61, 26, 110, 0.6)",
            }}
          />

          {/* Estado colapsado: label vertical centrado */}
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0">
            <span
              className="text-white font-bold text-lg tracking-wide drop-shadow-lg"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {item.label}
            </span>
          </div>

          {/* Estado expandido: título + count + CTA */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 delay-150 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            <h3 className="text-white text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
              {item.label}
            </h3>
            {item.count !== undefined && (
              <p className="mt-2 text-bb-lime font-semibold text-base">
                {item.count} {item.count === 1 ? "código" : "códigos"} disponibles
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 text-white/90 text-sm">
              <span>Click para explorar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
