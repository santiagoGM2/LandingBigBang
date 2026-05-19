"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Instagram,
  PartyPopper,
  Heart,
  Cake,
  Baby,
  Sparkles,
  GraduationCap,
  Gift,
  MessageCircle,
  Pencil,
  Lightbulb,
  Calendar,
  Check,
  type LucideIcon,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Balloons, type BalloonsHandle } from "@/components/ui/balloons";

import {
  submitLead,
  SubmitLeadError,
  type QuizAnswers,
  type Intencion,
} from "@/lib/ghl";
import { CODIGOS_DEC, type Categoria, type CodigoDec } from "@/lib/codigos-dec";
import {
  trackQuizComplete,
  trackQuizPartial,
  trackQuizStart,
  trackQuizStep,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bb-quiz-state-v2";

/* ─── Datasets de opciones ──────────────────────────────────── */

interface IconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const A_QUIEN: IconOption[] = [
  { value: "A mi pareja", label: "A mi pareja", icon: Heart },
  { value: "A mi mamá / papá", label: "A mi mamá / papá", icon: Cake },
  { value: "A mi hijo/hija", label: "A mi hijo/hija", icon: Baby },
  { value: "A alguien especial", label: "A alguien especial", icon: Sparkles },
];

const OCASIONES: IconOption[] = [
  { value: "Su cumpleaños", label: "Su cumpleaños", icon: Cake },
  { value: "Nuestro aniversario", label: "Nuestro aniversario", icon: Heart },
  { value: "Está esperando un bebé", label: "Está esperando un bebé", icon: Baby },
  { value: "Se acaba de graduar", label: "Se acaba de graduar", icon: GraduationCap },
  { value: "Sorpresa sin motivo", label: "Solo quiero sorprenderla sin motivo", icon: Gift },
  { value: "Otra ocasión especial", label: "Otra ocasión especial", icon: Sparkles },
];

interface IntencionOption {
  value: Intencion;
  label: string;
  icon: LucideIcon;
}

const INTENCIONES: IntencionOption[] = [
  { value: "personalizar", label: "Quiero personalizar una de estas", icon: Pencil },
  { value: "cero", label: "Tengo una idea desde cero", icon: Lightbulb },
  { value: "sorprendeme", label: "Sorpréndanme, confío en ustedes", icon: Sparkles },
  { value: "asesoria", label: "Prefiero que me asesoren", icon: MessageCircle },
];

const PERSONALIZACION_MULTI = [
  "Los colores",
  "Los detalles decorativos",
  "Un mensaje personalizado",
  "Agregar más elementos",
  "Me gusta tal cual",
  "Prefiero que me asesoren",
];

const FECHAS: IconOption[] = [
  { value: "Esta semana", label: "Esta semana", icon: Calendar },
  { value: "En 15 días", label: "En 15 días", icon: Calendar },
  { value: "En un mes o más", label: "En un mes o más", icon: Calendar },
  { value: "Asesoría", label: "Prefiero que me asesoren", icon: MessageCircle },
];

const PALETAS: Array<{ value: string; label: string; from: string; to: string }> = [
  { value: "Rosa y morado", label: "Rosa y morado", from: "#E91E8C", to: "#3D1A6E" },
  { value: "Pastel suave", label: "Pastel suave", from: "#FFD1E7", to: "#D9E4FF" },
  { value: "Verde y dorado", label: "Verde y dorado", from: "#7DC720", to: "#FFD93D" },
  { value: "Negro y dorado", label: "Negro y dorado", from: "#222", to: "#FFD93D" },
];

/* ─── Mapping ocasión → categorías para galería visual ──────── */
function categoriasFromContext(
  aQuien?: string,
  ocasion?: string
): Categoria[] {
  // Ocasión es el predictor más fuerte
  if (ocasion === "Nuestro aniversario") return ["romanticos", "minis"];
  if (ocasion === "Está esperando un bebé") return ["anchetas", "minis"];
  if (ocasion === "Se acaba de graduar") return ["tematicos", "elegantes"];

  if (ocasion === "Su cumpleaños") {
    if (aQuien === "A mi hijo/hija") return ["infantiles", "anchetas"];
    if (aQuien === "A mi pareja") return ["elegantes", "romanticos"];
    if (aQuien === "A mi mamá / papá") return ["elegantes", "anchetas"];
    if (aQuien === "A alguien especial") return ["elegantes", "minis"];
    return ["elegantes", "infantiles"];
  }

  if (ocasion === "Sorpresa sin motivo") {
    if (aQuien === "A mi pareja") return ["romanticos", "anchetas"];
    if (aQuien === "A mi hijo/hija") return ["infantiles", "anchetas"];
    return ["anchetas", "minis", "elegantes"];
  }

  if (ocasion === "Otra ocasión especial") {
    return ["tematicos", "romanticos", "elegantes"];
  }

  // Si solo conocemos aQuien (sin ocasion)
  if (aQuien === "A mi hijo/hija") return ["infantiles", "anchetas"];
  if (aQuien === "A mi pareja") return ["romanticos", "minis"];

  // Fallback genérico: sample diverso para no morir vacío en ningún edge case
  return ["elegantes", "minis", "romanticos"];
}

function pickGallery(
  aQuien?: string,
  ocasion?: string,
  limit = 6
): CodigoDec[] {
  const cats = categoriasFromContext(aQuien, ocasion);
  const matches = CODIGOS_DEC.filter((c) => cats.includes(c.categoria));
  // Si las categorías no llenan el grid, completar con un sample diverso del
  // resto del catálogo en lugar de devolver "vacío" o repetir las mismas fotos.
  if (matches.length >= limit) return matches.slice(0, limit);
  const fillers = CODIGOS_DEC.filter((c) => !cats.includes(c.categoria));
  return [...matches, ...fillers].slice(0, limit);
}

/* ─── Definición declarativa de los 7 pasos ─────────────────── */

type StepKey =
  | "a_quien"
  | "ocasion"
  | "pausa_visual"
  | "intencion"
  | "personalizar_galeria"
  | "vision_cero"
  | "personalizacion_multi"
  | "fecha_estimada"
  | "contacto";

interface StepDef {
  key: StepKey;
  title: string;
  isValid: (a: Partial<QuizAnswers>) => boolean;
  /** Pasos visibles en la barra de progreso (1..7) */
  progressIndex: number;
}

const ALL_STEPS: StepDef[] = [
  {
    key: "a_quien",
    title: "¿A quién quieres dejar sin palabras?",
    isValid: (a) => !!a.a_quien,
    progressIndex: 1,
  },
  {
    key: "ocasion",
    title: "¿Qué está a punto de vivir esa persona?",
    isValid: (a) => !!a.ocasion,
    progressIndex: 2,
  },
  {
    key: "pausa_visual",
    title: "Fotos reales que hemos creado para personas como esa.",
    isValid: () => true,
    progressIndex: 2,
  },
  {
    key: "intencion",
    title: "¿Alguna de estas te habló por dentro?",
    isValid: (a) => !!a.intencion,
    progressIndex: 3,
  },
  {
    key: "personalizar_galeria",
    title: "¿Cuál de estas decoraciones te enamoró?",
    isValid: (a) => !!a.codigo_elegido,
    progressIndex: 4,
  },
  {
    key: "vision_cero",
    title: "Describime tu visión en pocas palabras",
    isValid: (a) =>
      (a.vision_descripcion?.trim().length ?? 0) >= 4 || !!a.vision_paleta,
    progressIndex: 4,
  },
  {
    key: "personalizacion_multi",
    title: "¿Qué le agregarías o cambiarías?",
    isValid: (a) => (a.personalizacion_multi?.length ?? 0) >= 1,
    progressIndex: 5,
  },
  {
    key: "fecha_estimada",
    title: "¿Para cuándo es la sorpresa?",
    isValid: (a) => !!a.fecha_estimada,
    progressIndex: 6,
  },
  {
    key: "contacto",
    title: "Último paso. ¿Cómo te contactamos?",
    isValid: (a) =>
      (a.contacto?.nombre?.trim().length ?? 0) >= 2 &&
      /^\+?\d[\d\s-]{7,}$/.test(a.contacto?.telefono ?? ""),
    progressIndex: 7,
  },
];

function buildFlow(intencion?: Intencion): StepDef[] {
  // Base: A quién → Ocasión → Pausa visual → Intención
  const base = ALL_STEPS.filter((s) =>
    ["a_quien", "ocasion", "pausa_visual", "intencion"].includes(s.key)
  );
  if (!intencion) return [...base, ALL_STEPS.find((s) => s.key === "contacto")!];

  if (intencion === "sorprendeme" || intencion === "asesoria") {
    return [
      ...base,
      ALL_STEPS.find((s) => s.key === "fecha_estimada")!,
      ALL_STEPS.find((s) => s.key === "contacto")!,
    ];
  }

  // personalizar / cero → cargan paso 4 distinto, luego comparten 5, 6, 7
  const paso4 =
    intencion === "personalizar"
      ? ALL_STEPS.find((s) => s.key === "personalizar_galeria")!
      : ALL_STEPS.find((s) => s.key === "vision_cero")!;

  return [
    ...base,
    paso4,
    ALL_STEPS.find((s) => s.key === "personalizacion_multi")!,
    ALL_STEPS.find((s) => s.key === "fecha_estimada")!,
    ALL_STEPS.find((s) => s.key === "contacto")!,
  ];
}

const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir === 1 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir === 1 ? -80 : 80, opacity: 0 }),
};
const slideTransition = { type: "spring" as const, stiffness: 260, damping: 25 };

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Pre-selecciona un código DEC como punto de partida (rama "personalizar") */
  preselectedCodigo?: string | null;
  /** Pre-llena respuestas desde inputs externos (QuizInline, ConexionEmocional) */
  inlineSeed?: Partial<QuizAnswers> | null;
}

