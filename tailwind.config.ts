import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Y2K / 스티커 감성 비비드 팔레트 (Phase 3에서 본격 활용)
        chemi: {
          pink: "#ff5db1",
          purple: "#a855f7",
          violet: "#7c3aed",
        },
        // shadcn 계열 테마 토큰 (EDEN 표준 푸터 등에서 사용)
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
