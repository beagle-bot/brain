import type { BrainState, GeneratedOutput, MemoryCard, OutputType } from "@/lib/types";
import { makeId, nowIso } from "@/lib/utils";

export const outputTypes: OutputType[] = ["文章大纲", "产品判断", "决策备忘录", "项目 backlog", "一周认知复盘"];

function sectionFromMemories(memories: MemoryCard[]) {
  if (!memories.length) {
    return "- 信息不足：还没有记住任何内容。先在首页记住 2-3 条高相关内容，再生成会更有用。";
  }

  return memories.map((memory) => `- **${memory.title}**（${memory.topic} · ${memory.user_rating} 星）：${memory.one_sentence_value}`).join("\n");
}

function bodyByType(type: OutputType, memories: MemoryCard[]) {
  const titles = memories.map((memory) => memory.title);

  if (type === "项目 backlog") {
    return `## Backlog

${memories
  .map(
    (memory, index) => `- [ ] ${index + 1}. 基于「${memory.title}」验证一个小功能或判断
  - 价值：${memory.one_sentence_value}
  - 下一步：把它拆成 30 分钟内可完成的实验`
  )
  .join("\n") || "- [ ] 先记住至少一条内容"}
`;
  }

  if (type === "产品判断") {
    return `## 判断

brain v0.1 的关键不是把 AI HOT 保存下来，而是把用户选择、选择理由和未来用途一起编译成可复用资产。

## 依据

${sectionFromMemories(memories)}

## 风险

- 如果 Memory Intent 太重，用户会回到普通收藏。
- 如果输出无法体现保存理由，brain 会退回普通收藏工具。
- 如果输出无法复制到 Obsidian 或文档，沉淀资产的复用价值会下降。
`;
  }

  if (type === "决策备忘录") {
    return `## 背景

最近记住的内容集中在 ${titles.slice(0, 3).join("、") || "暂无内容"}。

## 可选决策

- 继续优先做本地 mock 闭环，先验证手机端刷卡和 Memory Intent 的体验。
- 暂缓复杂 RAG，把 Topic Page 作为长期判断层。
- 输出模块先做 Markdown 复制，而不是 Obsidian 自动同步。

## 建议

先把“记住一条内容后能立刻生成可复用资产”做到顺滑，再接真实 AI HOT 和 OpenAI。
`;
  }

  if (type === "一周认知复盘") {
    return `## 本周看见了什么

${sectionFromMemories(memories)}

## 判断变化

- 更倾向于把知识库设计成 Memory Card + Manual + Topic Page，而不是只做普通 RAG。
- 移动端选择动作需要非常轻，保存后的智能编译承担更多负担。

## 下周行动

- 继续收集反例：哪些信息不值得进入 brain。
- 用已保存记忆生成一篇产品判断，检验输出质量。
`;
  }

  return `## 标题建议

为什么 brain 不应该只是一个 AI HOT 收藏夹

## 核心论点

用户真正需要的不是更多信息，而是把“我选择过的信息”和“我为什么选择它”转成长期可复用的认知资产。

## 可引用素材

${sectionFromMemories(memories)}

## 文章结构

1. AI 信息流为什么造成 FOMO。
2. 普通收藏为什么无法形成长期价值。
3. Memory Intent 让信息带上个人选择理由。
4. Memory Card 和 Topic Page 如何把内容转成判断。
5. v0.1 应先验证手机端轻量闭环，而不是追求完整知识库。
`;
}

export function generateOutput(state: BrainState, outputType: OutputType): GeneratedOutput {
  const memories = state.memories.slice(-5).reverse();
  const title = `${outputType} - 最近记住`;
  const content = `---
type: ${outputType}
created: ${nowIso()}
profile: ${state.profile.role}
---

# ${title}

## 用户画像

${state.profile.custom_description}

## 相关记忆

${sectionFromMemories(memories)}

${bodyByType(outputType, memories)}
`;

  return {
    id: makeId("output"),
    output_type: outputType,
    title,
    content,
    related_topic_ids: [],
    related_memory_ids: memories.map((memory) => memory.id),
    created_at: nowIso()
  };
}
