"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ExperienceItem {
  id: string;
  title: string;
  slug: string;
}

// "Qual experiência você deseja viver hoje?" — transforma o catálogo em
// descoberta guiada por intenção, não apenas em navegação por categoria.
export function ExperiencePicker({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section className="bg-bg-sand py-section-y lg:py-section-y-lg">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Descubra</p>
          <h2 className="mt-4 font-display text-display-md text-brand-800">
            Qual experiência você deseja viver hoje?
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                href={`/experiencias/${exp.slug}`}
                className="inline-block rounded-full border border-brand-200 bg-bg px-6 py-3 text-brand-700 transition-colors duration-300 hover:border-brand-600 hover:bg-brand-600 hover:text-bg"
              >
                {exp.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
