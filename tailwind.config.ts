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
      },
      perspective: {
        "1000": "1000px",
      },
      animation: {
        "matrix-rain": "matrix-rain 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
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
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [],
};
export default config;
