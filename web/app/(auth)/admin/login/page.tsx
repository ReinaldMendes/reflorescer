"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Chama a rota do PRÓPRIO web/ (não a API diretamente) — ela troca as
    // credenciais pelo JWT na API real e guarda o token num cookie httpOnly
    // no domínio do site, sem nunca expor o token ao navegador.
    const res = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-sand px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-organic bg-bg p-8 shadow-soft">
        <p className="text-center font-display text-2xl text-brand-800">Reflorescer</p>
        <p className="mt-1 text-center text-sm text-brand-400">Painel administrativo</p>

        <div className="mt-8 space-y-4">
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </main>
  );
}
