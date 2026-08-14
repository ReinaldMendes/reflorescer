"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Seção "Um convite para Reflorescer" — deliberadamente composta como
// página de revista, não como bloco tradicional de e-commerce: imagem
// grande de um lado, texto pausado do outro, muito espaço em branco.
export function EditorialSection({
  eyebrow = "Um convite para Reflorescer",
  title,
  paragraphs,
  imageUrl,
  reverse = false,
}: {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-section-y lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-section-y-lg">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative aspect-[4/5] overflow-hidden rounded-organic ${reverse ? "lg:order-2" : ""}`}
      >
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-brand-500">{eyebrow}</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">{title}</h2>
        <div className="mt-6 space-y-4 text-body text-brand-500">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
