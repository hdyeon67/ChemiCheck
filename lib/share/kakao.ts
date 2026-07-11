// 카카오 JS SDK 로더 — 키는 env(NEXT_PUBLIC_KAKAO_JS_KEY)로 주입.
//   키가 없으면(로컬/미설정) 조용히 비활성화되어 앱은 정상 동작한다.

const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
// 배포 시 카카오 공식 문서의 2.7.2 SRI 해시를 여기에 넣고 아래 injectScript에서
// s.integrity/s.crossOrigin 을 활성화하면 보안(무결성 검증)이 강화된다.

export const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
export const isKakaoEnabled = Boolean(KAKAO_KEY);

// SDK 타입 최소 선언
type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (settings: unknown) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

function injectScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${KAKAO_SDK_SRC}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = KAKAO_SDK_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(s);
  });
}

/** SDK 로드 + 초기화. 키 없거나 실패 시 null */
export async function loadKakao(): Promise<KakaoSDK | null> {
  if (!KAKAO_KEY || typeof window === "undefined") return null;
  try {
    await injectScript();
    const kakao = window.Kakao;
    if (!kakao) return null;
    if (!kakao.isInitialized()) kakao.init(KAKAO_KEY);
    return kakao;
  } catch {
    return null;
  }
}
