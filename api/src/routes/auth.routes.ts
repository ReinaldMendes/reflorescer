import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signAdminToken } from "../lib/jwt";
import { asyncHandler } from "../middleware/error-handler";

export const authRouter = Router();

// Login exclusivo da equipe interna (painel administrativo). O cliente da
// loja não usa este fluxo — ver checkout, que cria/atualiza Customer sem
// exigir senha (item 43 do briefing: checkout sem fricção).
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) return res.status(401).json({ error: "Credenciais inválidas" });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = signAdminToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  })
);
