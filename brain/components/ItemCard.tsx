"use client";

import { useRef, useState, type PointerEvent } from "react";
import { BookmarkPlus, X } from "lucide-react";
import { ValueTags } from "@/components/ValueTags";
import type { RawItem } from "@/lib/types";

type ItemCardProps = {
  item: RawItem;
  onRemember: () => void;
  onSkip: () => void;
};

const SWIPE_THRESHOLD = 82;
const SWIPE_LIMIT = 124;

export function ItemCard({ item, onRemember, onSkip }: ItemCardProps) {
  const sourceName = item.author ?? item.source;
  const sourceMark = sourceName.slice(0, 2).toUpperCase();
  const startX = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  function resetDrag() {
    setDragX(0);
    setIsDragging(false);
    activePointerId.current = null;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
    activePointerId.current = event.pointerId;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== event.pointerId) return;
    const nextX = Math.max(-SWIPE_LIMIT, Math.min(SWIPE_LIMIT, event.clientX - startX.current));
    setDragX(nextX);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (dragX >= SWIPE_THRESHOLD) {
      setIsDragging(false);
      setDragX(SWIPE_LIMIT);
      window.setTimeout(() => {
        onRemember();
        resetDrag();
      }, 120);
      return;
    }

    if (dragX <= -SWIPE_THRESHOLD) {
      setIsDragging(false);
      setDragX(-SWIPE_LIMIT);
      window.setTimeout(onSkip, 120);
      return;
    }

    resetDrag();
  }

  return (
    <div className="relative overflow-hidden rounded-lg touch-pan-y">
      <div className="absolute inset-0 flex items-center justify-between rounded-lg bg-zinc-100 px-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-mint">
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          记住
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          略过
          <X className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <article
        className="relative rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_14px_34px_rgba(21,24,29,0.07)]"
        aria-label="向右滑收藏，向左滑略过"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={resetDrag}
        onPointerUp={handlePointerEnd}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 160ms ease"
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
              {sourceMark}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-700">{sourceName}</div>
              <div className="mt-0.5 text-xs text-zinc-400">{item.source}</div>
            </div>
          </div>
          {item.aihot_rank ? (
            <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-2 text-xs font-semibold text-zinc-500">
              {item.aihot_rank}
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-7 text-ink">{item.title}</h2>
        <p className="feed-card-summary mt-3 text-sm leading-6 text-zinc-600">{item.raw_summary}</p>

        <div className="mt-4">
          <ValueTags tags={item.raw_tags} limit={3} />
        </div>
      </article>
    </div>
  );
}
