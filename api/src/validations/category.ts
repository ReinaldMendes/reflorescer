import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  parentId: z.string().cuid().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
