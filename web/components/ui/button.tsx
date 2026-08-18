import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "glass" | "clay";
  size?: "sm" | "md" | "lg";
}

// Três estilos visuais: "glass" é o padrão do vidro etéreo (usar como
// primeira opção em qualquer CTA sobre fundo pérola); "primary" (sólido
// dourado) para contraste mais forte quando necessário; "ghost" (contorno)
// como ação secundária.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "glass", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-organic ease-organic disabled:opacity-50 disabled:pointer-events-none",
          variant === "glass" && "glass glass-hover text-brand-800",
          variant === "primary" && "bg-gold-deep text-bg shadow-glass hover:bg-brand-800",
          variant === "ghost" && "border border-brand-800/25 text-brand-500 hover:border-gold-deep hover:text-gold-deep",
          variant === "clay" && "bg-clay text-bg hover:bg-clay-dark",
          size === "sm" && "px-5 py-2.5 text-sm",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-9 py-4 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
