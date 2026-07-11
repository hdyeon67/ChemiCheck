// 띠·별자리 보정 (가중치 20%)
//   - 12지지 띠 궁합: 삼합/육합(높음), 충(낮음), 동일(중간+), 그 외(중간)
//   - 별자리 원소 궁합: 불/흙/공기/물 원소 간 상성 보정

import type { Jiji, Element } from "./types";

/** 12지지 순서 (자=0) */
export const JIJI_ORDER: Jiji[] = [
  "자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해",
];

/** 생년 → 연지(띠) index. 서기 4년 = 자(쥐) 기준 */
export function ttiIndex(year: number): number {
  return (((year - 4) % 12) + 12) % 12;
}

export function ttiJiji(year: number): Jiji {
  return JIJI_ORDER[ttiIndex(year)];
}

// 삼합(三合): 같은 局 3지지끼리 강한 상성
const SAMHAP: number[][] = [
  [8, 0, 4], // 신자진 수국
  [2, 6, 10], // 인오술 화국
  [5, 9, 1], // 사유축 금국
  [11, 3, 7], // 해묘미 목국
];

// 육합(六合): 짝 상성
const YUKHAP: [number, number][] = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
];

function inSameSamhap(a: number, b: number): boolean {
  return SAMHAP.some((g) => g.includes(a) && g.includes(b));
}

function isYukhap(a: number, b: number): boolean {
  return YUKHAP.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function isChung(a: number, b: number): boolean {
  // 충: 정반대(6칸 차이)
  return (Math.abs(a - b) === 6);
}

/** 두 띠 index 의 궁합 점수 (0~100) */
export function ttiScore(a: number, b: number): number {
  if (a === b) return 72; // 동일 띠: 중간+
  if (isYukhap(a, b)) return 92; // 육합: 최고 상성
  if (inSameSamhap(a, b)) return 85; // 삼합: 높은 상성
  if (isChung(a, b)) return 35; // 충: 낮은 상성
  return 60; // 그 외: 중간
}

// ── 별자리 원소 ──────────────────────────────────────────────

/** 월/일 → 별자리 원소 */
export function elementOf(month: number, day: number): Element {
  // (월, 시작일) 이 별자리 시작 기준. 아래 표에서 해당 구간 원소 반환.
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return "불"; // 양자리
  if (md >= 420 && md <= 520) return "흙"; // 황소
  if (md >= 521 && md <= 621) return "공기"; // 쌍둥이
  if (md >= 622 && md <= 722) return "물"; // 게
  if (md >= 723 && md <= 822) return "불"; // 사자
  if (md >= 823 && md <= 922) return "흙"; // 처녀
  if (md >= 923 && md <= 1022) return "공기"; // 천칭
  if (md >= 1023 && md <= 1122) return "물"; // 전갈
  if (md >= 1123 && md <= 1221) return "불"; // 사수
  if (md >= 1222 || md <= 119) return "흙"; // 염소
  if (md >= 120 && md <= 218) return "공기"; // 물병
  return "물"; // 물고기 (2/19 ~ 3/20)
}

const ELEM_IDX: Record<Element, number> = { 불: 0, 흙: 1, 공기: 2, 물: 3 };

// 상성 쌍: 불-공기, 흙-물 / 상충 쌍: 불-물, 흙-공기
function elementPairScore(a: Element, b: Element): number {
  if (a === b) return 78; // 같은 원소: 안정적
  const key = [ELEM_IDX[a], ELEM_IDX[b]].sort((x, y) => x - y).join("-");
  const harmonious = new Set(["0-2", "1-3"]); // 불-공기, 흙-물
  const clashing = new Set(["0-3", "1-2"]); // 불-물, 흙-공기
  if (harmonious.has(key)) return 90;
  if (clashing.has(key)) return 45;
  return 62; // 그 외(불-흙, 공기-물 등)
}

/**
 * 띠·별자리 종합 축 점수 (0~100).
 * 띠 60% + 별자리 원소 40% 가중.
 */
export function zodiacScore(
  yearA: number,
  monthA: number,
  dayA: number,
  yearB: number,
  monthB: number,
  dayB: number,
): number {
  const tti = ttiScore(ttiIndex(yearA), ttiIndex(yearB));
  const elem = elementPairScore(elementOf(monthA, dayA), elementOf(monthB, dayB));
  return tti * 0.6 + elem * 0.4;
}
