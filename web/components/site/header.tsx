"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Search, Heart, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Produtos", href: "/produtos" },
  { label: "Experiências", href: "/experiencias" },
  { label: "Kits", href: "/kits" },
  { label: "Nossa essência", href: "/sobre" },
  { label: "Diário Reflorescer", href: "/journal" },
];

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-bg/70 backdrop-blur-glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center" aria-label="Reflorescer — página inicial">
          <Image
            src="/images/logo-reflorescer.png"
            alt="Reflorescer Artesanal Natural"
            width={1238}
            height={1149}
            priority
            className="h-12 w-auto lg:h-14"
          />
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-brand-500 transition-colors hover:text-gold-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Buscar" className="text-brand-600 hover:text-brand-800">
            <Search size={20} />
          </button>
          <Link href="/conta/favoritos" aria-label="Favoritos" className="text-brand-600 hover:text-brand-800">
            <Heart size={20} />
          </Link>
          <Link href="/conta" aria-label="Minha conta" className="hidden text-brand-600 hover:text-brand-800 sm:block">
            <User size={20} />
          </Link>
          <Link href="/carrinho" aria-label="Carrinho" className="relative text-brand-600 hover:text-brand-800">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav
        className={cn(
          "flex flex-col gap-1 overflow-hidden border-t border-brand-100 bg-bg px-6 transition-all duration-organic ease-organic lg:hidden",
          open ? "max-h-96 py-4" : "max-h-0"
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="py-3 text-brand-700" onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
