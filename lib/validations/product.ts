import { z } from "zod";

// Schemas base compartilhados por todos os tipos de produto
const baseAttributesSchema = z.object({
  weightVolume: z.string().optional(), // ex.: "150g", "30ml"
});

// Cosméticos exigem composição/ingredientes/modo de uso/validade —
// nunca texto solto, sempre estruturado (ver item 13 do briefing:
// nada de alegações terapêuticas não fundamentadas).
export const cosmeticAttributesSchema = baseAttributesSchema.extend({
  ingredients: z.array(z.string()).min(1, "Informe ao menos um ingrediente"),
  howToUse: z.string().min(1, "Descreva o modo de use"),
  precautions: z.string().optional(),
  shelfLife: z.string().optional(), // "12 meses após aberto"
  manufacturer: z.string().optional(),
});

export const artPieceAttributesSchema = baseAttributesSchema.extend({
  materials: z.array(z.string()).min(1, "Informe ao menos um material"),
  origin: z.string().optional(),
  careInstructions: z.string().optional(),
});

export const aromaticAttributesSchema = baseAttributesSchema.extend({
  scentNotes: z.array(z.string()).optional(),
  burnTimeMinutes: z.number().int().positive().optional(),
});

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
