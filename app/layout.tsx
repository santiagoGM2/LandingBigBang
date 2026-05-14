import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bigbangcali.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Big Bang Cali · Decoración de fiestas inolvidables",
  description:
    "Convertimos tu fiesta en el recuerdo más feliz de quien amas. Decoración profesional para cumpleaños, baby showers, bautizos y eventos en Cali.",
  keywords: [
    "decoración fiestas Cali",
    "piñatería Cali",
    "decoración cumpleaños",
    "baby shower Cali",
    "globos decoración Cali",
    "Big Bang Cali",
  ],
  openGraph: {
    title: "Big Bang Cali · El recuerdo que contarán dentro de 20 años",
    description:
      "Decoración profesional con identidad. Quiz de 60 segundos para diseñar tu sorpresa.",
    url: siteUrl,
    siteName: "Big Bang Cali",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Big Bang Cali" }],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Bang Cali · Decoración de fiestas inolvidables",
    description: "Quiz de 60 segundos para diseñar tu próxima sorpresa.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: siteUrl },
  authors: [{ name: "Big Bang Cali" }],
  creator: "Big Bang Cali",
};

export const viewport: Viewport = {
  themeColor: "#E91E8C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-bb-white text-bb-text font-sans">
        <a href="#main" className="skip-link">
          Ir al contenido
        </a>
        <SmoothScroll />
        {children}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="bb-ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });`}
            </Script>
          </>
        )}
        {META_PIXEL_ID && (
          <Script id="bb-fbq" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
              n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}'); fbq('track', 'PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
