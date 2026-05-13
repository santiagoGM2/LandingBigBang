import { NextResponse } from "next/server";
import type { MayoristaPayload } from "@/lib/ghl";

const GHL_WEBHOOK_MAYORISTA_URL = process.env.GHL_WEBHOOK_MAYORISTA_URL || "";
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573013182266";

function buildWaUrl(data: Partial<MayoristaPayload>): string {
  const nombre = data.nombre || "alguien";
  const empresa = data.empresa || "una empresa";
  const text = `Hola, soy ${nombre}, represento a ${empresa}. Vi su página y quiero recibir propuesta mayorista.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export async function POST(req: Request) {
  let data: MayoristaPayload;
  try {
    data = (await req.json()) as MayoristaPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  // Modo fallback: webhook aún no creado en GHL
  if (!GHL_WEBHOOK_MAYORISTA_URL) {
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        whatsapp_url: buildWaUrl(data),
        message:
          "Estamos preparando este canal exclusivo. Mientras tanto, escribinos directo por WhatsApp y un asesor B2B te contacta hoy mismo.",
      },
      { status: 503 }
    );
  }

  if (!data?.nombre || !data?.empresa || !data?.whatsapp) {
    return NextResponse.json(
      { ok: false, error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  try {
    const ghlRes = await fetch(GHL_WEBHOOK_MAYORISTA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: "landing_big_bang_mayorista",
        resumen:
          `Mayorista | ${data.empresa} | NIT ${data.nit || "-"} | ${data.ciudad} | ` +
          `Volumen ${data.volumen_mensual} | ${data.intereses || "(sin notas)"}`,
      }),
      cache: "no-store",
    });

    if (!ghlRes.ok) {
      const body = await ghlRes.text();
      console.error("[/api/mayorista] GHL error", ghlRes.status, body.slice(0, 300));
      return NextResponse.json({ ok: false, error: "Backend error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/mayorista] Network", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
