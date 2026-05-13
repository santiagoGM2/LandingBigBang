import Link from "next/link";
import type { Metadata } from "next";
import { PartyPopper, Instagram, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Gracias · Big Bang Cali",
  description: "Tu información llegó. En menos de 24h te contactamos por WhatsApp.",
  robots: { index: false, follow: false },
};

const IG = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/tiendas_big_bang/";

export default function GraciasPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-bb-pink-soft px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-bb-soft">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bb-lime text-bb-purple">
          <PartyPopper className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-bb-purple leading-tight">
          ¡Listo! Eres oficialmente el próximo anfitrión inolvidable
        </h1>
        <p className="mt-4 text-bb-text/80 leading-relaxed">
          En menos de 24 horas un asesor te contacta por WhatsApp. Mientras
          tanto, seguinos en Instagram para inspirarte con montajes reales.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={IG}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-bb-pink px-6 py-3 font-bold text-white shadow-bb-pink hover:bg-bb-pink/90"
          >
            <Instagram className="h-5 w-5" /> @tiendas_big_bang
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-bb-purple hover:bg-bb-pink-soft"
          >
            <ArrowLeft className="h-5 w-5" /> Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
