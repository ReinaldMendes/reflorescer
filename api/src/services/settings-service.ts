import { prisma } from "../lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

export async function getActivePageSections(page = "home") {
  return prisma.pageSection.findMany({ where: { page, active: true }, orderBy: { order: "asc" } });
}
