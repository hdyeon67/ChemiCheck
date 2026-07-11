// 문구 선택 유틸 — 시드(해시)로 변형을 결정적으로 고른다.
//
// 섹션마다 다른 변형이 뽑히도록 시드에 salt 를 섞어 재해시한다.
// (순환 의존을 피하려고 카피 풀을 import 하지 않는 순수 모듈로 유지)

import { fnv1a } from "../scoring/hash";

/** seed + salt 로 [0, length) 결정적 인덱스 */
export function pickIndex(seed: number, salt: string, length: number): number {
  if (length <= 0) return 0;
  const h = fnv1a(`${seed}:${salt}`);
  return h % length;
}

/** 배열에서 seed + salt 로 결정적 원소 선택 */
export function pick<T>(arr: T[], seed: number, salt: string): T {
  return arr[pickIndex(seed, salt, arr.length)];
}
