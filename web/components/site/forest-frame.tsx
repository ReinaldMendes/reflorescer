"use client";

import { motion } from "framer-motion";

// Árvores em silhueta emoldurando o portal do Hero — reforçam a ambientação
// de floresta sem virar clipart: formas simples (coníferas estilizadas),
// duas camadas de profundidade (fundo mais escuro e distante, primeiro
// plano mais próximo com um leve rim-light dourado para casar com a luz
// do vidro etéreo já usada no resto do Hero). Puramente decorativo.
export function ForestFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Camada de fundo — mais escura, mais afastada */}
      <motion.svg
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 0.45, x: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-10 bottom-0 h-[46%] w-auto max-w-[22vw]"
        viewBox="0 0 200 320"
        fill="none"
      >
        <rect x="92" y="260" width="16" height="60" fill="#2B3428" />
        <path d="M100 40 L150 150 L125 150 L165 220 L135 220 L175 270 L25 270 L65 220 L35 220 L75 150 L50 150 Z" fill="#2B3428" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-12 bottom-0 h-[42%] w-auto max-w-[20vw]"
        viewBox="0 0 200 320"
        fill="none"
      >
        <rect x="92" y="260" width="16" height="60" fill="#2B3428" />
        <path d="M100 60 L145 155 L122 155 L158 215 L132 215 L168 265 L32 265 L68 215 L42 215 L78 155 L55 155 Z" fill="#2B3428" />
      </motion.svg>

      {/* Camada de primeiro plano — emoldura o portal, com rim-light dourado sutil */}
      <motion.svg
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-4 bottom-0 h-[56%] w-auto max-w-[26vw]"
        viewBox="0 0 220 360"
        fill="none"
      >
        <defs>
          <linearGradient id="forestLeftGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C9A876" stopOpacity="0.35" />
            <stop offset="1" stopColor="#4F5C48" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="98" y="300" width="20" height="60" fill="#3A4534" />
        <path d="M108 30 L165 165 L138 165 L182 240 L150 240 L195 300 L20 300 L65 240 L33 240 L77 165 L50 165 Z" fill="#3A4534" />
        <path d="M108 30 L165 165 L138 165 L182 240 L150 240 L195 300 L20 300 L65 240 L33 240 L77 165 L50 165 Z" fill="url(#forestLeftGlow)" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-6 bottom-0 h-[52%] w-auto max-w-[26vw]"
        viewBox="0 0 220 360"
        fill="none"
      >
        <defs>
          <linearGradient id="forestRightGlow" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#C9A876" stopOpacity="0.35" />
            <stop offset="1" stopColor="#4F5C48" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="102" y="300" width="20" height="60" fill="#3A4534" />
        <path d="M112 45 L172 170 L143 170 L188 235 L155 235 L200 295 L25 295 L70 235 L37 235 L82 170 L52 170 Z" fill="#3A4534" />
        <path d="M112 45 L172 170 L143 170 L188 235 L155 235 L200 295 L25 295 L70 235 L37 235 L82 170 L52 170 Z" fill="url(#forestRightGlow)" />
      </motion.svg>
    </div>
  );
}
