"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Ainda não existe login de cliente no site (as outras páginas de /conta
// também são placeholders convidando a entrar). Enquanto isso não existe,
// "Acompanhar pedido" funciona por busca direta do número do pedido —
// o mesmo ID usado na URL de confirmação após o checkout.
export default function OrdersLookupPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    router.push(`/conta/pedidos/${trimmed}`);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="font-display text-display-md text-brand-800">Acompanhar pedido</h1>
      <p className="mt-3 text-brand-500">
        Informe o número do pedido recebido por e-mail para consultar o status da entrega.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Número do pedido"
          className="glass rounded-full px-6 py-3.5 text-center text-brand-800 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-gold-deep/40"
        />
        <button
          type="submit"
          className="glass glass-hover rounded-full px-7 py-3.5 text-sm font-medium tracking-wide text-brand-800"
        >
          Consultar
        </button>
      </form>

      <p className="mt-8 text-sm text-brand-400">
        Já tem uma conta? Entre para ver o histórico completo dos seus pedidos.
      </p>
    </main>
  );
}