export function QuizModal({
  open,
  onOpenChange,
  preselectedCodigo,
  inlineSeed,
}: Props) {
  const reduced = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [answers, setAnswers] = React.useState<Partial<QuizAnswers>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const partialSent = React.useRef(false);
  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const balloonsRef = React.useRef<BalloonsHandle>(null);

  const flow = React.useMemo(
    () => buildFlow(answers.intencion),
    [answers.intencion]
  );
  const currentStep = flow[step];
  const isLastStep = step === flow.length - 1;
  const canAdvance = currentStep ? currentStep.isValid(answers) : false;

  /* ─── Init + seed + persistencia ───────────────────────── */
  React.useEffect(() => {
    if (!open) return;

    if (inlineSeed) {
      setAnswers((a) => ({ ...a, ...inlineSeed }));
      // Si ya viene con ocasion o emocion, saltar al paso 2 o 3
      if (inlineSeed.ocasion) setStep(2);
      else setStep(0);
      trackQuizStart();
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          step?: number;
          answers?: Partial<QuizAnswers>;
        };
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.step === "number") setStep(parsed.step);
      }
    } catch {
      /* ignore */
    }

    if (preselectedCodigo) {
      setAnswers((a) => ({
        ...a,
        codigo_elegido: preselectedCodigo,
        intencion: "personalizar",
      }));
    }

    trackQuizStart();
  }, [open, preselectedCodigo, inlineSeed]);

  React.useEffect(() => {
    if (!open) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, answers })
      );
    } catch {
      /* ignore */
    }
  }, [open, step, answers]);

  /* ─── Idle timer → envío parcial a los 60s ────────────── */
  const resetIdleTimer = React.useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (partialSent.current) return;
      if (step < 2) return;
      if (!answers.contacto?.telefono) return;
      partialSent.current = true;
      submitLead({
        ...(answers as QuizAnswers),
        camino: answers.intencion === "personalizar" ? "A" : "B",
        tipo_envio: "parcial",
      }).catch(() => {
        /* no romper UX */
      });
      trackQuizPartial();
    }, 60_000);
  }, [step, answers]);

  React.useEffect(() => {
    if (!open) return;
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [open, resetIdleTimer]);

  /* ─── Helpers ──────────────────────────────────────────── */
  const update = React.useCallback(
    <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
      setAnswers((a) => ({ ...a, [key]: value }));
      resetIdleTimer();
    },
    [resetIdleTimer]
  );

  const updateContacto = React.useCallback(
    (patch: Partial<NonNullable<QuizAnswers["contacto"]>>) => {
      setAnswers((a) => ({
        ...a,
        contacto: { nombre: "", telefono: "", ...(a.contacto || {}), ...patch },
      }));
      resetIdleTimer();
    },
    [resetIdleTimer]
  );

  const toggleMulti = React.useCallback(
    (opt: string) => {
      setAnswers((a) => {
        const current = a.personalizacion_multi || [];
        const next = current.includes(opt)
          ? current.filter((o) => o !== opt)
          : [...current, opt];
        return { ...a, personalizacion_multi: next };
      });
      resetIdleTimer();
    },
    [resetIdleTimer]
  );

  const goNext = () => {
    setDirection(1);
    setStep((s) => {
      const next = s + 1;
      trackQuizStep(next + 1);
      return next;
    });
    resetIdleTimer();
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    resetIdleTimer();
  };

  const resetAll = () => {
    setStep(0);
    setAnswers({});
    setSubmitError(null);
    setSuccess(false);
    partialSent.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleClose = (next: boolean) => {
    if (!next && success) resetAll();
    onOpenChange(next);
  };

  /* ─── Submit final ─────────────────────────────────────── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Construir payload con guards: TODOS los campos opcionales del quiz
      // saltados deben ser string vacío, NUNCA undefined, para que el endpoint
      // no falle al hacer .trim() o concat sobre undefined.
      const payload: QuizAnswers = {
        camino: answers.intencion === "personalizar" ? "A" : "B",
        a_quien: answers.a_quien || "",
        ocasion: answers.ocasion || "",
        emocion: answers.emocion || "",
        intencion: answers.intencion,
        codigo_elegido: answers.codigo_elegido || "",
        vision_descripcion: answers.vision_descripcion || "",
        vision_paleta: answers.vision_paleta || "",
        personalizacion_multi: answers.personalizacion_multi || [],
        fecha_estimada: answers.fecha_estimada || "",
        fecha_exacta: answers.fecha_exacta || "",
        contacto: {
          nombre: answers.contacto?.nombre || "",
          telefono: answers.contacto?.telefono || "",
          email: answers.contacto?.email || "",
        },
        tipo_envio: "completo",
      };

      await submitLead(payload);

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      trackQuizComplete(answers.intencion === "personalizar" ? "A" : "B");
      setDirection(1);
      setSuccess(true);
      toast.success("Te contactamos en menos de 15 minutos.", {
        description: "Tu sorpresa está a punto de empezar.",
      });
      if (!reduced) {
        window.setTimeout(() => balloonsRef.current?.launchAnimation(), 220);
      }
    } catch (e) {
      // El log de consola muestra detalles para debug; el toast al usuario es genérico.
      console.error("[QuizModal submit error]", e);

      let msg = "No pudimos enviar tu información. Probá de nuevo o escribinos por WhatsApp.";
      let debugDetail = "";

      if (e instanceof SubmitLeadError) {
        debugDetail = `[${e.code || "unknown"}] HTTP ${e.status}: ${e.message}`;
        // Mensaje más explícito si el backend reporta env vars faltantes
        if (e.code === "missing_env") {
          msg =
            "El servicio de envío está en mantenimiento. Escribinos directo por WhatsApp y te contactamos al instante.";
        } else if (e.code === "ghl_error") {
          msg =
            "No pudimos conectar con el sistema. Probá de nuevo en un momento o escribinos por WhatsApp.";
        }
      } else if (e instanceof Error) {
        debugDetail = e.message;
      } else {
        debugDetail = String(e);
      }

      console.error("[QuizModal submit detail]", debugDetail);
      setSubmitError(`${msg} (${debugDetail})`);
      toast.error("Algo salió mal", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Render del paso activo ──────────────────────────── */
  const renderStep = (): React.ReactNode => {
    if (!currentStep) return null;
    switch (currentStep.key) {
      case "a_quien":
        return (
          <IconGrid
            options={A_QUIEN}
            value={answers.a_quien}
            onChange={(v) => update("a_quien", v)}
            cols={2}
          />
        );
      case "ocasion":
        return (
          <IconGrid
            options={OCASIONES}
            value={answers.ocasion}
            onChange={(v) => update("ocasion", v)}
            cols={2}
          />
        );
      case "pausa_visual":
        return (
          <PausaVisual
            a={answers.a_quien}
            o={answers.ocasion}
          />
        );
      case "intencion":
        return (
          <IconGrid
            options={INTENCIONES}
            value={answers.intencion}
            onChange={(v) => update("intencion", v as Intencion)}
            cols={1}
          />
        );
      case "personalizar_galeria":
        return (
          <CodigoSelector
            codigos={pickGallery(answers.a_quien, answers.ocasion, 12)}
            value={answers.codigo_elegido}
            onChange={(v) => update("codigo_elegido", v)}
          />
        );
      case "vision_cero":
        return (
          <VisionCero
            descripcion={answers.vision_descripcion}
            paleta={answers.vision_paleta}
            onDescripcion={(v) => update("vision_descripcion", v)}
            onPaleta={(v) => update("vision_paleta", v)}
          />
        );
      case "personalizacion_multi":
        return (
          <MultiSelect
            options={PERSONALIZACION_MULTI}
            value={answers.personalizacion_multi || []}
            onToggle={toggleMulti}
          />
        );
      case "fecha_estimada":
        return (
          <IconGrid
            options={FECHAS}
            value={answers.fecha_estimada}
            onChange={(v) => update("fecha_estimada", v)}
            cols={2}
          />
        );
      case "contacto":
        return (
          <ContactoForm
            contacto={answers.contacto}
            fechaExacta={answers.fecha_exacta}
            onChangeContacto={updateContacto}
            onChangeFechaExacta={(v) => update("fecha_exacta", v)}
            error={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-3xl">
        <VisuallyHidden.Root>
          <DialogTitle>Quiz Big Bang Cali</DialogTitle>
        </VisuallyHidden.Root>
        <Balloons ref={balloonsRef} />

        {success ? (
          <PantallaExito onClose={() => handleClose(false)} />
        ) : (
          currentStep && (
            <div>
              {/* pr-12 reserva espacio para el botón X de cerrar (absolute right-5 + h-10 w-10) */}
              <div className="pr-12 md:pr-14">
                <ProgressBar
                  current={currentStep.progressIndex}
                  total={7}
                />
              </div>

              {currentStep.key === "contacto" ? (
                <>
                  <h2 className="mt-6 pr-12 md:pr-0 text-2xl md:text-3xl font-extrabold text-bb-purple leading-tight">
                    {currentStep.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-bb-text/65">
                    Solo 3 datos. Sin email. Sin tarjeta. Respuesta en menos de
                    15 minutos.
                  </p>
                </>
              ) : currentStep.key === "pausa_visual" ? (
                <h2 className="mt-6 pr-12 md:pr-0 text-lg md:text-xl font-bold text-bb-purple/85 leading-snug">
                  {currentStep.title}
                </h2>
              ) : (
                <h2 className="mt-6 pr-12 md:pr-0 text-2xl md:text-3xl font-extrabold text-bb-purple leading-tight">
                  {currentStep.title}
                </h2>
              )}

              <div className="relative mt-6 min-h-[260px] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 -mx-5 md:-mx-10 mt-6 flex items-center justify-between gap-3 border-t border-bb-purple/10 bg-white/95 px-5 md:px-10 py-3 md:py-4 backdrop-blur-sm z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={submitting || step === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </Button>

                {isLastStep ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!canAdvance || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Asegurando tu reserva...
                      </>
                    ) : (
                      "Quiero que me contacten"
                    )}
                  </Button>
                ) : currentStep.key === "pausa_visual" ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={goNext}
                  >
                    Continuar al paso 3 <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={goNext}
                    disabled={!canAdvance}
                  >
                    Siguiente <ArrowRight className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Sub-componentes
   ═══════════════════════════════════════════════════════════════════ */

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-wide text-bb-purple/70 whitespace-nowrap">
        Paso {current} / {total}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-bb-purple/10">
        <motion.div
          layout
          className="absolute inset-y-0 left-0 rounded-full bg-bb-pink"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>
    </div>
  );
}

function IconGrid({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: IconOption[] | IntencionOption[];
  value?: string;
  onChange: (v: string) => void;
  cols?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-3", cols === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
              selected
                ? "border-bb-pink bg-bb-pink-soft text-bb-purple shadow-bb-pink"
                : "border-bb-purple/15 bg-white text-bb-text hover:border-bb-pink/60 hover:bg-bb-pink-soft/30"
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
                selected
                  ? "bg-bb-pink text-white"
                  : "bg-bb-pink-soft text-bb-pink group-hover:bg-bb-pink group-hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
            </span>
            <span className="flex-1">{opt.label}</span>
            {selected && (
              <Check className="h-5 w-5 text-bb-pink" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}

function PausaVisual({
  a,
  o,
}: {
  a?: string;
  o?: string;
}) {
  const gallery = React.useMemo(() => pickGallery(a, o, 6), [a, o]);
  const refAQuien = a
    ? a
        .replace(/^A mi /, "")
        .replace(/^A /, "")
    : "esa persona";

  return (
    <div className="space-y-4">
      <p className="rounded-2xl bg-bb-pink-soft/60 px-4 py-2.5 text-sm text-bb-purple/85 leading-snug">
        Mientras procesamos, mirá lo que hemos creado para personas como{" "}
        <strong>{refAQuien}</strong>.
      </p>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {gallery.map((c, i) => (
          <div
            key={c.codigo}
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30 shadow-bb-soft",
              i >= 4 && "hidden md:block"
            )}
          >
            <Image
              src={c.img}
              alt={c.alt}
              fill
              sizes="(min-width:768px) 33vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bb-purple/95 to-transparent p-2">
              <p className="text-xs font-bold text-white">{c.titulo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodigoSelector({
  codigos,
  value,
  onChange,
}: {
  codigos: CodigoDec[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {codigos.map((c) => {
        const selected = value === c.codigo;
        return (
          <button
            key={c.codigo}
            type="button"
            onClick={() => onChange(c.codigo)}
            aria-pressed={selected}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-2 text-left transition-all",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
              selected
                ? "border-bb-pink shadow-bb-pink"
                : "border-bb-purple/10 hover:border-bb-pink/60"
            )}
          >
            <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/30">
              <Image
                src={c.img}
                alt={c.alt}
                fill
                sizes="(min-width:768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {selected && (
                <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-bb-pink text-white shadow-lg">
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-[10px] font-bold text-bb-pink">{c.codigo}</p>
              <p className="text-sm font-extrabold text-bb-purple leading-tight">
                {c.titulo}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function VisionCero({
  descripcion,
  paleta,
  onDescripcion,
  onPaleta,
}: {
  descripcion?: string;
  paleta?: string;
  onDescripcion: (v: string) => void;
  onPaleta: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <Textarea
        value={descripcion || ""}
        onChange={(e) => onDescripcion(e.target.value)}
        placeholder="Ej: ambiente romántico con luces cálidas, una palabra clave en el centro, mensaje personalizado…"
        rows={4}
      />
      <div>
        <Label className="text-sm font-bold text-bb-purple">
          Paleta de colores
        </Label>
        <div className="mt-2 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {PALETAS.map((p) => {
            const selected = paleta === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPaleta(p.value)}
                aria-pressed={selected}
                className={cn(
                  "rounded-2xl border-2 p-2 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
                  selected
                    ? "border-bb-pink shadow-bb-pink"
                    : "border-bb-purple/10 hover:border-bb-pink/60"
                )}
              >
                <div
                  className="h-10 w-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                  }}
                />
                <p className="mt-2 text-xs font-bold text-bb-purple">
                  {p.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onToggle,
}: {
  options: string[];
  value: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={selected}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
              selected
                ? "border-bb-pink bg-bb-pink-soft text-bb-purple shadow-bb-pink"
                : "border-bb-purple/15 bg-white text-bb-text hover:border-bb-pink/60 hover:bg-bb-pink-soft/30"
            )}
          >
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2",
                selected
                  ? "border-bb-pink bg-bb-pink text-white"
                  : "border-bb-purple/25"
              )}
            >
              {selected && <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="flex-1">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function ContactoForm({
  contacto,
  fechaExacta,
  onChangeContacto,
  onChangeFechaExacta,
  error,
}: {
  contacto?: QuizAnswers["contacto"];
  fechaExacta?: string;
  onChangeContacto: (p: Partial<NonNullable<QuizAnswers["contacto"]>>) => void;
  onChangeFechaExacta: (v: string) => void;
  error?: string | null;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="q-nombre">Nombre completo *</Label>
        <Input
          id="q-nombre"
          value={contacto?.nombre || ""}
          onChange={(e) => onChangeContacto({ nombre: e.target.value })}
          placeholder="Ej. Andrea Restrepo"
          autoComplete="name"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="q-tel">WhatsApp *</Label>
        <div className="flex gap-2">
          <span className="grid place-items-center rounded-2xl bg-bb-pink-soft px-3 text-bb-purple font-bold">
            +57
          </span>
          <Input
            id="q-tel"
            type="tel"
            value={contacto?.telefono || ""}
            onChange={(e) => onChangeContacto({ telefono: e.target.value })}
            placeholder="301 318 2266"
            autoComplete="tel"
            inputMode="tel"
            className="flex-1"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="q-fecha-exacta">
          Fecha exacta del evento (opcional)
        </Label>
        <Input
          id="q-fecha-exacta"
          type="date"
          value={fechaExacta || ""}
          min={today}
          onChange={(e) => onChangeFechaExacta(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <p className="text-xs text-bb-text/60">
        Tus datos se usan solo para coordinar tu sorpresa. No spam, no email,
        sin tarjeta.
      </p>
    </div>
  );
}

function PantallaExito({ onClose }: { onClose: () => void }) {
  const igUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/tiendas_big_bang/";
  return (
    <div className="text-center py-2">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bb-lime text-bb-purple">
        <PartyPopper className="h-9 w-9" />
      </span>
      <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-bb-purple leading-tight">
        ¡Listo! Esa sorpresa está a punto de empezar.
      </h2>
      <p className="mt-4 text-base md:text-lg text-bb-text/80 max-w-xl mx-auto">
        En menos de 15 minutos un asesor te contacta por WhatsApp. Mientras
        tanto, seguinos en Instagram para inspirarte con montajes reales.
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg" variant="default">
          <a href={igUrl} target="_blank" rel="noopener">
            <Instagram className="h-5 w-5" /> @tiendas_big_bang
          </a>
        </Button>
        <Button variant="ghost" size="lg" onClick={onClose}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
