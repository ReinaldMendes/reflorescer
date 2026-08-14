import { listProducts } from "@/lib/services/product-service";
import { ProductCard } from "@/components/site/product-card";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const { items } = await listProducts({ search: query, perPage: 24 });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <h1 className="font-display text-display-lg text-brand-800">
        {query ? `Resultados para "${query}"` : "Buscar produtos"}
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={{ id: p.id, name: p.name, slug: p.slug, price: p.price.toString(), images: p.images }}
          />
        ))}
      </div>
      {query && items.length === 0 && <p className="mt-10 text-brand-400">Nenhum produto encontrado.</p>}
    </main>
  );
}
