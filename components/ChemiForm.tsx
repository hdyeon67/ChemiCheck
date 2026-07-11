"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RelationType } from "@/lib/scoring/types";
import { encodePayload } from "@/lib/share/encode";

const RELATIONS: { value: RelationType; label: string; emoji: string }[] = [
  { value: "couple", label: "썸/연인", emoji: "💗" },
  { value: "friend", label: "친구", emoji: "🤝" },
  { value: "coworker", label: "직장동료", emoji: "💼" },
];

const HANGUL = /^[가-힣]{1,10}$/;

function PersonFields({
  title,
  name,
  birth,
  onName,
  onBirth,
}: {
  title: string;
  name: string;
  birth: string;
  onName: (v: string) => void;
  onBirth: (v: string) => void;
}) {
  return (
    <div className="sticker p-4">
      <div className="mb-3 text-sm font-extrabold text-chemi-pink">{title}</div>
      <div className="mb-3">
        <label className="field-label">이름</label>
        <input
          className="field-input"
          type="text"
          inputMode="text"
          placeholder="한글 이름"
          maxLength={10}
          value={name}
          onChange={(e) => onName(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">생년월일</label>
        <input
          className="field-input"
          type="date"
          min="1920-01-01"
          max="2020-12-31"
          value={birth}
          onChange={(e) => onBirth(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function ChemiForm() {
  const router = useRouter();
  const [aName, setAName] = useState("");
  const [aBirth, setABirth] = useState("");
  const [bName, setBName] = useState("");
  const [bBirth, setBBirth] = useState("");
  const [relation, setRelation] = useState<RelationType>("couple");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!HANGUL.test(aName.trim()) || !HANGUL.test(bName.trim())) {
      setError("이름은 한글로 입력해주세요 (10자 이내)");
      return;
    }
    if (!aBirth || !bBirth) {
      setError("두 사람의 생년월일을 모두 입력해주세요");
      return;
    }
    setError("");
    const d = encodePayload({
      a: { name: aName.trim(), birth: aBirth },
      b: { name: bName.trim(), birth: bBirth },
      relation,
    });
    router.push(`/result?d=${d}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <PersonFields
        title="나"
        name={aName}
        birth={aBirth}
        onName={setAName}
        onBirth={setABirth}
      />
      <PersonFields
        title="상대"
        name={bName}
        birth={bBirth}
        onName={setBName}
        onBirth={setBBirth}
      />

      <div className="sticker p-4">
        <div className="mb-2 text-sm font-extrabold text-chemi-pink">
          우리 관계는?
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RELATIONS.map((r) => {
            const active = relation === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRelation(r.value)}
                className={`rounded-2xl px-2 py-3 text-sm font-bold transition active:scale-95 ${
                  active
                    ? "bg-gradient-to-r from-chemi-pink to-chemi-violet text-white shadow-md"
                    : "bg-purple-50 text-chemi-violet"
                }`}
              >
                <span className="mr-1">{r.emoji}</span>
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-center text-sm font-semibold text-white drop-shadow">
          {error}
        </p>
      )}

      <button type="submit" className="btn-pop mt-1 w-full py-4 text-lg">
        케미 확인하기 ✨
      </button>

      <p className="pb-2 text-center text-xs text-white/85">
        입력 정보는 저장되지 않아요 · 재미로 보는 콘텐츠예요
      </p>
    </form>
  );
}
