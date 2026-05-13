"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Instagram,
  PartyPopper,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Balloons, type BalloonsHandle } from "@/components/ui/balloons";

import { submitLead, type QuizAnswers, type CaminoQuiz } from "@/lib/ghl";
import {
  CODIGOS_DEC,
  CATEGORIA_LABEL,
  type CodigoDec,
} from "@/lib/codigos-dec";
import {
  trackQuizComplete,
  trackQuizPartial,
  trackQuizStart,
  trackQuizStep,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Phase = "welcome" | "A" | "B" | "success";
const STORAGE_KEY = "bb-quiz-state-v1";

const PARA_QUIEN = [
  "Para mi hijo o hija",
  "Para mi pareja",
  "Para mi mamá o papá",
  "Para mí",
  "Para un amigo",
  "Para alguien especial",
  "Otro",
];

const TIPOS_EVENTO = [
  "Cumpleaños infantil",
  "Cumpleaños de adulto",
  "Baby shower",
  "Gender reveal",
  "Bautizo o primera comunión",
  "Grado",
  "Aniversario",
  "Evento empresarial",
  "Otro",
];

const PERSONALIZACION_OPCIONES = [
  { value: "tal_cual", label: "Tal cual lo veo en el código" },
  { value: "cambios", label: "Le cambio algunos detalles" },
  { value: "inspiracion", label: "Lo uso como inspiración, pero quiero algo único" },
];

const TIENE_TEMATICA_OPCIONES = [
  { value: "si", label: "Sí, ya sé qué quiero" },
  { value: "idea_asesoria", label: "Tengo una idea pero necesito asesoría" },
  { value: "recomendaciones", label: "Quiero que me recomienden" },
];

const PRESUPUESTOS = [
  "Menos de 300.000",
  "300.000 a 600.000",
  "600.000 a 1.000.000",
  "1.000.000 a 2.000.000",
  "Más de 2.000.000",
  "Aún no lo tengo definido",
];

const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir === 1 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir === 1 ? -80 : 80, opacity: 0 }),
};
const slideTransition = { type: "spring" as const, stiffness: 260, damping: 25 };

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Pre-llena código DEC y entra directo al Camino A */
  preselectedCodigo?: string | null;
  /** Pre-llena respuestas del formulario inline y abre Camino B en el paso 2 */
  inlineSeed?: Partial<QuizAnswers> | null;
  /** Cierra el modal y hace scroll a la sección de mayoristas */
  onRequestMayorista?: () => void;
}

