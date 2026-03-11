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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#155EF2",
          50: "#eff4fe",
          100: "#e0e9fd",
          200: "#c7d6fc",
          300: "#a0bafc",
          400: "#7598f8",
          500: "#5275f4",
          600: "#3650ea",
          700: "#223ad8",
          800: "#2333b2",
          900: "#222f8e",
        },
      },
      borderRadius: {
        xl: "1.25rem", // 20px
        lg: "1.125rem", // 18px
      }
    },
  },
  plugins: [],
};
export default config;
