import type { Persona } from "@/lib/copy/personas";

/** 캐릭터 페르소나 뱃지 — 동물 이모지 + 이름 + 캐릭터명 + 성향 타입 */
export function PersonaBadge({
  persona,
  name,
  size = 68,
}: {
  persona: Persona;
  name?: string;
  size?: number;
}) {
  return (
    <div className="flex w-[6.5rem] flex-col items-center gap-1.5">
      <div
        className="flex items-center justify-center rounded-2xl shadow-md ring-4 ring-white"
        style={{ width: size, height: size, backgroundColor: persona.color }}
        aria-hidden
      >
        <span style={{ fontSize: size * 0.5 }}>{persona.emoji}</span>
      </div>
      <div className="text-center leading-tight">
        {name && (
          <div className="max-w-[6.5rem] truncate text-xs font-semibold text-gray-400">
            {name}
          </div>
        )}
        <div className="text-sm font-black" style={{ color: persona.color }}>
          {persona.animal}
        </div>
        <div className="text-[11px] font-bold text-chemi-violet">
          {persona.type}
        </div>
      </div>
    </div>
  );
}
