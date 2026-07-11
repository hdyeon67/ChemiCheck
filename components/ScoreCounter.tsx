"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 2000; // 0 → 최종점수 2초
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ScoreCounter({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // 모션 최소화 선호 시 즉시 최종 점수 표시
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(score);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setDisplay(Math.round(easeOutCubic(t) * score));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    // 안전망: 백그라운드 탭 등으로 rAF 가 멈춰도 최종 점수는 보장
    const safety = window.setTimeout(() => setDisplay(score), DURATION + 100);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.clearTimeout(safety);
    };
  }, [score]);

  // 원형 프로그레스 링
  const R = 76;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - display / 100);

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90">
        <circle cx="88" cy="88" r={R} fill="none" stroke="#f0e4fb" strokeWidth="14" />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5db1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <circle
          cx="88"
          cy="88"
          r={R}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="bg-gradient-to-r from-chemi-pink to-chemi-violet bg-clip-text text-6xl font-black text-transparent tabular-nums">
          {display}
        </span>
        <span className="text-sm font-bold text-gray-400">/ 100</span>
      </div>
    </div>
  );
}
