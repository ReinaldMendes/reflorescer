import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "Aguardando pagamento",
  PAYMENT_APPROVED: "Pagamento aprovado",
  PREPARING: "Preparando seu pedido",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sucesso?: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true },
  });
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      {searchParams.sucesso && (
        <p className="mb-6 inline-block rounded-full bg-brand-100 px-4 py-2 text-sm text-brand-700">
          Pedido confirmado com sucesso 🌿
        </p>
      )}
      <h1 className="font-display text-display-md text-brand-800">Pedido {order.number}</h1>
      <p className="mt-2 text-brand-500">{STATUS_LABELS[order.status]}</p>

      <div className="mt-10 space-y-3 rounded-organic border border-brand-100 p-6 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-brand-600">
            <span>{item.quantity}× {item.productName}</span>
            <span>{formatCurrency(item.unitPrice.toString())}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-brand-100 pt-3 font-medium text-brand-800">
          <span>Total</span>
          <span>{formatCurrency(order.total.toString())}</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-brand-400">Realizado em {formatDate(order.createdAt)}</p>
    </main>
  );
}
