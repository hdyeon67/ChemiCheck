// 케미체크 점수 엔진 통합
//   최종점수 = 0.4*이름 + 0.4*오행 + 0.2*(띠·별자리) + 시드기반 미세난수(±3)
//   같은 입력이면 항상 같은 결과 (결정적).

import type {
  ChemiInput,
  ChemiResult,
  Person,
  PersonProfile,
} from "./types";
import { nameChemiScore } from "./nameChemi";
import { dayCheongan, dayOhaeng } from "./saju";
import { ohaengScore } from "./ohaeng";
import { ttiJiji, elementOf, zodiacScore } from "./zodiac";
import { fnv1a, seededJitter } from "./hash";

const WEIGHT = { name: 0.4, ohaeng: 0.4, zodiac: 0.2 } as const;
const JITTER_RANGE = 3;

function parseYMD(birth: string): { y: number; m: number; d: number } {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(birth.trim());
  if (!m) return { y: 2000, m: 1, d: 1 };
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** 한 사람의 사주/띠/별자리 프로필 도출 */
export function buildProfile(person: Person): PersonProfile {
  const { y, m, d } = parseYMD(person.birth);
  return {
    cheongan: dayCheongan(person.birth),
    ohaeng: dayOhaeng(person.birth),
    ttiJiji: ttiJiji(y),
    element: elementOf(m, d),
  };
}

/** 두 사람의 케미 점수 계산 (결정적) */
export function calculateChemi(input: ChemiInput): ChemiResult {
  const { a, b, relation } = input;

  const profileA = buildProfile(a);
  const profileB = buildProfile(b);

  const nameAxis = nameChemiScore(a.name, b.name);
  const ohaengAxis = ohaengScore(profileA.ohaeng, profileB.ohaeng);

  const pa = parseYMD(a.birth);
  const pb = parseYMD(b.birth);
  const zodiacAxis = zodiacScore(pa.y, pa.m, pa.d, pb.y, pb.m, pb.d);

  const raw =
    nameAxis * WEIGHT.name +
    ohaengAxis * WEIGHT.ohaeng +
    zodiacAxis * WEIGHT.zodiac;

  // 입력 순서에 무관하게 같은 결과가 나오도록 두 사람 키를 정렬해 시드 구성
  const keyA = `${a.name}|${a.birth}`;
  const keyB = `${b.name}|${b.birth}`;
  const [k1, k2] = [keyA, keyB].sort();
  const seed = fnv1a(`${k1}#${k2}#${relation}`);

  const jitter = seededJitter(seed, JITTER_RANGE);
  const score = Math.max(0, Math.min(100, Math.round(raw + jitter)));

  return {
    score,
    axes: {
      name: Math.round(nameAxis),
      ohaeng: Math.round(ohaengAxis),
      zodiac: Math.round(zodiacAxis),
    },
    profileA,
    profileB,
    seed,
  };
}

// 하위 모듈 재노출 (Phase 2+ 편의용)
export * from "./types";
export { nameChemiScore, nameChemiPercent, choseongBonus } from "./nameChemi";
export { dayCheongan, dayOhaeng, gapjaIndex } from "./saju";
export { ohaengScore, OHAENG_MATRIX } from "./ohaeng";
export { ttiScore, ttiJiji, zodiacScore, elementOf } from "./zodiac";
