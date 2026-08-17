import type { Request, Response, NextFunction } from "express";
import { verifyAdminToken } from "../lib/jwt";

// Protege todas as rotas /admin/* da API. O token chega via header
// Authorization: Bearer <token> — quem envia esse header é o próprio
// Next.js (web/) rodando server-side, nunca o navegador diretamente
// (ver README da raiz do monorepo para o fluxo completo de autenticação).
export interface AuthenticatedRequest extends Request {
  admin?: { id: string; email: string; role: string };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada" });
  }
}
