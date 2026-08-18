import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-brand-800">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "glass rounded-full px-5 py-3 text-brand-800 placeholder:text-brand-400 outline-none transition-all duration-300 focus:shadow-glass-hover",
            error && "border-red-400",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
