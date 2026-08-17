import { redirect } from "next/navigation";
import { getAdminToken } from "@/lib/admin-client";
import { AdminSidebar } from "@/components/admin/sidebar";

// Gate simples de presença do cookie — quem de fato valida o JWT (assinatura
// e expiração) é a API a cada chamada via requireAdmin. Este layout só evita
// que a página administrativa renderize sem nenhum token presente.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = getAdminToken();
  if (!token) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-bg-sand">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
