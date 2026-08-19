"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Hero "portal de luz" — a pessoa acessa a loja e vai literalmente entrando
// na floresta: a fotografia real ocupa o fundo inteiro, com um lento
// zoom-avanço (Ken Burns) simulando o movimento de caminhar mata adentro,
// vista por trás de um véu de vidro fosco (a mesma linguagem "vidro etéreo"
// usada no resto do site). O portal de luz — anéis girando + círculo que
// respira — continua no centro, como a passagem que a pessoa atravessa.
export function Hero({
  imageUrl = "/images/hero-floresta.jpg",
  title = "Reflorescer",
  subtitle = "Natureza, arte e cuidado transformados em experiências que atravessam os sentidos.",
}: {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative flex min-h-[96vh] items-center justify-center overflow-hidden px-6 pb-16 pt-20 text-center">
      {/* Fundo: a floresta real, entrando em foco e avançando lentamente —
          sensação de estar caminhando para dentro da mata. */}
      <motion.div
        className="absolute inset-0 -z-30"
        initial={{ scale: 1.22, opacity: 0 }}
        animate={{ scale: 1.06, opacity: 1 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3.2 }}
        >
          <Image
            src={imageUrl}
            alt="Trilha entre árvores e um riacho na floresta Reflorescer"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Véu de vidro fosco sobre a fotografia — funde a mata real com a
          paleta pérola/dourada do site (em vez de deixar a foto crua) e
          garante legibilidade do texto, como olhar a floresta através de
          uma porta de vidro embaçado. */}
      <div className="absolute inset-0 -z-20 backdrop-blur-[3px]" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-bg/85 via-bg/30 to-bg/90" />
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 46%, transparent 0%, rgba(43,52,40,0.18) 100%)",
        }}
      />

      {/* Portal: anéis concêntricos girando + círculo de luz respirando */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-[52%] animate-spin-slow-reverse rounded-full border border-brand-300/25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-[52%] animate-spin-slow rounded-full border border-gold/35" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-[52%] animate-portal-breathe rounded-full blur-[1px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(232,217,184,0.5) 35%, rgba(201,168,118,0.12) 60%, transparent 75%)",
        }}
      />

      {/* Constelação sutil — geometria abstrata, não símbolo literal */}
      <svg
        aria-hidden="true"
        viewBox="0 0 620 620"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-[52%] opacity-55"
      >
        <g stroke="rgba(201,168,118,0.4)" strokeWidth="0.6" fill="none">
          <line x1="120" y1="140" x2="230" y2="90" />
          <line x1="230" y1="90" x2="380" y2="120" />
          <line x1="380" y1="120" x2="480" y2="220" />
          <line x1="120" y1="140" x2="90" y2="280" />
          <line x1="480" y1="220" x2="520" y2="380" />
          <line x1="90" y1="280" x2="140" y2="470" />
          <line x1="140" y1="470" x2="290" y2="540" />
          <line x1="290" y1="540" x2="440" y2="480" />
          <line x1="440" y1="480" x2="520" y2="380" />
        </g>
        <g fill="rgba(201,168,118,0.55)">
          <circle cx="120" cy="140" r="2.2" />
          <circle cx="230" cy="90" r="1.6" />
          <circle cx="380" cy="120" r="2" />
          <circle cx="480" cy="220" r="1.8" />
          <circle cx="90" cy="280" r="1.6" />
          <circle cx="520" cy="380" r="2.2" />
          <circle cx="140" cy="470" r="1.8" />
          <circle cx="290" cy="540" r="1.6" />
          <circle cx="440" cy="480" r="2" />
        </g>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-xl"
      >
        <span className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-[0.28em] text-gold-deep">
          Um portal para o cuidado
        </span>

        <h1 className="mt-7 font-display text-display-xl text-brand-800">
          {title}
          <br />
          <em className="italic text-gold-deep">além do véu.</em>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-lg font-light text-brand-500">{subtitle}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/produtos"
            className={cn(
              "glass glass-hover rounded-full px-9 py-4 text-sm font-medium tracking-wide text-brand-800"
            )}
          >
            Atravesse o portal
          </Link>
          <Link
            href="/sobre"
            className="rounded-full border border-brand-800/25 px-9 py-4 text-sm font-medium tracking-wide text-brand-500 transition-colors duration-500 hover:border-gold-deep hover:text-gold-deep"
          >
            Nossa essência
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-brand-400">
        <span>Role</span>
        <span className="h-9 w-px animate-pulse-line bg-gradient-to-b from-gold-deep to-transparent" />
      </div>
    </section>
  );
}
