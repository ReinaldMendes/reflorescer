import { adminFetch } from "@/lib/admin-client";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "Aguardando pagamento",
  PAYMENT_APPROVED: "Pagamento aprovado",
  PREPARING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default async function AdminOrdersPage() {
  const orders = await adminFetch<any[]>("/admin/orders?take=50");

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Pedidos</h1>

      <div className="mt-8 overflow-hidden rounded-organic bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-100 text-brand-400">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-brand-50">
                <td className="p-4 text-brand-800">{o.number}</td>
                <td className="p-4 text-brand-600">{o.customer.name}</td>
                <td className="p-4 text-brand-500">{formatDate(o.createdAt)}</td>
                <td className="p-4 text-brand-700">{formatCurrency(o.total)}</td>
                <td className="p-4">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-700">{STATUS_LABELS[o.status] ?? o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-brand-400">Nenhum pedido ainda.</p>}
      </div>
    </div>
  );
}
