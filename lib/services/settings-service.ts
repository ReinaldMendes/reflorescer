import { prisma } from "@/lib/prisma";

// SiteSettings é um singleton (id fixo "singleton") — garante que exista
// sempre um único registro de configuração, criado sob demanda.
export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

export async function getActivePageSections(page = "home") {
  return prisma.pageSection.findMany({
    where: { page, active: true },
    orderBy: { order: "asc" },
  });
}
