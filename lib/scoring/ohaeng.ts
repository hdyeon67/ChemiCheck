// 오행 상생/상극 케미 매트릭스 (사주 오행 축 점수)
//
// 상생(生): 목→화→토→금→수→목  — 서로 북돋는 관계 (높은 점수)
// 상극(剋): 목→토→수→화→금→목  — 서로 눌러대는 관계 (낮은 점수)
// 동일 오행: 중간+ 점수
//
// 매트릭스는 [A행][B열] = A가 B를 봤을 때의 관계 점수(0~100).
// 방향성이 살짝 다르므로(내가 생해줌 vs 생받음) 대칭이 아니다.

import type { Ohaeng } from "./types";

/** 오행 인덱스 순서 */
export const OHAENG_ORDER: Ohaeng[] = ["목", "화", "토", "금", "수"];

const IDX: Record<Ohaeng, number> = {
  목: 0, 화: 1, 토: 2, 금: 3, 수: 4,
};

// 점수 의미:
//   90 = 내가 상대를 생(生)해줌 (상생·주는 쪽)
//   85 = 상대가 나를 생해줌 (상생·받는 쪽)
//   65 = 동일 오행
//   40 = 내가 상대를 극(剋)함 (상극·누르는 쪽)
//   35 = 상대가 나를 극함 (상극·눌리는 쪽)
export const OHAENG_MATRIX: number[][] = [
  //        목   화   토   금   수
  /* 목 */ [65, 90, 40, 35, 85],
  /* 화 */ [85, 65, 90, 40, 35],
  /* 토 */ [35, 85, 65, 90, 40],
  /* 금 */ [40, 35, 85, 65, 90],
  /* 수 */ [90, 40, 35, 85, 65],
];

/** 두 사람 일간 오행의 케미 점수 (0~100). 방향 평균으로 대칭화 */
export function ohaengScore(a: Ohaeng, b: Ohaeng): number {
  const ab = OHAENG_MATRIX[IDX[a]][IDX[b]];
  const ba = OHAENG_MATRIX[IDX[b]][IDX[a]];
  return (ab + ba) / 2;
}

/**
 * A(첫 번째 사람) 오행이 B를 어떻게 대하는지의 관계 유형.
 * 해석 문구(케미 분석)에서 오행 근거를 서술하는 데 사용.
 *   - "생함":   A가 B를 생(生)해줌 (A→B 상생, 주는 쪽)
 *   - "생받음": B가 A를 생해줌 (받는 쪽)
 *   - "동일":   같은 오행
 *   - "극함":   A가 B를 극(剋)함 (누르는 쪽)
 *   - "극받음": B가 A를 극함 (눌리는 쪽)
 */
export type OhaengRelation = "생함" | "생받음" | "동일" | "극함" | "극받음";

export function ohaengRelation(a: Ohaeng, b: Ohaeng): OhaengRelation {
  const ia = IDX[a];
  const ib = IDX[b];
  if (ia === ib) return "동일";
  if (ib === (ia + 1) % 5) return "생함"; // 木生火 …
  if (ib === (ia + 4) % 5) return "생받음"; // B가 A를 생
  if (ib === (ia + 2) % 5) return "극함"; // 木剋土 …
  return "극받음"; // ib === (ia + 3) % 5
}
