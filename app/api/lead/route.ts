import { NextResponse } from "next/server";
import type { QuizAnswers } from "@/lib/ghl";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || "";

interface GhlPayloadNuevo {
  nombre: string;
  telefono: string;
  email: string;
  a_quien: string;
  ocasion: string;
  emocion: string;
  intencion: string;
  codigo_elegido: string;
  vision_descripcion: string;
  vision_paleta: string;
  personalizacion: string;
  fecha_estimada: string;
  fecha_exacta: string;
  resumen_quiz: string;
  source: "landing_big_bang_funnel_v2";
}

/**
 * Campos legacy (Phase O.1): mapping de los workflows viejos de GHL que
 * todavía esperan los nombres de la v1 del funnel. Se concatenan al payload
 * nuevo para que durante la transición ambos sets de workflows reciban data
 * correctamente cableada.
 * TODO: Phase O.2 — eliminar campos compat cuando GHL workflows estén 100% migrados.
 */
interface GhlPayloadCompat extends GhlPayloadNuevo {
  tipo_evento: string;
  para_quien: string;
  tiene_tematica: string;
  tematica_detalle: string;
  fecha_evento: string;
  presupuesto: string;
}

function buildResumen(a: QuizAnswers): string {
  const lines = [
    `A quien: ${a.a_quien || "(sin definir)"}`,
    `Ocasion: ${a.ocasion || a.tipo_evento || "(sin definir)"}`,
    a.emocion ? `Emocion previa: ${a.emocion}` : "",
    `Intencion: ${a.intencion || "(sin definir)"}`,
    a.codigo_elegido ? `Codigo elegido: ${a.codigo_elegido}` : "",
    a.vision_descripcion ? `Vision: ${a.vision_descripcion}` : "",
    a.vision_paleta ? `Paleta: ${a.vision_paleta}` : "",
    a.personalizacion_multi?.length
      ? `Personalizacion: ${a.personalizacion_multi.join(", ")}`
      : "",
    a.fecha_estimada ? `Fecha estimada: ${a.fecha_estimada}` : "",
    a.fecha_exacta ? `Fecha exacta: ${a.fecha_exacta}` : "",
    a.tipo_envio === "parcial"
      ? `[ENVIO PARCIAL - el usuario abandono el quiz]`
      : "",
  ].filter(Boolean);
  return lines.join(" | ");
}

/** Ofusca un teléfono dejando solo los últimos 4 dígitos visibles */
function maskPhone(p: string): string {
  if (!p || p.length < 5) return p;
  return p.slice(0, -4).replace(/\d/g, "•") + p.slice(-4);
}

/** Ofusca email mostrando solo primer char + dominio */
function maskEmail(e: string): string {
  if (!e || !e.includes("@")) return e;
  const [user, dom] = e.split("@");
  if (!user || !dom) return e;
  return `${user[0]}***@${dom}`;
}

/** Safe trim que tolera undefined / null */
function safe(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim();
}

