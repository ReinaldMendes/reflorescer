import { prisma } from "../lib/prisma";

export async function applyCoupon(code: string, subtotal: number, productIds: string[]) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: { products: true, categories: true },
  });

  if (!coupon || !coupon.active) throw new Error("Cupom inválido");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Cupom expirado");
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error("Cupom esgotado");
  if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
    throw new Error(`Valor mínimo de ${coupon.minOrderValue} para usar este cupom`);
  }
  if (coupon.products.length > 0) {
    const allowed = coupon.products.map((p) => p.productId);
    const hasAllowedProduct = productIds.some((id) => allowed.includes(id));
    if (!hasAllowedProduct) throw new Error("Cupom não válido para os produtos do carrinho");
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") discount = (subtotal * Number(coupon.value)) / 100;
  else if (coupon.type === "FIXED") discount = Number(coupon.value);

  return { discount: Math.min(discount, subtotal), couponId: coupon.id };
}
