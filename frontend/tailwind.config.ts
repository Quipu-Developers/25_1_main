import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js 13+ App Router
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // 재사용 가능한 컴포넌트
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}", // 커스텀 훅 (필요할 경우)
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}", // 라이브러리 유틸 (필요할 경우)
    "./public/fonts/fonts.ts",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        spoqaHanSansNeo: ["var(--font-spoqaHanSansNeo)", "sans-serif"],
        firaCode: ["var(--font-fira-code)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
