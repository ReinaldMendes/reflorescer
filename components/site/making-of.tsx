"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// "O Fazer Artesanal" — mostra que existe uma pessoa e um processo por
// trás de cada produto. Galeria assimétrica, sem grid rígido de cards.
export function MakingOf({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 max-w-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-500">O Fazer Artesanal</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">
          Um cuidado que começa muito antes do frasco
        </h2>
        <p className="mt-4 text-body text-brand-500">
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
            className={`relative overflow-hidden rounded-organic bg-brand-100 ${
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            }`}
          >
            <Image src={img.url} alt={img.alt} fill className="object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
