import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createOrderFromCart } from "@/lib/services/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cartId, ...checkoutData } = body;

  if (!cartId) {
    return NextResponse.json({ error: "Carrinho não encontrado" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(checkoutData);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  try {
    const order = await createOrderFromCart(cartId, parsed.data);
    // TODO: chamar PaymentProvider.createCharge aqui e persistir o Payment
    // (adapter já definido em lib/payments — ver resolvePaymentProvider).
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar pedido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
