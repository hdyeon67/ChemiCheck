import { describe, it, expect } from "vitest";
import { calculateChemi } from "../../scoring";
import type { ChemiResult, Ohaeng, RelationType } from "../../scoring/types";
import { buildReport } from "../index";
import { scoreToBand, BADGES, BAND_RANGES } from "../bands";
import { SUMMARIES } from "../summaries";
import { ANALYSIS_OPENERS, ANALYSIS_BODIES } from "../analyses";
import { CAUTIONS } from "../cautions";
import { BOOSTERS } from "../boosters";
import { ALL_CHEMI_TYPES } from "../chemiTypes";

const RELATIONS: RelationType[] = ["couple", "friend", "coworker"];

/** 커버리지 테스트용 가짜 ChemiResult 생성 */
function makeResult(score: number, seed: number, a: Ohaeng, b: Ohaeng): ChemiResult {
  return {
    score,
    seed,
    axes: { name: 50, ohaeng: 50, zodiac: 50 },
    profileA: { cheongan: "갑", ohaeng: a, ttiJiji: "자", element: "불" },
    profileB: { cheongan: "병", ohaeng: b, ttiJiji: "오", element: "물" },
  };
}

describe("점수 구간 (band)", () => {
  it("경계값이 올바른 구간으로 매핑", () => {
    expect(scoreToBand(0)).toBe(0);
    expect(scoreToBand(29)).toBe(0);
    expect(scoreToBand(30)).toBe(1);
    expect(scoreToBand(44)).toBe(1);
    expect(scoreToBand(45)).toBe(2);
    expect(scoreToBand(59)).toBe(2);
    expect(scoreToBand(60)).toBe(3);
    expect(scoreToBand(69)).toBe(3);
    expect(scoreToBand(70)).toBe(4);
    expect(scoreToBand(79)).toBe(4);
    expect(scoreToBand(80)).toBe(5);
    expect(scoreToBand(89)).toBe(5);
    expect(scoreToBand(90)).toBe(6);
    expect(scoreToBand(100)).toBe(6);
  });

  it("구간 경계가 빈틈/겹침 없이 연속", () => {
    for (let i = 0; i < BAND_RANGES.length - 1; i++) {
      expect(BAND_RANGES[i][1] + 1).toBe(BAND_RANGES[i + 1][0]);
    }
  });
});

describe("문구 풀 구조", () => {
  it("모든 관계 × 구간 요약이 8변형 이상", () => {
    for (const r of RELATIONS) {
      expect(SUMMARIES[r]).toHaveLength(7);
      for (const band of SUMMARIES[r]) {
        expect(band.length).toBeGreaterThanOrEqual(8);
      }
    }
  });

  it("모든 관계 × 구간 부스터가 8변형 이상", () => {
    for (const r of RELATIONS) {
      expect(BOOSTERS[r]).toHaveLength(7);
      for (const band of BOOSTERS[r]) {
        expect(band.length).toBeGreaterThanOrEqual(8);
      }
    }
  });

  it("모든 구간 케미분석 바디 / 조심할점이 8변형 이상", () => {
    expect(ANALYSIS_BODIES).toHaveLength(7);
    expect(CAUTIONS).toHaveLength(7);
    for (const band of ANALYSIS_BODIES) expect(band.length).toBeGreaterThanOrEqual(8);
    for (const band of CAUTIONS) expect(band.length).toBeGreaterThanOrEqual(8);
  });

  it("오행 관계 5종 오프너가 모두 존재", () => {
    for (const rel of ["생함", "생받음", "동일", "극함", "극받음"] as const) {
      expect(ANALYSIS_OPENERS[rel].length).toBeGreaterThanOrEqual(2);
    }
  });

  it("전체 문구 수가 224개 이상", () => {
    let count = 0;
    for (const r of RELATIONS) {
      SUMMARIES[r].forEach((b) => (count += b.length));
      BOOSTERS[r].forEach((b) => (count += b.length));
    }
    ANALYSIS_BODIES.forEach((b) => (count += b.length));
    CAUTIONS.forEach((b) => (count += b.length));
    Object.values(ANALYSIS_OPENERS).forEach((a) => (count += a.length));
    expect(count).toBeGreaterThanOrEqual(224);
  });

  it("등급 뱃지 7종, 케미 유형 16종(중복 없음)", () => {
    expect(BADGES).toHaveLength(7);
    expect(ALL_CHEMI_TYPES).toHaveLength(16);
    expect(new Set(ALL_CHEMI_TYPES).size).toBe(16);
  });

  it("모든 문구에 빈 문자열이 없다", () => {
    const allText = [
      ...RELATIONS.flatMap((r) => SUMMARIES[r].flat()),
      ...RELATIONS.flatMap((r) => BOOSTERS[r].flat()),
      ...ANALYSIS_BODIES.flat(),
      ...CAUTIONS.flat(),
      ...Object.values(ANALYSIS_OPENERS).flat(),
    ];
    for (const t of allText) expect(t.trim().length).toBeGreaterThan(0);
  });
});

