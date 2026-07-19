"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * 결과 페이지 진입 계측 (result_view). 서버 컴포넌트인 ResultView 안에서
 * 마운트되어 관계(category)·점수 구간(score_band)만 전송한다. 렌더 출력 없음.
 */
export function ResultTracker({
  category,
  scoreBand,
}: {
  category: string;
  scoreBand: string;
}) {
  useEffect(() => {
    track("result_view", { category, score_band: scoreBand });
  }, [category, scoreBand]);
  return null;
}
