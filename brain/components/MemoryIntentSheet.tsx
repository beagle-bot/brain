"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookmarkCheck, Check, Star, X } from "lucide-react";
import { useBrain } from "@/components/BrainProvider";
import { guessMemoryIntent, memoryEmotionOptions, memoryTopicOptions, normalizeIntentInput, ratingDescriptions, type IntentInput } from "@/lib/memory";
import type { ItemScore, MemoryEmotion, MemoryTopic, RawItem, UserRating } from "@/lib/types";

type MemoryIntentSheetProps = {
  item?: RawItem;
  score?: ItemScore;
  initialInput?: IntentInput;
  mode?: "create" | "edit";
  onClose: () => void;
  onConfirm: (input: IntentInput) => void;
};

function ChoiceButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center rounded-md border px-2.5 text-xs font-semibold ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}

function RatingPicker({ value, onChange }: { value: UserRating; onChange: (rating: UserRating) => void }) {
  const ratings: UserRating[] = [1, 2, 3, 4, 5];

  return (
    <div>
      <div className="flex items-center gap-1">
        {ratings.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-amber-500"
            aria-label={`${rating} 星`}
          >
            <Star className="h-6 w-6" fill={rating <= value ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{ratingDescriptions[value]}</p>
    </div>
  );
}

export function MemoryIntentSheet({ item, score, initialInput, mode = "create", onClose, onConfirm }: MemoryIntentSheetProps) {
  const { state } = useBrain();
  const guess = useMemo(() => (item && score ? guessMemoryIntent(item, score, state.profile) : null), [item, score, state.profile]);
  const startingInput = useMemo(() => normalizeIntentInput(initialInput ?? guess), [guess, initialInput]);
  const [rating, setRating] = useState<UserRating>(startingInput.user_rating);
  const [topic, setTopic] = useState<MemoryTopic>(startingInput.topic);
  const [emotion, setEmotion] = useState<MemoryEmotion | undefined>(startingInput.emotion);
  const [note, setNote] = useState(startingInput.user_note ?? "");

  useEffect(() => {
    const next = normalizeIntentInput(initialInput ?? guess);
    setRating(next.user_rating);
    setTopic(next.topic);
    setEmotion(next.emotion);
    setNote(next.user_note ?? "");
  }, [guess, initialInput, item?.id]);

  if (!item || !score) return null;

  const title = mode === "edit" ? "编辑这条记忆" : "已收藏。你想怎么记住它？";
  const confirmText = mode === "edit" ? "保存修改" : "确认保存";

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-ink/35 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" role="dialog" aria-modal="true">
      <section className="mx-auto max-h-[88vh] w-full max-w-screen-sm overflow-y-auto rounded-lg border border-line bg-white p-4 shadow-lift thin-scrollbar">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex h-8 items-center gap-2 rounded-md bg-emerald-50 px-2 text-xs font-semibold text-mint">
              <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              {mode === "edit" ? "编辑收藏" : "已收藏"}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">只需要确认星级和主题，备注可以只写一句。</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white" aria-label="关闭">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">有用性</h3>
            <div className="mt-2">
              <RatingPicker value={rating} onChange={setRating} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">主题</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {memoryTopicOptions.map((option) => (
                <ChoiceButton key={option} active={topic === option} onClick={() => setTopic(option)}>
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">情绪</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {memoryEmotionOptions.map((option) => (
                <ChoiceButton key={option} active={emotion === option} onClick={() => setEmotion(emotion === option ? undefined : option)}>
                  {option}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-ink">我的备注</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="我为什么想记住它？"
              className="mt-2 min-h-24 w-full resize-none rounded-md border border-line bg-zinc-50 px-3 py-2 text-sm leading-6 outline-none focus:border-mint focus:bg-white"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => onConfirm({ user_rating: rating, topic, emotion, user_note: note })}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {confirmText}
        </button>
      </section>
    </div>
  );
}
