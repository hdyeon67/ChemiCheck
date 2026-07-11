import { describe, it, expect } from "vitest";
import { calculateChemi } from "../index";
import type { RelationType } from "../types";

// 테스트 자체도 재현 가능하도록 시드 PRNG 로 입력을 생성한다.
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 흔한 한글 성/이름 음절 풀
const SURNAME = [..."김이박최정강조윤장임한오서신권황안송류전홍"];
const GIVEN = [..."민서지우하은도윤예준시아현주은채원건우수빈나연준혁"];

const RELATIONS: RelationType[] = ["couple", "friend", "coworker"];

function randomName(rng: () => number): string {
  const s = SURNAME[Math.floor(rng() * SURNAME.length)];
  const g1 = GIVEN[Math.floor(rng() * GIVEN.length)];
  const g2 = GIVEN[Math.floor(rng() * GIVEN.length)];
  return s + g1 + g2;
}

function randomBirth(rng: () => number): string {
  const y = 1990 + Math.floor(rng() * 20); // 1990~2009
  const m = 1 + Math.floor(rng() * 12);
  const d = 1 + Math.floor(rng() * 28);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${y}-${pad(m)}-${pad(d)}`;
}

describe("점수 분포", () => {
  const N = 5000;
  const rng = makeRng(20260710);
  const scores: number[] = [];

  for (let i = 0; i < N; i++) {
    const relation = RELATIONS[Math.floor(rng() * RELATIONS.length)];
    const r = calculateChemi({
      a: { name: randomName(rng), birth: randomBirth(rng) },
      b: { name: randomName(rng), birth: randomBirth(rng) },
      relation,
    });
    scores.push(r.score);
  }

  const mean = scores.reduce((a, b) => a + b, 0) / N;
  const variance =
    scores.reduce((a, b) => a + (b - mean) ** 2, 0) / N;
  const std = Math.sqrt(variance);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const within = scores.filter((s) => s >= 30 && s <= 95).length / N;

  it("모든 점수가 0~100 경계 안", () => {
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThanOrEqual(100);
  });

  it("평균이 재미있는 중상위 구간(50~78)", () => {
    expect(mean).toBeGreaterThan(50);
    expect(mean).toBeLessThan(78);
  });

  it("대부분(≥85%)이 30~95 구간에 분포", () => {
    expect(within).toBeGreaterThanOrEqual(0.85);
  });

  it("한 값에 쏠리지 않는다 (표준편차 > 6)", () => {
    expect(std).toBeGreaterThan(6);
  });

  it("7개 등급 구간 중 최소 5개 이상에 점수가 존재", () => {
    const buckets = [
      [0, 29], [30, 44], [45, 59], [60, 69], [70, 79], [80, 89], [90, 100],
    ];
    const hit = buckets.filter(([lo, hi]) =>
      scores.some((s) => s >= lo && s <= hi),
    ).length;
    expect(hit).toBeGreaterThanOrEqual(5);
  });
});
