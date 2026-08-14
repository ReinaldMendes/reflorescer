"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description?: string | null;
}

export function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 max-w-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Explore</p>
        <h2 className="mt-4 font-display text-display-md text-brand-800">Encontre o seu momento</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/categoria/${category.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-organic bg-brand-100">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-organic ease-organic group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-800/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-bg">
                  <p className="font-display text-xl">{category.name}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
