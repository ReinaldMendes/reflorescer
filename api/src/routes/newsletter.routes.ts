import { Router } from "express";
import { prisma } from "../lib/prisma";
import { newsletterSchema } from "../validations/newsletter";
import { asyncHandler } from "../middleware/error-handler";

export const newsletterRouter = Router();

newsletterRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = newsletterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "E-mail inválido" });

    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { active: true },
      create: { email: parsed.data.email },
    });

    // TODO: sincronizar com Resend Audiences / plataforma de e-mail marketing
    res.json({ ok: true });
  })
);
