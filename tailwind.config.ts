import type { Config } from "tailwindcss";

// ============================================================================
// REFLORESCER ARTESANAL NATURAL — Design System
// Tokens extraídos da identidade visual da marca (logo + embalagens).
// Regra de uso: ~80% off-white/areia, ~15% verdes, ~5% argila/marrom.
// Nunca preencher seções inteiras com brand-500 sólido — usar como acento.
// ============================================================================

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base — dominante no site
        bg: {
          DEFAULT: "#F7F5EE", // off-white natural
          sand: "#E8E2D2",    // areia — fundos alternados de seção
        },
        // Verde Reflorescer — acento, nunca fundo dominante
        brand: {
          50: "#F1F3EF",
          100: "#DCE2D8",
          200: "#BAC5B6", // verde claro
          300: "#93A38C",
          400: "#6E8265",
          500: "#586A52", // verde sálvia — texto secundário / hover
          600: "#43573C", // verde Reflorescer — CTA / links / logo
          700: "#334430",
          800: "#1E2521", // verde profundo — texto principal / rodapé
          900: "#141813",
        },
        // Argila — acento pontual (badges, detalhes)
        clay: {
          DEFAULT: "#765542",
          light: "#9C7C68",
          dark: "#573F31",
        },
      },
      fontFamily: {
        // Títulos/editorial — serifada com personalidade
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        // Corpo de texto — sans-serif neutra e legível
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Uso muito pontual — assinaturas, pequenos destaques
        script: ["var(--font-script)", "cursive"],
      },
      fontSize: {
        // Escala editorial — títulos de hero fluidos via clamp()
        "display-xl": ["clamp(2.75rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
      },
      spacing: {
        // Espaçamento generoso para seções — "o site precisa respirar"
        "section-y": "6rem",      // py-24 mobile
        "section-y-lg": "8rem",   // py-32 desktop
      },
      borderRadius: {
        organic: "0.75rem", // 12px — arredondado suave, nunca rounded-full em cards
      },
      boxShadow: {
        // Sombra quase imperceptível — nunca sombra "de card de app"
        soft: "0 2px 24px -8px rgba(30, 37, 33, 0.08)",
      },
      transitionDuration: {
        organic: "600ms",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.22, 1, 0.36, 1)", // easing suave, sem bounce
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
