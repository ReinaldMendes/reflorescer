"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Painel de vidro com reflexo de luz atravessando periodicamente
// (.glass-shimmer, definida em globals.css) — a foto real, quando
// disponível, fica dentro do próprio vidro, não como fundo de página.
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
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-section-y lg:grid-cols-2 lg:gap-16 lg:py-section-y-lg lg:px-12">
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`glass glass-shimmer relative aspect-[4/5] overflow-hidden rounded-glass p-8 ${reverse ? "lg:order-2" : ""}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-organic">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">{eyebrow}</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">{title}</h2>
        <div className="mt-6 space-y-4 text-body font-light text-brand-500">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
