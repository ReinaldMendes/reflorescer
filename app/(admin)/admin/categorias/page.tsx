import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Categorias</h1>
      <p className="mt-1 text-brand-500">Organize o catálogo em famílias de produtos</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-organic bg-bg p-4">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-organic bg-brand-100">
              {c.imageUrl && <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />}
            </div>
            <div>
              <p className="text-brand-800">{c.name}</p>
              <p className="text-xs text-brand-400">/{c.slug}</p>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-brand-400">Nenhuma categoria cadastrada ainda.</p>}
      </div>
    </div>
  );
}
