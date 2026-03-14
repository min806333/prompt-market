import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dce7ff",
          200: "#bdd0ff",
          300: "#92aeff",
          400: "#6680ff",
          500: "#4f60f5",
          600: "#3d45ea",
          700: "#3235ce",
          800: "#2b2ea6",
          900: "#292e83",
          950: "#191b4c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
