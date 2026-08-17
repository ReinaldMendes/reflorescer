"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function CartItemControls({
  cartItemId,
  quantity,
  unitPrice,
}: {
  cartItemId: string;
  quantity: number;
  unitPrice: number;
}) {
  const [qty, setQty] = useState(quantity);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function updateQuantity(newQty: number) {
    setQty(newQty);
    startTransition(async () => {
      await fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center rounded-organic border border-brand-200">
        <button className="p-2 text-brand-600" onClick={() => updateQuantity(Math.max(1, qty - 1))} disabled={isPending}>
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm">{qty}</span>
        <button className="p-2 text-brand-600" onClick={() => updateQuantity(qty + 1)} disabled={isPending}>
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-brand-800">{formatCurrency(unitPrice * qty)}</span>
        <button aria-label="Remover item" className="text-brand-300 hover:text-red-400" onClick={remove} disabled={isPending}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
