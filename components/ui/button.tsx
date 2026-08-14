import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "clay";
  size?: "sm" | "md" | "lg";
}

// Apenas dois estilos visuais conforme o Design System: sólido (primary)
// e contorno (ghost). Nada de gradientes, nada de sombra colorida.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-organic font-sans font-medium transition-colors duration-organic ease-organic disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-brand-600 text-bg hover:bg-brand-800",
          variant === "ghost" && "border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-bg",
          variant === "clay" && "bg-clay text-bg hover:bg-clay-dark",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
