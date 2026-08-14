import { cookies } from "next/headers";
import { getOrCreateCart, getCartWithItems } from "@/lib/services/cart-service";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/checkout-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const sessionId = cookies().get("reflorescer_session")?.value ?? "anonymous";
  const cart = await getOrCreateCart(sessionId);
  const fullCart = await getCartWithItems(cart.id);

  if (!fullCart || fullCart.items.length === 0) {
    redirect("/carrinho");
  }

  const shippingMethods = await prisma.shippingMethod.findMany({ where: { active: true } });

  const items = fullCart.items.map((item) => ({
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
        shippingMethods={shippingMethods.map((s) => ({
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
