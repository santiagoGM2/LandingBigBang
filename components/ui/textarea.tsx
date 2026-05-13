import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[110px] w-full rounded-2xl border-2 border-bb-purple/15 bg-white px-4 py-3 text-base",
        "placeholder:text-bb-text/40 focus-visible:outline-none focus-visible:border-bb-pink",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
