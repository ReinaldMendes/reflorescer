import { ProductCard, type ProductCardData } from "@/components/site/product-card";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 flex items-end justify-between">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Seleção</p>
          <h2 className="mt-4 font-display text-display-md text-brand-800">Escolhas para o seu momento</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
