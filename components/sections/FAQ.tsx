"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/components/quiz/QuizProvider";
import { useHasMounted } from "@/lib/use-has-mounted";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "¿Cuánto tiempo antes debo reservar?",
    a: "Para fechas comunes, mínimo 7 días. Para eventos en fechas pico (graduaciones, día de la madre, diciembre) mínimo 15 días.",
  },
  {
    q: "¿Cubren toda Cali y municipios cercanos?",
    a: "Sí, toda Cali. Yumbo, Palmira y Jamundí con costo adicional de transporte cotizable.",
  },
  {
    q: "¿Puedo pedir una temática que no esté en los códigos?",
    a: 'Por supuesto. El código es el punto de partida pero todo se puede personalizar 100%. Para temáticas nuevas usá la opción "Empezar desde cero" en el quiz.',
  },
  {
    q: "¿Cuál es el presupuesto mínimo?",
    a: "Tenemos opciones desde bouquets de globos desde 35.000 hasta montajes completos. Tu presupuesto define el tipo de experiencia, no si te atendemos.",
  },
  {
    q: "¿Trabajan eventos de último minuto?",
    a: "Sí, si tenemos cupos. Por eso es importante que llenes el quiz pronto: en menos de 24 horas te confirmamos.",
  },
  {
    q: "¿Qué incluye exactamente una decoración?",
    a: "Diseño, materiales, montaje y desmontaje el mismo día o al siguiente. Tarima y mobiliario son cotización aparte.",
  },
  {
    q: "¿Cómo pago?",
    a: "50% al confirmar la reserva, 50% el día del montaje. Aceptamos transferencia y Nequi.",
  },
];

export function FAQ() {
  const { open } = useQuiz();
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const animate = mounted && !reduced;

  return (
    <section className="bg-bb-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-bb-purple leading-tight">
            Lo que la gente nos pregunta
          </h2>
          <p className="mt-3 text-bb-text/75">
            Si tu pregunta no está acá, pedila en el quiz.
          </p>
        </div>

        <motion.div
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-10 rounded-3xl bg-bb-gray px-6 md:px-8 shadow-bb-soft"
        >
          <Accordion type="single" collapsible>
            {FAQS.map((f, i) => (
              <motion.div
                key={i}
                variants={
                  animate
                    ? {
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                      }
                    : undefined
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-10 text-center">
          <p className="text-bb-text/70">¿Tenés otra pregunta?</p>
          <Button size="lg" className="mt-3" onClick={() => open()}>
            Quiero asesoría
          </Button>
        </div>
      </div>
    </section>
  );
}
