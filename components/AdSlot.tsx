"use client";

import { useEffect } from "react";

// 카카오 애드핏(AdFit) 광고 슬롯 (크기 지정 가능).
//   - 광고 단위 ID(unit)가 env로 주입되면 실제 광고를 렌더.
//   - 심사 전(미설정)이면 자리만 잡아두는 플레이스홀더 박스를 노출한다.

export default function AdSlot({
  unit,
  width = 320,
  height = 100,
}: {
  unit?: string;
  width?: number;
  height?: number;
}) {
  useEffect(() => {
    if (!unit || typeof window === "undefined") return;
    const existing = document.querySelector(
      'script[src*="t1.daumcdn.net/kas/static/ba.min.js"]',
    );
    if (existing) return;
    const s = document.createElement("script");
    s.src = "https://t1.daumcdn.net/kas/static/ba.min.js";
    s.async = true;
    document.body.appendChild(s);
  }, [unit]);

  // 심사 전: 플레이스홀더
  if (!unit) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/50 bg-white/25 text-white/70"
        style={{ width, height }}
        aria-hidden
      >
        <span className="text-xs font-semibold">광고</span>
        <span className="mt-0.5 text-[10px]">준비 중이에요</span>
      </div>
    );
  }

  // 심사 후: 실제 애드핏 광고
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={unit}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
    />
  );
}
