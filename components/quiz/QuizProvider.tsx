"use client";

import * as React from "react";
import { QuizModal } from "./QuizModal";
import type { QuizAnswers } from "@/lib/ghl";

interface QuizCtx {
  /**
   * Abre el modal del quiz. Si se pasa un código DEC, lo pre-selecciona en el
   * paso 4 (rama "personalizar") como sugerencia inicial.
   */
  open: (codigo?: string) => void;
  /**
   * Abre el modal con respuestas pre-llenadas (ocasion, emocion, etc.) desde
   * un punto de entrada inline (QuizInline section, ConexionEmocional).
   */
  openInline: (prefill: Partial<QuizAnswers>) => void;
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

  const value = React.useMemo<QuizCtx>(
    () => ({ open: openQuiz, openInline }),
    [openQuiz, openInline]
  );

  return (
    <QuizContext.Provider value={value}>
      {children}
      <QuizModal
        open={open}
        onOpenChange={setOpen}
        preselectedCodigo={codigo}
        inlineSeed={inlineSeed}
      />
    </QuizContext.Provider>
  );
}
