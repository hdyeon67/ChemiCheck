"use client";

import { useRef, useState } from "react";
import type { ChemiResult, RelationType } from "@/lib/scoring/types";
import type { ChemiReport } from "@/lib/copy/types";
import { loadKakao, isKakaoEnabled } from "@/lib/share/kakao";
import { track } from "@/lib/analytics";
import StoryCard from "./StoryCard";

export default function ShareButtons({
  result,
  report,
  aName,
  bName,
  relation,
}: {
  result: ChemiResult;
  report: ChemiReport;
  aName: string;
  bName: string;
  relation: RelationType;
}) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1800);
  }

  function currentD(): string {
    return new URLSearchParams(window.location.search).get("d") ?? "";
  }

  async function handleCopy() {
    track("share_click", { channel: "link" });
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("링크가 복사됐어요! 친구에게 붙여넣기 📋");
    } catch {
      flash("복사에 실패했어요. 주소창을 길게 눌러 복사해주세요");
    }
  }

  async function handleSaveImage() {
    if (!storyRef.current || busy) return;
    track("share_click", { channel: "png" });
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(storyRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `케미체크_${aName}_${bName}.png`;
      link.href = dataUrl;
      link.click();
      flash("이미지를 저장했어요! 스토리에 올려보세요 🖼️");
    } catch {
      flash("이미지 저장에 실패했어요. 다시 시도해주세요");
    } finally {
      setBusy(false);
    }
  }

  async function handleKakao() {
    track("share_click", { channel: "kakao" });
    const kakao = await loadKakao();
    if (!kakao) {
      flash("카카오 공유는 준비 중이에요. 링크 복사를 이용해주세요!");
      return;
    }
    const origin = window.location.origin;
    const imageUrl = `${origin}/api/og?d=${currentD()}`;
    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${aName} × ${bName} 케미 ${result.score}점! (${report.badge})`,
        description: `${report.chemiType} · 나도 케미 확인하러 가기`,
        imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "나도 케미 확인하기",
          link: { mobileWebUrl: origin, webUrl: origin },
        },
      ],
    });
  }

  return (
    <div className="mt-5">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleKakao}
          className="flex flex-col items-center gap-1 rounded-2xl bg-[#FEE500] px-2 py-3 text-xs font-bold text-[#3A1D1D] shadow active:scale-95"
        >
          <span className="text-lg">💬</span>
          카카오톡
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-xs font-bold text-chemi-violet shadow active:scale-95"
        >
          <span className="text-lg">🔗</span>
          링크 복사
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={busy}
          className="flex flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-xs font-bold text-chemi-violet shadow active:scale-95 disabled:opacity-60"
        >
          <span className="text-lg">🖼️</span>
          {busy ? "저장 중…" : "이미지 저장"}
        </button>
      </div>

      {!isKakaoEnabled && (
        <p className="mt-2 text-center text-[11px] text-white/70">
          카카오 공유는 배포 시 키 설정 후 활성화돼요
        </p>
      )}

      {toast && (
        <div className="mt-3 rounded-2xl bg-black/70 px-4 py-2 text-center text-sm font-semibold text-white">
          {toast}
        </div>
      )}

      {/* 캡처 전용 오프스크린 스토리 카드 (화면 밖에 배치) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          pointerEvents: "none",
        }}
      >
        <StoryCard
          ref={storyRef}
          result={result}
          report={report}
          aName={aName}
          bName={bName}
          relation={relation}
        />
      </div>
    </div>
  );
}
