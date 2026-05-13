import { Toaster } from "sonner";
import { CircleCheck, AlertTriangle } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BackgroundOrb } from "@/components/decor/BackgroundOrb";
import { QuizProvider } from "@/components/quiz/QuizProvider";
import { Hero } from "@/components/sections/Hero";
import { EspejoCuriosidad } from "@/components/sections/EspejoCuriosidad";
import { StatsPotenciadas } from "@/components/sections/StatsPotenciadas";
import { QuizInline } from "@/components/sections/QuizInline";
import { ConexionEmocional } from "@/components/sections/ConexionEmocional";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { CategoriasNavegables } from "@/components/sections/CategoriasNavegables";
import { Testimonios } from "@/components/sections/Testimonios";
import { Escasez } from "@/components/sections/Escasez";
import { Mayoristas } from "@/components/sections/Mayoristas";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export default function Page() {
  return (
    <QuizProvider>
      <LoadingScreen />
      <BackgroundOrb />
      <main id="main">
        <Hero />
        <EspejoCuriosidad />
        <StatsPotenciadas />
        <QuizInline />
        <ConexionEmocional />
        <ComoFunciona />
        <CategoriasNavegables />
        <Testimonios />
        <Escasez cuposOcupados={2} cuposTotal={3} />
        <Mayoristas />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppFAB />
      <Toaster
        position="bottom-center"
        theme="light"
        duration={3500}
        icons={{
          success: <CircleCheck className="h-5 w-5 text-bb-lime" />,
          error: <AlertTriangle className="h-5 w-5 text-red-500" />,
        }}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-2xl !border-2 !border-bb-purple/10 !shadow-[0_20px_48px_-20px_rgba(61,26,110,0.35)] !px-5 !py-4 !font-sans !bg-white !text-bb-purple !gap-3",
            title: "!font-bold !text-base !text-bb-purple",
            description: "!font-normal !text-sm !text-bb-text/70",
            success: "!border-bb-lime/40",
            error: "!border-red-300 !text-red-700",
          },
        }}
      />
    </QuizProvider>
  );
}
