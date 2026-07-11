// 16개 케미 유형 이름 + 결정적 선택 로직
//
// 오행 관계(생함/생받음/동일/극함/극받음)별로 톤이 맞는 유형을 묶어
// 유형 이름이 실제 오행 근거와 어긋나지 않게 한다. 그룹 내에서는 시드로 선택.

import type { OhaengRelation } from "../scoring/ohaeng";
import { pickIndex } from "./select";

/** 오행 관계별 케미 유형 그룹 (총 16개) */
export const CHEMI_TYPES: Record<OhaengRelation, string[]> = {
  생함: [
    "서로 물들이는 그라데이션 케미",
    "은근히 스며드는 케미",
    "볼수록 정드는 케미",
  ],
  생받음: [
    "편안한 홈그라운드 케미",
    "잔잔한 물결 케미",
    "첫눈에 통하는 케미",
  ],
  동일: [
    "찰떡 티키타카 케미",
    "환상의 싱크로 케미",
    "거울 보는 도플갱어 케미",
  ],
  극함: [
    "불꽃 튀는 맞짱 케미",
    "텐션 폭발 케미",
    "예측불가 롤러코스터 케미",
  ],
  극받음: [
    "츤데레 밸런스 케미",
    "밀당 고수 케미",
    "상극인 척 찰떡 케미",
    "극과 극 자석 케미",
  ],
};

/** 전체 유형 평탄화 목록 (검증/카운트용) */
export const ALL_CHEMI_TYPES: string[] = Object.values(CHEMI_TYPES).flat();

/** 오행 관계 + 시드로 결정적 케미 유형 선택 */
export function selectChemiType(rel: OhaengRelation, seed: number): string {
  const group = CHEMI_TYPES[rel];
  return group[pickIndex(seed, "chemiType", group.length)];
}
