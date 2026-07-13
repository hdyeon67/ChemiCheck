import type { RelationType } from "@/lib/scoring/types";
import { PROMOS } from "@/lib/config/promos";

const SAJU_URL =
  PROMOS.find((p) => p.id === "saju")?.href ?? "https://saju.fineboll.com";
const GOODDAY_URL =
  PROMOS.find((p) => p.id === "goodday")?.href ?? "https://goodday.fineboll.com";

/** 생일(YYYY-MM-DD)을 사주풀이 프리필 파라미터로 딥링크 */
function sajuLink(birth: string): string {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(birth.trim());
  if (!m) return SAJU_URL;
  return `${SAJU_URL}/?y=${m[1]}&m=${Number(m[2])}&d=${Number(m[3])}&cal=solar`;
}

/** 관계 유형별 '좋은날' 후킹 문구 */
const GOODDAY_HOOK: Record<
  RelationType,
  { emoji: string; line: string; cta: string }
> = {
  couple: {
    emoji: "💞",
    line: "잘 맞는 두 분, 좋은 날도 잡아볼까요?",
    cta: "데이트·기념일 좋은날",
  },
  friend: {
    emoji: "🤝",
    line: "같이 뭉치기 좋은 날이 필요하다면?",
    cta: "여행·모임 좋은날",
  },
  coworker: {
    emoji: "💼",
    line: "중요한 날, 택일이 필요하다면?",
    cta: "좋은날 택일",
  },
};

/**
 * 결과 하단 맥락형 브릿지.
 *   케미는 두 사람의 사주(오행)에서 계산되므로, 그 흐름 그대로 "각자 사주 보기"로
 *   자연스럽게 잇고, 관계 유형에 맞춰 '좋은날'을 덧붙인다. (광고가 아닌 다음 단계처럼)
 */
export function ResultBridge({
  aName,
  bName,
  aBirth,
  bBirth,
  relation,
}: {
  aName: string;
  bName: string;
  aBirth: string;
  bBirth: string;
  relation: RelationType;
}) {
  const gd = GOODDAY_HOOK[relation];
  return (
    <section className="mt-6 flex flex-col gap-2">
      {/* 사주 브릿지 — 케미의 근거인 오행에서 이어짐 */}
      <div className="sticker p-5">
        <div className="mb-1.5 text-xs font-extrabold text-chemi-pink">
          🔮 이 케미, 사주에서 나왔어요
        </div>
        <p className="text-[15px] leading-relaxed text-chemi-violet">
          <b>{aName}</b>님·<b>{bName}</b>님의 사주 오행이 이 궁합을 만들었어요.
          각자 사주 전체가 궁금하다면?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={sajuLink(aBirth)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate rounded-2xl bg-purple-50 px-3 py-2.5 text-center text-sm font-black text-chemi-violet transition active:scale-95"
          >
            🔮 {aName} 사주 →
          </a>
          <a
            href={sajuLink(bBirth)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate rounded-2xl bg-purple-50 px-3 py-2.5 text-center text-sm font-black text-chemi-violet transition active:scale-95"
          >
            🔮 {bName} 사주 →
          </a>
        </div>
      </div>

      {/* 좋은날 브릿지 — 관계 유형 맞춤 */}
      <a
        href={GOODDAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sticker flex items-center gap-3 px-4 py-3 transition active:scale-[0.98]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c99a5b22] text-xl">
          {gd.emoji}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-black text-chemi-violet">
            {gd.line}
          </span>
          <span className="block text-xs text-gray-400">{gd.cta}</span>
        </span>
        <span className="font-black text-chemi-pink">→</span>
      </a>
    </section>
  );
}
