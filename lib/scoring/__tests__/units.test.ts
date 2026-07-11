import { describe, it, expect } from "vitest";
import { syllableStrokes, totalStrokes, firstChoseong } from "../strokes";
import { gapjaIndex, dayCheongan, dayOhaeng } from "../saju";
import { ohaengScore } from "../ohaeng";
import { ttiIndex, ttiJiji, ttiScore, elementOf } from "../zodiac";
import { nameChemiPercent } from "../nameChemi";

describe("한글 획수", () => {
  it("이 = ㅇ(1)+ㅣ(1) = 2획", () => {
    expect(syllableStrokes("이")).toBe(2);
  });

  it("김 = ㄱ(2)+ㅣ(1)+ㅁ(4) = 7획", () => {
    expect(syllableStrokes("김")).toBe(7);
  });

  it("받침 없는 여러 글자 합산", () => {
    // 아 = ㅇ(1)+ㅏ(2)=3, 이 = 2  → 5
    expect(totalStrokes("아이")).toBe(5);
  });

  it("한글이 아닌 문자는 0획", () => {
    expect(syllableStrokes("A")).toBe(0);
    expect(totalStrokes("김A")).toBe(7);
  });

  it("첫 글자 초성 추출", () => {
    expect(firstChoseong("김하늘")).toBe("ㄱ");
    expect(firstChoseong("이수민")).toBe("ㅇ");
  });
});

describe("사주 일간 (60갑자)", () => {
  it("1900-01-01 은 甲戌 (index 10) → 일간 갑, 오행 목", () => {
    expect(gapjaIndex("1900-01-01")).toBe(10);
    expect(dayCheongan("1900-01-01")).toBe("갑");
    expect(dayOhaeng("1900-01-01")).toBe("목");
  });

  it("하루 뒤는 index +1 (乙亥)", () => {
    expect(gapjaIndex("1900-01-02")).toBe(11);
    expect(dayCheongan("1900-01-02")).toBe("을");
  });

  it("60일 주기로 갑자가 순환", () => {
    expect(gapjaIndex("1900-03-02")).toBe(gapjaIndex("1900-01-01"));
  });

  it("잘못된 날짜 형식은 index 0 으로 방어", () => {
    expect(gapjaIndex("not-a-date")).toBe(0);
  });
});

describe("오행 상생상극 매트릭스", () => {
  it("목생화(상생)는 높은 점수", () => {
    // matrix[목][화]=90, matrix[화][목]=85 → 평균 87.5
    expect(ohaengScore("목", "화")).toBe(87.5);
  });

  it("목극토(상극)는 낮은 점수", () => {
    // matrix[목][토]=40, matrix[토][목]=35 → 평균 37.5
    expect(ohaengScore("목", "토")).toBe(37.5);
  });

  it("동일 오행은 중간+ 점수", () => {
    expect(ohaengScore("수", "수")).toBe(65);
  });

  it("대칭이다 (A-B == B-A)", () => {
    expect(ohaengScore("금", "수")).toBe(ohaengScore("수", "금"));
  });
});

describe("띠 궁합", () => {
  it("2020년생은 쥐띠(자)", () => {
    expect(ttiIndex(2020)).toBe(0);
    expect(ttiJiji(2020)).toBe("자");
  });

  it("육합(자축)은 최고 상성", () => {
    expect(ttiScore(0, 1)).toBe(92);
  });

  it("삼합(신자진: 자-진)은 높은 상성", () => {
    expect(ttiScore(0, 4)).toBe(85);
  });

  it("충(자오)은 낮은 상성", () => {
    expect(ttiScore(0, 6)).toBe(35);
  });

  it("동일 띠는 중간+ 상성", () => {
    expect(ttiScore(3, 3)).toBe(72);
  });
});

describe("별자리 원소", () => {
  it("3/25 는 양자리(불)", () => {
    expect(elementOf(3, 25)).toBe("불");
  });
  it("1/1 은 염소자리(흙)", () => {
    expect(elementOf(1, 1)).toBe("흙");
  });
  it("6/1 은 쌍둥이(공기)", () => {
    expect(elementOf(6, 1)).toBe("공기");
  });
  it("7/1 은 게자리(물)", () => {
    expect(elementOf(7, 1)).toBe("물");
  });
});

describe("이름궁합 퍼센트", () => {
  it("항상 0~99 범위", () => {
    const p = nameChemiPercent("김철수", "이영희");
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(99);
  });
});
