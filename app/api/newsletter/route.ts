import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { active: true },
    create: { email: parsed.data.email },
  });

  // TODO: sincronizar com plataforma de e-mail marketing (Resend Audiences,
  // Mailchimp, etc.) quando a integração for definida.

  return NextResponse.json({ ok: true });
}
