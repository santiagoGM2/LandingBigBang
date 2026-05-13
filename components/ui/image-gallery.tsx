"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
}

/**
 * Expanding image gallery — versión simplificada y garantizada.
 *
 * Usa <img> HTML estándar (NO next/image fill) para eliminar la dependencia
 * de altura calculada del padre. La altura 480px se define en tres lugares
 * (container, button inline, className) intencionalmente redundante para que
 * la card siempre se vea, pase lo que pase con el wrapping de motion.div o
 * AnimatePresence en el padre.
 *
 * Cada button arranca con `flex: 1 1 0` inline. Al hover el `hover:flex-[5]`
 * de Tailwind override y la card se expande mientras las otras se comprimen.
 */
export function ImageGallery({ items, className }: ImageGalleryProps) {
  return (
    <div
      className={cn(
        "flex items-stretch gap-2 w-full max-w-6xl mx-auto px-4",
        className
      )}
      style={{ height: "480px" }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          type="button"
          aria-label={`Explorar categoría ${item.label}`}
          className={cn(
            "bb-cat-card group relative overflow-hidden rounded-2xl cursor-pointer",
            "transition-[flex] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:flex-[5] focus-visible:flex-[5]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-pink focus-visible:ring-offset-2"
          )}
          style={{ flex: "1 1 0", minWidth: 0, height: "480px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay gradient morado */}
          <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/95 via-bb-purple/40 to-transparent" />

          {/* Sombra interna inferior para contraste extra */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 -40px 80px -40px rgba(61, 26, 110, 0.6)",
            }}
          />

          {/* Label vertical (estado colapsado) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 transition-opacity duration-300">
            <span
              className="px-2 text-center text-xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {item.label}
            </span>
          </div>

          {/* Content expandido (estado hovered/focused) */}
          <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 delay-150">
            <h3 className="text-3xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {item.label}
            </h3>
            {item.count !== undefined && (
              <p className="mt-2 text-lg font-bold text-bb-lime">
                {item.count} {item.count === 1 ? "código" : "códigos"}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 font-semibold text-white">
              <span>Click para explorar</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
