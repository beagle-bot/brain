"use client";

import { useEffect, useMemo, useState } from "react";
import { BookmarkCheck, Check, X } from "lucide-react";
import { useBrain } from "@/components/BrainProvider";
import { emotionTagOptions, guessMemoryIntent, intentValueTagOptions, type IntentInput, useCaseTagOptions } from "@/lib/memory";
import type { ItemScore, RawItem } from "@/lib/types";

type MemoryIntentSheetProps = {
  item?: RawItem;
  score?: ItemScore;
  onClose: () => void;
  onConfirm: (input: IntentInput) => void;
};

function toggleTag(tags: string[], tag: string) {
  return tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag];
}

function TagButton({ active, tag, onClick }: { active: boolean; tag: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs font-semibold ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-zinc-600"
      }`}
    >
      {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {tag}
    </button>
  );
}

export function MemoryIntentSheet({ item, score, onClose, onConfirm }: MemoryIntentSheetProps) {
  const { state } = useBrain();
  const guess = useMemo(() => (item && score ? guessMemoryIntent(item, score, state.profile) : null), [item, score, state.profile]);
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [valueTags, setValueTags] = useState<string[]>([]);
  const [useCaseTags, setUseCaseTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    setEmotionTags(guess?.emotion_tags ?? []);
    setValueTags(guess?.value_tags ?? []);
    setUseCaseTags(guess?.use_case_tags ?? []);
    setNote("");
  }, [guess, item?.id]);

  if (!item || !score || !guess) return null;

  const input: IntentInput = {
    emotion_tags: emotionTags,
    value_tags: valueTags,
    use_case_tags: useCaseTags,
    user_note: note
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-ink/35 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" role="dialog" aria-modal="true">
      <section className="mx-auto max-h-[88vh] w-full max-w-screen-sm overflow-y-auto border border-line bg-white p-4 shadow-lift thin-scrollbar">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex h-8 items-center gap-2 rounded-md bg-emerald-50 px-2 text-xs font-semibold text-mint">
              <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              已收藏
            </div>
            <h2 className="mt-3 text-xl font-semibold text-ink">你想怎么记住它？</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{guess.ai_guess_reason}</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white" aria-label="关闭">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">情绪反应</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {emotionTagOptions.map((tag) => (
                <TagButton key={tag} tag={tag} active={emotionTags.includes(tag)} onClick={() => setEmotionTags(toggleTag(emotionTags, tag))} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">价值类型</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {intentValueTagOptions.map((tag) => (
                <TagButton key={tag} tag={tag} active={valueTags.includes(tag)} onClick={() => setValueTags(toggleTag(valueTags, tag))} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">未来用途</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {useCaseTagOptions.map((tag) => (
                <TagButton key={tag} tag={tag} active={useCaseTags.includes(tag)} onClick={() => setUseCaseTags(toggleTag(useCaseTags, tag))} />
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-ink">备注</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="可选输入一句话"
              className="mt-2 min-h-24 w-full resize-none rounded-md border border-line bg-zinc-50 px-3 py-2 text-sm leading-6 outline-none focus:border-mint focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onConfirm(input)} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white">
            <Check className="h-4 w-4" aria-hidden="true" />
            确认保存
          </button>
          <button type="button" onClick={() => onConfirm(guess)} className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-700">
            使用默认理由保存
          </button>
        </div>
      </section>
    </div>
  );
}
