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
        scholarly: {
          navy: "#00263E",
          deep: "#001B2E",
          blue: "#007398",
          sky: "#00A3D9",
          orange: "#E25822",
          paper: "#FAF9F6",
          parchment: "#F8FAFC",
          border: "#D1D5DB",
          borderMuted: "#E5E7EB",
          text: "#1E293B",
          textMuted: "#64748B",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Lora", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
