"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { BigBangLogo } from "@/components/BigBangLogo";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

const IG = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/tiendas_big_bang/";
const FB = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/TiendasBigBang/";
const TT = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/@tiendasbigbang";
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573013182266";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Big Bang Piñatas y Regalos",
  description: "Decoración profesional de fiestas y eventos en Cali",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 9 # 30-44",
    addressLocality: "Cali",
    addressRegion: "Valle del Cauca",
    addressCountry: "CO",
  },
  telephone: "+573013182266",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://bigbangcali.com",
  openingHours: "Mo-Sa 09:00-19:00",
  priceRange: "$$",
  sameAs: [IG, FB, TT],
};

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
    </svg>
  );
}

function UnderlineLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={cn(
        "group relative inline-block transition-colors hover:text-bb-pink",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-bb-pink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </a>
  );
}

export function Footer() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const animate = mounted && !reduced;

  const columnVariant = animate
    ? {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }
    : undefined;

  return (
    <footer className="bg-bb-text text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
          }}
          className="grid gap-10 md:grid-cols-4"
        >
          <motion.div variants={columnVariant} className="md:col-span-2">
            <BigBangLogo variant="footer" className="h-20" />
            <p className="mt-5 max-w-md text-white/70 leading-relaxed">
              Decoración profesional de fiestas en Cali. Convertimos fechas en
              recuerdos que se cuentan por años.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={IG}
                aria-label="Instagram Big Bang"
                target="_blank"
                rel="noopener"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-bb-pink"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={FB}
                aria-label="Facebook Big Bang"
                target="_blank"
                rel="noopener"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-bb-pink"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={TT}
                aria-label="TikTok Big Bang"
                target="_blank"
                rel="noopener"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-bb-pink"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div variants={columnVariant}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-bb-lime">
              Visitanos
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bb-pink" />
                Calle 9 # 30-44, Cali, Valle del Cauca
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bb-pink" />
                Lunes a sábado · 9am a 7pm
              </li>
            </ul>
          </motion.div>

          <motion.div variants={columnVariant}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-bb-lime">
              Hablanos
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-bb-pink" />
                <UnderlineLink href={`https://wa.me/${WA}`} external>
                  +57 301 318 2266
                </UnderlineLink>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-bb-pink" />
                <UnderlineLink href="mailto:contacto@bigbangcali.com">
                  contacto@bigbangcali.com
                </UnderlineLink>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <hr className="my-10 border-white/10" />

        <p className="text-center text-xs text-white/55">
          © {new Date().getFullYear()} Big Bang Cali · Hecho con cariño para los anfitriones inolvidables
        </p>
      </div>
    </footer>
  );
}
