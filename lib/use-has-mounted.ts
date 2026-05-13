"use client";

import { useEffect, useState } from "react";

/**
 * Hook para evitar mismatches de hidratación cuando un componente difiere
 * estructuralmente entre SSR y CSR. Devuelve `false` durante el primer paint
 * y `true` después del montaje del cliente.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
