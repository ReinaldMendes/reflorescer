import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa essência",
  description: "A história por trás da Reflorescer Artesanal Natural.",
};

// Página "Sobre" desenhada como narrativa, não como bloco institucional
// genérico — retrato da fundadora emoldurado em vidro dourado (em vez de
// esticado como banner), texto pausado, seção final de valores.
export default function SobrePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 pb-20 pt-32 lg:px-12 lg:pb-28 lg:pt-40">
        {/* Halo ambiente, discreto — mantém a paleta pérola/dourada do site
            sem competir com o retrato. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 15% 15%, rgba(201,168,118,0.16), transparent 60%), radial-gradient(ellipse 50% 45% at 88% 85%, rgba(124,143,115,0.14), transparent 60%)",
          }}
        />

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center lg:flex-row lg:gap-16 lg:text-left">
          {/* Retrato — moldura circular de vidro com halo dourado, mesma
              linguagem "vidro etéreo" do resto do site. */}
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(201,168,118,0.4), transparent 70%)" }}
            />
            <div className="glass relative h-60 w-60 rounded-full p-2 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="/images/proprietaria-gislaine.jpg"
                  alt="Gislaine Campos, terapeuta holística e fundadora da Reflorescer"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/45" />
            </div>
          </div>

          {/* Texto de apresentação */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">Nossa essência</p>
            <h1 className="mt-3 font-display text-display-lg text-brand-800">
              A história por trás de cada frasco
            </h1>
            <p className="mt-6 font-display text-2xl italic text-brand-800">Gislaine Campos</p>
            <p className="mt-1 text-sm uppercase tracking-[0.15em] text-brand-400">
              Terapeuta Holística &middot; Fundadora da Reflorescer
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 py-section-y text-body text-brand-600 lg:py-section-y-lg">
        <p className="font-display text-2xl italic text-brand-800">
          &ldquo;Há cuidados que ultrapassam a pele. Chegam aos sentidos, atravessam a rotina e nos convidam a
          voltar para nós mesmos.&rdquo;
        </p>
        <p className="text-right text-sm uppercase tracking-[0.15em] text-brand-400">— Gislaine Campos</p>
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
