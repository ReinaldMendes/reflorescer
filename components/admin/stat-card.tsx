import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-organic bg-bg p-6">
      <div className="flex items-center gap-3 text-brand-500">
        <Icon size={18} />
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl text-brand-800">{value}</p>
    </div>
  );
}
