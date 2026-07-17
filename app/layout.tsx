import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "케미체크 — 우리 궁합 몇 점?",
  description:
    "이름과 생년월일로 보는 재미로 보는 케미 점수 테스트. 썸·친구·직장동료 케미를 확인하고 친구에게 공유해보세요.",
  metadataBase: new URL("https://chemicheck.fineboll.com"),
  openGraph: {
    title: "케미체크 — 우리 궁합 몇 점?",
    description: "이름과 생년월일로 보는 재미 궁합 테스트",
    type: "website",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
