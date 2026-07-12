import type { Metadata } from "next";
import Link from "next/link";
import { calculateChemi } from "@/lib/scoring";
import { buildReport } from "@/lib/copy";
import { decodePayload } from "@/lib/share/encode";
import ResultView from "@/components/ResultView";

// 결과는 URL 쿼리(?d=)에 따라 달라지므로 동적 렌더링
export const dynamic = "force-dynamic";

// 카톡·SNS 미리보기용 동적 OG 메타태그 (점수+등급+두 이름)
// Next 15: searchParams 는 Promise
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const { d } = await searchParams;
  const payload = decodePayload(d);
  if (!payload) {
    return { title: "케미체크 결과" };
  }
  const result = calculateChemi(payload);
  const report = buildReport(result, payload.relation);
  const title = `${payload.a.name} × ${payload.b.name} 케미 ${result.score}점! (${report.badge})`;
  const description = `${report.chemiType} · 나도 케미 확인하러 가기`;
  const ogUrl = `/api/og?d=${d ?? ""}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 600, height: 315 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const payload = decodePayload(d);

  if (!payload) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="sticker px-6 py-8">
          <p className="text-lg font-black text-chemi-violet">
            결과를 불러올 수 없어요 😢
          </p>
          <p className="mt-1 text-sm text-gray-500">
            링크가 잘못되었거나 만료된 것 같아요.
          </p>
          <Link href="/" className="btn-pop mt-5">
            처음부터 다시 하기
          </Link>
        </div>
      </main>
    );
  }

  const result = calculateChemi(payload);
  const report = buildReport(result, payload.relation);

  return (
    <ResultView
      result={result}
      report={report}
      aName={payload.a.name}
      bName={payload.b.name}
      relation={payload.relation}
    />
  );
}
