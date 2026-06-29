"use client";

import { BookmarkPlus, ExternalLink } from "lucide-react";
import { ValueTags } from "@/components/ValueTags";
import type { RawItem } from "@/lib/types";

type ItemCardProps = {
  item: RawItem;
  onRemember: () => void;
};

export function ItemCard({ item, onRemember }: ItemCardProps) {
  return (
    <article className="border border-line bg-white p-4 shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-normal text-zinc-400">
            {item.source} {item.aihot_rank ? `#${item.aihot_rank}` : ""} {item.author ? `· ${item.author}` : ""}
          </div>
          <h2 className="mt-2 text-xl font-semibold leading-7 text-ink">{item.title}</h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-600">{item.raw_summary}</p>

      <div className="mt-4">
        <ValueTags tags={item.raw_tags} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onRemember}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-mint px-3 text-sm font-semibold text-white"
        >
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          记住
        </button>
        <a
          href={item.source_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-zinc-50 px-3 text-sm font-semibold text-zinc-700"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          原文
        </a>
      </div>
    </article>
  );
}
