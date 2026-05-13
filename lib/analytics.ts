/**
 * Stubs de analytics. GA4 y Meta Pixel quedan preparados pero se activan solo
 * cuando NEXT_PUBLIC_GA_ID y/o NEXT_PUBLIC_META_PIXEL_ID estén definidos.
 */

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export const isAnalyticsEnabled = (): boolean =>
  Boolean(GA_ID || META_PIXEL_ID);

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (GA_ID && window.gtag) {
      window.gtag("event", name, params || {});
    }
    if (META_PIXEL_ID && window.fbq) {
      window.fbq("trackCustom", name, params || {});
    }
  } catch {
    // Tracking nunca debe romper UX
  }
}

export const trackQuizStart    = () => trackEvent("quiz_start");
export const trackQuizStep     = (n: number) => trackEvent("quiz_step", { step: n });
export const trackQuizComplete = (camino: "A" | "B") => trackEvent("quiz_complete", { camino });
export const trackQuizPartial  = () => trackEvent("quiz_partial");
export const trackMayorista    = () => trackEvent("mayorista_submit");
export const trackWaClick      = (source: string) => trackEvent("whatsapp_click", { source });
