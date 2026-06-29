"use client";

import { useState } from "react";
import { FilePenLine, Sparkles } from "lucide-react";
import { MarkdownCopyButton } from "@/components/MarkdownCopyButton";
import { EmptyState } from "@/components/EmptyState";
import { useBrain } from "@/components/BrainProvider";
import { outputTypes } from "@/lib/output";
import type { GeneratedOutput, OutputType } from "@/lib/types";

export default function OutputPage() {
  const { state, createOutput } = useBrain();
  const [outputType, setOutputType] = useState<OutputType>("文章大纲");
  const [output, setOutput] = useState<GeneratedOutput | undefined>(state.outputs.at(-1));

  function generate() {
    setOutput(createOutput(outputType));
  }

  if (!state.memories.length) {
    return <EmptyState title="还没有可用于输出的记忆" body="先在首页记住几条内容，Output 会基于你保存的理由生成 Markdown。" />;
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-ink">输出类型</span>
          <select
            value={outputType}
            onChange={(event) => setOutputType(event.target.value as OutputType)}
            className="mt-2 h-11 w-full rounded-md border border-line bg-zinc-50 px-3 text-sm outline-none focus:border-mint focus:bg-white"
          >
            {outputTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={generate} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          生成输出
        </button>
      </section>

      {output ? (
        <section className="border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-mint">
            <FilePenLine className="h-4 w-4" aria-hidden="true" />
            {output.title}
          </div>
          <pre className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-zinc-50 p-3 text-sm leading-6 text-zinc-700 thin-scrollbar">
            {output.content}
          </pre>
          <div className="mt-4">
            <MarkdownCopyButton markdown={output.content} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
