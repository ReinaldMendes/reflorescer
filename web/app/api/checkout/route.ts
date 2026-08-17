import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = cookies().get("reflorescer_session")?.value;

  // Resolve o cartId real a partir da sessão antes de repassar pro checkout
  const cartRes = await fetch(`${API_URL}/cart?sessionId=${sessionId}`, { cache: "no-store" });
  const cart = await cartRes.json();

  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, cartId: cart.id }),
  });

  return NextResponse.json(await res.json(), { status: res.status });
}
