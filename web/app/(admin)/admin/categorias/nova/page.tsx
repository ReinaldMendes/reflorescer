import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Nova categoria</h1>
      <p className="mt-1 text-brand-500">Crie uma nova família de produtos</p>

      <div className="mt-8 max-w-2xl rounded-organic bg-bg p-8">
        <CategoryForm />
      </div>
    </div>
  );
}
