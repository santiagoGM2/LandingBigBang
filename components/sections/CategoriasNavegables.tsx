"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

import {
  ImageGallery,
  type ImageGalleryItem,
} from "@/components/ui/image-gallery";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useIsDesktop } from "@/lib/use-media-query";
import {
  CODIGOS_DEC,
  CATEGORIA_LABEL,
  type Categoria,
  type CodigoDec,
} from "@/lib/codigos-dec";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Orden de categorías en la galería */
const CATEGORIAS_ORDER: Categoria[] = [
  "cumple_infantil",
  "baby",
  "religioso",
  "grado",
  "cumple_adulto",
  "romantico",
  "empresarial",
  "especial",
];

const COUNT_BY_CAT: Record<Categoria, number> = CODIGOS_DEC.reduce(
  (acc, c) => {
    acc[c.categoria] = (acc[c.categoria] || 0) + 1;
    return acc;
  },
  {} as Record<Categoria, number>
);

const REP_IMG_BY_CAT: Record<Categoria, string> = CATEGORIAS_ORDER.reduce(
  (acc, cat) => {
    const first = CODIGOS_DEC.find((c) => c.categoria === cat);
    acc[cat] = first?.img ?? "";
    return acc;
  },
  {} as Record<Categoria, string>
);

export function CategoriasNavegables() {
  const [selected, setSelected] = React.useState<Categoria | null>(null);
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const desktop = useIsDesktop();
  const enableMotion = mounted && !reduced;
  const gridRef = React.useRef<HTMLDivElement>(null);

  // GSAP entrance stagger sobre las 8 cards de categoría
  useGSAP(
    () => {
      if (!enableMotion || !gridRef.current) return;
      if (selected !== null) return; // solo en modo default

      gsap.from(".bb-cat-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: gridRef, dependencies: [enableMotion, selected] }
  );

  const codigosDeCategoria = React.useMemo(
    () => (selected ? CODIGOS_DEC.filter((c) => c.categoria === selected) : []),
    [selected]
  );

  const pickCodigo = (c: CodigoDec) => {
    open(c.codigo);
    toast.success(`Código ${c.codigo} seleccionado`, {
      description: c.titulo,
    });
  };

  const handleBack = () => setSelected(null);

  // Items mapeados para ImageGallery / MobileGallery
  const galleryItems: ImageGalleryItem[] = CATEGORIAS_ORDER.map((cat) => ({
    src: REP_IMG_BY_CAT[cat],
    alt: `Decoración categoría ${CATEGORIA_LABEL[cat]}`,
    label: CATEGORIA_LABEL[cat],
    count: COUNT_BY_CAT[cat],
    onClick: () => setSelected(cat),
  }));

  return (
    <section id="categorias" className="bg-bb-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-bb-pink-soft px-4 py-1.5 text-sm font-bold text-bb-pink">
            <Sparkles className="h-4 w-4" /> Explorá por categoría
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-bb-purple leading-tight">
            Cada montaje es único como tu visión
          </h2>
          <p className="mt-4 text-lg text-bb-text/70 max-w-2xl mx-auto leading-relaxed">
            Recorridos de fiestas que diseñamos para clientes que querían algo
            que nadie más tuviera
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.div
              key="categorias"
              ref={gridRef}
              initial={enableMotion ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={enableMotion ? { opacity: 0, scale: 0.95 } : undefined}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12"
            >
              {desktop ? (
                <ImageGallery items={galleryItems} itemClassName="bb-cat-card" />
              ) : (
                <MobileGallery items={galleryItems} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`codigos-${selected}`}
              initial={enableMotion ? { opacity: 0, scale: 0.96 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={enableMotion ? { opacity: 0, scale: 0.96 } : undefined}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12"
            >
              {/* Header sticky con back + categoría seleccionada */}
              <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-bb-pink-soft bg-bb-white/90 px-6 py-4 backdrop-blur-lg md:gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 rounded-full bg-bb-gray px-4 py-2 text-sm font-bold text-bb-purple transition-colors hover:bg-bb-pink-soft hover:text-bb-pink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a categorías
                </button>
                <h3 className="text-lg md:text-2xl font-extrabold text-bb-purple">
                  {CATEGORIA_LABEL[selected]}
                </h3>
                <span className="ml-auto text-sm font-bold text-bb-pink">
                  {codigosDeCategoria.length} código
                  {codigosDeCategoria.length === 1 ? "" : "s"}
                </span>
              </div>

              <motion.div
                initial={enableMotion ? "hidden" : false}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                style={enableMotion ? { perspective: "1200px" } : undefined}
              >
                {codigosDeCategoria.map((c) => (
                  <CodigoCard
                    key={c.codigo}
                    codigo={c}
                    enableMotion={enableMotion}
                    onPick={() => pickCodigo(c)}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Mobile fallback: scroll-snap horizontal con cards 240×320
   ────────────────────────────────────────────────────────────────── */
function MobileGallery({ items }: { items: ImageGalleryItem[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          type="button"
          aria-label={`Explorar categoría ${item.label}`}
          className="bb-cat-card relative h-[320px] w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-pink focus-visible:ring-offset-2"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="240px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/95 via-bb-purple/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-xl font-extrabold text-white leading-tight">
              {item.label}
            </h3>
            {item.count !== undefined && (
              <p className="mt-1 text-sm font-semibold text-bb-lime">
                {item.count} códigos
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Card de código DEC (modo explorando)
   ────────────────────────────────────────────────────────────────── */
function CodigoCard({
  codigo,
  enableMotion,
  onPick,
}: {
  codigo: CodigoDec;
  enableMotion: boolean;
  onPick: () => void;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 22 });
  const sy = useSpring(my, { stiffness: 240, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onPick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={enableMotion ? { y: -4, z: 40 } : undefined}
      whileTap={enableMotion ? { scale: 0.98 } : undefined}
      variants={
        enableMotion
          ? {
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }
          : undefined
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={
        enableMotion
          ? {
              transformPerspective: 900,
              transformStyle: "preserve-3d",
              rotateX: rotX,
              rotateY: rotY,
            }
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white text-left",
        "ring-1 ring-bb-purple/10 shadow-bb-soft transition-shadow duration-300",
        "hover:shadow-[0_30px_60px_-15px_rgba(233,30,140,0.45)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/40",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
        "after:bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.45)_50%,transparent_62%)]",
        "after:bg-[length:220%_100%] after:[background-position:-110%_0] after:opacity-0",
        "after:transition-[background-position,opacity] after:duration-700",
        "hover:after:[background-position:210%_0] hover:after:opacity-100"
      )}
      aria-label={`Elegir código ${codigo.codigo}: ${codigo.titulo}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30">
        <Image
          src={codigo.img}
          alt={`${codigo.codigo}: ${codigo.titulo}`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/20 via-transparent to-transparent" />
      </div>
      <div className="relative p-5">
        <p
          className="text-[10px] font-bold uppercase tracking-wider text-bb-purple/55"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          {codigo.codigo}
        </p>
        <h4 className="mt-1 text-lg font-extrabold text-bb-purple leading-tight">
          {codigo.titulo}
        </h4>
        <p className="mt-1 text-sm font-semibold text-bb-pink">{codigo.emocion}</p>
      </div>
    </motion.button>
  );
}
