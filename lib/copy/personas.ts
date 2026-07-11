// 오행 → 캐릭터 페르소나 (동물 + 성향 타입 + 시그니처 색)
//   오행(목화토금수)은 사주 계산의 내부 결과일 뿐, 유저에겐 와닿지 않으므로
//   귀여운 동물 캐릭터와 성향 타입 라벨로 "번역"해 자기 동일시·공유 재미를 준다.
//   (lib 계층 독립성을 위해 색상 hex도 여기서 직접 정의)

import type { Ohaeng } from "../scoring/types";

export interface Persona {
  /** 동물 이모지 */
  emoji: string;
  /** 캐릭터 이름 */
  animal: string;
  /** 성향 타입 라벨 (MBTI식 한 줄) */
  type: string;
  /** 성향 한 줄 설명 */
  vibe: string;
  /** 시그니처 색 (hex) */
  color: string;
}

export const PERSONAS: Record<Ohaeng, Persona> = {
  목: {
    emoji: "🐰",
    animal: "새싹토끼",
    type: "성장 새싹형",
    vibe: "순수하고 무럭무럭 자라는 긍정 에너지",
    color: "#39b869",
  },
  화: {
    emoji: "🦊",
    animal: "불꽃여우",
    type: "열정 스파크형",
    vibe: "텐션 만렙, 매력 폭발하는 분위기 메이커",
    color: "#ff5b5b",
  },
  토: {
    emoji: "🐻",
    animal: "든든곰",
    type: "안정 포용형",
    vibe: "묵직하게 다 받아주는 편안한 안식처",
    color: "#dca23a",
  },
  금: {
    emoji: "🐱",
    animal: "시크냥",
    type: "쿨한 팩폭형",
    vibe: "깔끔하고 똑 부러지는 시크한 완벽주의",
    color: "#9aa4bb",
  },
  수: {
    emoji: "🐬",
    animal: "물빛돌고래",
    type: "감성 힐링형",
    vibe: "섬세하고 자유로운 감성 충만 힐러",
    color: "#41a6ff",
  },
};

export function personaOf(ohaeng: Ohaeng): Persona {
  return PERSONAS[ohaeng];
}
