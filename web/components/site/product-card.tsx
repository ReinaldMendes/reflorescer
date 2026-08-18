"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  isNew?: boolean;
  images: { url: string; alt?: string | null }[];
  category?: { name: string } | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0]?.url ?? "/images/placeholder-product.jpg";
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);

  return (
    <div className="glass glass-hover group relative rounded-glass p-3">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-organic bg-gradient-to-br from-gold-pale/40 to-brand-100">
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-organic ease-organic group-hover:scale-[1.03]"
          />
          {product.isNew && (
            <Badge variant="clay" className="absolute left-3 top-3 border border-gold/30 bg-white/85 text-gold-deep">
              Novidade
            </Badge>
          )}
          <button
            aria-label="Adicionar aos favoritos"
            className="glass absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} />
          </button>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-2 px-1 pb-1">
        <div>
          {product.category && (
            <p className="text-[11px] uppercase tracking-wide text-brand-400 opacity-80">{product.category.name}</p>
          )}
          <Link href={`/produto/${product.slug}`}>
            <p className="mt-1 font-display text-lg font-light text-brand-800">{product.name}</p>
          </Link>
          <div className="mt-1 flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-brand-300 line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
            <span className="font-medium text-gold-deep">{formatCurrency(product.price)}</span>
          </div>
        </div>

        <button
          aria-label="Adicionar ao carrinho"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brand-800/15 text-brand-600 transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep hover:text-bg"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  );
}
