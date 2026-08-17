import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export interface ProductListFilters {
  categorySlug?: string;
  kind?: string;
  search?: string;
  featuredOnly?: boolean;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
  page?: number;
  perPage?: number;
}

export async function listProducts(filters: ProductListFilters = {}) {
  const { categorySlug, kind, search, featuredOnly, sort = "relevance", page = 1, perPage = 12 } = filters;

  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(kind && { kind: kind as Prisma.ProductWhereInput["kind"] }),
    ...(featuredOnly && { featured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "newest"
      ? { createdAt: "desc" }
      : { featured: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        images: { orderBy: { order: "asc" }, take: 2 },
        category: true,
        inventory: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { where: { active: true } },
      category: true,
      inventory: true,
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string, take = 4) {
  return prisma.product.findMany({
    where: { id: { not: productId }, categoryId, active: true },
    take,
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
}

export async function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    take,
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
}
