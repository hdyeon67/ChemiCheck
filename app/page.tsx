import ChemiForm from "@/components/ChemiForm";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pt-6">
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          케미체크
        </h1>
        <p className="mt-1 text-sm font-semibold text-white/90">
          이름 + 생일로 보는 우리 케미 점수
        </p>
      </header>
      <ChemiForm />
      <Footer
        logoSrc={null}
        links={[{ label: "서비스 소개", href: "/about" }]}
        note="재미로 보는 콘텐츠예요 · 입력 정보는 저장되지 않아요"
      />
    </main>
  );
}
