import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Mitcrux Brand Palette (derived from mitcrux.com inspection)
        brand: {
          50:  "#e8f1fb",
          100: "#d0e3f7",
          200: "#a1c7ef",
          300: "#72abe7",
          400: "#438fdf",
          500: "#1a72d7",  // primary action blue
          600: "#1a56a0",  // brand deep blue (hero/headers)
          700: "#144282",  // dark blue
          800: "#0d2d5c",  // darkest brand
          900: "#071a38",
        },
        cyan: {
          400: "#22d3ee",
          500: "#00b4d8",  // accent cyan
          600: "#0891b2",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#0f1a2e",   // dark card
          900: "#080f1e",   // dark page bg
          950: "#040a14",   // darkest bg
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      spacing: {
        "18":  "4.5rem",
        "22":  "5.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(rgba(26,86,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,160,0.07) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      animation: {
        "float":        "float 6s ease-in-out infinite",
        "pulse-slow":   "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":    "spin 12s linear infinite",
        "shimmer":      "shimmer 2.5s linear infinite",
        "marquee":      "marquee 30s linear infinite",
        "marquee2":     "marquee2 30s linear infinite",
        "glow-pulse":   "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee2: {
          "0%":   { transform: "translateX(50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(26,114,215,0.3), 0 0 60px rgba(0,180,216,0.1)" },
          "50%":      { boxShadow: "0 0 40px rgba(26,114,215,0.6), 0 0 80px rgba(0,180,216,0.3)" },
        },
      },
      boxShadow: {
        "brand-sm":  "0 2px 8px rgba(26,86,160,0.15)",
        "brand-md":  "0 4px 24px rgba(26,86,160,0.25)",
        "brand-lg":  "0 8px 48px rgba(26,86,160,0.35)",
        "brand-xl":  "0 16px 72px rgba(26,86,160,0.45)",
        "glow-cyan": "0 0 30px rgba(0,180,216,0.5)",
        "glow-blue": "0 0 30px rgba(26,114,215,0.5)",
        "card":      "0 1px 3px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)",
        "card-dark": "0 1px 3px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)",
      },
      transitionTimingFunction: {
        "spring":  "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth":  "cubic-bezier(0.4, 0, 0.2, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        "expo-out":"cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
