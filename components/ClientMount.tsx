"use client";

import * as React from "react";
import { useHasMounted } from "@/lib/use-has-mounted";

interface Props {
  children: React.ReactNode;
  /** Render mientras NO esté montado (SSR + primer paint del cliente). Debe ser el árbol estático con el ESTADO FINAL para evitar mismatches de hidratación. */
  fallback: React.ReactNode;
}

/**
 * Wrapper que evita mismatches de hidratación cuando se necesita motion
 * inline-style en el cliente pero el SSR no puede serializarlo idéntico.
 * Usa cuando un componente tiene `initial`, `variants`, `whileInView` o
 * `style` con motion values.
 */
export function ClientMount({ children, fallback }: Props) {
  const mounted = useHasMounted();
  return <>{mounted ? children : fallback}</>;
}
