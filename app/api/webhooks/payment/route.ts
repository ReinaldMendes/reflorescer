import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePaymentProvider } from "@/lib/payments/mercado-pago-provider";
import { updateOrderStatus } from "@/lib/services/order-service";

// Endpoint único de webhook — o provider ativo (configurável em
// SiteSettings) decide como interpretar o payload recebido. Trocar de
// gateway não exige criar uma nova rota, só uma nova implementação de
// PaymentProvider.
export async function POST(req: NextRequest) {
  const payload = await req.json();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const provider = resolvePaymentProvider(settings?.activePaymentProvider ?? "mercadopago");

  const { providerReference, status } = provider.parseWebhookPayload(payload);

  const payment = await prisma.payment.findFirst({ where: { providerReference } });
  if (!payment) {
    return NextResponse.json({ ok: true }); // evento não reconhecido, ignora sem erro
  }

  const paymentStatus = status === "PAID" ? "PAID" : status === "FAILED" ? "FAILED" : "PENDING";
  await prisma.payment.update({ where: { id: payment.id }, data: { status: paymentStatus, rawPayload: payload } });

  if (paymentStatus === "PAID") {
    await updateOrderStatus(payment.orderId, "PAYMENT_APPROVED", "Pagamento confirmado via webhook");
  }

  return NextResponse.json({ ok: true });
}
