"use client";

import { useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { MemoryIntentSheet } from "@/components/MemoryIntentSheet";
import { EmptyState } from "@/components/EmptyState";
import { useBrain } from "@/components/BrainProvider";
import type { IntentInput } from "@/lib/memory";

function dateFor(itemDate?: string) {
  const date = itemDate ? new Date(itemDate) : new Date();
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
}

function formatDateLabel(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatTimeLabel(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export default function FeedPage() {
  const { feedItems, getScore, rememberItem, resetDemo, skipItem } = useBrain();
  const [pendingItemId, setPendingItemId] = useState<string | undefined>();
  const pendingItem = feedItems.find((item) => item.id === pendingItemId);
  const pendingScore = pendingItem ? getScore(pendingItem.id) : undefined;

  function confirmRemember(input: IntentInput) {
    if (!pendingItemId) return;
    rememberItem(pendingItemId, input);
    setPendingItemId(undefined);
  }

  if (!feedItems.length) {
    return (
      <EmptyState
        title="Bingo，今天的内容已经刷完了"
        body="已记住的内容会在 Saved 里继续沉淀。"
        action={
          <button type="button" onClick={resetDemo} className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-3 text-sm font-semibold text-white">
            重新开始
          </button>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-5">
        {feedItems.map((item, index) => {
          const score = getScore(item.id);
          if (!score) return null;
          const itemDate = dateFor(item.published_at ?? item.created_at);
          const previousItem = feedItems[index - 1];
          const previousDate = previousItem ? dateFor(previousItem.published_at ?? previousItem.created_at) : undefined;
          const shouldShowDate = !previousDate || formatDateLabel(previousDate) !== formatDateLabel(itemDate);

          return (
            <div key={item.id}>
              {shouldShowDate ? (
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <span>{formatDateLabel(itemDate)}</span>
                  <span className="text-slate-400">⌄</span>
                </div>
              ) : null}
              <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3">
                <div className="relative flex justify-end pr-3 pt-5">
                  <div className="absolute right-0 top-0 h-full w-px bg-zinc-200" />
                  <div className="absolute right-[-4px] top-7 h-2.5 w-2.5 rounded-full border-2 border-paper bg-mint" />
                  <time className="text-sm font-bold leading-none text-slate-800" dateTime={itemDate.toISOString()}>
                    {formatTimeLabel(itemDate)}
                  </time>
                </div>
                <ItemCard
                  item={item}
                  onRemember={() => setPendingItemId(item.id)}
                  onSkip={() => skipItem(item.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <MemoryIntentSheet item={pendingItem} score={pendingScore} onClose={() => setPendingItemId(undefined)} onConfirm={confirmRemember} />
    </>
  );
}
