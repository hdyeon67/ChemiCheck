import Link from "next/link";

/** 전 페이지 공용 푸터 — 엔터테인먼트 고지 + 개인정보 안내 + 내비 */
export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-md px-4 pb-8 text-center text-xs leading-relaxed text-white/80">
      <nav className="flex items-center justify-center gap-3 font-semibold">
        <Link href="/" className="underline underline-offset-2">
          홈
        </Link>
        <span className="text-white/40">·</span>
        <Link href="/about" className="underline underline-offset-2">
          서비스 소개
        </Link>
        <span className="text-white/40">·</span>
        <Link href="/about" className="underline underline-offset-2">
          개인정보 안내
        </Link>
      </nav>
      <p className="mt-3">본 결과는 재미를 위한 엔터테인먼트 콘텐츠입니다.</p>
      <p>입력 정보는 서버에 저장되지 않아요.</p>
      <p className="mt-2 text-white/55">© 케미체크</p>
    </footer>
  );
}
