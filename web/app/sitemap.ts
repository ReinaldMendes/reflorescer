import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/api-client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflorescerartesanal.com.br";
  const { products, categories, posts } = await getSitemapData().catch(() => ({ products: [], categories: [], posts: [] }));

  const staticRoutes = ["", "/produtos", "/sobre", "/journal", "/kits", "/experiencias"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...products.map((p: any) => ({ url: `${baseUrl}/produto/${p.slug}`, lastModified: p.updatedAt })),
    ...categories.map((c: any) => ({ url: `${baseUrl}/categoria/${c.slug}`, lastModified: c.updatedAt })),
    ...posts.map((p: any) => ({ url: `${baseUrl}/journal/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
