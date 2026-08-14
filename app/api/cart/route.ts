import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getOrCreateCart, addItemToCart, getCartWithItems } from "@/lib/services/cart-service";

// Toda escrita no carrinho passa por aqui — nunca confiamos em preço/estoque
// vindos do frontend; produto e variante são relidos do banco em cada
// operação subsequente (order-service).

function ensureSessionId() {
  const store = cookies();
  let sessionId = store.get("reflorescer_session")?.value;
  if (!sessionId) {
    sessionId = randomUUID();
  }
  return sessionId;
}

export async function GET() {
  const sessionId = ensureSessionId();
  const cart = await getOrCreateCart(sessionId);
  const fullCart = await getCartWithItems(cart.id);
  return NextResponse.json(fullCart);
}

export async function POST(req: NextRequest) {
  const { productId, variantId, quantity } = await req.json();

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const sessionId = ensureSessionId();
  const cart = await getOrCreateCart(sessionId);
  await addItemToCart(cart.id, productId, quantity, variantId);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("reflorescer_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
