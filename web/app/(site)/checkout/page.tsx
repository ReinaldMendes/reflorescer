import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listShippingMethods } from "@/lib/api-client";
import { CheckoutForm } from "@/components/site/checkout-form";

export const dynamic = "force-dynamic";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default async function CheckoutPage() {
  const sessionId = cookies().get("reflorescer_session")?.value ?? "anonymous";
  const res = await fetch(`${API_URL}/cart?sessionId=${sessionId}`, { cache: "no-store" });
  const cart = await res.json();

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/carrinho");
  }

  const shippingMethods = await listShippingMethods();

  const items = cart.items.map((item: any) => ({
    id: item.id,
    name: item.product.name,
    quantity: item.quantity,
    unitPrice: Number(item.product.price) + Number(item.variant?.priceDelta ?? 0),
    image: item.product.images[0]?.url ?? null,
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
      <h1 className="mb-10 font-display text-display-lg text-brand-800">Finalizar compra</h1>
      <CheckoutForm
        cartId={cart.id}
        items={items}
        shippingMethods={shippingMethods.map((s: any) => ({
          id: s.id,
          name: s.name,
          price: Number(s.price),
          estimatedDaysMin: s.estimatedDaysMin,
          estimatedDaysMax: s.estimatedDaysMax,
        }))}
      />
    </main>
  );
}
