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
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
