import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export async function getOrCreateCart(sessionId: string, customerId?: string) {
  if (customerId) {
    const existing = await prisma.cart.findUnique({ where: { customerId } });
    if (existing) return existing;
    return prisma.cart.create({ data: { customerId } });
  }
  const existing = await prisma.cart.findUnique({ where: { sessionId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { sessionId } });
}

export async function addItemToCart(cartId: string, productId: string, quantity: number, variantId?: string) {
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId, productId, variantId: variantId ?? null },
  });
  if (existingItem) {
    return prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: existingItem.quantity + quantity } });
  }
  return prisma.cartItem.create({ data: { cartId, productId, variantId, quantity } });
}

export async function getCartWithItems(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: { include: { images: { orderBy: { order: "asc" }, take: 1 }, inventory: true } },
          variant: true,
        },
      },
    },
  });
}

export async function calculateCartTotal(cartId: string): Promise<number> {
  const cart = await getCartWithItems(cartId);
  if (!cart) return 0;
  return cart.items.reduce((total, item) => {
    const unitPrice = new Prisma.Decimal(item.product.price).plus(item.variant?.priceDelta ?? 0);
    return total + unitPrice.toNumber() * item.quantity;
  }, 0);
}

export async function removeCartItem(cartItemId: string) {
  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) return removeCartItem(cartItemId);
  return prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
}
