"use client";

import * as React from "react";
import { QuizModal } from "./QuizModal";
import type { QuizAnswers } from "@/lib/ghl";

interface QuizCtx {
  /** Abre el modal en welcome (o en Camino A si se pasa código DEC) */
  open: (codigo?: string) => void;
  /**
   * Abre el modal directo en Camino B paso 2 (¿Para quién?) con el `tipo_evento`
   * pre-seleccionado desde el formulario inline de la landing.
   */
  openInline: (prefill: Partial<QuizAnswers>) => void;
  scrollToMayorista: () => void;
}

const QuizContext = React.createContext<QuizCtx | null>(null);

export function useQuiz(): QuizCtx {
  const ctx = React.useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz debe usarse dentro de <QuizProvider>");
  return ctx;
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [codigo, setCodigo] = React.useState<string | null>(null);
  const [inlineSeed, setInlineSeed] = React.useState<Partial<QuizAnswers> | null>(null);

  const openQuiz = React.useCallback((c?: string) => {
    setInlineSeed(null);
    setCodigo(c ?? null);
    setOpen(true);
  }, []);

  const openInline = React.useCallback((prefill: Partial<QuizAnswers>) => {
    setCodigo(null);
    setInlineSeed(prefill);
    setOpen(true);
  }, []);

  const scrollToMayorista = React.useCallback(() => {
    const el = document.getElementById("mayoristas");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = React.useMemo<QuizCtx>(
    () => ({ open: openQuiz, openInline, scrollToMayorista }),
    [openQuiz, openInline, scrollToMayorista]
  );

  return (
    <QuizContext.Provider value={value}>
      {children}
      <QuizModal
        open={open}
        onOpenChange={setOpen}
        preselectedCodigo={codigo}
        inlineSeed={inlineSeed}
        onRequestMayorista={scrollToMayorista}
      />
    </QuizContext.Provider>
  );
}
