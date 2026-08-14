import { getProductBySlug, getRelatedProducts } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/site/product-card";
import { AddToCartForm } from "@/components/site/add-to-cart-form";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: {
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export const revalidate = 1800;

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  const attributes = product.attributes as Record<string, unknown> | null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price.toString(),
      availability:
        (product.inventory?.quantity ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-organic bg-brand-50">
            {product.images[0] && (
              <Image src={product.images[0].url} alt={product.images[0].alt ?? product.name} fill priority className="object-cover" />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-organic bg-brand-50">
                  <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-brand-300">{product.category.name}</p>
          <h1 className="mt-2 font-display text-display-md text-brand-800">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-lg text-brand-300 line-through">{formatCurrency(product.compareAtPrice.toString())}</span>
            )}
            <span className="text-2xl font-medium text-brand-800">{formatCurrency(product.price.toString())}</span>
          </div>
          <p className="mt-1 text-sm text-brand-400">ou Pix com 5% de desconto</p>

          {product.shortDescription && <p className="mt-6 text-body text-brand-600">{product.shortDescription}</p>}

          <AddToCartForm
            productId={product.id}
            variants={product.variants}
            inStock={(product.inventory?.quantity ?? 0) > 0}
          />

          <div className="mt-12 space-y-6 border-t border-brand-100 pt-8">
            {product.description && (
              <div>
                <p className="font-display text-lg text-brand-800">Sobre o produto</p>
                <p className="mt-2 whitespace-pre-line text-sm text-brand-600">{product.description}</p>
              </div>
            )}

            {attributes?.ingredients ? (
              <div>
                <p className="font-display text-lg text-brand-800">Composição</p>
                <ul className="mt-2 list-inside list-disc text-sm text-brand-600">
                  {(attributes.ingredients as string[]).map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {attributes?.howToUse ? (
              <div>
                <p className="font-display text-lg text-brand-800">Modo de uso</p>
                <p className="mt-2 text-sm text-brand-600">{attributes.howToUse as string}</p>
              </div>
            ) : null}

            {attributes?.precautions ? (
              <div>
                <p className="font-display text-lg text-brand-800">Cuidados</p>
                <p className="mt-2 text-sm text-brand-600">{attributes.precautions as string}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-display-md text-brand-800">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price.toString(),
                  images: p.images,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
