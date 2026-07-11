import { describe, it, expect } from "vitest";
import { encodePayload, decodePayload, type SharePayload } from "../encode";

const cases: SharePayload[] = [
  { a: { name: "김하늘", birth: "2001-05-14" }, b: { name: "이서준", birth: "2000-11-03" }, relation: "couple" },
  { a: { name: "박", birth: "1999-01-01" }, b: { name: "최유나", birth: "2002-08-17" }, relation: "friend" },
  { a: { name: "가나다라마", birth: "1990-12-31" }, b: { name: "히읗", birth: "2010-02-28" }, relation: "coworker" },
];

describe("공유 페이로드 인코딩", () => {
  it("한글 포함 왕복(roundtrip)이 손실 없이 복원", () => {
    for (const c of cases) {
      const enc = encodePayload(c);
      expect(enc).toMatch(/^[A-Za-z0-9\-_]+$/); // URL-safe 문자만
      expect(decodePayload(enc)).toEqual(c);
    }
  });

  it("잘못된 문자열은 null", () => {
    expect(decodePayload("")).toBeNull();
    expect(decodePayload(undefined)).toBeNull();
    expect(decodePayload("!!!not-valid-json!!!")).toBeNull();
  });

  it("유효하지 않은 관계 유형은 null", () => {
    const enc = encodePayload({
      a: { name: "김", birth: "2000-01-01" },
      b: { name: "이", birth: "2000-01-01" },
      // @ts-expect-error 의도적으로 잘못된 relation
      relation: "enemy",
    });
    expect(decodePayload(enc)).toBeNull();
  });
});
