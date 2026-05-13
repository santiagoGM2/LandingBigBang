import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind respetando precedencia */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Construye URL de Unsplash con dimensión y query estable */
export function unsplashUrl(query: string, w = 800, h = 600): string {
  // Usamos featured photos por seed estable para evitar 404
  const seed = encodeURIComponent(query.trim().toLowerCase().replace(/\s+/g, "-"));
  return `https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=${w}&h=${h}&q=80&ixlib=rb-4.0.3&s=${seed}`;
}

/** WhatsApp deeplink con mensaje pre-cargado */
export function waLink(message: string): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573013182266";
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

/** Pequeño helper para esperar (debug, no usar en prod) */
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
