/**
 * Cliente del proxy hacia GoHighLevel.
 * El frontend NUNCA habla directo al webhook, siempre pasa por /api/lead
 * o /api/mayorista para mantener la URL del webhook en backend.
 */

export type CaminoQuiz = "A" | "B";

export interface QuizAnswers {
  camino: CaminoQuiz;
  /** Camino A: código DEC pre-elegido */
  codigo_dec?: string;
  /** Camino B: tipo de evento elegido */
  tipo_evento?: string;
  para_quien: string;
  tiene_tematica?: string;
  tematica_detalle?: string;
  personalizacion?: string;
  detalle_personalizacion?: string;
  fecha_evento?: string;
  presupuesto?: string;
  contacto: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  /** Marca envío incompleto (abandono detectado a los 60s sin interacción) */
  tipo_envio?: "completo" | "parcial";
}

export interface MayoristaPayload {
  nombre: string;
  empresa: string;
  nit?: string;
  ciudad: string;
  volumen_mensual: string;
  whatsapp: string;
  email?: string;
  intereses?: string;
}

export interface MayoristaResponse {
  ok: boolean;
  fallback?: boolean;
  whatsapp_url?: string;
  message?: string;
}

export async function submitLead(answers: QuizAnswers): Promise<{ ok: true }> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error(`Submit falló: ${res.status}`);
  return res.json();
}

export async function submitMayorista(data: MayoristaPayload): Promise<MayoristaResponse> {
  const res = await fetch("/api/mayorista", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as MayoristaResponse;
  // 503 fallback no es error duro: el front muestra modal con WhatsApp
  if (!res.ok && res.status !== 503) throw new Error(`Submit mayorista falló: ${res.status}`);
  return json;
}