describe("buildReport", () => {
  it("모든 구간 × 관계 조합에서 완전한 리포트 생성", () => {
    const bandMids = [15, 37, 52, 65, 75, 85, 95];
    const oheCombos: [Ohaeng, Ohaeng][] = [
      ["목", "화"], // 생함
      ["화", "목"], // 생받음
      ["토", "토"], // 동일
      ["목", "토"], // 극함
      ["토", "목"], // 극받음
    ];
    for (let band = 0; band < 7; band++) {
      for (const r of RELATIONS) {
        for (const [a, b] of oheCombos) {
          const rep = buildReport(makeResult(bandMids[band], 12345 + band, a, b), r);
          expect(rep.band).toBe(band);
          expect(rep.badge).toBe(BADGES[band]);
          expect(rep.summary.length).toBeGreaterThan(0);
          expect(rep.analysis.length).toBeGreaterThan(0);
          expect(rep.caution.length).toBeGreaterThan(0);
          expect(rep.booster.length).toBeGreaterThan(0);
          expect(ALL_CHEMI_TYPES).toContain(rep.chemiType);
          // 캐릭터/반응/부스터 부가 요소
          expect(rep.personaA.animal.length).toBeGreaterThan(0);
          expect(rep.personaB.type.length).toBeGreaterThan(0);
          expect(rep.reaction.length).toBeGreaterThan(0);
          expect(rep.chemiItem.length).toBeGreaterThan(0);
          expect(rep.chemiColor.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
          expect(rep.chemiPlace.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("결정적: 같은 입력이면 같은 리포트", () => {
    const input = {
      a: { name: "김하늘", birth: "2001-05-14" },
      b: { name: "이서준", birth: "2000-11-03" },
      relation: "couple" as RelationType,
    };
    const r1 = buildReport(calculateChemi(input), input.relation);
    const r2 = buildReport(calculateChemi(input), input.relation);
    expect(r1).toEqual(r2);
  });

  it("관계 유형이 다르면 요약/부스터 세트가 갈린다", () => {
    const res = makeResult(75, 999, "목", "화");
    const couple = buildReport(res, "couple");
    const coworker = buildReport(res, "coworker");
    // 같은 구간이라도 관계별 풀이 달라 문구가 서로 다른 세트에서 나온다
    expect(SUMMARIES.couple[4]).toContain(couple.summary);
    expect(SUMMARIES.coworker[4]).toContain(coworker.summary);
    expect(couple.summary).not.toBe(coworker.summary);
  });

  it("변형이 실제로 분산된다 (요약이 한 문구에 고정되지 않음)", () => {
    const seen = new Set<string>();
    for (let s = 0; s < 40; s++) {
      const rep = buildReport(makeResult(75, s * 7 + 1, "목", "화"), "couple");
      seen.add(rep.summary);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});
