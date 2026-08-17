import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/constants";

// Gate de UX: só verifica se o cookie existe, sem decodificar o JWT (o
// middleware do Next roda no Edge Runtime, que não deve carregar segredos
// de verificação). A validação de verdade acontece na API a cada chamada
// (middleware requireAdmin), então mesmo que alguém falsifique o cookie
// aqui, nenhuma requisição autenticada real passa sem o token correto.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
