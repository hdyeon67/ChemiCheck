// 시드 해시 + 시드 기반 미세 난수
//
// 입력 문자열을 FNV-1a 32bit 해시로 시드화하고, mulberry32 로 결정적 난수를
// 뽑는다. 같은 입력이면 항상 같은 시드/난수가 나오므로 재계산해도 결과 동일.

/** FNV-1a 32bit 해시 (부호 없는 정수 반환) */
export function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // hash *= 16777619 (32bit)
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 결정적 PRNG. [0,1) 실수 하나 반환 */
export function mulberry32(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * 시드로부터 [-range, +range] 정수 미세 난수.
 * range=3 이면 -3 ~ +3 (정수).
 */
export function seededJitter(seed: number, range: number): number {
  const r = mulberry32(seed); // 0 ~ 1
  return Math.round((r * 2 - 1) * range);
}
