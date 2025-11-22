// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#222222",
        cyan: {
          glow: "rgba(0, 217, 255, 0.25)",
        },
      },
      perspective: {
        "1000": "1000px",
      },
      animation: {
        "matrix-rain": "matrix-rain 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 5s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        "pulse-slower": "pulse-slower 10s ease-in-out infinite",
      },
      keyframes: {
        "matrix-rain": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-glow": {
          from: { boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)" },
          to: { boxShadow: "0 0 40px rgba(59, 130, 246, 1)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 217, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 217, 255, 0.4)" },
        },
        "spin-cyan": {
          to: { transform: "rotate(360deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.5" },
        },
        "pulse-slower": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.4" },
        },
      },

      // animation: {
      //   "float-slow": "float-slow 6s ease-in-out infinite",
      //   "float-medium": "float-medium 5s ease-in-out infinite",
      //   "float-fast": "float-fast 4s ease-in-out infinite",
      //   "pulse-slow": "pulse-slow 8s ease-in-out infinite",
      //   "pulse-slower": "pulse-slower 10s ease-in-out infinite",
      // },

      backdropBlur: {
        xs: "2px",
        xl: "40px",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [],
};
export default config;
