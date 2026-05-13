"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Building2, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Balloons, type BalloonsHandle } from "@/components/ui/balloons";
import { submitMayorista, type MayoristaPayload } from "@/lib/ghl";
import { trackMayorista } from "@/lib/analytics";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

const VOLUMENES = [
  "Menos de 500.000",
  "500.000 a 2.000.000",
  "2.000.000 a 5.000.000",
  "Más de 5.000.000",
];

const schema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  empresa: z.string().min(2, "Empresa requerida"),
  nit: z.string().optional(),
  ciudad: z.string().min(2, "Ciudad requerida"),
  volumen_mensual: z.string().min(1, "Seleccioná un volumen"),
  whatsapp: z.string().regex(/^\+?\d[\d\s-]{7,}$/, "WhatsApp inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  intereses: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "fallback"; whatsappUrl: string; message: string }
  | { kind: "error"; message: string };

export function Mayoristas() {
  const [state, setState] = React.useState<State>({ kind: "idle" });
  const balloonsRef = React.useRef<BalloonsHandle>(null);
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const animate = mounted && !reduced;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { volumen_mensual: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setState({ kind: "submitting" });
    try {
      const res = await submitMayorista(values as MayoristaPayload);
      if (res.fallback && res.whatsapp_url) {
        setState({
          kind: "fallback",
          whatsappUrl: res.whatsapp_url,
          message: res.message || "Canal en preparación. Escribinos por WhatsApp.",
        });
        return;
      }
      trackMayorista();
      setState({ kind: "success" });
      reset();
      // Globos al submit exitoso (regla v4)
      window.setTimeout(() => balloonsRef.current?.launchAnimation(), 180);
      toast.success("Recibimos tu solicitud", {
        description: "Un asesor B2B te contacta en menos de 24 horas.",
      });
    } catch {
      setState({
        kind: "error",
        message: "No pudimos enviar el formulario. Probá de nuevo en unos segundos.",
      });
      toast.error("Algo salió mal", {
        description: "Probá de nuevo o escribinos por WhatsApp.",
      });
    }
  };

  return (
    <section id="mayoristas" className="bg-bb-lime-soft py-20 md:py-28">
      <Balloons ref={balloonsRef} />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          <motion.span
            variants={animate ? { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } : undefined}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-bb-purple shadow-bb-soft"
          >
            <Building2 className="h-4 w-4 text-bb-pink" /> Canal B2B
          </motion.span>
          <motion.h2
            variants={animate ? { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } } : undefined}
            className="mt-5 text-3xl md:text-5xl font-extrabold text-bb-purple leading-[1.05]"
          >
            ¿Tienda, distribuidor o evento corporativo?
          </motion.h2>
          <motion.p
            variants={animate ? { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } } : undefined}
            className="mt-5 text-bb-text/80 leading-relaxed"
          >
            Manejamos volumen, variedad y precios especiales para mayoristas en
            Cali y Valle del Cauca. Contanos qué necesitás y un asesor B2B te
            contacta en menos de 24 horas.
          </motion.p>
          <motion.ul
            variants={
              animate
                ? {
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
                  }
                : undefined
            }
            className="mt-8 space-y-3 text-bb-text/85"
          >
            {[
              "Catálogo mayorista actualizado mensualmente",
              "Plazo y condiciones especiales por volumen",
              "Asesor B2B dedicado para grandes cuentas",
              "Despacho a Cali, Yumbo, Palmira y Jamundí",
            ].map((p) => (
              <motion.li
                key={p}
                variants={animate ? { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } } : undefined}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bb-pink" />
                <span>{p}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={animate ? { x: 40, opacity: 0 } : false}
          whileInView={animate ? { x: 0, opacity: 1 } : undefined}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="rounded-3xl bg-white p-7 md:p-9 shadow-bb-soft"
        >
          <AnimatePresence mode="wait">
            {state.kind === "success" ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center"
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-bb-lime" />
                <h3 className="mt-4 text-2xl font-extrabold text-bb-purple">
                  Gracias. Tu solicitud llegó.
                </h3>
                <p className="mt-2 text-bb-text/80">
                  Un asesor B2B te escribe en menos de 24 horas.
                </p>
              </motion.div>
            ) : state.kind === "fallback" ? (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <AlertTriangle className="h-10 w-10 text-bb-pink" />
                <h3 className="mt-4 text-xl font-extrabold text-bb-purple">
                  Canal en preparación
                </h3>
                <p className="mt-2 text-bb-text/80">{state.message}</p>
                <Button asChild size="lg" className="mt-5 w-full">
                  <a href={state.whatsappUrl} target="_blank" rel="noopener">
                    Escribir por WhatsApp
                  </a>
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4"
                noValidate
              >
                <FieldRow label="Nombre del responsable" error={errors.nombre?.message}>
                  <Input {...register("nombre")} placeholder="Andrea Restrepo" autoComplete="name" />
                </FieldRow>
                <FieldRow label="Empresa" error={errors.empresa?.message}>
                  <Input {...register("empresa")} placeholder="Tienda Andrea SAS" />
                </FieldRow>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldRow label="NIT (opcional)" error={errors.nit?.message}>
                    <Input {...register("nit")} placeholder="901.234.567-8" />
                  </FieldRow>
                  <FieldRow label="Ciudad" error={errors.ciudad?.message}>
                    <Input {...register("ciudad")} placeholder="Cali" />
                  </FieldRow>
                </div>
                <FieldRow label="Volumen mensual aproximado" error={errors.volumen_mensual?.message}>
                  <select
                    {...register("volumen_mensual")}
                    className={cn(
                      "h-12 w-full rounded-2xl border-2 border-bb-purple/15 bg-white px-4",
                      "focus-visible:outline-none focus-visible:border-bb-pink"
                    )}
                  >
                    <option value="">Seleccioná…</option>
                    {VOLUMENES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </FieldRow>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldRow label="WhatsApp" error={errors.whatsapp?.message}>
                    <Input
                      type="tel"
                      {...register("whatsapp")}
                      placeholder="+57 301 318 2266"
                      autoComplete="tel"
                    />
                  </FieldRow>
                  <FieldRow label="Email (opcional)" error={errors.email?.message}>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="andrea@tienda.com"
                      autoComplete="email"
                    />
                  </FieldRow>
                </div>
                <FieldRow label="¿Qué productos te interesan? (opcional)" error={errors.intereses?.message}>
                  <Textarea
                    {...register("intereses")}
                    placeholder="Ej: piñatas, globos para reventa, decoración corporativa..."
                    rows={3}
                  />
                </FieldRow>

                {state.kind === "error" && (
                  <p role="alert" className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-3 py-2">
                    {state.message}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={state.kind === "submitting"}
                  className="mt-2 w-full"
                >
                  {state.kind === "submitting" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Enviando…
                    </>
                  ) : (
                    "Quiero recibir propuesta mayorista"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field grid gap-1.5 has-[:focus]:[&_label]:-translate-y-0.5 has-[:focus]:[&_label]:text-bb-pink">
      <Label className="transition-all duration-200">{label}</Label>
      {children}
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}
