import { NextRequest, NextResponse } from "next/server";
import { updateCartItemQuantity, removeCartItem } from "@/lib/services/cart-service";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { quantity } = await req.json();
  if (typeof quantity !== "number") {
    return NextResponse.json({ error: "Quantidade inválida" }, { status: 400 });
  }
  const item = await updateCartItemQuantity(params.id, quantity);
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await removeCartItem(params.id);
  return NextResponse.json({ ok: true });
}
