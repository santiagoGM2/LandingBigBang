"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: number | string;
  name: string;
  avatar: string;
  description: string;
}

interface Props {
  items: Testimonial[];
  className?: string;
}

const SWIPE_THRESHOLD = 80;

export function TestimonialCarousel({ items, className }: Props) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  const go = React.useCallback(
    (next: number) => {
      const last = items.length - 1;
      const safe = next < 0 ? last : next > last ? 0 : next;
      setDirection(next > index ? 1 : -1);
      setIndex(safe);
    },
    [index, items.length]
  );

  React.useEffect(() => {
    const id = setInterval(() => go(index + 1), 7000);
    return () => clearInterval(id);
  }, [index, go]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(index + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(index - 1);
  };

  const current = items[index];
  if (!current) return null;

  return (
    <div className={cn("relative mx-auto w-full max-w-3xl", className)}>
      {/* Indicador numérico arriba-derecha */}
      <div className="absolute -top-2 right-0 z-20 rounded-full bg-bb-purple px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-bb-soft">
        {index + 1} <span className="opacity-60">de {items.length}</span>
      </div>

      <div className="relative h-80 md:h-72 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article
            key={current.id}
            custom={direction}
            initial={{ x: direction === 1 ? 120 : -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? -120 : 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 grid place-items-center cursor-grab active:cursor-grabbing"
          >
            <div className="rounded-3xl bg-white p-8 md:p-10 shadow-bb-soft border border-bb-purple/10 text-center max-w-2xl">
              <div className="mx-auto mb-5 h-16 w-16 rounded-full overflow-hidden ring-4 ring-bb-pink-soft">
                <Image
                  src={current.avatar}
                  alt={current.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <blockquote className="text-base md:text-lg leading-relaxed text-bb-text">
                <span className="text-bb-pink text-3xl font-extrabold leading-none">&ldquo;</span>
                {current.description}
                <span className="text-bb-pink text-3xl font-extrabold leading-none">&rdquo;</span>
              </blockquote>
              <p className="mt-4 font-bold text-bb-purple">{current.name}</p>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonios">
        {items.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Mostrar testimonio ${i + 1}`}
            onClick={() => go(i)}
            className={cn(
              "h-2.5 rounded-full transition-all",
              i === index ? "w-8 bg-bb-pink" : "w-2.5 bg-bb-purple/25 hover:bg-bb-purple/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
