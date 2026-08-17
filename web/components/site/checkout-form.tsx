"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string | null;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
}

type Step = "identificacao" | "entrega" | "pagamento";

// Checkout em 3 etapas visíveis, resumo do pedido sempre acessível —
// pensado para conversão (item 43 do briefing), não para exibir campos.
export function CheckoutForm({
  cartId,
  items,
  shippingMethods,
}: {
  cartId: string;
  items: Item[];
  shippingMethods: ShippingMethod[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identificacao");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", document: "" });
  const [address, setAddress] = useState({
    recipient: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
  });
  const [shippingMethodId, setShippingMethodId] = useState(shippingMethods[0]?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [items]);
  const shipping = shippingMethods.find((s) => s.id === shippingMethodId)?.price ?? 0;
  const total = subtotal + shipping;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, customer, address, shippingMethodId, paymentMethod }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Não foi possível concluir o pedido.");
      }
      const order = await res.json();
      router.push(`/conta/pedidos/${order.id}?sucesso=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao processar pedido.");
    } finally {
      setLoading(false);
    }
  }

  const steps: { key: Step; label: string }[] = [
    { key: "identificacao", label: "Identificação" },
    { key: "entrega", label: "Entrega" },
    { key: "pagamento", label: "Pagamento" },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="flex gap-6 border-b border-brand-100 pb-4">
          {steps.map((s) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={cn(
                "text-sm font-medium",
                step === s.key ? "text-brand-800 underline underline-offset-8" : "text-brand-300"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {step === "identificacao" && (
          <div className="space-y-4">
            <Input label="Nome completo" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
            <Input label="E-mail" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
            <Input label="Telefone / WhatsApp" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} required />
            <Input label="CPF" value={customer.document} onChange={(e) => setCustomer({ ...customer, document: e.target.value })} required />
            <Button onClick={() => setStep("entrega")}>Continuar para entrega</Button>
          </div>
        )}

        {step === "entrega" && (
          <div className="space-y-4">
            <Input label="Nome do destinatário" value={address.recipient} onChange={(e) => setAddress({ ...address, recipient: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="CEP" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} required />
              <Input label="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} required />
            </div>
            <Input label="Rua" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            <Input label="Complemento" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Bairro" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} required />
              <Input label="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              <Input label="UF" maxLength={2} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })} required />
            </div>

            <p className="pt-2 text-sm font-medium text-brand-800">Método de envio</p>
            {shippingMethods.map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center justify-between rounded-organic border border-brand-200 p-4">
                <span className="flex items-center gap-3 text-sm">
                  <input type="radio" checked={shippingMethodId === m.id} onChange={() => setShippingMethodId(m.id)} />
                  {m.name}
                  {m.estimatedDaysMin && <span className="text-brand-400">({m.estimatedDaysMin}-{m.estimatedDaysMax} dias úteis)</span>}
                </span>
                <span>{formatCurrency(m.price)}</span>
              </label>
            ))}

            <Button onClick={() => setStep("pagamento")}>Continuar para pagamento</Button>
          </div>
        )}

        {step === "pagamento" && (
          <div className="space-y-4">
            {(["PIX", "CREDIT_CARD", "BOLETO"] as const).map((method) => (
              <label key={method} className="flex cursor-pointer items-center gap-3 rounded-organic border border-brand-200 p-4 text-sm">
                <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                {method === "PIX" && "Pix — aprovação imediata"}
                {method === "CREDIT_CARD" && "Cartão de crédito — em até 3x sem juros"}
                {method === "BOLETO" && "Boleto bancário"}
              </label>
            ))}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Processando..." : `Confirmar pedido — ${formatCurrency(total)}`}
            </Button>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-organic border border-brand-100 bg-bg-sand p-6">
        <p className="font-display text-xl text-brand-800">Resumo do pedido</p>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-brand-600">
              <span>{item.quantity}× {item.name}</span>
              <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-brand-200 pt-4 text-sm">
          <div className="flex justify-between text-brand-600">
            <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-brand-600">
            <span>Frete</span><span>{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium text-brand-800">
            <span>Total</span><span>{formatCurrency(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
