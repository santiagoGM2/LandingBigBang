"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bb-pink/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]",
  {
    variants: {
      variant: {
        default:
          "bg-bb-pink text-white shadow-bb-pink hover:bg-bb-pink/90 hover:shadow-[0_24px_50px_-18px_rgba(233,30,140,0.6)]",
        purple:
          "bg-bb-purple text-white hover:bg-bb-purple-soft hover:-translate-y-[1px]",
        lime: "bg-bb-lime text-bb-purple hover:bg-bb-lime/90 hover:-translate-y-[1px]",
        outline:
          "border-2 border-bb-pink text-bb-pink bg-transparent hover:bg-bb-pink-soft",
        ghost: "text-bb-purple hover:bg-bb-pink-soft",
        white:
          "bg-white text-bb-purple border border-bb-purple/10 hover:bg-bb-pink-soft hover:text-bb-pink",
        link: "text-bb-pink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-base",
        lg: "h-14 px-9 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
