import { ProductCard, type ProductCardData } from "@/components/site/product-card";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">Seleção</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">
          Escolhas para o <em className="italic text-gold-deep">seu</em> momento
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
