import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Novo produto</h1>
      <p className="mt-1 text-brand-500">Cadastre um novo item do catálogo Reflorescer</p>

      <div className="mt-8 max-w-3xl rounded-organic bg-bg p-8">
        <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
