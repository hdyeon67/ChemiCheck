import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "케미체크 소개 · 개인정보 안내",
  description: "케미체크는 재미로 보는 궁합 테스트예요. 입력 정보는 저장되지 않아요.",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sticker p-5">
      <h2 className="mb-2 text-base font-black text-chemi-pink">{title}</h2>
      <div className="space-y-1.5 text-[15px] leading-relaxed text-chemi-violet">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <header className="mb-4 text-center text-white drop-shadow">
        <h1 className="text-2xl font-black">케미체크는요</h1>
        <p className="mt-1 text-sm font-semibold text-white/90">
          이름 + 생일로 보는 우리 케미 점수
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Card title="어떤 서비스인가요?">
          <p>
            두 사람의 이름과 생년월일로 케미 점수와 재미있는 해석을 보여주는 무료
            테스트예요. 썸·연인, 친구, 직장동료 관계에 맞춰 결과가 달라져요.
          </p>
        </Card>

        <Card title="점수는 어떻게 나오나요?">
          <p>
            이름 획수 궁합, 사주 오행(일간) 상생·상극, 띠·별자리 궁합을 섞어
            계산해요. 같은 입력이면 항상 같은 결과가 나오도록 만들었어요.
          </p>
        </Card>

        <Card title="⚠️ 재미로 봐주세요">
          <p>
            본 서비스의 모든 결과는 <b>재미를 위한 엔터테인먼트 콘텐츠</b>예요.
            과학적·통계적 근거가 있는 것이 아니며, 실제 관계를 판단하는 근거로
            사용하지 말아주세요.
          </p>
        </Card>

        <Card title="🔒 개인정보 안내">
          <p>
            입력하신 이름·생년월일은 <b>서버에 저장되지 않아요.</b> 결과는 주소(URL)에
            암호화되어 담기며, 계산은 그때그때 수행돼요. 별도의 데이터베이스나 회원가입이
            없어요.
          </p>
          <p>
            결과 링크를 공유하면 링크에 담긴 정보로 상대방도 같은 결과를 볼 수 있어요.
          </p>
        </Card>
      </div>

      <Link href="/" className="btn-pop mt-5 w-full py-4 text-lg">
        케미 확인하러 가기 ✨
      </Link>

      <Footer
        logoSrc={null}
        links={[{ label: "홈", href: "/" }]}
        note="재미로 보는 콘텐츠예요 · 입력 정보는 저장되지 않아요"
      />
    </main>
  );
}
