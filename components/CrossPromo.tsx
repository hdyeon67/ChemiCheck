import { PROMOS } from "@/lib/config/promos";

/** 결과 페이지 하단 크로스 프로모션 배너 (config 배열 기반) */
export function CrossPromo() {
  if (PROMOS.length === 0) return null;
  return (
    <div className="mt-6">
      <p className="mb-2 text-center text-xs font-bold text-white/85">
        이런 것도 있어요
      </p>
      <div className="flex flex-col gap-2">
        {PROMOS.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker flex items-center gap-3 px-4 py-3 transition active:scale-[0.98]"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: `${p.color}22` }}
            >
              {p.emoji}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-black text-chemi-violet">
                {p.title}
              </span>
              <span className="block text-xs text-gray-400">{p.desc}</span>
            </span>
            <span className="font-black text-chemi-pink">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
