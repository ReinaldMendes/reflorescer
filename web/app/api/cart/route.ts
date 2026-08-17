import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// Proxy fino para a API real — o web/ só cuida de manter o cookie de
// sessão do visitante (reflorescer_session), a lógica de carrinho em si
// vive inteiramente na API (Railway).
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function ensureSessionId() {
  const store = cookies();
  return store.get("reflorescer_session")?.value ?? randomUUID();
}

export async function GET() {
  const sessionId = ensureSessionId();
  const res = await fetch(`${API_URL}/cart?sessionId=${sessionId}`, { cache: "no-store" });
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = ensureSessionId();

  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, sessionId }),
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });
  response.cookies.set("reflorescer_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
