"use client";

import { useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { MemoryIntentSheet } from "@/components/MemoryIntentSheet";
import { EmptyState } from "@/components/EmptyState";
import { useBrain } from "@/components/BrainProvider";
import type { IntentInput } from "@/lib/memory";

export default function FeedPage() {
  const { feedItems, getScore, rememberItem, resetDemo } = useBrain();
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
        title="今天的 Feed 已处理完"
        body="已记住的内容会从首页消失。你可以去 Saved 查看自己的记住理由。"
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
      <div className="space-y-4">
        {feedItems.map((item) => {
          const score = getScore(item.id);
          if (!score) return null;

          return (
            <ItemCard
              key={item.id}
              item={item}
              onRemember={() => setPendingItemId(item.id)}
            />
          );
        })}
      </div>

      <MemoryIntentSheet item={pendingItem} score={pendingScore} onClose={() => setPendingItemId(undefined)} onConfirm={confirmRemember} />
    </>
  );
}
