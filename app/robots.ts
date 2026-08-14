import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflorescerartesanal.com.br";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/checkout", "/carrinho"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
