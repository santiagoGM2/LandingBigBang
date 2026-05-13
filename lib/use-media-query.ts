"use client";

import { useEffect, useState } from "react";

/**
 * Hook que retorna true cuando el media query matchea. Útil para gatear
 * efectos 3D/parallax solo en desktop.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
