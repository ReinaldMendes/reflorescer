import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/constants";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Recebe e-mail/senha do formulário de login do admin, autentica contra a
// API real (Railway) e guarda o JWT retornado como cookie httpOnly no
// domínio do PRÓPRIO web/ — o navegador nunca vê o token.
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const apiRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!apiRes.ok) {
    const data = await apiRes.json().catch(() => ({}));
    return NextResponse.json({ error: data.error ?? "Credenciais inválidas" }, { status: apiRes.status });
  }

  const { token, user } = await apiRes.json();

  const response = NextResponse.json({ user });
  response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
