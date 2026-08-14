import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { getOrCreateCart, getCartWithItems } from "@/lib/services/cart-service";
import { formatCurrency } from "@/lib/utils";
import { CartItemControls } from "@/components/site/cart-item-controls";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const sessionId = cookies().get("reflorescer_session")?.value ?? "anonymous";
  const cart = await getOrCreateCart(sessionId);
  const fullCart = await getCartWithItems(cart.id);

  const items = fullCart?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const unit = Number(item.product.price) + Number(item.variant?.priceDelta ?? 0);
    return sum + unit * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-display-md text-brand-800">Seu carrinho está vazio</h1>
        <p className="mt-3 text-brand-500">Que tal descobrir algo especial para o seu momento?</p>
        <Link href="/produtos" className="mt-8 inline-block rounded-organic bg-brand-600 px-8 py-4 text-bg">
          Explorar produtos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
      <h1 className="mb-10 font-display text-display-lg text-brand-800">Carrinho</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-brand-100 pb-6">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-organic bg-brand-50">
                {item.product.images[0] && (
                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-display text-lg text-brand-800">{item.product.name}</p>
                  {item.variant && <p className="text-sm text-brand-400">{item.variant.name}</p>}
                </div>
                <CartItemControls
                  cartItemId={item.id}
                  quantity={item.quantity}
                  unitPrice={Number(item.product.price) + Number(item.variant?.priceDelta ?? 0)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-organic border border-brand-100 bg-bg-sand p-6">
          <p className="font-display text-xl text-brand-800">Resumo</p>
          <div className="mt-4 flex justify-between text-sm text-brand-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-brand-400">Frete calculado no próximo passo</p>
          <Link
            href="/checkout"
            className="mt-6 block rounded-organic bg-brand-600 py-4 text-center text-bg transition-colors hover:bg-brand-800"
          >
            Finalizar compra
          </Link>
        </div>
      </div>
    </main>
  );
}