export async function POST(req: Request) {
  const t0 = Date.now();

  // Diagnóstico de env vars en runtime — clave para debug en Vercel
  console.info("[/api/lead] env check", {
    has_webhook_url: !!GHL_WEBHOOK_URL,
    webhook_prefix: GHL_WEBHOOK_URL?.slice(0, 50) || "EMPTY",
    node_env: process.env.NODE_ENV,
  });

  if (!GHL_WEBHOOK_URL) {
    console.error(
      "[/api/lead] CRITICO: GHL_WEBHOOK_URL no esta configurada en env vars de Vercel"
    );
    return NextResponse.json(
      {
        error: "Backend no configurado. Verificar env vars en Vercel.",
        code: "missing_env",
      },
      { status: 500 }
    );
  }

  let answers: QuizAnswers;
  try {
    answers = (await req.json()) as QuizAnswers;
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "bad_json" },
      { status: 400 }
    );
  }

  const nombre = safe(answers?.contacto?.nombre);
  const telefono = safe(answers?.contacto?.telefono);

  if (!nombre || !telefono) {
    console.warn("[/api/lead] Faltan campos obligatorios", {
      has_nombre: !!nombre,
      has_telefono: !!telefono,
    });
    return NextResponse.json(
      {
        error: "Faltan campos obligatorios (nombre, telefono)",
        code: "missing_fields",
      },
      { status: 400 }
    );
  }

  const payloadNuevo: GhlPayloadNuevo = {
    nombre,
    telefono,
    email: safe(answers?.contacto?.email),
    a_quien: safe(answers.a_quien),
    ocasion: safe(answers.ocasion) || safe(answers.tipo_evento),
    emocion: safe(answers.emocion),
    intencion: safe(answers.intencion),
    codigo_elegido: safe(answers.codigo_elegido) || safe(answers.codigo_dec),
    vision_descripcion: safe(answers.vision_descripcion),
    vision_paleta: safe(answers.vision_paleta),
    personalizacion: answers.personalizacion_multi?.join(", ") || "",
    fecha_estimada: safe(answers.fecha_estimada),
    fecha_exacta: safe(answers.fecha_exacta) || safe(answers.fecha_evento),
    resumen_quiz: buildResumen(answers),
    source: "landing_big_bang_funnel_v2",
  };

  // Phase O.1: mapping a campos viejos para mantener GHL funcionando durante
  // transición. Los workflows v1 leen tipo_evento/para_quien/etc; los v2 leen
  // los campos directos. Ambos sets viajan en el mismo POST.
  // TODO: Phase O.2 — eliminar campos compat cuando GHL workflows estén 100% migrados.
  const tieneTematica =
    answers.intencion === "personalizar"
      ? "Si, ya se que quiero"
      : answers.intencion === "cero"
        ? "No, quiero empezar desde cero"
        : answers.intencion === "asesoria"
          ? "Necesito asesoria"
          : answers.intencion === "sorprendeme"
            ? "Confio en ustedes"
            : "";

  const payload: GhlPayloadCompat = {
    ...payloadNuevo,
    tipo_evento: payloadNuevo.ocasion,
    para_quien: payloadNuevo.a_quien,
    tiene_tematica: tieneTematica,
    tematica_detalle:
      payloadNuevo.codigo_elegido ||
      payloadNuevo.vision_descripcion ||
      payloadNuevo.personalizacion ||
      "",
    fecha_evento: payloadNuevo.fecha_exacta || payloadNuevo.fecha_estimada,
    presupuesto: "",
  };

  console.info("[/api/lead] inbound", {
    intencion: answers.intencion,
    tipo_envio: answers.tipo_envio || "completo",
    payload: {
      nombre: payload.nombre,
      telefono: maskPhone(payload.telefono),
      email: maskEmail(payload.email),
      a_quien: payload.a_quien,
      ocasion: payload.ocasion,
      intencion: payload.intencion,
      codigo_elegido: payload.codigo_elegido,
      fecha_estimada: payload.fecha_estimada,
      // Compat (Phase O.1)
      tipo_evento: payload.tipo_evento,
      para_quien: payload.para_quien,
      tiene_tematica: payload.tiene_tematica,
      resumen_quiz_len: payload.resumen_quiz.length,
    },
  });

  try {
    const ghlRes = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const dt = Date.now() - t0;

    if (!ghlRes.ok) {
      const body = await ghlRes.text();
      console.error("[/api/lead] GHL error", {
        status: ghlRes.status,
        body: body.slice(0, 300),
        dt,
      });
      return NextResponse.json(
        {
          error: `Backend GHL respondió ${ghlRes.status}`,
          code: "ghl_error",
          status: ghlRes.status,
        },
        { status: 502 }
      );
    }

    console.info("[/api/lead] OK", { status: ghlRes.status, dt });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/lead] Network", e);
    return NextResponse.json(
      { error: "Error de red al contactar GHL", code: "network" },
      { status: 500 }
    );
  }
}
