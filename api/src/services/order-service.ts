import { prisma } from "../lib/prisma";
import { generateOrderNumber } from "../lib/utils";
import type { CheckoutInput } from "../validations/checkout";
import { getCartWithItems, calculateCartTotal } from "./cart-service";
import { applyCoupon } from "./coupon-service";

export async function createOrderFromCart(cartId: string, input: CheckoutInput) {
  const cart = await getCartWithItems(cartId);
  if (!cart || cart.items.length === 0) throw new Error("Carrinho vazio");

  const subtotal = await calculateCartTotal(cartId);

  let discountTotal = 0;
  let couponId: string | undefined;
  if (input.couponCode) {
    const result = await applyCoupon(input.couponCode, subtotal, cart.items.map((i) => i.productId));
    discountTotal = result.discount;
    couponId = result.couponId;
  }

  const shippingMethod = await prisma.shippingMethod.findUnique({ where: { id: input.shippingMethodId } });
  if (!shippingMethod || !shippingMethod.active) throw new Error("Método de envio inválido");

  const shippingTotal = Number(shippingMethod.price);
  const total = subtotal - discountTotal + shippingTotal;

  const customer = await prisma.customer.upsert({
    where: { email: input.customer.email },
    update: { name: input.customer.name, phone: input.customer.phone, document: input.customer.document },
    create: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
      document: input.customer.document,
    },
  });

  const address = await prisma.address.create({ data: { ...input.address, customerId: customer.id } });

  const orderCount = await prisma.order.count();
  const number = generateOrderNumber(orderCount + 1);

  const order = await prisma.order.create({
    data: {
      number,
      customerId: customer.id,
      addressId: address.id,
      subtotal,
      discountTotal,
      shippingTotal,
      total,
      couponId,
      shippingMethodId: shippingMethod.id,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      },
      statusHistory: { create: { status: "AWAITING_PAYMENT", note: "Pedido criado" } },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId } });

  return order;
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  return prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: status as never } }),
    prisma.orderStatusHistory.create({ data: { orderId, status: status as never, note } }),
  ]);
}
