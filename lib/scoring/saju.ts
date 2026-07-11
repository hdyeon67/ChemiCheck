// 사주 오행 케미 (가중치 40%) — 일간(日干) 계산
//
// 만세력 근사: 1900-01-01 을 甲戌(60갑자 index 10)일로 보고 일진을 순환 계산한다.
// 천간(10간)만으로 일간을 도출하고 그 오행을 취한다.
// 날짜 산술은 UTC 기준으로 수행해 타임존에 따른 비결정성을 제거한다.

import type { Cheongan, Ohaeng } from "./types";

/** 천간 10종 (甲乙丙丁戊己庚辛壬癸) */
const CHEONGAN: Cheongan[] = [
  "갑", "을", "병", "정", "무", "기", "경", "신", "임", "계",
];

/** 천간 → 오행 (갑을=목, 병정=화, 무기=토, 경신=금, 임계=수) */
const CHEONGAN_OHAENG: Ohaeng[] = [
  "목", "목", "화", "화", "토", "토", "금", "금", "수", "수",
];

/** 1900-01-01 의 60갑자 index (甲戌 = 10) */
const BASE_GAPJA_INDEX = 10;
const BASE_UTC = Date.UTC(1900, 0, 1); // 1900-01-01 00:00 UTC

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" → UTC 자정 타임스탬프 (파싱 실패 시 NaN) */
function parseBirthUTC(birth: string): number {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(birth.trim());
  if (!m) return NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return Date.UTC(y, mo - 1, d);
}

/** 생년월일의 60갑자 index (0~59). 파싱 실패 시 0 */
export function gapjaIndex(birth: string): number {
  const utc = parseBirthUTC(birth);
  if (Number.isNaN(utc)) return 0;
  const daysDiff = Math.round((utc - BASE_UTC) / MS_PER_DAY);
  return ((((BASE_GAPJA_INDEX + daysDiff) % 60) + 60) % 60);
}

/** 일간 (천간) */
export function dayCheongan(birth: string): Cheongan {
  return CHEONGAN[gapjaIndex(birth) % 10];
}

/** 일간의 오행 */
export function dayOhaeng(birth: string): Ohaeng {
  return CHEONGAN_OHAENG[gapjaIndex(birth) % 10];
}
