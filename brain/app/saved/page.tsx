"use client";

import Link from "next/link";
import { ExternalLink, Home } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { MarkdownCopyButton } from "@/components/MarkdownCopyButton";
import { ValueTags } from "@/components/ValueTags";
import { useBrain } from "@/components/BrainProvider";

export default function SavedPage() {
  const { state, getItem } = useBrain();
  const memories = [...state.memories].reverse();

  if (!memories.length) {
    return (
      <EmptyState
        title="还没有记住内容"
        body="在首页点击记住后，会先弹出“为什么想记住它”，确认后这里会保存你的理由。"
        action={
          <Link href="/" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white">
            <Home className="h-4 w-4" aria-hidden="true" />
            回到 Feed
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <article key={memory.id} className="border border-line bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-normal text-zinc-400">{memory.memory_type}</div>
              <h2 className="mt-2 text-lg font-semibold leading-7 text-ink">{memory.title}</h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{memory.why_i_saved_it}</p>
          <div className="mt-3">
            <ValueTags tags={[...memory.value_tags, ...memory.use_case_tags]} limit={6} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <MarkdownCopyButton markdown={memory.markdown_content} />
            {getItem(memory.item_id)?.source_url ? (
              <a
                href={getItem(memory.item_id)?.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-zinc-50 px-3 text-sm font-semibold text-zinc-700"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                原文
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
