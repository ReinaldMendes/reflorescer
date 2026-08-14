import { notFound } from "next/navigation";

const POLICIES: Record<string, { title: string; content: string }> = {
  "trocas-e-devolucoes": {
    title: "Trocas e devoluções",
    content: "Detalhes sobre o prazo e processo de trocas e devoluções serão publicados aqui pelo painel administrativo.",
  },
  privacidade: {
    title: "Política de privacidade",
    content: "Detalhes sobre o tratamento de dados pessoais serão publicados aqui pelo painel administrativo.",
  },
  termos: {
    title: "Termos de uso",
    content: "Termos de uso da loja Reflorescer Artesanal Natural, editáveis pelo painel administrativo.",
  },
};

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = POLICIES[params.slug];
  if (!policy) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-display-md text-brand-800">{policy.title}</h1>
      <p className="mt-6 text-body text-brand-600">{policy.content}</p>
    </main>
  );
}