export function QuizModal({
  open,
  onOpenChange,
  preselectedCodigo,
  inlineSeed,
  onRequestMayorista,
}: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("welcome");
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [answers, setAnswers] = React.useState<Partial<QuizAnswers>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const partialSent = React.useRef(false);
  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const balloonsRef = React.useRef<BalloonsHandle>(null);

  // ─── Persistencia localStorage + seed externo ───────────────
  React.useEffect(() => {
    if (!open) return;
    // 1. Seed inline (formulario embebido) gana sobre todo
    if (inlineSeed) {
      setAnswers((a) => ({ ...a, ...inlineSeed, camino: "B" as CaminoQuiz }));
      setPhase("B");
      setStep(1); // paso 2 visible: "¿Para quién?"
      trackQuizStart();
      return;
    }
    // 2. Restaurar de localStorage si existe
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          phase?: Phase;
          step?: number;
          answers?: Partial<QuizAnswers>;
        };
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.phase) setPhase(parsed.phase);
        if (typeof parsed.step === "number") setStep(parsed.step);
      }
    } catch {
      /* ignore */
    }
    // 3. Camino A directo si vino con código preseleccionado
    if (preselectedCodigo) {
      setAnswers((a) => ({
        ...a,
        codigo_dec: preselectedCodigo,
        camino: "A" as CaminoQuiz,
      }));
      setPhase("A");
      setStep(1);
    }
    trackQuizStart();
  }, [open, preselectedCodigo, inlineSeed]);

  React.useEffect(() => {
    if (!open) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ phase, step, answers })
      );
    } catch {
      /* ignore */
    }
  }, [open, phase, step, answers]);

  // ─── Idle timer → envío parcial a los 60s ───────────────────
  const resetIdleTimer = React.useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (partialSent.current) return;
      // Solo si avanzó al menos al paso 3 (índice 2)
      if (step < 2) return;
      if (!answers.contacto?.telefono) return;
      partialSent.current = true;
      const partial: QuizAnswers = {
        ...(answers as QuizAnswers),
        camino: phase === "B" ? "B" : "A",
        tipo_envio: "parcial",
      };
      submitLead(partial).catch(() => {
        /* no romper UX */
      });
      trackQuizPartial();
    }, 60_000);
  }, [step, answers, phase]);

  React.useEffect(() => {
    if (!open) return;
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [open, resetIdleTimer]);

  // ─── Helpers ────────────────────────────────────────────────
  const update = React.useCallback(<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    resetIdleTimer();
  }, [resetIdleTimer]);

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
    setPhase("welcome");
    setStep(0);
    setAnswers({});
    setSubmitError(null);
    partialSent.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleClose = (next: boolean) => {
    if (!next && phase === "success") {
      // Cerrar tras éxito → limpiar todo
      resetAll();
    }
    onOpenChange(next);
  };

  const startCamino = (c: CaminoQuiz) => {
    setDirection(1);
    setPhase(c);
    setStep(0);
    setAnswers((a) => ({ ...a, camino: c }));
  };

  // ─── Submit final ───────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitLead({
        ...(answers as QuizAnswers),
        camino: phase === "B" ? "B" : "A",
        tipo_envio: "completo",
      });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      trackQuizComplete(phase === "B" ? "B" : "A");
      setDirection(1);
      setPhase("success");
      setStep(0);
      toast.success("Te contactamos en menos de 24 horas.", {
        description: "Tu reserva de identidad quedó asegurada.",
      });
      // celebrar
      if (!reduced) {
        window.setTimeout(() => balloonsRef.current?.launchAnimation(), 220);
      }
    } catch (e) {
      console.error(e);
      const msg =
        "No pudimos enviar tu información. Probá de nuevo o escribinos por WhatsApp.";
      setSubmitError(msg);
      toast.error("Algo salió mal", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Definición de pasos (Camino A y B) ─────────────────────
  type StepDef = {
    title: string;
    isValid: () => boolean;
    render: () => React.ReactNode;
  };

  const stepsA: StepDef[] = [
    {
      title: "¿Cuál es el código que te enamoró?",
      isValid: () => !!answers.codigo_dec,
      render: () => (
        <CodigoSelector
          value={answers.codigo_dec || ""}
          onChange={(v) => update("codigo_dec", v)}
        />
      ),
    },
    {
      title: "¿Para quién es la sorpresa?",
      isValid: () => !!answers.para_quien,
      render: () => (
        <OptionGrid
          value={answers.para_quien}
          options={PARA_QUIEN}
          onChange={(v) => update("para_quien", v)}
        />
      ),
    },
    {
      title: "¿Lo dejas tal cual o lo personalizas?",
      isValid: () => !!answers.personalizacion,
      render: () => (
        <OptionGrid
          value={answers.personalizacion}
          options={PERSONALIZACION_OPCIONES.map((o) => o.label)}
          valuesMap={PERSONALIZACION_OPCIONES}
          onChange={(v) => update("personalizacion", v)}
        />
      ),
    },
    {
      title: "¿Qué quieres cambiar?",
      isValid: () =>
        answers.personalizacion === "tal_cual" ||
        (answers.detalle_personalizacion?.trim().length ?? 0) >= 4,
      render: () =>
        answers.personalizacion === "tal_cual" ? (
          <div className="rounded-2xl bg-bb-lime-soft p-6 text-bb-purple">
            <p className="font-bold mb-1">Perfecto, lo dejamos tal cual.</p>
            <p className="text-sm text-bb-text/80">
              Lo replicamos fielmente y te confirmamos en menos de 24h.
            </p>
          </div>
        ) : (
          <Textarea
            value={answers.detalle_personalizacion || ""}
            onChange={(e) => update("detalle_personalizacion", e.target.value)}
            placeholder="Ej: cambiar los colores a azul y plateado, agregar el nombre, sumar un photo opportunity..."
            rows={5}
          />
        ),
    },
    {
      title: "¿Cuándo es el evento?",
      isValid: () => !!answers.fecha_evento,
      render: () => (
        <FechaPicker
          value={answers.fecha_evento}
          onChange={(v) => update("fecha_evento", v)}
        />
      ),
    },
    {
      title: "¿Cuál es tu presupuesto aproximado?",
      isValid: () => !!answers.presupuesto,
      render: () => (
        <OptionGrid
          value={answers.presupuesto}
          options={PRESUPUESTOS}
          onChange={(v) => update("presupuesto", v)}
          cols={2}
        />
      ),
    },
    {
      title: "¿Cómo te contactamos?",
      isValid: () =>
        (answers.contacto?.nombre?.trim().length ?? 0) >= 2 &&
        /^\+?\d[\d\s\-]{7,}$/.test(answers.contacto?.telefono ?? ""),
      render: () => (
        <ContactoForm
          contacto={answers.contacto}
          onChange={updateContacto}
          error={submitError}
        />
      ),
    },
  ];

  const stepsB: StepDef[] = [
    {
      title: "¿Qué tipo de evento vas a celebrar?",
      isValid: () => !!answers.tipo_evento,
      render: () => (
        <OptionGrid
          value={answers.tipo_evento}
          options={TIPOS_EVENTO}
          onChange={(v) => update("tipo_evento", v)}
          cols={2}
        />
      ),
    },
    {
      title: "¿Para quién es?",
      isValid: () => !!answers.para_quien,
      render: () => (
        <OptionGrid
          value={answers.para_quien}
          options={PARA_QUIEN}
          onChange={(v) => update("para_quien", v)}
        />
      ),
    },
    {
      title: "¿Tienes temática definida?",
      isValid: () => !!answers.tiene_tematica,
      render: () => (
        <OptionGrid
          value={answers.tiene_tematica}
          options={TIENE_TEMATICA_OPCIONES.map((o) => o.label)}
          valuesMap={TIENE_TEMATICA_OPCIONES}
          onChange={(v) => update("tiene_tematica", v)}
        />
      ),
    },
    {
      title: "Contanos qué estilo o temática imaginás",
      isValid: () =>
        answers.tiene_tematica === "recomendaciones" ||
        (answers.tematica_detalle?.trim().length ?? 0) >= 4,
      render: () =>
        answers.tiene_tematica === "recomendaciones" ? (
          <div className="rounded-2xl bg-bb-pink-soft p-6 text-bb-purple">
            <p className="font-bold mb-1">Listo. Nosotros te proponemos.</p>
            <p className="text-sm text-bb-text/80">
              En la asesoría te llevamos tres opciones a medida.
            </p>
          </div>
        ) : (
          <Textarea
            value={answers.tematica_detalle || ""}
            onChange={(e) => update("tematica_detalle", e.target.value)}
            placeholder={tematicaPlaceholder(answers.tipo_evento)}
            rows={5}
          />
        ),
    },
    {
      title: "¿Cuándo es el evento?",
      isValid: () => !!answers.fecha_evento,
      render: () => (
        <FechaPicker
          value={answers.fecha_evento}
          onChange={(v) => update("fecha_evento", v)}
        />
      ),
    },
    {
      title: "¿Cuál es tu presupuesto aproximado?",
      isValid: () => !!answers.presupuesto,
      render: () => (
        <OptionGrid
          value={answers.presupuesto}
          options={PRESUPUESTOS}
          onChange={(v) => update("presupuesto", v)}
          cols={2}
        />
      ),
    },
    {
      title: "¿Cómo te contactamos?",
      isValid: () =>
        (answers.contacto?.nombre?.trim().length ?? 0) >= 2 &&
        /^\+?\d[\d\s\-]{7,}$/.test(answers.contacto?.telefono ?? ""),
      render: () => (
        <ContactoForm
          contacto={answers.contacto}
          onChange={updateContacto}
          error={submitError}
        />
      ),
    },
  ];

  const currentSteps = phase === "A" ? stepsA : phase === "B" ? stepsB : [];
  const totalSteps = currentSteps.length;
  const currentStep = currentSteps[step];
  const isLastStep = step === totalSteps - 1;
  const canAdvance = currentStep?.isValid() ?? false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-3xl">
        <VisuallyHidden.Root>
          <DialogTitle>Quiz Big Bang Cali</DialogTitle>
        </VisuallyHidden.Root>
        <Balloons ref={balloonsRef} />

        {/* WELCOME */}
        {phase === "welcome" && (
          <Welcome
            onPickA={() => startCamino("A")}
            onPickB={() => startCamino("B")}
            onMayorista={() => {
              onOpenChange(false);
              onRequestMayorista?.();
            }}
          />
        )}

        {/* CAMINO A o B */}
        {(phase === "A" || phase === "B") && currentStep && (
          <div>
            <ProgressBar current={step + 1} total={totalSteps} />
            <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-bb-purple leading-tight">
              {currentStep.title}
            </h2>

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
                  {currentStep.render()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={step === 0 ? () => setPhase("welcome") : goBack}
                disabled={submitting}
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
                    <>
                      Asegurar mi reserva de identidad <Sparkles className="h-5 w-5" />
                    </>
                  )}
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
        )}

        {/* SUCCESS */}
        {phase === "success" && (
          <PantallaExito onClose={() => handleClose(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Sub-componentes locales
   ═══════════════════════════════════════════════════════════════════ */

function Welcome({
  onPickA,
  onPickB,
  onMayorista,
}: {
  onPickA: () => void;
  onPickB: () => void;
  onMayorista: () => void;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-bb-pink-soft px-4 py-1.5 text-sm font-bold text-bb-pink">
        <Sparkles className="h-4 w-4" /> 60 segundos
      </span>
      <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-bb-purple leading-tight">
        ¿Ya viste un código o decoración que te haya gustado?
      </h2>
      <p className="mt-3 text-bb-text/75 max-w-lg mx-auto">
        Elegí por dónde empezar. Cero compromiso. Te llamamos en menos de 24 horas.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPickA}
          className="group rounded-3xl bg-bb-pink p-7 text-left text-white shadow-bb-pink transition hover:-translate-y-1"
        >
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            Tengo un código en mente
          </span>
          <span className="mt-2 block text-2xl font-extrabold leading-tight">
            Sí, ya vi algo que me enamoró
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
            Continuar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </button>

        <button
          type="button"
          onClick={onPickB}
          className="group rounded-3xl bg-bb-purple p-7 text-left text-white transition hover:-translate-y-1"
        >
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            Empezar de cero
          </span>
          <span className="mt-2 block text-2xl font-extrabold leading-tight">
            Quiero diseñar algo único
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
            Continuar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onMayorista}
        className="mt-6 text-sm font-bold text-bb-purple/70 hover:text-bb-pink underline-offset-4 hover:underline"
      >
        Soy mayorista o empresa →
      </button>
    </div>
  );
}

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

function OptionGrid({
  value,
  options,
  onChange,
  valuesMap,
  cols = 1,
}: {
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  valuesMap?: { value: string; label: string }[];
  cols?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-3", cols === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {options.map((opt) => {
        const internal = valuesMap?.find((m) => m.label === opt)?.value ?? opt;
        const selected = value === internal;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(internal)}
            aria-pressed={selected}
            className={cn(
              "w-full rounded-2xl border-2 p-4 text-left font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
              selected
                ? "border-bb-pink bg-bb-pink-soft text-bb-purple shadow-bb-pink"
                : "border-bb-purple/15 bg-white text-bb-text hover:border-bb-pink/60 hover:bg-bb-pink-soft/30"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function CodigoSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [search, setSearch] = React.useState(value);
  React.useEffect(() => setSearch(value), [value]);

  const selected: CodigoDec | undefined = CODIGOS_DEC.find(
    (c) => c.codigo.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="codigo-input">Escribí el código (ej. DEC-005)</Label>
        <Input
          id="codigo-input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value.toUpperCase().trim());
          }}
          placeholder="DEC-..."
          autoComplete="off"
          className="mt-1.5"
        />
        {selected && (
          <p className="mt-2 text-sm text-bb-purple">
            <strong>{selected.titulo}</strong> · {CATEGORIA_LABEL[selected.categoria]} · {selected.emocion}
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-bb-purple/70">
          O elegí desde la galería
        </p>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
          {CODIGOS_DEC.slice(0, 24).map((c) => {
            const isSel = c.codigo === value;
            return (
              <button
                key={c.codigo}
                type="button"
                onClick={() => onChange(c.codigo)}
                aria-pressed={isSel}
                className={cn(
                  "snap-start shrink-0 w-32 overflow-hidden rounded-2xl border-2 transition-all text-left",
                  isSel
                    ? "border-bb-pink shadow-bb-pink"
                    : "border-bb-purple/10 hover:border-bb-pink/40"
                )}
              >
                <div className="relative h-20 w-full bg-gradient-to-br from-bb-pink-soft to-bb-purple-soft/40">
                  <Image
                    src={c.img}
                    alt={c.titulo}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-bold text-bb-pink">{c.codigo}</p>
                  <p className="truncate text-xs font-bold text-bb-purple">{c.titulo}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FechaPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const sinFecha = value === "sin_definir";
  return (
    <div className="space-y-3">
      <Input
        type="date"
        value={sinFecha ? "" : value || ""}
        min={today}
        onChange={(e) => onChange(e.target.value)}
        disabled={sinFecha}
      />
      <button
        type="button"
        onClick={() => onChange(sinFecha ? "" : "sin_definir")}
        className={cn(
          "text-sm font-bold underline-offset-4 hover:underline",
          sinFecha ? "text-bb-pink" : "text-bb-purple/70 hover:text-bb-pink"
        )}
      >
        {sinFecha ? "Quitar selección" : "No tengo fecha definida"}
      </button>
    </div>
  );
}

function ContactoForm({
  contacto,
  onChange,
  error,
}: {
  contacto?: QuizAnswers["contacto"];
  onChange: (p: Partial<NonNullable<QuizAnswers["contacto"]>>) => void;
  error?: string | null;
}) {
  const fieldClass =
    "group/field grid gap-1.5 has-[:focus]:[&_label]:-translate-y-0.5 has-[:focus]:[&_label]:text-bb-pink";
  const labelClass = "transition-all duration-200";

  return (
    <div className="grid gap-4">
      <div className={fieldClass}>
        <Label htmlFor="q-nombre" className={labelClass}>
          Nombre completo *
        </Label>
        <Input
          id="q-nombre"
          value={contacto?.nombre || ""}
          onChange={(e) => onChange({ nombre: e.target.value })}
          placeholder="Ej. Andrea Restrepo"
          autoComplete="name"
        />
      </div>
      <div className={fieldClass}>
        <Label htmlFor="q-tel" className={labelClass}>
          WhatsApp (con código de país) *
        </Label>
        <Input
          id="q-tel"
          type="tel"
          value={contacto?.telefono || ""}
          onChange={(e) => onChange({ telefono: e.target.value })}
          placeholder="+57 301 318 2266"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      <div className={fieldClass}>
        <Label htmlFor="q-email" className={labelClass}>
          Email (opcional)
        </Label>
        <Input
          id="q-email"
          type="email"
          value={contacto?.email || ""}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="andrea@correo.com"
          autoComplete="email"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <p className="text-xs text-bb-text/60">
        Tus datos se usan exclusivamente para coordinar tu asesoría. No spam.
      </p>
    </div>
  );
}

function PantallaExito({ onClose }: { onClose: () => void }) {
  const igUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/tiendas_big_bang/";
  return (
    <div className="text-center py-2">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bb-lime text-bb-purple">
        <PartyPopper className="h-9 w-9" />
      </span>
      <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-bb-purple leading-tight">
        ¡Listo! Eres oficialmente el próximo anfitrión inolvidable
      </h2>
      <p className="mt-4 text-base md:text-lg text-bb-text/80 max-w-xl mx-auto">
        En menos de 24 horas un asesor te contacta por WhatsApp. Mientras tanto,
        seguinos en Instagram para inspirarte con montajes reales.
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

function tematicaPlaceholder(tipo?: string): string {
  if (!tipo) return "Contanos qué imaginás...";
  if (tipo.includes("infantil")) return "Ej: temática unicornios con tonos pastel y mucho rosa";
  if (tipo.includes("adulto")) return "Ej: cumpleaños 30 negro y dorado, vibe sofisticado";
  if (tipo.includes("Baby")) return "Ej: nube de algodón, tonos pastel, osito como protagonista";
  if (tipo.includes("Bautizo")) return "Ej: blanco y dorado, paloma central, ambiente sereno";
  if (tipo.includes("Grado")) return "Ej: birrete dorado sobre fondo oscuro, frase del programa";
  if (tipo.includes("Aniversario")) return "Ej: 25 años juntos, rojos y dorados, foto del primer viaje";
  if (tipo.includes("empresarial")) return "Ej: lanzamiento de producto tech, paleta corporativa";
  return "Contanos qué imaginás...";
}
