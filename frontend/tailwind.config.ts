import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/fonts/fonts.ts",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        point: "var(--point)",
      },
      fontFamily: {
        spoqaHanSansNeo: ["var(--font-spoqaHanSansNeo)", "sans-serif"],
        firaCode: ["var(--font-fira-code)", "monospace"],
      },
      height: {
        screen: "100dvh",
      },
      minHeight: {
        screen: "100dvh",
      },
      maxHeight: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
} satisfies Config;
