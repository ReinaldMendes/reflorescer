import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});
