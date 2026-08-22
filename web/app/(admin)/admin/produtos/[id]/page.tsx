import { adminFetch } from "@/lib/admin-client";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    adminFetch<any>(`/admin/products/${params.id}`).catch(() => null),
    adminFetch<any[]>("/admin/categories"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Editar produto</h1>
      <p className="mt-1 text-brand-500">{product.name}</p>

      <div className="mt-8 max-w-3xl rounded-organic bg-bg p-8">
        <ProductForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          product={{
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            kind: product.kind,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            shortDescription: product.shortDescription,
            description: product.description,
            featured: product.featured,
            attributes: product.attributes,
            images: (product.images ?? []).map((img: any) => ({ id: img.id, url: img.url })),
          }}
        />
      </div>
    </div>
  );
}
