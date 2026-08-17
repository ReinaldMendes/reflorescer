import { adminFetch } from "@/lib/admin-client";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await adminFetch<any[]>("/admin/products");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-md text-brand-800">Produtos</h1>
        <Link href="/admin/produtos/novo" className="flex items-center gap-2 rounded-organic bg-brand-600 px-5 py-3 text-sm text-bg">
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-organic bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-100 text-brand-400">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-50">
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-organic bg-brand-100">
                    {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                  </div>
                  <Link href={`/admin/produtos/${p.id}`} className="text-brand-800 hover:underline">{p.name}</Link>
                </td>
                <td className="p-4 text-brand-500">{p.category.name}</td>
                <td className="p-4 text-brand-700">{formatCurrency(p.price)}</td>
                <td className="p-4 text-brand-500">{p.inventory?.quantity ?? 0}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${p.active ? "bg-brand-100 text-brand-700" : "bg-red-50 text-red-500"}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-brand-400">Nenhum produto cadastrado ainda.</p>}
      </div>
    </div>
  );
}
