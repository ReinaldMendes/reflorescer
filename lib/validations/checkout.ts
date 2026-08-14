import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().optional(),
  recipient: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
});

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    document: z.string().min(11, "CPF inválido"),
  }),
  address: addressSchema,
  shippingMethodId: z.string().cuid(),
  paymentMethod: z.enum(["PIX", "CREDIT_CARD", "BOLETO"]),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
