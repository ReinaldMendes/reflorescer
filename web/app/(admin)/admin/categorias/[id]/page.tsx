import { adminFetch } from "@/lib/admin-client";
import { CategoryForm } from "@/components/admin/category-form";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await adminFetch<any>(`/admin/categories/${params.id}`).catch(() => null);
  if (!category) notFound();

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Editar categoria</h1>
      <p className="mt-1 text-brand-500">{category.name}</p>

      <div className="mt-8 max-w-2xl rounded-organic bg-bg p-8">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.imageUrl,
            order: category.order,
            featured: category.featured,
            active: category.active,
          }}
        />
      </div>
    </div>
  );
}
