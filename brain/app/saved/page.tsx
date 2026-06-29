"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Home, Pencil } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { MarkdownCopyButton } from "@/components/MarkdownCopyButton";
import { MemoryIntentSheet } from "@/components/MemoryIntentSheet";
import { ValueTags } from "@/components/ValueTags";
import { useBrain } from "@/components/BrainProvider";
import { memoryTopicOptions, normalizeIntentInput, type IntentInput } from "@/lib/memory";
import type { BrainState, MemoryCard, MemoryEmotion, MemoryIntent, MemoryTopic, RawItem, UserRating } from "@/lib/types";

type SavedView = "time" | "rating" | "topic";

type SavedEntry = {
  memory: MemoryCard;
  intent: IntentInput;
  item?: RawItem;
};

type LegacyMemory = Partial<MemoryCard> & {
  emotion_tags?: string[];
  value_tags?: string[];
  use_case_tags?: string[];
};

const viewLabels: Record<SavedView, string> = {
  time: "时间",
  rating: "星级",
  topic: "主题"
};

function asTimestamp(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatSavedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知时间";
  return date.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function stars(rating: UserRating) {
  return "★".repeat(rating);
}

function isTopic(value: unknown): value is MemoryTopic {
  return typeof value === "string" && memoryTopicOptions.includes(value as MemoryTopic);
}

function findIntent(state: BrainState, memory: MemoryCard) {
  return state.intents.find((intent) => intent.id === memory.intent_id || intent.item_id === memory.item_id) as Partial<MemoryIntent> | undefined;
}

function intentForMemory(state: BrainState, memory: MemoryCard): IntentInput {
  const intent = findIntent(state, memory);
  const legacy = memory as LegacyMemory;
  const legacyTopic = legacy.related_topics?.find(isTopic) ?? legacy.value_tags?.find(isTopic);
  const legacyEmotion = legacy.emotion_tags?.find((tag): tag is MemoryEmotion => ["惊艳", "共鸣", "困惑", "怀疑"].includes(tag));

  return normalizeIntentInput({
    user_rating: intent?.user_rating ?? legacy.user_rating,
    topic: intent?.topic ?? legacy.topic ?? legacyTopic,
    emotion: intent?.emotion ?? legacy.emotion ?? legacyEmotion,
    user_note: intent?.user_note ?? legacy.user_note
  });
}

function sortEntries(entries: SavedEntry[], view: SavedView) {
  return [...entries].sort((first, second) => {
    if (view === "rating") {
      return second.intent.user_rating - first.intent.user_rating || asTimestamp(second.memory.created_at) - asTimestamp(first.memory.created_at);
    }

    if (view === "topic") {
      return first.intent.topic.localeCompare(second.intent.topic, "zh-CN") || second.intent.user_rating - first.intent.user_rating || asTimestamp(second.memory.created_at) - asTimestamp(first.memory.created_at);
    }

    return asTimestamp(second.memory.created_at) - asTimestamp(first.memory.created_at);
  });
}

function MemoryArticle({ entry, onEdit }: { entry: SavedEntry; onEdit: () => void }) {
  const { memory, intent, item } = entry;
  const tags = [intent.topic, `${intent.user_rating} 星`, intent.emotion].filter(Boolean) as string[];

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
            <span className="text-amber-500">{stars(intent.user_rating)}</span>
            <span>{intent.topic}</span>
            {intent.emotion ? <span>{intent.emotion}</span> : null}
            <span>{formatSavedDate(memory.created_at)}</span>
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-7 text-ink">{memory.title}</h2>
        </div>
        <button type="button" onClick={onEdit} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-white text-zinc-600" aria-label="编辑收藏备注">
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-600">{intent.user_note || memory.why_i_saved_it}</p>
      <div className="mt-3">
        <ValueTags tags={tags} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <MarkdownCopyButton markdown={memory.markdown_content} />
        {item?.source_url ? (
          <a
            href={item.source_url}
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
  );
}

export default function SavedPage() {
  const { state, getItem, getScore, rememberItem } = useBrain();
  const [view, setView] = useState<SavedView>("time");
  const [editingMemoryId, setEditingMemoryId] = useState<string | undefined>();
  const entries = useMemo<SavedEntry[]>(
    () =>
      state.memories.map((memory) => ({
        memory,
        intent: intentForMemory(state, memory),
        item: getItem(memory.item_id)
      })),
    [getItem, state]
  );
  const sortedEntries = useMemo(() => sortEntries(entries, view), [entries, view]);
  const editingEntry = entries.find((entry) => entry.memory.id === editingMemoryId);
  const activeTopicCount = new Set(entries.map((entry) => entry.intent.topic)).size;

  function confirmEdit(input: IntentInput) {
    if (!editingEntry) return;
    rememberItem(editingEntry.memory.item_id, input);
    setEditingMemoryId(undefined);
  }

  if (!entries.length) {
    return (
      <EmptyState
        title="还没有记住内容"
        body="在首页右滑收藏后，会弹出轻量备注面板，确认后这里会保存你的星级、主题和备注。"
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
    <>
      <div className="space-y-4">
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">已记住</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {entries.length} 条内容，沉淀到 {activeTopicCount} 个主题。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(viewLabels) as SavedView[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`h-10 rounded-md border text-sm font-semibold ${
                  view === key ? "border-ink bg-ink text-white" : "border-line bg-white text-zinc-600"
                }`}
              >
                {viewLabels[key]}
              </button>
            ))}
          </div>
        </section>

        {view === "topic" ? (
          <div className="space-y-6">
            {memoryTopicOptions
              .map((topic) => ({
                topic,
                entries: sortedEntries.filter((entry) => entry.intent.topic === topic)
              }))
              .filter((group) => group.entries.length)
              .map((group) => {
                const highValueCount = group.entries.filter((entry) => entry.intent.user_rating >= 4).length;
                return (
                  <section key={group.topic} className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-ink">{group.topic}</h3>
                        <p className="mt-1 text-xs text-zinc-500">
                          {group.entries.length} 条内容 · {highValueCount} 条高有用性
                        </p>
                      </div>
                    </div>
                    {group.entries.map((entry) => (
                      <MemoryArticle key={entry.memory.id} entry={entry} onEdit={() => setEditingMemoryId(entry.memory.id)} />
                    ))}
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEntries.map((entry) => (
              <MemoryArticle key={entry.memory.id} entry={entry} onEdit={() => setEditingMemoryId(entry.memory.id)} />
            ))}
          </div>
        )}
      </div>

      <MemoryIntentSheet
        mode="edit"
        item={editingEntry?.item}
        score={editingEntry?.item ? getScore(editingEntry.item.id) : undefined}
        initialInput={editingEntry?.intent}
        onClose={() => setEditingMemoryId(undefined)}
        onConfirm={confirmEdit}
      />
    </>
  );
}
