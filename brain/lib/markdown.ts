import type { ItemScore, MemoryCard, MemoryIntent, MemoryManual, RawItem, TopicPage } from "@/lib/types";
import { formatList } from "@/lib/utils";

export function memoryCardMarkdown(memory: MemoryCard, item: RawItem, score: ItemScore, intent: MemoryIntent) {
  return `---
source: ${item.source}
status: remembered
memory_type: ${memory.memory_type}
relevance_score: ${score.relevance_score}
emotion_tags: ${memory.emotion_tags.join(", ")}
value_tags: ${memory.value_tags.join(", ")}
use_case_tags: ${memory.use_case_tags.join(", ")}
related_projects: ${memory.related_projects.join(", ")}
related_topics: ${memory.related_topics.join(", ")}
created: ${memory.created_at}
original_url: ${item.source_url}
---

# ${memory.title}

## 一句话价值

${memory.one_sentence_value}

## 为什么我会记住它

${memory.why_i_saved_it}

## 我的收藏意图

### 情绪反应

${formatList(intent.emotion_tags)}

### 价值判断

${formatList(intent.value_tags)}

### 未来用途

${formatList(intent.use_case_tags)}

### 我的备注

${intent.user_note || "暂无"}

## 核心洞察

${memory.core_insights.map((insight) => `- ${insight}`).join("\n")}

## 可复用场景

${memory.reusable_scenarios.map((scenario) => `- ${scenario}`).join("\n")}

## 相关项目

${memory.related_projects.map((project) => `- ${project}`).join("\n")}

## 相关主题

${memory.related_topics.map((topic) => `- ${topic}`).join("\n")}

## 原文链接

${item.source_url}
`;
}

export function memoryManualMarkdown(manual: MemoryManual, memory: MemoryCard) {
  return `# 使用说明：${memory.title}

## 适合调用的场景

${manual.when_to_use.map((item) => `- ${item}`).join("\n")}

## 不适合调用的场景

${manual.when_not_to_use.map((item) => `- ${item}`).join("\n")}

## 适合回答的问题

${manual.good_for_questions.map((item) => `- ${item}`).join("\n")}

## 不适合回答的问题

${manual.not_good_for_questions.map((item) => `- ${item}`).join("\n")}

## 局限

${manual.limitations.map((item) => `- ${item}`).join("\n")}

## 检索关键词

${manual.retrieval_keywords.map((item) => `- ${item}`).join("\n")}

## 调用优先级

${manual.priority}
`;
}

export function topicPageMarkdown(topic: TopicPage, memories: MemoryCard[]) {
  const supporting = memories
    .filter((memory) => topic.supporting_memory_ids.includes(memory.id))
    .map((memory) => `- ${memory.title}: ${memory.one_sentence_value}`)
    .join("\n");

  return `# ${topic.topic_name}

## 当前判断

${topic.current_judgment}

## 关键观点

${topic.key_points.map((point) => `- ${point}`).join("\n")}

## 相关记忆

${supporting || "暂无"}

## 待验证问题

${topic.open_questions.map((question) => `- ${question}`).join("\n")}

## 最近更新

${topic.last_updated_at}
`;
}
