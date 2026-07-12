import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chemicheck.fineboll.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // 결과 페이지는 개인 입력이 담긴 동적 URL이라 색인 대상에서 제외
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
