import Link from "next/link";
import type { ChemiResult, RelationType } from "@/lib/scoring/types";
import type { ChemiReport } from "@/lib/copy/types";
import ScoreCounter from "./ScoreCounter";
import { PersonaBadge } from "./PersonaBadge";
import ShareButtons from "./ShareButtons";
import AdRails from "./AdRails";
import { ResultBridge } from "./ResultBridge";
import { Footer } from "./footer";

const RELATION_LABEL: Record<RelationType, string> = {
  couple: "썸·연인 케미",
  friend: "친구 케미",
  coworker: "직장동료 케미",
};

function SectionCard({
  title,
  emoji,
  text,
  featured = false,
}: {
  title: string;
  emoji: string;
  text: string;
  featured?: boolean;
}) {
  return (
    <div className={`sticker p-5 ${featured ? "ring-2 ring-chemi-pink/40" : ""}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-chemi-pink">
        <span>{emoji}</span>
        {title}
      </div>
      <p
        className={`leading-relaxed text-chemi-violet ${
          featured ? "text-lg font-bold" : "text-[15px]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default function ResultView({
  result,
  report,
  aName,
  bName,
  aBirth,
  bBirth,
  relation,
}: {
  result: ChemiResult;
  report: ChemiReport;
  aName: string;
  bName: string;
  aBirth: string;
  bBirth: string;
  relation: RelationType;
}) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-6 pb-32 lg:pb-6">
      {/* 헤더: 두 이름 + 관계 */}
      <header className="mb-3 text-center text-white drop-shadow">
        <p className="text-sm font-semibold text-white/90">
          {RELATION_LABEL[relation]}
        </p>
        <h1 className="text-2xl font-black">
          {aName} <span className="text-white/70">×</span> {bName}
        </h1>
      </header>

      {/* 점수 카드 */}
      <section className="sticker animate-pop-in mb-4 px-5 py-6 text-center">
        <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-chemi-pink to-chemi-violet px-4 py-1 text-sm font-black text-white shadow">
          {report.badge}
        </div>
        <ScoreCounter score={result.score} />
        <div className="mt-3 text-xl font-black text-chemi-violet">
          {report.chemiType}
        </div>

        {/* 캐릭터 케미 */}
        <div className="mt-5 flex items-start justify-center gap-4">
          <PersonaBadge persona={report.personaA} name={aName} />
          <span className="mt-6 text-2xl font-black text-purple-200">×</span>
          <PersonaBadge persona={report.personaB} name={bName} />
        </div>
        <div className="mt-4 rounded-2xl bg-purple-50 px-4 py-3 text-sm font-bold leading-relaxed text-chemi-violet">
          {report.reaction}
        </div>
      </section>

      {/* 해석 4섹션 */}
      <div className="flex flex-col gap-3">
        <SectionCard title="한줄 요약" emoji="✨" text={report.summary} featured />
        <SectionCard title="케미 분석" emoji="🔍" text={report.analysis} />
        <SectionCard title="조심할 점" emoji="⚠️" text={report.caution} />

        {/* 케미 부스터 — 팁 + 아이템/컬러/장소 */}
        <div className="sticker p-5">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-chemi-pink">
            <span>🚀</span>
            케미 부스터
          </div>
          <p className="text-[15px] leading-relaxed text-chemi-violet">
            {report.booster}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-purple-50 px-2 py-3 text-center">
              <div className="text-[11px] font-bold text-gray-400">케미 아이템</div>
              <div className="mt-1 text-[13px] font-black text-chemi-violet">
                {report.chemiItem}
              </div>
            </div>
            <div className="rounded-2xl bg-purple-50 px-2 py-3 text-center">
              <div className="text-[11px] font-bold text-gray-400">케미 컬러</div>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span
                  className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: report.chemiColor.hex }}
                />
                <span className="text-[13px] font-black text-chemi-violet">
                  {report.chemiColor.name}
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-purple-50 px-2 py-3 text-center">
              <div className="text-[11px] font-bold text-gray-400">케미 장소</div>
              <div className="mt-1 text-[13px] font-black text-chemi-violet">
                {report.chemiPlace}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 공유 버튼 (카카오 / 링크 복사 / 이미지 저장) */}
      <ShareButtons
        result={result}
        report={report}
        aName={aName}
        bName={bName}
        relation={relation}
      />

      {/* 바이럴 루프 CTA */}
      <Link
        href="/"
        className="btn-pop mt-5 w-full py-4 text-lg"
      >
        내 차례! 나도 해보기 →
      </Link>

      {/* 맥락형 브릿지 (사주=각자 생일 딥링크 / 좋은날=관계 맞춤) */}
      <ResultBridge
        aName={aName}
        bName={bName}
        aBirth={aBirth}
        bBirth={bBirth}
        relation={relation}
      />

      <Footer
        logoSrc={null}
        links={[{ label: "서비스 소개", href: "/about" }]}
        note="재미로 보는 콘텐츠예요 · 입력 정보는 저장되지 않아요"
      />

      {/* 반응형 광고: 데스크톱 좌우 세로 / 모바일 하단 가로 */}
      <AdRails />
    </main>
  );
}
