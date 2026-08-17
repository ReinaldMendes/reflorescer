import { Router } from "express";
import {
  getOrCreateCart,
  addItemToCart,
  getCartWithItems,
  updateCartItemQuantity,
  removeCartItem,
} from "../services/cart-service";
import { asyncHandler } from "../middleware/error-handler";

export const cartRouter = Router();

// sessionId é gerado e mantido pelo web/ (cookie httpOnly no domínio do
// front) e enviado aqui via query/body — a API nunca decide identidade
// de visitante, só resolve o carrinho a partir do id recebido.

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { sessionId, customerId } = req.query;
    if (!sessionId && !customerId) return res.status(400).json({ error: "sessionId é obrigatório" });
    const cart = await getOrCreateCart(sessionId as string, customerId as string | undefined);
    const fullCart = await getCartWithItems(cart.id);
    res.json(fullCart);
  })
);

cartRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { sessionId, productId, variantId, quantity } = req.body;
    if (!sessionId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Dados inválidos" });
    }
    const cart = await getOrCreateCart(sessionId);
    await addItemToCart(cart.id, productId, quantity, variantId);
    const fullCart = await getCartWithItems(cart.id);
    res.json(fullCart);
  })
);

cartRouter.patch(
  "/items/:id",
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (typeof quantity !== "number") return res.status(400).json({ error: "Quantidade inválida" });
    const item = await updateCartItemQuantity(req.params.id, quantity);
    res.json(item);
  })
);

cartRouter.delete(
  "/items/:id",
  asyncHandler(async (req, res) => {
    await removeCartItem(req.params.id);
    res.json({ ok: true });
  })
);
