import { forwardRef } from "react";
import type { ChemiResult, RelationType } from "@/lib/scoring/types";
import type { ChemiReport } from "@/lib/copy/types";
import { PersonaBadge } from "./PersonaBadge";

const RELATION_LABEL: Record<RelationType, string> = {
  couple: "썸·연인 케미",
  friend: "친구 케미",
  coworker: "직장동료 케미",
};

function Section({
  title,
  emoji,
  text,
}: {
  title: string;
  emoji: string;
  text: string;
}) {
  return (
    <div className="w-full rounded-2xl bg-white/95 px-4 py-3 text-left">
      <div className="mb-1 text-[11px] font-extrabold text-chemi-pink">
        {emoji} {title}
      </div>
      <p className="text-[13px] font-medium leading-relaxed text-chemi-violet">
        {text}
      </p>
    </div>
  );
}

/**
 * 저장/공유용 전체 결과 카드 — 점수부터 해석 4섹션까지 한 장에 담는다.
 * 폭 380 고정, 세로는 내용에 따라 자동. 캡처 시 pixelRatio 2~3 로 고해상 저장.
 */
const StoryCard = forwardRef<
  HTMLDivElement,
  {
    result: ChemiResult;
    report: ChemiReport;
    aName: string;
    bName: string;
    relation: RelationType;
  }
>(function StoryCard({ result, report, aName, bName, relation }, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: 380,
        background: "linear-gradient(160deg,#ff8fd4 0%,#c86bf5 45%,#8b5cf6 100%)",
      }}
      className="flex flex-col items-center gap-3 px-5 py-7 text-white"
    >
      {/* 헤더 */}
      <div className="text-center">
        <div className="text-lg font-black tracking-tight">케미체크</div>
        <div className="mt-0.5 text-xs font-semibold text-white/85">
          {RELATION_LABEL[relation]}
        </div>
        <div className="mt-2 text-2xl font-black">
          {aName} <span className="text-white/70">×</span> {bName}
        </div>
      </div>

      {/* 점수 + 등급 + 유형 */}
      <div className="flex flex-col items-center">
        <div className="flex items-baseline font-black leading-none">
          <span className="text-[92px]">{result.score}</span>
          <span className="ml-1 text-2xl text-white/80">점</span>
        </div>
        <div className="mt-1 rounded-full bg-white/95 px-4 py-1.5 text-sm font-black text-chemi-violet">
          {report.badge} · {report.chemiType}
        </div>
      </div>

      {/* 캐릭터 케미 */}
      <div className="flex items-start justify-center gap-3">
        <PersonaBadge persona={report.personaA} name={aName} size={48} />
        <span className="mt-5 text-lg font-black text-white/70">×</span>
        <PersonaBadge persona={report.personaB} name={bName} size={48} />
      </div>
      <div className="w-full rounded-2xl bg-white/95 px-4 py-2.5 text-center text-[13px] font-bold text-chemi-violet">
        {report.reaction}
      </div>

      {/* 해석 4섹션 (전체 결과) */}
      <Section title="한줄 요약" emoji="✨" text={report.summary} />
      <Section title="케미 분석" emoji="🔍" text={report.analysis} />
      <Section title="조심할 점" emoji="⚠️" text={report.caution} />
      <Section title="케미 부스터 팁" emoji="🚀" text={report.booster} />
      <div className="grid w-full grid-cols-3 gap-2">
        {[
          { label: "케미 아이템", value: report.chemiItem },
          { label: "케미 컬러", value: report.chemiColor.name },
          { label: "케미 장소", value: report.chemiPlace },
        ].map((it) => (
          <div key={it.label} className="rounded-2xl bg-white/95 px-2 py-2 text-center">
            <div className="text-[9px] font-bold text-gray-400">{it.label}</div>
            <div className="mt-0.5 text-[11px] font-black text-chemi-violet">
              {it.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-1 text-[11px] font-semibold text-white/85">
        chemicheck · 나도 해보기
      </div>
    </div>
  );
});

export default StoryCard;
