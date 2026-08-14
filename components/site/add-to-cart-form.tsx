"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  name: string;
  priceDelta: string | number;
}

export function AddToCartForm({
  productId,
  variants,
  inStock,
}: {
  productId: string;
  variants: Variant[];
  inStock: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <div className="mt-8 rounded-organic border border-brand-200 bg-brand-50 p-4 text-sm text-brand-500">
        Produto temporariamente indisponível. Deixe seu contato para ser avisada quando voltar ao estoque.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                variantId === v.id ? "border-brand-600 bg-brand-600 text-bg" : "border-brand-200 text-brand-600"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-organic border border-brand-200">
          <button
            aria-label="Diminuir quantidade"
            className="p-3 text-brand-600"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            aria-label="Aumentar quantidade"
            className="p-3 text-brand-600"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={16} />
          </button>
        </div>

        <Button className="flex-1" onClick={handleAddToCart} disabled={loading}>
          {loading ? "Adicionando..." : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </Button>
      </div>

      <Button variant="ghost" className="w-full">
        Comprar agora
      </Button>
    </div>
  );
}
