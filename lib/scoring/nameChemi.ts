// 이름 케미 (가중치 40%)
//   1) 초등학교식 이름궁합 알고리즘: 두 이름 글자를 교차 배열 → 획수 나열 →
//      인접 합 mod 10 을 반복해 2자리로 축약 → 0~99% 산출
//   2) 초성 궁합 보정 (±5): 두 이름 첫 글자 초성의 조음 계열 관계로 가감

import { strokesPerChar, firstChoseong, CHOSEONG } from "./strokes";

/** 이름 글자를 교차(a1,b1,a2,b2,...) 배열한 획수 시퀀스 */
function interleaveStrokes(nameA: string, nameB: string): number[] {
  const a = strokesPerChar(nameA);
  const b = strokesPerChar(nameB);
  const out: number[] = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

/** 인접 합 mod 10 을 반복해 2자리(0~99)로 축약하는 전통 궁합 계산 */
export function nameChemiPercent(nameA: string, nameB: string): number {
  let seq = interleaveStrokes(nameA, nameB);
  // 한글이 하나도 없는 방어 케이스
  if (seq.length === 0) return 50;
  if (seq.length === 1) seq = [seq[0], seq[0]];

  while (seq.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < seq.length - 1; i++) {
      next.push((seq[i] + seq[i + 1]) % 10);
    }
    seq = next;
  }
  return seq[0] * 10 + seq[1]; // 0 ~ 99
}

/** 초성 조음 계열 (아음/설음/순음/치음/후음) */
const CHO_FAMILY: Record<string, number> = {
  ㄱ: 0, ㄲ: 0, ㅋ: 0, // 아음
  ㄴ: 1, ㄷ: 1, ㄸ: 1, ㅌ: 1, ㄹ: 1, // 설음
  ㅁ: 2, ㅂ: 2, ㅃ: 2, ㅍ: 2, // 순음
  ㅅ: 3, ㅆ: 3, ㅈ: 3, ㅉ: 3, ㅊ: 3, // 치음
  ㅇ: 4, ㅎ: 4, // 후음
};

// 상성 계열 쌍(부드럽게 어울림) → +, 상충 계열 쌍 → -
const HARMONIOUS = new Set(["1-2", "3-4"]); // 설음+순음, 치음+후음
const CLASHING = new Set(["0-4", "0-3"]); // 아음+후음, 아음+치음

function familyKey(x: number, y: number): string {
  const [lo, hi] = x <= y ? [x, y] : [y, x];
  return `${lo}-${hi}`;
}

/** 초성 궁합 보정치 (-5 ~ +5) */
export function choseongBonus(nameA: string, nameB: string): number {
  const ca = firstChoseong(nameA);
  const cb = firstChoseong(nameB);
  if (!ca || !cb) return 0;

  const fa = CHO_FAMILY[ca];
  const fb = CHO_FAMILY[cb];
  if (fa === fb) return 5; // 같은 계열: 안정적 케미

  const key = familyKey(fa, fb);
  if (HARMONIOUS.has(key)) return 3;
  if (CLASHING.has(key)) return -5;

  // 그 외: 초성 인덱스 조합으로 결정적인 -2/0/+2
  const ia = CHOSEONG.indexOf(ca);
  const ib = CHOSEONG.indexOf(cb);
  return (((ia + ib) % 3) - 1) * 2;
}

/**
 * 이름 케미 축 점수 (0~100 정규화).
 * 전통 궁합 퍼센트에 초성 보정을 더한 뒤 0~100 클램프.
 * 궁합은 A-B 와 B-A 가 같아야 하므로 양방향 교차 결과를 평균해 대칭화한다.
 */
export function nameChemiScore(nameA: string, nameB: string): number {
  const base =
    (nameChemiPercent(nameA, nameB) + nameChemiPercent(nameB, nameA)) / 2;
  const bonus = choseongBonus(nameA, nameB); // -5~+5 (이미 대칭)
  return Math.max(0, Math.min(100, base + bonus));
}
