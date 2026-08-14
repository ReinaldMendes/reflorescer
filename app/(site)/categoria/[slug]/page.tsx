import { getCategoryBySlug } from "@/lib/services/category-service";
import { listProducts } from "@/lib/services/product-service";
import { ProductCard } from "@/components/site/product-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { items } = await listProducts({ categorySlug: params.slug, perPage: 24 });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-12 max-w-xl">
        <h1 className="font-display text-display-lg text-brand-800">{category.name}</h1>
        {category.description && <p className="mt-3 text-brand-500">{category.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={{
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price.toString(),
              compareAtPrice: p.compareAtPrice?.toString(),
              isNew: p.isNew,
              images: p.images,
            }}
          />
        ))}
      </div>
    </main>
  );
}
