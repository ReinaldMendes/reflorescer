"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ExperienceItem {
  id: string;
  title: string;
  slug: string;
}

export function ExperiencePicker({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section className="relative overflow-hidden py-section-y lg:py-section-y-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(124,143,115,0.14), transparent 65%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">Descubra</p>
          <h2 className="mt-4 font-display text-display-md text-brand-800">
            Qual travessia você deseja <em className="italic text-gold-deep">viver</em> hoje?
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
                className="glass glass-hover inline-block rounded-full px-7 py-3.5 text-brand-700 transition-colors hover:border-gold-deep"
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
