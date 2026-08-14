import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";
import { DollarSign, ShoppingBag, Package, AlertTriangle } from "lucide-react";

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [revenueAgg, orderCount, recentOrders, lowStock, bestSellers] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true } }),
    prisma.$queryRaw`
      SELECT i.id, i."quantity", i."minQuantity", p.name as "productName"
      FROM inventory i
      LEFT JOIN products p ON p.id = i."productId"
      WHERE i."quantity" <= i."minQuantity"
      LIMIT 5
    `.catch(() => [] as { id: string; quantity: number; minQuantity: number; productName: string }[]),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);
  const avgTicket = orderCount > 0 ? revenue / orderCount : 0;

  return (
    <div>
      <h1 className="font-display text-display-md text-brand-800">Dashboard</h1>
      <p className="mt-1 text-brand-500">Visão geral do mês atual</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Faturamento no mês" value={formatCurrency(revenue)} />
        <StatCard icon={ShoppingBag} label="Pedidos no mês" value={String(orderCount)} />
        <StatCard icon={Package} label="Ticket médio" value={formatCurrency(avgTicket)} />
        <StatCard icon={AlertTriangle} label="Itens com estoque baixo" value={String(lowStock.length)} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-organic bg-bg p-6">
          <p className="font-display text-lg text-brand-800">Pedidos recentes</p>
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between border-b border-brand-100 pb-3 text-sm">
                <div>
                  <p className="text-brand-800">{order.number}</p>
                  <p className="text-brand-400">{order.customer.name}</p>
                </div>
                <span className="text-brand-600">{formatCurrency(order.total.toString())}</span>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-brand-400">Nenhum pedido ainda.</p>}
          </div>
        </div>

        <div className="rounded-organic bg-bg p-6">
          <p className="font-display text-lg text-brand-800">Produtos mais vendidos</p>
          <div className="mt-4 space-y-3">
            {bestSellers.map((item) => (
              <div key={item.productId} className="flex justify-between border-b border-brand-100 pb-3 text-sm">
                <span className="text-brand-800">{item.productName}</span>
                <span className="text-brand-500">{item._sum.quantity} un.</span>
              </div>
            ))}
            {bestSellers.length === 0 && <p className="text-sm text-brand-400">Sem vendas registradas ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
