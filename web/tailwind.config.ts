import type { Config } from "tailwindcss";

// ============================================================================
// REFLORESCER ARTESANAL NATURAL — Design System "Vidro Etéreo"
// Luz, vidro fosco e flutuação. Regra de uso: pérola dominante, dourado como
// luz/acento, sálvia como acento secundário. Superfícies translúcidas
// (bg-white/40 + backdrop-blur) em vez de cards sólidos com sombra pesada.
// ============================================================================

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base — pérola luminosa, dominante no site
        bg: {
          DEFAULT: "#FBF9F4", // pérola
          sand: "#F3EEE2",    // pérola profunda — fundos alternados de seção
        },
        // Verde Reflorescer — mantido como acento secundário (sálvia)
        brand: {
          50: "#F1F3EF",
          100: "#DCE2D8",
          200: "#BAC5B6",
          300: "#93A38C",
          400: "#7C8F73",
          500: "#586A52",
          600: "#4F5C48", // sálvia profundo — usado com moderação
          700: "#3A4534",
          800: "#2B3428", // ink — texto principal
          900: "#1B2117",
        },
        // Dourado — a "luz" do vidro etéreo. Substitui a argila como acento
        // principal de destaque (CTAs em vidro, ícones, itálicos de título).
        gold: {
          pale: "#E8D9B8",
          DEFAULT: "#C9A876",
          deep: "#A8874F",
        },
        clay: {
          DEFAULT: "#765542",
          light: "#9C7C68",
          dark: "#573F31",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.06", letterSpacing: "-0.01em", fontWeight: "300" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "300" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", fontWeight: "300" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
      },
      spacing: {
        "section-y": "6rem",
        "section-y-lg": "8rem",
      },
      borderRadius: {
        organic: "0.875rem", // 14px — vidro tende a cantos um pouco mais suaves
        glass: "1.5rem",     // 24px — painéis grandes de vidro
      },
      boxShadow: {
        soft: "0 2px 24px -8px rgba(43, 52, 40, 0.08)",
        // Sombra + glow dourado — a "luz" saindo de trás do vidro
        glass: "0 10px 40px -16px rgba(201, 168, 118, 0.28), inset 0 1px 0 rgba(255,255,255,0.5)",
        "glass-lg": "0 20px 60px -20px rgba(201, 168, 118, 0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-hover": "0 24px 60px -14px rgba(201, 168, 118, 0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
      },
      backdropBlur: {
        glass: "20px",
      },
      transitionDuration: {
        organic: "600ms",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "portal-breathe": {
          "0%, 100%": { transform: "translate(-50%, -52%) scale(1)", opacity: "1" },
          "50%": { transform: "translate(-50%, -52%) scale(1.05)", opacity: "0.85" },
        },
        "spin-slow": {
          from: { transform: "translate(-50%, -52%) rotate(0deg)" },
          to: { transform: "translate(-50%, -52%) rotate(360deg)" },
        },
        "spin-slow-reverse": {
          from: { transform: "translate(-50%, -52%) rotate(360deg)" },
          to: { transform: "translate(-50%, -52%) rotate(0deg)" },
        },
        shimmer: {
          "0%, 100%": { transform: "translateX(-30%)", opacity: "0" },
          "50%": { transform: "translateX(160%)", opacity: "1" },
        },
        "drift-a": {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(14px, -22px)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(-18px, 16px)" },
        },
        "pulse-line": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float: "float 8s ease-in-out infinite",
        "portal-breathe": "portal-breathe 9s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 90s linear infinite",
        shimmer: "shimmer 7s ease-in-out infinite",
        "drift-a": "drift-a 14s ease-in-out infinite",
        "drift-b": "drift-b 18s ease-in-out infinite",
        "pulse-line": "pulse-line 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
