import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflorescerartesanal.com.br";

  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = ["", "/produtos", "/sobre", "/journal", "/kits", "/experiencias"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...products.map((p) => ({ url: `${baseUrl}/produto/${p.slug}`, lastModified: p.updatedAt })),
    ...categories.map((c) => ({ url: `${baseUrl}/categoria/${c.slug}`, lastModified: c.updatedAt })),
    ...posts.map((p) => ({ url: `${baseUrl}/journal/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
