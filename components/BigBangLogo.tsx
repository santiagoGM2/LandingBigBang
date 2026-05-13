import Image from "next/image";
import { cn } from "@/lib/utils";

type Variant = "default" | "footer" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
  /** Texto accesible (default: "Big Bang Cali") */
  label?: string;
  /** Carga prioritaria (LoadingScreen, Hero) */
  priority?: boolean;
}

const LOGO_SRC = "/logo-big-bang.png";
const INTRINSIC_W = 382;
const INTRINSIC_H = 217;

/**
 * Logo Big Bang oficial.
 *  - default: usa el PNG con sus colores (rosa + outline lime + sombra purple)
 *  - footer:  el mismo PNG pero invertido a blanco vía CSS filter
 *  - compact: igual al default pero más chico para navs y FABs
 */
export function BigBangLogo({
  variant = "default",
  className,
  label = "Big Bang Cali",
  priority = false,
}: Props) {
  const sizeClass =
    variant === "compact" ? "h-8 w-auto" : variant === "footer" ? "h-20 w-auto" : "h-20 w-auto";

  const invertFilter =
    variant === "footer" ? { filter: "brightness(0) invert(1)" } : undefined;

  return (
    <Image
      src={LOGO_SRC}
      alt={label}
      width={INTRINSIC_W}
      height={INTRINSIC_H}
      priority={priority}
      style={invertFilter}
      className={cn("select-none", sizeClass, className)}
    />
  );
}
