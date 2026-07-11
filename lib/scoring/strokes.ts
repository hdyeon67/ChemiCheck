// 한글 자모별 획수 테이블 + 음절 분해 + 이름 총획수 계산
//
// 전통 "이름 획수 궁합"에서 쓰는 필순 기준 획수를 상수로 정의한다.
// 한글 완성형 음절(가~힣)을 유니코드 산술로 초/중/종성으로 분해한 뒤
// 각 자모의 획수를 합산한다. 겹받침은 구성 자음의 획수 합으로 계산한다.

/** 초성 19종 (유니코드 배열 순서) */
export const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
  "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

/** 중성 21종 (유니코드 배열 순서) */
const JUNGSEONG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ",
  "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
] as const;

/** 종성 28종 (0번은 받침 없음, 유니코드 배열 순서) */
const JONGSEONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ",
  "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ",
  "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

/** 기본 자음 획수 (필순 기준) */
const CONSONANT_STROKES: Record<string, number> = {
  ㄱ: 2, ㄲ: 4, ㄴ: 2, ㄷ: 3, ㄸ: 6, ㄹ: 5, ㅁ: 4, ㅂ: 4, ㅃ: 8,
  ㅅ: 2, ㅆ: 4, ㅇ: 1, ㅈ: 3, ㅉ: 6, ㅊ: 4, ㅋ: 3, ㅌ: 4, ㅍ: 4, ㅎ: 3,
};

/** 기본 모음 획수 (필순 기준) */
const VOWEL_STROKES: Record<string, number> = {
  ㅏ: 2, ㅐ: 3, ㅑ: 3, ㅒ: 4, ㅓ: 2, ㅔ: 3, ㅕ: 3, ㅖ: 4, ㅗ: 2,
  ㅘ: 4, ㅙ: 5, ㅚ: 3, ㅛ: 3, ㅜ: 2, ㅝ: 4, ㅞ: 5, ㅟ: 3, ㅠ: 3,
  ㅡ: 1, ㅢ: 2, ㅣ: 1,
};

/** 겹받침 → 구성 자음 분해 (없으면 자기 자신 단일 원소) */
const JONG_DECOMPOSE: Record<string, string[]> = {
  ㄳ: ["ㄱ", "ㅅ"], ㄵ: ["ㄴ", "ㅈ"], ㄶ: ["ㄴ", "ㅎ"], ㄺ: ["ㄹ", "ㄱ"],
  ㄻ: ["ㄹ", "ㅁ"], ㄼ: ["ㄹ", "ㅂ"], ㄽ: ["ㄹ", "ㅅ"], ㄾ: ["ㄹ", "ㅌ"],
  ㄿ: ["ㄹ", "ㅍ"], ㅀ: ["ㄹ", "ㅎ"], ㅄ: ["ㅂ", "ㅅ"],
};

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;

function jongStrokes(jong: string): number {
  if (jong === "") return 0;
  const parts = JONG_DECOMPOSE[jong] ?? [jong];
  return parts.reduce((sum, c) => sum + (CONSONANT_STROKES[c] ?? 0), 0);
}

/** 한 음절의 획수 (초성 + 중성 + 종성). 한글이 아니면 0 */
export function syllableStrokes(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) return 0;
  const offset = code - HANGUL_BASE;
  const cho = CHOSEONG[Math.floor(offset / 588)];
  const jung = JUNGSEONG[Math.floor((offset % 588) / 28)];
  const jong = JONGSEONG[offset % 28];
  return (
    (CONSONANT_STROKES[cho] ?? 0) +
    (VOWEL_STROKES[jung] ?? 0) +
    jongStrokes(jong)
  );
}

/** 이름 문자열의 글자별 획수 배열 (한글 음절만) */
export function strokesPerChar(name: string): number[] {
  return [...name.trim()]
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= HANGUL_BASE && code <= HANGUL_END;
    })
    .map(syllableStrokes);
}

/** 이름 총획수 */
export function totalStrokes(name: string): number {
  return strokesPerChar(name).reduce((a, b) => a + b, 0);
}

/** 첫 글자의 초성 (초성 궁합용). 한글이 없으면 null */
export function firstChoseong(name: string): (typeof CHOSEONG)[number] | null {
  for (const ch of name.trim()) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      return CHOSEONG[Math.floor((code - HANGUL_BASE) / 588)];
    }
  }
  return null;
}
