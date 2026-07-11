// 케미체크 점수 엔진 공용 타입 정의

/** 관계 유형 — Phase 2 해석 문구 세트 분기 및 시드에 반영 */
export type RelationType = "couple" | "friend" | "coworker";

/** 오행 (목·화·토·금·수) */
export type Ohaeng = "목" | "화" | "토" | "금" | "수";

/** 천간 (10간) */
export type Cheongan =
  | "갑"
  | "을"
  | "병"
  | "정"
  | "무"
  | "기"
  | "경"
  | "신"
  | "임"
  | "계";

/** 12지지 (띠) */
export type Jiji =
  | "자"
  | "축"
  | "인"
  | "묘"
  | "진"
  | "사"
  | "오"
  | "미"
  | "신"
  | "유"
  | "술"
  | "해";

/** 별자리 4원소 */
export type Element = "불" | "흙" | "공기" | "물";

/** 한 사람의 입력 */
export interface Person {
  /** 한글 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD) */
  birth: string;
}

/** calculateChemi 입력 */
export interface ChemiInput {
  a: Person;
  b: Person;
  relation: RelationType;
}

/** 한 사람의 사주/띠/별자리 도출 결과 */
export interface PersonProfile {
  /** 일간 (천간) */
  cheongan: Cheongan;
  /** 일간의 오행 */
  ohaeng: Ohaeng;
  /** 띠 (연지) */
  ttiJiji: Jiji;
  /** 별자리 원소 */
  element: Element;
}

/** 각 축별 세부 점수 (0~100 정규화) */
export interface AxisScores {
  /** 이름 케미 (획수 + 초성 보정) */
  name: number;
  /** 사주 오행 케미 */
  ohaeng: number;
  /** 띠 + 별자리 보정 */
  zodiac: number;
}

/** 최종 결과 */
export interface ChemiResult {
  /** 최종 점수 0~100 */
  score: number;
  /** 축별 세부 점수 */
  axes: AxisScores;
  /** 두 사람의 프로필 (오행 시각화 등에 사용) */
  profileA: PersonProfile;
  profileB: PersonProfile;
  /** 결정성 검증/디버깅용 시드 */
  seed: number;
}
