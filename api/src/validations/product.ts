import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  slug: z.string().min(2),
  shortDescription: z.string().max(280).optional(),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  kind: z.enum(["COSMETIC", "INCENSE", "CANDLE", "ART_PIECE", "AROMATIC", "KIT", "OTHER"]),
  price: z.number().positive("Preço deve ser maior que zero"),
  compareAtPrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  sku: z.string().optional(),
  weightGrams: z.number().int().positive().optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  active: z.boolean().default(true),
  attributes: z.record(z.unknown()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
