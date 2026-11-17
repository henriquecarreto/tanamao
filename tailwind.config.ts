import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amber: "#F59E0B",
          amberHover: "#D97706",
          dark: "#0F172A",
          darkLight: "#1E293B",
          light: "#F8FAFC",
          muted: "#64748B",
          whatsapp: "#16A34A",
          whatsappHover: "#15803D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
