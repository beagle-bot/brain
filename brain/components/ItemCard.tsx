"use client";

import { BookmarkPlus, ExternalLink } from "lucide-react";
import { ValueTags } from "@/components/ValueTags";
import type { RawItem } from "@/lib/types";

type ItemCardProps = {
  item: RawItem;
  onRemember: () => void;
};

export function ItemCard({ item, onRemember }: ItemCardProps) {
  const sourceName = item.author ?? item.source;
  const sourceMark = sourceName.slice(0, 2).toUpperCase();

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_14px_34px_rgba(21,24,29,0.07)]">
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
        <div className="flex shrink-0 items-center gap-1.5">
          {item.aihot_rank ? (
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-2 text-xs font-semibold text-zinc-500">
              {item.aihot_rank}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onRemember}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm"
            title="记住"
            aria-label="记住"
          >
            <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm"
            title="打开原文"
            aria-label="打开原文"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <h2 className="mt-4 text-lg font-semibold leading-7 text-ink">{item.title}</h2>
      <p className="feed-card-summary mt-3 text-sm leading-6 text-zinc-600">{item.raw_summary}</p>

      <div className="mt-4">
        <ValueTags tags={item.raw_tags} limit={3} />
      </div>
    </article>
  );
}
