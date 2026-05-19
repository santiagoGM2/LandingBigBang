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
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

import {
  ImageGallery,
  type ImageGalleryItem,
} from "@/components/ui/image-gallery";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";
import {
  CODIGOS_DEC,
  CATEGORIA_LABEL,
  CATEGORIA_MICROCOPY,
  getCover,
  type Categoria,
  type CodigoDec,
} from "@/lib/codigos-dec";
import { cn } from "@/lib/utils";

const COUNT_BY_CAT: Record<Categoria, number> = CODIGOS_DEC.reduce(
  (acc, c) => {
    acc[c.categoria] = (acc[c.categoria] || 0) + 1;
    return acc;
  },
  {} as Record<Categoria, number>
);

const ORDER: Categoria[] = [
  "infantiles",
  "elegantes",
  "tematicos",
  "romanticos",
  "anchetas",
  "minis",
];

const COVER_ALT: Record<Categoria, string> = {
  infantiles: "Decoración temática infantil con globos",
  elegantes: "Bouquet elegante con metalizados y oro",
  tematicos: "Decoración temática personalizada",
  romanticos: "Decoración romántica con osos y burbujas",
  anchetas: "Ancheta de regalo con peluches y dulces",
  minis: "Mini burbuja decorativa para centro de mesa",
};

/**
 * 6 categorías reales del cliente — labels marketing + cover de foto real
 * extraída de cada subcarpeta + conteo dinámico. onClick dispara toast.
 */
function buildItems(
  pickCategoria: (c: Categoria, label: string) => void
): ImageGalleryItem[] {
  return ORDER.map((cat) => ({
    src: getCover(cat),
    alt: COVER_ALT[cat],
    label: CATEGORIA_LABEL[cat],
    microcopy: `+${COUNT_BY_CAT[cat]} diseños · ${CATEGORIA_MICROCOPY[cat]}`,
    onClick: () => pickCategoria(cat, CATEGORIA_LABEL[cat]),
  }));
}

export function CategoriasNavegables() {
  const [selected, setSelected] = React.useState<Categoria | null>(null);
  const [isDesktop, setIsDesktop] = React.useState(true);
  const { open } = useQuiz();
  const reduced = useReducedMotion();
  const mounted = useHasMounted();
  const enableMotion = mounted && !reduced;

  // Detect viewport. Default true así la galería renderiza en SSR y desktop
  // sin un flash de mobile fallback. Mobile se aplica solo cuando window
  // confirma viewport < 768px.
  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pickCategoria = React.useCallback(
    (cat: Categoria, label: string) => {
      setSelected(cat);
      toast.success(
        `Perfecto. Te mostramos nuestros diseños para ${label}`
      );
    },
    []
  );

  const items = React.useMemo(
    () => buildItems(pickCategoria),
    [pickCategoria]
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

  return (
    <section id="categorias" className="bg-bb-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-bb-pink-soft px-4 py-1.5 text-sm font-bold text-bb-pink">
            <Sparkles className="h-4 w-4" /> Explorá por categoría
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-bb-purple leading-tight">
            ¿Para qué momento estás creando el recuerdo?
          </h2>
          <p className="mt-4 text-lg text-bb-text/70 max-w-2xl mx-auto leading-relaxed">
            Escoge tu ocasión y te mostramos exactamente lo que hemos creado
            para momentos como el tuyo.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.div
              key="categorias"
              initial={enableMotion ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={enableMotion ? { opacity: 0, scale: 0.95 } : undefined}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12"
            >
              {isDesktop ? (
                <ImageGallery items={items} />
              ) : (
                <MobileGrid items={items} />
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

        {selected === null && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => open()}
              className="group inline-flex items-center gap-2 text-bb-purple font-bold hover:text-bb-pink transition-colors"
            >
              <span className="underline underline-offset-4 decoration-2 decoration-bb-pink/40 group-hover:decoration-bb-pink">
                No encuentras tu ocasión → Cuéntanos y la creamos desde cero
              </span>
            </button>
            <p className="mt-2 text-sm text-bb-text/65">
              Tenemos más de 1.000 temáticas y todas se personalizan al 100%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Mobile fallback: grid 2 cols con cards simples
   ────────────────────────────────────────────────────────────────── */
function MobileGrid({ items }: { items: ImageGalleryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          type="button"
          aria-label={`Explorar categoría ${item.label}`}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-pink focus-visible:ring-offset-2"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width:640px) 33vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bb-purple/95 via-bb-purple/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-base font-extrabold leading-tight text-white">
              {item.label}
            </h3>
            {item.microcopy ? (
              <p className="text-xs font-bold text-bb-lime leading-tight">
                {item.microcopy}
              </p>
            ) : item.count !== undefined ? (
              <p className="text-xs font-bold text-bb-lime">
                {item.count} códigos
              </p>
            ) : null}
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
          alt={codigo.alt}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
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
