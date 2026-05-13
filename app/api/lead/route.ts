import { NextResponse } from "next/server";
import type { QuizAnswers } from "@/lib/ghl";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || "";

interface GhlPayload {
  nombre: string;
  telefono: string;
  email: string;
  tipo_evento: string;
  para_quien: string;
  tiene_tematica: string;
  tematica_detalle: string;
  fecha_evento: string;
  presupuesto: string;
  resumen_quiz: string;
  source: "landing_big_bang";
}

function buildResumen(a: QuizAnswers): string {
  const lines = [
    a.camino === "A"
      ? `Camino: Con codigo DEC ${a.codigo_dec || "(no especificado)"}`
      : `Camino: Desde cero`,
    `Evento: ${a.tipo_evento || (a.codigo_dec ? "Con codigo DEC" : "Sin definir")}`,
    `Para quien: ${a.para_quien}`,
    a.tiene_tematica ? `Tematica: ${a.tiene_tematica}` : "",
    a.tematica_detalle ? `Detalle: ${a.tematica_detalle}` : "",
    a.personalizacion ? `Personalizacion: ${a.personalizacion}` : "",
    a.detalle_personalizacion ? `Detalle personalizacion: ${a.detalle_personalizacion}` : "",
    `Fecha: ${a.fecha_evento || "Sin definir"}`,
    `Presupuesto: ${a.presupuesto || "Sin definir"}`,
    a.tipo_envio === "parcial" ? `[ENVIO PARCIAL - el usuario abandono el quiz]` : "",
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
    tipo_evento:
      answers.tipo_evento ||
      (answers.codigo_dec ? `Con codigo DEC (${answers.codigo_dec})` : "Sin definir"),
    para_quien: answers.para_quien,
    tiene_tematica: answers.tiene_tematica || "",
    tematica_detalle: answers.tematica_detalle || "",
    fecha_evento: answers.fecha_evento || "",
    presupuesto: answers.presupuesto || "",
    resumen_quiz: buildResumen(answers),
    source: "landing_big_bang",
  };

  console.info("[/api/lead] inbound", {
    camino: answers.camino,
    tipo_envio: answers.tipo_envio || "completo",
    payload: {
      nombre: payload.nombre,
      telefono: maskPhone(payload.telefono),
      email: maskEmail(payload.email),
      tipo_evento: payload.tipo_evento,
      para_quien: payload.para_quien,
      tiene_tematica: payload.tiene_tematica,
      tematica_detalle: payload.tematica_detalle ? `${payload.tematica_detalle.slice(0, 60)}...` : "",
      fecha_evento: payload.fecha_evento,
      presupuesto: payload.presupuesto,
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
