"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-3", className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/** RadioItem visual estilo "tarjeta seleccionable" */
const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string;
    description?: string;
  }
>(({ className, label, description, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group flex items-start gap-3 rounded-2xl border-2 border-bb-purple/15 bg-white p-4 text-left",
      "transition-all hover:border-bb-pink/60 hover:bg-bb-pink-soft/30",
      "data-[state=checked]:border-bb-pink data-[state=checked]:bg-bb-pink-soft data-[state=checked]:shadow-bb-pink",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30",
      className
    )}
    {...props}
  >
    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-bb-purple/30 group-data-[state=checked]:border-bb-pink group-data-[state=checked]:bg-bb-pink">
      <RadioGroupPrimitive.Indicator>
        <Check className="h-4 w-4 text-white" />
      </RadioGroupPrimitive.Indicator>
    </span>
    <span className="flex flex-col">
      <span className="font-bold text-bb-purple">{label}</span>
      {description ? <span className="text-sm text-bb-text/70">{description}</span> : null}
    </span>
  </RadioGroupPrimitive.Item>
));
RadioCard.displayName = "RadioCard";

export { RadioGroup, RadioCard };
