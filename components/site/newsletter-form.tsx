"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setMessage("Obrigada por se juntar a nós. Em breve você recebe um pouco de Reflorescer.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Não foi possível concluir o cadastro. Tente novamente.");
    }
  }

  return (
    <section className="bg-brand-800 py-section-y text-bg lg:py-section-y-lg">
      <div className="mx-auto max-w-xl px-6 text-center lg:px-12">
        <p className="font-display text-display-md">Receba um pouco de Reflorescer</p>
        <p className="mt-4 text-brand-100">
          Novidades, bastidores do fazer artesanal e reflexões do nosso Diário — direto na sua caixa de entrada.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-bg"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Enviando..." : "Quero receber"}
          </Button>
        </form>

        {message && (
          <p className={`mt-3 text-sm ${status === "error" ? "text-red-300" : "text-brand-100"}`}>{message}</p>
        )}
      </div>
    </section>
  );
}
