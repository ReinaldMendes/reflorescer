"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, FolderTree, Boxes, ShoppingCart, Users,
  Ticket, Gift, BookOpen, Layout, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/kits", label: "Kits", icon: Gift },
  { href: "/admin/journal", label: "Journal", icon: BookOpen },
  { href: "/admin/conteudo-home", label: "Conteúdo da Home", icon: Layout },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/session/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-brand-100 bg-bg p-6">
      <div>
        <p className="font-display text-xl text-brand-800">Reflorescer</p>
        <p className="text-xs text-brand-400">Painel administrativo</p>

        <nav className="mt-8 space-y-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-organic px-3 py-2.5 text-sm transition-colors",
                pathname.startsWith(href) ? "bg-brand-600 text-bg" : "text-brand-600 hover:bg-brand-50"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-3 rounded-organic px-3 py-2.5 text-sm text-brand-400 hover:bg-brand-50">
        <LogOut size={16} />
        Sair
      </button>
    </aside>
  );
}
