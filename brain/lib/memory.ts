import type { ItemScore, MemoryCard, MemoryIntent, MemoryManual, MemoryType, RawItem, TopicPage, UserProfile } from "@/lib/types";
import { memoryCardMarkdown, topicPageMarkdown } from "@/lib/markdown";
import { formatList, makeId, nowIso, uniqueList } from "@/lib/utils";

export const emotionTagOptions = [
  "惊艳 / fancy",
  "有启发",
  "想试试",
  "不认同",
  "困惑",
  "焦虑 / FOMO",
  "被说服",
  "觉得危险",
  "以后可能有用",
  "只是觉得新鲜"
];

export const intentValueTagOptions = [
  "新交互方式",
  "新产品路线",
  "新商业模式",
  "新技术路径",
  "新工作流",
  "开源工具",
  "竞品观察",
  "趋势信号",
  "案例证据",
  "反方观点",
  "概念解释",
  "方法论",
  "可立即实践",
  "长期知识",
  "低优先级收藏"
];

export const useCaseTagOptions = [
  "用于 brain",
  "用于 AI HOT",
  "用于文章",
  "用于产品判断",
  "用于项目 backlog",
  "用于学习复盘",
  "用于技术选型",
  "用于决策备忘录",
  "用于以后问 AI",
  "只是收藏"
];

export type IntentInput = Pick<MemoryIntent, "emotion_tags" | "value_tags" | "use_case_tags"> & {
  user_note?: string;
};

function itemText(item: RawItem) {
  return `${item.title} ${item.raw_summary} ${item.raw_content ?? ""} ${item.raw_tags.join(" ")}`;
}

function inferMemoryType(item: RawItem, score: ItemScore): MemoryType {
  if (item.raw_tags.includes("开源项目") || item.raw_tags.includes("工具")) return "工具";
  if (item.raw_tags.includes("教程") || item.raw_tags.includes("方法论")) return "教程";
  if (item.raw_tags.includes("案例") || item.raw_tags.includes("案例参考")) return "案例";
  if (score.value_tags.includes("决策证据") || item.raw_tags.includes("反方观点")) return "决策证据";
  if (item.raw_tags.includes("技术方案") || item.raw_tags.includes("RAG")) return "技术方案";
  if (item.raw_tags.includes("AI 产品设计") || item.raw_tags.includes("产品设计")) return "产品灵感";
  return "观点";
}

function relatedProjects(item: RawItem, profile: UserProfile) {
  const text = itemText(item).toLowerCase();
  const matched = profile.current_projects.filter((project) => text.includes(project.toLowerCase()));

  if (matched.length > 0) return matched;
  if (item.raw_tags.some((tag) => ["个人知识管理", "RAG", "LLM Wiki", "Memory Card", "PWA"].includes(tag))) return ["brain"];
  if (item.raw_tags.includes("AI coding")) return ["brain", "AI HOT"];

  return ["个人认知系统"];
}

function relatedTopics(item: RawItem) {
  const topicCandidates = [
    "brain 记忆层设计",
    "AI 信息筛选",
    "移动端 PWA 体验",
    "AI coding 工作流",
    "个人知识管理",
    "RAG 与 LLM Wiki",
    "AI 产品机会",
    "Obsidian 输出链路",
    "项目 backlog"
  ];
  const text = itemText(item).toLowerCase();

  const matched = topicCandidates.filter((topic) => text.includes(topic.toLowerCase()));

  if (item.raw_tags.includes("RAG") || item.raw_tags.includes("LLM Wiki")) matched.push("RAG 与 LLM Wiki", "brain 记忆层设计");
  if (item.raw_tags.includes("个人知识管理") || item.raw_tags.includes("Memory Card")) matched.push("个人知识管理", "brain 记忆层设计");
  if (item.raw_tags.includes("PWA") || item.raw_tags.includes("移动端") || item.raw_tags.includes("新交互方式")) matched.push("移动端 PWA 体验");
  if (item.raw_tags.includes("AI coding") || item.raw_tags.includes("项目 backlog")) matched.push("AI coding 工作流", "项目 backlog");
  if (item.raw_tags.includes("AI 产品设计") || item.raw_tags.includes("商业模式")) matched.push("AI 产品机会");
  if (item.raw_tags.includes("Obsidian") || item.raw_tags.includes("Markdown")) matched.push("Obsidian 输出链路");

  return uniqueList(matched).slice(0, 4);
}

