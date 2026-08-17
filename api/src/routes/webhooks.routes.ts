import { Router } from "express";
import { prisma } from "../lib/prisma";
import { resolvePaymentProvider } from "../payments/mercado-pago-provider";
import { updateOrderStatus } from "../services/order-service";
import { asyncHandler } from "../middleware/error-handler";

export const webhooksRouter = Router();

webhooksRouter.post(
  "/payment",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    const provider = resolvePaymentProvider(settings?.activePaymentProvider ?? "mercadopago");

    const { providerReference, status } = provider.parseWebhookPayload(payload);

    const payment = await prisma.payment.findFirst({ where: { providerReference } });
    if (!payment) return res.json({ ok: true });

    const paymentStatus = status === "PAID" ? "PAID" : status === "FAILED" ? "FAILED" : "PENDING";
    await prisma.payment.update({ where: { id: payment.id }, data: { status: paymentStatus, rawPayload: payload } });

    if (paymentStatus === "PAID") {
      await updateOrderStatus(payment.orderId, "PAYMENT_APPROVED", "Pagamento confirmado via webhook");
    }

    res.json({ ok: true });
  })
);
