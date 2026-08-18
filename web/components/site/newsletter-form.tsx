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
    <section className="relative overflow-hidden py-section-y text-center lg:py-section-y-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(201,168,118,0.16), transparent 65%)" }}
      />

      <div className="mx-auto max-w-xl px-6 lg:px-12">
        <p className="font-display text-display-md text-brand-800">
          Receba um pouco de <em className="italic text-gold-deep">Reflorescer</em>
        </p>
        <p className="mt-4 font-light text-brand-500">
          Novidades, bastidores do fazer artesanal e reflexões do nosso Diário — direto na sua caixa de entrada.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Input
            type="email"
            required
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass flex-1 rounded-full border-white/70 bg-white/40"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Enviando..." : "Quero receber"}
          </Button>
        </form>

        {message && (
          <p className={`mt-3 text-sm ${status === "error" ? "text-red-500" : "text-brand-500"}`}>{message}</p>
        )}
      </div>
    </section>
  );
}
