import { Router } from "express";
import { checkoutSchema } from "../validations/checkout";
import { createOrderFromCart } from "../services/order-service";
import { asyncHandler } from "../middleware/error-handler";

export const checkoutRouter = Router();

checkoutRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { cartId, ...checkoutData } = req.body;
    if (!cartId) return res.status(400).json({ error: "Carrinho não encontrado" });

    const parsed = checkoutSchema.safeParse(checkoutData);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }

    try {
      const order = await createOrderFromCart(cartId, parsed.data);
      // TODO: chamar PaymentProvider.createCharge aqui e persistir o Payment
      res.status(201).json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao processar pedido";
      res.status(400).json({ error: message });
    }
  })
);

checkoutRouter.get(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    const { prisma } = await import("../lib/prisma");
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true, address: true },
    });
    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(order);
  })
);
