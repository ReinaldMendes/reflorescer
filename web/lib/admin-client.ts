import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE } from "@/lib/constants";

// Cliente para as rotas administrativas da API. É usado apenas em Server
// Components/Route Handlers rodando no servidor da Vercel — nunca no
// navegador. O token fica em cookie httpOnly no domínio do PRÓPRIO web/
// (setado por app/api/session/login/route.ts), e é repassado aqui como
// Authorization: Bearer para a API real no Railway. Esse padrão
// "Backend-For-Frontend" evita expor o JWT ao navegador e evita configurar
// CORS com credenciais entre domínios diferentes.


const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function getAdminToken(): string | undefined {
  return cookies().get(ADMIN_TOKEN_COOKIE)?.value;
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Falha na chamada administrativa: ${res.status}`);
  }

  return res.json();
}
