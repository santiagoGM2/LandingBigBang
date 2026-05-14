import { NextResponse } from "next/server";
import type { QuizAnswers } from "@/lib/ghl";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || "";

interface GhlPayload {
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

export async function POST(req: Request) {
  const t0 = Date.now();

  if (!GHL_WEBHOOK_URL) {
    console.error("[/api/lead] Falta GHL_WEBHOOK_URL en env");
    return NextResponse.json(
      { error: "Backend no configurado" },
      { status: 500 }
    );
  }

  let answers: QuizAnswers;
  try {
    answers = (await req.json()) as QuizAnswers;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!answers?.contacto?.nombre || !answers?.contacto?.telefono) {
    console.warn("[/api/lead] Faltan campos obligatorios");
    return NextResponse.json(
      { error: "Faltan campos obligatorios (nombre, telefono)" },
      { status: 400 }
    );
  }

  const payload: GhlPayload = {
    nombre: answers.contacto.nombre.trim(),
    telefono: answers.contacto.telefono.trim(),
    email: answers.contacto.email?.trim() || "",
    a_quien: answers.a_quien || "",
    ocasion: answers.ocasion || answers.tipo_evento || "",
    emocion: answers.emocion || "",
    intencion: answers.intencion || "",
    codigo_elegido: answers.codigo_elegido || answers.codigo_dec || "",
    vision_descripcion: answers.vision_descripcion || "",
    vision_paleta: answers.vision_paleta || "",
    personalizacion: answers.personalizacion_multi?.join(", ") || "",
    fecha_estimada: answers.fecha_estimada || "",
    fecha_exacta: answers.fecha_exacta || answers.fecha_evento || "",
    resumen_quiz: buildResumen(answers),
    source: "landing_big_bang_funnel_v2",
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
      return NextResponse.json({ error: "Backend error" }, { status: 502 });
    }

    console.info("[/api/lead] OK", { status: ghlRes.status, dt });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/lead] Network", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