export function guessMemoryIntent(item: RawItem, score: ItemScore, profile: UserProfile): IntentInput & { ai_guess_reason: string } {
  const emotion_tags =
    score.relevance_score >= 86
      ? ["有启发", "想试试"]
      : score.noise_penalty > 35
        ? ["以后可能有用", "不认同"]
        : ["以后可能有用"];

  const value_tags = uniqueList([
    ...score.value_tags
      .map((tag) => {
        if (tag === "产品灵感") return "新产品路线";
        if (tag === "工具试用") return "开源工具";
        if (tag === "写作素材") return "案例证据";
        if (tag === "可立即行动") return "可立即实践";
        return tag;
      })
      .filter((tag) => intentValueTagOptions.includes(tag)),
    score.reusability >= 72 ? "长期知识" : "",
    item.raw_tags.includes("方法论") ? "方法论" : ""
  ]).slice(0, 4);

  const projectUses = relatedProjects(item, profile);
  const use_case_tags = uniqueList([
    projectUses.includes("brain") ? "用于 brain" : "",
    score.value_tags.includes("项目 backlog") ? "用于项目 backlog" : "",
    score.value_tags.includes("决策证据") || score.value_tags.includes("产品灵感") ? "用于产品判断" : "",
    score.value_tags.includes("写作素材") ? "用于文章" : "",
    score.reading_cost === "high" ? "用于学习复盘" : ""
  ]).filter((tag) => useCaseTagOptions.includes(tag));

  return {
    emotion_tags,
    value_tags: value_tags.length ? value_tags : ["长期知识"],
    use_case_tags: use_case_tags.length ? use_case_tags : ["用于以后问 AI"],
    ai_guess_reason: `这条内容可能会服务 ${formatList(projectUses)}，并补充 ${formatList(relatedTopics(item))} 的判断。`
  };
}

export function createMemoryIntent(item: RawItem, decisionId: string, input: IntentInput, aiGuessReason?: string): MemoryIntent {
  return {
    id: makeId("intent"),
    item_id: item.id,
    decision_id: decisionId,
    emotion_tags: uniqueList(input.emotion_tags),
    value_tags: uniqueList(input.value_tags),
    use_case_tags: uniqueList(input.use_case_tags),
    user_note: input.user_note?.trim() || undefined,
    ai_guess_reason: aiGuessReason,
    created_at: nowIso()
  };
}

export function createMemoryCard(item: RawItem, score: ItemScore, profile: UserProfile, intent: MemoryIntent): MemoryCard {
  const projects = relatedProjects(item, profile);
  const topics = relatedTopics(item);
  const memoryType = inferMemoryType(item, score);
  const title = item.title.replace(/^长文：/, "");
  const now = nowIso();

  const memory: MemoryCard = {
    id: makeId("memory"),
    item_id: item.id,
    intent_id: intent.id,
    title,
    one_sentence_value: `${item.raw_summary} 对你当前的价值在于：它能补充 ${formatList(topics.slice(0, 2))} 的判断。`,
    why_i_saved_it:
      intent.user_note ||
      `${score.recommendation_reason} 你选择记住它，是因为它可能服务 ${formatList(intent.use_case_tags)}，而不只是成为一个链接收藏。`,
    core_insights: uniqueList([
      item.raw_summary,
      `${score.action_suggestion}`,
      `它的复用价值来自 ${formatList(score.value_tags)}，阅读成本为 ${score.reading_cost}。`
    ]),
    memory_type: memoryType,
    emotion_tags: intent.emotion_tags,
    value_tags: intent.value_tags,
    use_case_tags: intent.use_case_tags,
    reusable_scenarios: uniqueList([
      `写 ${topics[0] ?? "AI 产品判断"} 相关内容时作为素材`,
      `判断 ${projects[0] ?? "当前项目"} 的下一步功能优先级`,
      "和 AI 对话时作为个人偏好与上下文证据"
    ]),
    related_projects: projects,
    related_topics: topics.length ? topics : ["AI 信息筛选"],
    confidence: Math.max(60, Math.min(95, score.relevance_score)),
    markdown_content: "",
    created_at: now
  };

  memory.markdown_content = memoryCardMarkdown(memory, item, score, intent);
  return memory;
}

