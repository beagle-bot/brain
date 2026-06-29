"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useBrain } from "@/components/BrainProvider";
import type { UserProfile } from "@/lib/types";

type ListKey = "current_projects" | "goals" | "preferred_topics" | "disliked_topics" | "preferred_content_types" | "output_goals";

const listFields: Array<{ key: ListKey; label: string }> = [
  { key: "current_projects", label: "当前项目" },
  { key: "goals", label: "当前目标" },
  { key: "preferred_topics", label: "感兴趣主题" },
  { key: "disliked_topics", label: "不感兴趣主题" },
  { key: "preferred_content_types", label: "偏好内容类型" },
  { key: "output_goals", label: "希望产出的内容类型" }
];

function parseList(value: string) {
  return value
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const { state, saveProfile } = useBrain();
  const [draft, setDraft] = useState<UserProfile>(state.profile);
  const [listDraft, setListDraft] = useState<Record<ListKey, string>>(() =>
    Object.fromEntries(listFields.map((field) => [field.key, state.profile[field.key].join("\n")])) as Record<ListKey, string>
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(state.profile);
    setListDraft(Object.fromEntries(listFields.map((field) => [field.key, state.profile[field.key].join("\n")])) as Record<ListKey, string>);
  }, [state.profile]);

  function updateField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function submit() {
    saveProfile({
      ...draft,
      current_projects: parseList(listDraft.current_projects),
      goals: parseList(listDraft.goals),
      preferred_topics: parseList(listDraft.preferred_topics),
      disliked_topics: parseList(listDraft.disliked_topics),
      preferred_content_types: parseList(listDraft.preferred_content_types),
      output_goals: parseList(listDraft.output_goals)
    });
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-ink">我的角色</span>
          <input
            value={draft.role}
            onChange={(event) => updateField("role", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-line bg-zinc-50 px-3 text-sm outline-none focus:border-mint focus:bg-white"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-semibold text-ink">我的知识水平</span>
          <textarea
            value={draft.level}
            onChange={(event) => updateField("level", event.target.value)}
            className="mt-2 min-h-20 w-full resize-none rounded-md border border-line bg-zinc-50 px-3 py-2 text-sm leading-6 outline-none focus:border-mint focus:bg-white"
          />
        </label>
      </section>

      {listFields.map((field) => (
        <section key={field.key} className="border border-line bg-white p-4 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-ink">{field.label}</span>
            <textarea
              value={listDraft[field.key]}
              onChange={(event) => {
                setListDraft((current) => ({ ...current, [field.key]: event.target.value }));
                setSaved(false);
              }}
              className="mt-2 min-h-28 w-full resize-none rounded-md border border-line bg-zinc-50 px-3 py-2 text-sm leading-6 outline-none focus:border-mint focus:bg-white"
            />
          </label>
        </section>
      ))}

      <section className="border border-line bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-ink">自定义描述</span>
          <textarea
            value={draft.custom_description}
            onChange={(event) => updateField("custom_description", event.target.value)}
            className="mt-2 min-h-32 w-full resize-none rounded-md border border-line bg-zinc-50 px-3 py-2 text-sm leading-6 outline-none focus:border-mint focus:bg-white"
          />
        </label>
      </section>

      <button type="button" onClick={submit} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white">
        <Save className="h-4 w-4" aria-hidden="true" />
        {saved ? "已保存" : "保存画像并重新评分"}
      </button>
    </div>
  );
}
