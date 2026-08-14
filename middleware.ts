import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protege toda a árvore /admin — exige sessão válida com role ADMIN ou
// EDITOR. Nunca confia em nada vindo do cliente: a checagem de role usa o
// token assinado gerado pelo NextAuth (lib/auth.ts).
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin/login")) return true;
        return !!token && (token.role === "ADMIN" || token.role === "EDITOR" || token.role === "STAFF");
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
