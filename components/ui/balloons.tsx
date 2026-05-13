"use client";

import * as React from "react";
import { balloons, textBalloons } from "balloons-js";
import { cn } from "@/lib/utils";

export interface BalloonsHandle {
  launchAnimation: () => void;
}

interface BalloonsProps {
  type?: "default" | "text";
  text?: string;
  fontSize?: number;
  color?: string;
  className?: string;
  onLaunch?: () => void;
}

/**
 * Wrapper de balloons-js. Imperativo: el padre llama a ref.current.launchAnimation()
 * desde un evento (click CTA, complete quiz, primera carga).
 */
export const Balloons = React.forwardRef<BalloonsHandle, BalloonsProps>(
  ({ type = "default", text, fontSize = 120, color = "#E91E8C", className, onLaunch }, ref) => {
    const launchAnimation = React.useCallback(() => {
      if (typeof window === "undefined") return;
      if (type === "default") {
        balloons();
      } else if (type === "text" && text) {
        textBalloons([{ text, fontSize, color }]);
      }
      onLaunch?.();
    }, [type, text, fontSize, color, onLaunch]);

    React.useImperativeHandle(ref, () => ({ launchAnimation }), [launchAnimation]);

    return <div className={cn("pointer-events-none", className)} aria-hidden />;
  }
);
Balloons.displayName = "Balloons";
