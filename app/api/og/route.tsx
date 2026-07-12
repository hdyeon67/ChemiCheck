// 동적 OG 이미지 — 카톡/링크 미리보기에 점수+등급+두 이름 노출 (바이럴 유도)
//   next/og(satori) 기반. 외부 키·CDN 불필요.
//   Cloudflare Workers(128MB) 제약에 맞춰 메모리를 최소화:
//   - 한글 폰트는 워커 ASSETS의 KS X 1001 서브셋(337KB)
//   - 솔리드 배경/뱃지(그라데이션·섀도 없음), 600×315 캔버스
//   - Cache API로 d별 1회만 렌더 후 엣지 캐시

import { ImageResponse } from "next/og";
import { calculateChemi } from "@/lib/scoring";
import { buildReport, personaOf } from "@/lib/copy";
import { decodePayload } from "@/lib/share/encode";

const FONT_PATH = "/fonts/pretendard-kr-subset.ttf";

const RELATION_LABEL: Record<string, string> = {
  couple: "썸·연인 케미",
  friend: "친구 케미",
  coworker: "직장동료 케미",
};

const W = 600;
const H = 315;

// 따뜻한 아이솔레이트 안에서 폰트를 한 번만 받아 재사용(매 렌더 재fetch/파싱 방지)
let cachedFont: ArrayBuffer | null = null;
async function loadFont(origin: string): Promise<ArrayBuffer | null> {
  if (cachedFont) return cachedFont;
  try {
    const res = await fetch(new URL(FONT_PATH, origin), { cache: "force-cache" });
    if (!res.ok) return null;
    cachedFont = await res.arrayBuffer();
    return cachedFont;
  } catch {
    return null;
  }
}

// OG 이미지는 d별로 결정적 → 엣지에서 오래 캐시.
const OG_HEADERS = {
  "Cache-Control": "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
};

// Cloudflare는 Worker가 "생성한" 응답을 헤더만으로 자동 캐시하지 않는다.
// Cache API로 명시적으로 캐시해, 같은 d 요청은 한 번만 렌더한다.
export async function GET(req: Request): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const cacheKey = new Request(new URL(req.url).toString(), { method: "GET" });

  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const res = await render(req);

  if (cache && res.ok) {
    try {
      await cache.put(cacheKey, res.clone());
    } catch {
      /* 캐시 저장 실패는 무시 */
    }
  }
  return res;
}

async function render(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get("d"));
  const font = await loadFont(req.url);
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
            fontSize: 44,
            color: "#fff",
            background: "#8b5cf6",
          }}
        >
          케미체크
        </div>
      ),
      { width: W, height: H, fonts, headers: OG_HEADERS },
    );
  }

  const result = calculateChemi(payload);
  const report = buildReport(result, payload.relation);
  const colorA = personaOf(result.profileA.ohaeng).color;
  const colorB = personaOf(result.profileB.ohaeng).color;

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
          background: "#8b5cf6",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 500,
            padding: "26px 24px",
            borderRadius: 24,
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#a855f7" }}>
            {RELATION_LABEL[payload.relation] ?? "케미"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 6,
              fontSize: 32,
              fontWeight: 700,
              color: "#2b1746",
            }}
          >
            <span style={{ color: colorA }}>{payload.a.name}</span>
            <span style={{ color: "#d8b4fe", margin: "0 10px" }}>×</span>
            <span style={{ color: colorB }}>{payload.b.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", marginTop: 4, fontWeight: 700 }}>
            <span style={{ fontSize: 104, lineHeight: 1, color: "#c026d3" }}>{result.score}</span>
            <span style={{ fontSize: 30, color: "#9aa4bb", marginLeft: 4 }}>점</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 8,
              padding: "6px 18px",
              borderRadius: 999,
              background: "#ff5db1",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {report.badge} · {report.chemiType}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 16,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          케미체크 · 나도 해보기
        </div>
      </div>
    ),
    { width: W, height: H, fonts, headers: OG_HEADERS },
  );
}
