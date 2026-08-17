import { adminFetch } from "@/lib/admin-client";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";
import { DollarSign, ShoppingBag, Package, AlertTriangle } from "lucide-react";

interface DashboardData {
  revenue: number;
  orderCount: number;
  recentOrders: any[];
  lowStock: any[];
  bestSellers: any[];
}

export default async function AdminDashboardPage() {
  const data = await adminFetch<DashboardData>("/admin/dashboard");
  const avgTicket = data.orderCount > 0 ? data.revenue / data.orderCount : 0;

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Dashboard</h1>
      <p className="mt-1 text-brand-500">Visão geral do mês atual</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Faturamento no mês" value={formatCurrency(data.revenue)} />
        <StatCard icon={ShoppingBag} label="Pedidos no mês" value={String(data.orderCount)} />
        <StatCard icon={Package} label="Ticket médio" value={formatCurrency(avgTicket)} />
        <StatCard icon={AlertTriangle} label="Itens com estoque baixo" value={String(data.lowStock.length)} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-organic bg-bg p-6">
          <p className="font-display text-lg text-brand-800">Pedidos recentes</p>
          <div className="mt-4 space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between border-b border-brand-100 pb-3 text-sm">
                <div>
                  <p className="text-brand-800">{order.number}</p>
                  <p className="text-brand-400">{order.customer.name}</p>
                </div>
                <span className="text-brand-600">{formatCurrency(order.total)}</span>
              </div>
            ))}
            {data.recentOrders.length === 0 && <p className="text-sm text-brand-400">Nenhum pedido ainda.</p>}
          </div>
        </div>

        <div className="rounded-organic bg-bg p-6">
          <p className="font-display text-lg text-brand-800">Produtos mais vendidos</p>
          <div className="mt-4 space-y-3">
            {data.bestSellers.map((item) => (
              <div key={item.productId} className="flex justify-between border-b border-brand-100 pb-3 text-sm">
                <span className="text-brand-800">{item.productName}</span>
                <span className="text-brand-500">{item._sum.quantity} un.</span>
              </div>
            ))}
            {data.bestSellers.length === 0 && <p className="text-sm text-brand-400">Sem vendas registradas ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
