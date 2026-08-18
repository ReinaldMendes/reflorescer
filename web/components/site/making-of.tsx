"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function MakingOf({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">O Fazer Artesanal</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">
          Um cuidado que começa <em className="italic text-gold-deep">antes</em> do frasco
        </h2>
        <p className="mt-4 font-light text-body text-brand-500">
          Cada produto Reflorescer nasce de um processo lento: a escolha da matéria-prima, o tempo de preparo, o
          cuidado no detalhe final.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {images.map((img, i) => (
          <motion.div
            key={img.url}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`glass glass-hover overflow-hidden rounded-glass p-2 ${
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-organic">
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
