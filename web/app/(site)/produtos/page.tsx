import { listProducts, listCategories } from "@/lib/api-client";
import { ProductCard } from "@/components/site/product-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Cosméticos artesanais, incensos, velas, mandalas e peças feitas à mão pela Reflorescer.",
};

interface PageProps {
  searchParams: { categoria?: string; ordenar?: string; busca?: string; pagina?: string };
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const page = Number(searchParams.pagina ?? 1);
  const { items, totalPages } = await listProducts({
    categoria: searchParams.categoria,
    ordenar: searchParams.ordenar as "price-asc" | "price-desc" | "newest" | undefined,
    busca: searchParams.busca,
    pagina: page,
  });

  const categories = await listCategories();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-12 max-w-xl">
        <h1 className="font-display text-display-lg text-brand-800">Produtos</h1>
        <p className="mt-3 text-brand-500">Cosméticos, aromas, luz e arte — feitos à mão, com intenção.</p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/produtos"
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            !searchParams.categoria ? "border-brand-600 bg-brand-600 text-bg" : "border-brand-200 text-brand-600"
          )}
        >
          Todos
        </Link>
        {categories.map((c: any) => (
          <Link
            key={c.id}
            href={`/produtos?categoria=${c.slug}`}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              searchParams.categoria === c.slug
                ? "border-brand-600 bg-brand-600 text-bg"
                : "border-brand-200 text-brand-600"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center text-brand-400">Nenhum produto encontrado com esses filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((p: any) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                compareAtPrice: p.compareAtPrice,
                isNew: p.isNew,
                images: p.images,
                category: p.category,
              }}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/produtos?pagina=${i + 1}`}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm",
                page === i + 1 ? "border-brand-600 bg-brand-600 text-bg" : "border-brand-200 text-brand-600"
              )}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
