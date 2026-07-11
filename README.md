# 케미체크 (ChemiCheck) 🧪

두 사람의 이름과 생년월일로 **궁합·케미 점수**와 재미있는 해석 리포트를 보여주는
무료 웹앱. 한국 10~20대를 타깃으로 한 바이럴 서비스예요.

> ⚠️ 모든 결과는 **재미를 위한 엔터테인먼트 콘텐츠**입니다.

---

## ✨ 핵심 특징

- **운영비 0원** — 실시간 AI 호출 없이 결정적 로직으로 점수 계산
- **DB 없음** — 결과는 URL(`?d=`)에 base64로 인코딩. 서버 저장 없음
- **환경변수 없이도 동작** — 카카오/애드센스 키는 모두 선택 사항
- **모바일 퍼스트** — 인스타 스토리(9:16) 이미지 저장, 동적 OG 미리보기

## 🛠 기술 스택

| 영역 | 사용 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 스타일 | Tailwind CSS + Pretendard |
| OG 이미지 | `next/og` (satori) |
| 이미지 저장 | `html-to-image` |
| 테스트 | Vitest |
| 배포 | Vercel |

## 🧮 점수 계산 로직

`lib/scoring/` 의 순수 함수로 3개 축을 가중 합산 (같은 입력 → 항상 같은 결과):

| 축 | 가중치 | 내용 |
|---|---|---|
| 이름 케미 | 40% | 한글 획수 궁합(초등학교식) + 초성 조음계열 보정 |
| 사주 오행 | 40% | 1900-01-01 甲戌 기준 일간 → 오행 상생/상극 |
| 띠·별자리 | 20% | 12지지 삼합·육합·충 + 별자리 4원소 궁합 |

최종 점수에 입력 해시 시드 기반 미세 난수(±3)를 더하되, 시드 기반이라 재계산해도 동일.

해석 문구(`lib/copy/`)는 7구간 × 4섹션 × 관계별로 **450개 이상**의 사전 생성 템플릿에서
입력 해시로 결정적으로 선택돼요.

## 🚀 로컬 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm test           # 단위 테스트 (52개)
npm run build      # 프로덕션 빌드
npx tsc --noEmit   # 타입체크
```

## 🔑 환경변수 (모두 선택 사항)

`.env.example` 를 `.env.local` 로 복사한 뒤 필요한 값만 채우면 돼요.
**하나도 설정하지 않아도 앱은 정상 동작**합니다 (카카오 버튼·광고만 비활성).

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오톡 공유 버튼 활성화 (JavaScript 키) |
| `NEXT_PUBLIC_ADFIT_UNIT_SIDE_LEFT` | 데스크톱 좌측 세로 광고 (160×600) |
| `NEXT_PUBLIC_ADFIT_UNIT_SIDE_RIGHT` | 데스크톱 우측 세로 광고 (160×600) |
| `NEXT_PUBLIC_ADFIT_UNIT_MOBILE` | 모바일 하단 가로 광고 (320×100) |

> 광고 배치: **웹(데스크톱)** = 화면 좌·우 세로 광고, **앱(모바일)** = 화면 하단 가로 광고.
> 결과 페이지에만 노출되며, 미설정 시 "광고 준비 중" 플레이스홀더가 표시됩니다.

- **카카오 키**: https://developers.kakao.com → 내 애플리케이션 → 앱 키 → JavaScript 키
  - 플랫폼 > Web 에 배포 도메인 등록, 카카오 로그인/공유 설정 확인
- **애드핏(광고)**: https://adfit.kakao.com → 매체·광고 단위 등록 → **심사 통과 후** 광고 단위
  ID(`DAN-...`) 발급. 미설정 시 결과 페이지에 "광고 준비 중" 플레이스홀더가 노출됩니다.

## ▲ Vercel 배포

1. 이 저장소를 GitHub 등에 푸시
2. [vercel.com/new](https://vercel.com/new) 에서 저장소 임포트
3. 프레임워크 프리셋: **Next.js** (자동 감지, 추가 설정 불필요)
4. (선택) **Settings → Environment Variables** 에 위 환경변수 등록
5. **Deploy** 클릭 → 완료

> OG 이미지 라우트(`/api/og`)는 Edge에서 동작하며 별도 설정이 필요 없어요.
> 배포 후 `metadataBase`(현재 `app/layout.tsx` 의 `chemicheck.vercel.app`)를
> 실제 도메인으로 바꾸면 OG 절대경로가 정확해집니다.

### CLI 배포 (대안)

```bash
npm i -g vercel
vercel          # 미리보기 배포
vercel --prod   # 프로덕션 배포
```

## 📁 구조

```
app/
  page.tsx              랜딩 (입력 폼)
  result/page.tsx       결과 (동적, OG 메타 포함)
  about/page.tsx        서비스 소개 · 개인정보 안내
  api/og/route.tsx      동적 OG 이미지
components/             폼 · 결과뷰 · 점수애니 · 오행 · 공유 · 광고 · 스토리카드
lib/
  scoring/              점수 계산 엔진 + 테스트
  copy/                 해석 문구 풀 + 선택 로직 + 테스트
  share/                URL 인코딩 · 카카오 SDK + 테스트
```

## 🔒 개인정보

이름·생년월일은 **서버에 저장하지 않아요.** 결과는 URL 인코딩만 사용하며,
데이터베이스나 회원가입이 없어요. 자세한 내용은 앱 내 `/about` 페이지 참고.

---

재미로 즐겨주세요! 결과가 마음에 들면 친구에게 공유해보세요 💗
