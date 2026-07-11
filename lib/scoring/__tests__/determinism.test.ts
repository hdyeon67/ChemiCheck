import { describe, it, expect } from "vitest";
import { calculateChemi } from "../index";
import type { ChemiInput } from "../types";

const sample: ChemiInput = {
  a: { name: "김하늘", birth: "2001-05-14" },
  b: { name: "이서준", birth: "2000-11-03" },
  relation: "couple",
};

describe("결정성 (deterministic)", () => {
  it("같은 입력이면 100회 재계산해도 항상 동일", () => {
    const first = calculateChemi(sample);
    for (let i = 0; i < 100; i++) {
      expect(calculateChemi(sample)).toEqual(first);
    }
  });

  it("점수는 0~100 정수", () => {
    const r = calculateChemi(sample);
    expect(Number.isInteger(r.score)).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it("입력 순서(A-B / B-A)에 무관하게 같은 점수", () => {
    const swapped: ChemiInput = { a: sample.b, b: sample.a, relation: sample.relation };
    expect(calculateChemi(swapped).score).toBe(calculateChemi(sample).score);
  });

  it("관계 유형이 다르면 시드가 달라 결과가 갈라질 수 있다", () => {
    const asFriend: ChemiInput = { ...sample, relation: "friend" };
    // 시드가 관계유형을 포함하므로 seed 는 반드시 다르다
    expect(calculateChemi(asFriend).seed).not.toBe(calculateChemi(sample).seed);
  });

  it("프로필(오행·띠·별자리)도 결정적", () => {
    const r1 = calculateChemi(sample);
    const r2 = calculateChemi(sample);
    expect(r1.profileA).toEqual(r2.profileA);
    expect(r1.profileB).toEqual(r2.profileB);
  });
});
