import { prisma } from "@/lib/prisma";

export async function listCategories({ featuredOnly = false }: { featuredOnly?: boolean } = {}) {
  return prisma.category.findMany({
    where: {
      active: true,
      ...(featuredOnly && { featured: true }),
      parentId: null, // categorias de topo — subcategorias vêm aninhadas
    },
    orderBy: { order: "asc" },
    include: { children: { where: { active: true }, orderBy: { order: "asc" } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug, active: true },
    include: { children: true },
  });
}
