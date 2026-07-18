// 크로스 프로모션 대상 앱 목록 (config 배열).
// 앞으로 앱이 늘면 여기에 항목만 추가하면 배너가 자동 노출된다.
//
// href 는 안정 커스텀 도메인(fineboll.com 서브도메인)을 쓴다. 호스팅과 무관하게
// 동일하게 유지되므로 컷오버 전후 그대로 동작. (케미체크 자신은 목록에서 제외)

export interface PromoApp {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  /** 배너 아이콘 배경 힌트 컬러 */
  color: string;
}

export const PROMOS: PromoApp[] = [
  {
    id: "saju",
    emoji: "🔮",
    title: "내 사주가 궁금하다면?",
    desc: "생년월일로 보는 사주풀이",
    href: "https://saju.fineboll.com",
    color: "#7c5cff",
  },
  {
    id: "goodday",
    emoji: "📅",
    title: "좋은 날이 궁금하다면?",
    desc: "이사·결혼 택일 추천 좋은날",
    href: "https://goodday.fineboll.com",
    color: "#c99a5b",
  },
];
