import { adminFetch } from "@/lib/admin-client";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await adminFetch<any[]>("/admin/categories");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-brand-800">Categorias</h1>
          <p className="mt-1 text-brand-500">Organize o catálogo em famílias de produtos</p>
        </div>
        <Link href="/admin/categorias/nova" className="flex items-center gap-2 rounded-organic bg-brand-600 px-5 py-3 text-sm text-bg">
          <Plus size={16} /> Nova categoria
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/categorias/${c.id}`}
            className="flex items-center gap-4 rounded-organic bg-bg p-4 transition-shadow hover:shadow-soft"
          >
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-organic bg-brand-100">
              {c.imageUrl && <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-brand-800">{c.name}</p>
              <p className="text-xs text-brand-400">/{c.slug}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.featured && (
                  <span className="rounded-full bg-gold-pale/50 px-2 py-0.5 text-[10px] text-gold-deep">Em destaque</span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${c.active ? "bg-brand-100 text-brand-700" : "bg-red-50 text-red-500"}`}>
                  {c.active ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {categories.length === 0 && <p className="text-brand-400">Nenhuma categoria cadastrada ainda.</p>}
      </div>
    </div>
  );
}
