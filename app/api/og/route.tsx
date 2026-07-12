// 동적 OG 이미지 — 카톡/링크 미리보기에 점수+등급+두 이름 노출 (바이럴 유도)
//   next/og(satori) 기반. 외부 키 불필요. 한글 렌더용 폰트만 공개 CDN에서 가져오되
//   실패해도 이미지는 생성되도록 그레이스풀 폴백.

import { ImageResponse } from "next/og";
import { calculateChemi } from "@/lib/scoring";
import { buildReport, personaOf } from "@/lib/copy";
import { decodePayload } from "@/lib/share/encode";

// Cloudflare Workers(OpenNext)에서는 워커 자체가 엣지 런타임이므로
// Next의 edge runtime 선언을 쓰지 않는다(기본 서버 함수에서 실행).

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

const RELATION_LABEL: Record<string, string> = {
  couple: "썸·연인 케미",
  friend: "친구 케미",
  coworker: "직장동료 케미",
};

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL, { cache: "force-cache" });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get("d"));
  const font = await loadFont();
  const fonts = font
    ? [{ name: "Pretendard", data: font, weight: 700 as const, style: "normal" as const }]
    : undefined;

  // 잘못된 데이터: 브랜드 카드로 폴백
  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Pretendard",
            fontWeight: 700,
            fontSize: 84,
            color: "#fff",
            background: "linear-gradient(135deg,#ff8fd4,#8b5cf6)",
          }}
        >
          케미체크 🧪
        </div>
      ),
      { width: 1200, height: 630, fonts },
    );
  }

  const result = calculateChemi(payload);
  const report = buildReport(result, payload.relation);
  const personaA = personaOf(result.profileA.ohaeng);
  const personaB = personaOf(result.profileB.ohaeng);
  const colorA = personaA.color;
  const colorB = personaB.color;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Pretendard",
          background: "linear-gradient(135deg,#ff8fd4 0%,#c86bf5 45%,#8b5cf6 100%)",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1000,
            padding: "56px 48px",
            borderRadius: 48,
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 20px 60px rgba(80,20,120,0.35)",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#a855f7" }}>
            {RELATION_LABEL[payload.relation] ?? "케미"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 12,
              fontSize: 60,
              fontWeight: 700,
              color: "#2b1746",
            }}
          >
            <span style={{ color: colorA }}>
              {personaA.emoji} {payload.a.name}
            </span>
            <span style={{ color: "#d8b4fe" }}>×</span>
            <span style={{ color: colorB }}>
              {personaB.emoji} {payload.b.name}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: 8,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 200, lineHeight: 1, color: "#c026d3" }}>
              {result.score}
            </span>
            <span style={{ fontSize: 56, color: "#9aa4bb", marginLeft: 8 }}>점</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 12,
              padding: "12px 32px",
              borderRadius: 999,
              background: "linear-gradient(90deg,#ff5db1,#7c3aed)",
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {report.badge} · {report.chemiType}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            fontWeight: 700,
            color: "rgba(255,255,255,0.95)",
          }}
        >
          케미체크 · 나도 해보기
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
