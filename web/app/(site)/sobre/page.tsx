import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa essência",
  description: "A história por trás da Reflorescer Artesanal Natural.",
};

// Página "Sobre" desenhada como narrativa, não como bloco institucional
// genérico — imagem grande, texto pausado, seção final de valores.
export default function SobrePage() {
  return (
    <main>
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <Image src="/images/sobre-hero.jpg" alt="Proprietária da Reflorescer" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-800/70 to-transparent" />
        <div className="absolute bottom-12 left-6 text-bg lg:left-12">
          <p className="text-sm uppercase tracking-[0.2em]">Nossa essência</p>
          <h1 className="mt-3 font-display text-display-lg">A história por trás de cada frasco</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 py-section-y text-body text-brand-600 lg:py-section-y-lg">
        <p className="font-display text-2xl italic text-brand-800">
          &ldquo;Há cuidados que ultrapassam a pele. Chegam aos sentidos, atravessam a rotina e nos convidam a
          voltar para nós mesmos.&rdquo;
        </p>
        <p>
          [Espaço reservado para a história real da proprietária: como a Reflorescer surgiu, o que motivou a
          criação da marca, a relação pessoal com a natureza e o significado do nome &ldquo;Reflorescer&rdquo;.
          Este texto deve ser escrito com base nas informações reais fornecidas, e pode ser editado a qualquer
          momento pelo painel administrativo, na seção &ldquo;Conteúdo institucional&rdquo;.]
        </p>
        <p>
          Cada criação nasce de um processo lento e intencional — da escolha da matéria-prima ao detalhe final
          da embalagem. Não buscamos apenas vender produtos: buscamos transformar um instante comum em um
          momento de presença.
        </p>
      </section>

      <section className="bg-bg-sand py-section-y lg:py-section-y-lg">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 lg:grid-cols-3 lg:px-12">
          {[
            { title: "Natureza", text: "Matéria-prima escolhida com respeito aos ciclos naturais." },
            { title: "Artesania", text: "Tempo dedicado ao fazer manual, sem pressa, sem atalhos." },
            { title: "Presença", text: "Produtos pensados para momentos de cuidado e contemplação." },
          ].map((v) => (
            <div key={v.title}>
              <p className="font-display text-xl text-brand-800">{v.title}</p>
              <p className="mt-2 text-sm text-brand-500">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
