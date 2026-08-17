"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero({
  imageUrl,
  title = "Reflorescer.",
  subtitle = "Natureza, arte e cuidado transformados em experiências.",
}: {
  imageUrl: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image src={imageUrl} alt="Reflorescer Artesanal Natural" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-800/60 via-brand-800/10 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 text-bg lg:px-12"
      >
        <h1 className="font-display text-display-xl">{title}</h1>
        <p className="mt-4 max-w-md font-sans text-lg text-bg/90">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/produtos"
            className={cn(
              "inline-flex items-center justify-center rounded-organic bg-brand-600 px-8 py-4 text-lg font-medium text-bg transition-colors duration-organic ease-organic hover:bg-brand-800"
            )}
          >
            Conheça nossos produtos
          </Link>
          <Link
            href="/sobre"
            className={cn(
              "inline-flex items-center justify-center rounded-organic border border-bg px-8 py-4 text-lg font-medium text-bg transition-colors duration-organic ease-organic hover:bg-bg hover:text-brand-800"
            )}
          >
            Nossa essência
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