export function createMemoryManual(memory: MemoryCard, item: RawItem, score: ItemScore): MemoryManual {
  return {
    id: makeId("manual"),
    memory_id: memory.id,
    when_to_use: uniqueList([
      `当问题涉及 ${formatList(memory.related_topics.slice(0, 2))} 时调用`,
      `当用户需要 ${formatList(memory.use_case_tags)} 时调用`,
      `当输出需要引用 ${item.source} 的具体信息源时调用`
    ]),
    when_not_to_use: [
      "当问题只需要最新事实，而这条内容已经过期时不要单独调用",
      "当用户需要完整技术实现细节时，需要补充原文或其他资料",
      "当主题和当前项目无关时降低优先级"
    ],
    good_for_questions: uniqueList([
      `brain 应该如何处理 ${memory.related_topics[0] ?? "记忆资产"}？`,
      `这条信息能不能转成 ${formatList(memory.use_case_tags)}？`,
      `它对 ${formatList(memory.related_projects)} 有什么启发？`
    ]),
    not_good_for_questions: [
      "不适合作为唯一事实来源回答行业规模、融资金额或模型指标",
      "不适合替代官方文档或原始论文"
    ],
    limitations: [
      "这是基于 mock 信息和本地规则生成的记忆说明，未调用真实 AI 校验。",
      "需要结合后续更多 Memory Card 才能形成更稳定的主题判断。"
    ],
    retrieval_keywords: uniqueList([...item.raw_tags, ...memory.related_topics, ...memory.value_tags]).slice(0, 12),
    priority: Math.max(40, Math.min(95, Math.round((score.relevance_score + memory.confidence) / 2))),
    created_at: nowIso()
  };
}

export function upsertTopicPages(existingTopics: TopicPage[], allMemories: MemoryCard[], newMemory: MemoryCard) {
  let topics = [...existingTopics];

  for (const topicName of newMemory.related_topics) {
    const current = topics.find((topic) => topic.topic_name === topicName);
    const topicMemories = uniqueList([...(current?.supporting_memory_ids ?? []), newMemory.id]);
    const relatedMemories = uniqueList([...allMemories, newMemory]).filter((memory) => topicMemories.includes(memory.id));
    const keyPoints = uniqueList([
      ...(current?.key_points ?? []),
      newMemory.one_sentence_value,
      ...newMemory.core_insights.slice(1, 2)
    ]).slice(-6);

    const topic: TopicPage = {
      id: current?.id ?? makeId("topic"),
      topic_name: topicName,
      current_judgment: `当前判断：${topicName} 的价值不在于保存更多信息，而在于把用户主动选择过的信息持续编译成可复用判断。最近新增的「${newMemory.title}」强化了这一点。`,
      key_points: keyPoints,
      supporting_memory_ids: topicMemories,
      open_questions: uniqueList([
        ...(current?.open_questions ?? []),
        `这个主题下一步能否转化为 ${formatList(newMemory.use_case_tags)}？`,
        "是否需要更多反例来避免只收藏同温层信息？"
      ]).slice(-5),
      markdown_content: "",
      last_updated_at: nowIso()
    };

    topic.markdown_content = topicPageMarkdown(topic, relatedMemories);
    topics = current ? topics.map((item) => (item.id === current.id ? topic : item)) : [...topics, topic];
  }

  return topics;
}
