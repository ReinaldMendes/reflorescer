import Link from "next/link";
import { listExperiences } from "@/lib/api-client";

export default async function ExperiencesIndexPage() {
  const experiences = await listExperiences();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">Descubra</p>
        <h1 className="mt-4 font-display text-display-lg text-brand-800">
          Qual travessia você deseja <em className="italic text-gold-deep">viver</em> hoje?
        </h1>
      </div>

      {experiences.length > 0 ? (
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {experiences.map((exp: any) => (
            <Link
              key={exp.id}
              href={`/experiencias/${exp.slug}`}
              className="glass glass-hover inline-block rounded-full px-7 py-3.5 text-brand-700 transition-colors hover:border-gold-deep"
            >
              {exp.title}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-brand-400">
          Nossas travessias estão sendo preparadas com carinho. Volte em breve.
        </p>
      )}
    </main>
  );
}
