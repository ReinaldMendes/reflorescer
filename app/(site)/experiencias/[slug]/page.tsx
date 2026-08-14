import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/product-card";

export default async function ExperiencePage({ params }: { params: { slug: string } }) {
  const experience = await prisma.experience.findUnique({
    where: { slug: params.slug, active: true },
    include: { products: { include: { product: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } } } },
  });
  if (!experience) notFound();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-12 max-w-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Experiência</p>
        <h1 className="mt-3 font-display text-display-lg text-brand-800">{experience.title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {experience.products.map(({ product }) => (
          <ProductCard
            key={product.id}
            product={{ id: product.id, name: product.name, slug: product.slug, price: product.price.toString(), images: product.images }}
          />
        ))}
        {experience.products.length === 0 && <p className="text-brand-400">Produtos para esta experiência em breve.</p>}
      </div>
    </main>
  );
}
