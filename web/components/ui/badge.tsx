import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "brand",
  className,
}: {
  children: React.ReactNode;
  variant?: "brand" | "clay" | "sage" | "gold";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "brand" && "bg-brand-100 text-brand-800",
        variant === "clay" && "bg-clay/10 text-clay-dark",
        variant === "sage" && "bg-brand-50 text-brand-500",
        variant === "gold" && "border border-gold/30 bg-white/70 text-gold-deep",
        className
      )}
    >
      {children}
    </span>
  );
}
