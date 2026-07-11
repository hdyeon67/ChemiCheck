// 점수 → 구간(band) 변환 + 등급 뱃지
//
// 7단계 구간: 0-29 / 30-44 / 45-59 / 60-69 / 70-79 / 80-89 / 90-100

import type { BandIndex } from "./types";

/** 각 구간의 [최소, 최대] 경계 (index 0~6) */
export const BAND_RANGES: [number, number][] = [
  [0, 29],
  [30, 44],
  [45, 59],
  [60, 69],
  [70, 79],
  [80, 89],
  [90, 100],
];

/** 구간별 등급 뱃지 */
export const BADGES: string[] = [
  "환승준비", // 0-29
  "노력형", // 30-44
  "밀당중", // 45-59
  "무난케미", // 60-69
  "찰떡", // 70-79
  "꿀케미", // 80-89
  "운명급", // 90-100
];

/** 점수(0~100) → 구간 index */
export function scoreToBand(score: number): BandIndex {
  const s = Math.max(0, Math.min(100, score));
  for (let i = 0; i < BAND_RANGES.length; i++) {
    if (s <= BAND_RANGES[i][1]) return i as BandIndex;
  }
  return 6;
}

/** 점수 → 등급 뱃지 */
export function scoreToBadge(score: number): string {
  return BADGES[scoreToBand(score)];
}
