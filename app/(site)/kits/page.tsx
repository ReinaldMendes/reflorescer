import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kits",
  description: "Kits presenteáveis, de autocuidado e aromáticos da Reflorescer.",
};

export default async function KitsPage() {
  const kits = await prisma.kit.findMany({ where: { active: true }, include: { items: { include: { product: true } } } });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-12 max-w-xl">
        <h1 className="font-display text-display-lg text-brand-800">Kits</h1>
        <p className="mt-3 text-brand-500">Combinações especiais para presentear ou se presentear.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {kits.map((kit) => (
          <Link key={kit.id} href={`/kits/${kit.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-organic bg-brand-50">
              {kit.imageUrl && <Image src={kit.imageUrl} alt={kit.name} fill className="object-cover transition-transform duration-organic group-hover:scale-105" />}
            </div>
            <p className="mt-4 font-display text-lg text-brand-800">{kit.name}</p>
            <p className="text-brand-600">{formatCurrency(kit.price.toString())}</p>
          </Link>
        ))}
        {kits.length === 0 && <p className="text-brand-400">Novos kits em breve.</p>}
      </div>
    </main>
  );
}
