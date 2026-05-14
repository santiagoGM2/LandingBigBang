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
    q: "¿Con cuánto tiempo debo hacer mi pedido?",
    a: "Lo ideal es con 3 días de anticipación para garantizar tu diseño y materiales. Si es urgente, escríbenos — con mínimo 24 horas podemos hacer magia, sujeto a disponibilidad de cupos.",
  },
  {
    q: "¿Hacen entregas en toda Cali?",
    a: "Sí, cubrimos toda Cali. Puedes elegir entre recoger en nuestra tienda en la Calle 9 # 30-44, o recibir tu decoración a domicilio — el costo del envío se coordina al momento del pedido.",
  },
  {
    q: "¿Puedo pedir algo que no esté en los códigos?",
    a: "Por supuesto. Los códigos son el punto de partida, no el límite. Todo se personaliza al 100% — colores, elementos, mensajes, temática. Si lo imaginas, nosotros lo creamos.",
  },
  {
    q: "¿Cuál es el precio mínimo?",
    a: "Tenemos bouquets de globos desde $25.000 pesos. Para decoraciones más elaboradas o eventos, el precio varía según el diseño — por eso el quiz nos ayuda a entender exactamente qué necesitas antes de darte una cifra.",
  },
  {
    q: "¿También trabajan para eventos grandes?",
    a: "Sí. Con el tiempo suficiente podemos crear bouquets grandes y decoraciones con globos para cualquier tipo de evento. Escríbenos con tu fecha y te armamos una propuesta.",
  },
  {
    q: "¿Qué incluye exactamente una decoración?",
    a: "Todo lo que necesita para quedar perfecta — materiales completos, diseño y mano de obra. Tú solo te preocupas por abrir la puerta.",
  },
  {
    q: "¿Cómo se paga?",
    a: "50% al confirmar el pedido y 50% el día del envío o la recogida. Aceptamos transferencia bancaria y Nequi.",
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
          className="mt-10 rounded-3xl bg-bb-gray px-4 sm:px-6 md:px-8 shadow-bb-soft"
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
          <p className="text-bb-text/80 font-bold">¿Lista tu decisión?</p>
          <Button size="lg" className="mt-3" onClick={() => open()}>
            Agendar mi decoración ahora →
          </Button>
          <p className="mt-3 text-sm text-bb-text/65">
            60 segundos · Sin compromiso · Respuesta en menos de 15 minutos
          </p>
        </div>
      </div>
    </section>
  );
}
