// 해석 문구(카피) 레이어 공용 타입

import type { RelationType } from "../scoring/types";
import type { Persona } from "./personas";

/** 점수 구간 index (0~6). bands.ts 의 BANDS 순서와 일치 */
export type BandIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 관계별로 분기되는 문구 세트: [relation][band] → 변형 배열 */
export type RelationBandPool = Record<RelationType, string[][]>;

/** 구간별 문구 세트: [band] → 변형 배열 */
export type BandPool = string[][];

/** 최종 해석 리포트 (Phase 3 UI 가 소비) */
export interface ChemiReport {
  /** 점수 구간 index */
  band: BandIndex;
  /** 등급 뱃지 (예: "운명급", "찰떡") */
  badge: string;
  /** 16개 중 선택된 케미 유형 이름 */
  chemiType: string;
  /** ① 한줄 요약 */
  summary: string;
  /** ② 케미 분석 (오행 근거 2~3문장) */
  analysis: string;
  /** ③ 조심할 점 (유머러스) */
  caution: string;
  /** ④ 케미 부스터 팁 (함께 하면 좋은 활동) */
  booster: string;

  // ── 캐릭터/반응 (오행을 재밌게 번역) ──
  /** 나의 캐릭터 페르소나 */
  personaA: Persona;
  /** 상대의 캐릭터 페르소나 */
  personaB: Persona;
  /** 두 캐릭터의 케미 반응 한 줄 */
  reaction: string;

  // ── 부스터 부가 요소 ──
  /** 케미 아이템 */
  chemiItem: string;
  /** 케미 컬러 (이름 + hex) */
  chemiColor: { name: string; hex: string };
  /** 케미 장소 */
  chemiPlace: string;
}
