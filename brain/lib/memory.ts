import type { ItemScore, MemoryCard, MemoryEmotion, MemoryIntent, MemoryManual, MemoryTopic, MemoryType, RawItem, TopicPage, UserProfile, UserRating } from "@/lib/types";
import { memoryCardMarkdown, topicPageMarkdown } from "@/lib/markdown";
import { formatList, makeId, nowIso, uniqueList } from "@/lib/utils";

export const memoryTopicOptions: MemoryTopic[] = [
  "Vibe Coding",
  "商业模式",
  "审美风格",
  "技术突破",
  "交互范式",
  "增长方式",
  "工作流改造",
  "趋势信号"
];

export const memoryEmotionOptions: MemoryEmotion[] = ["惊艳", "共鸣", "困惑", "怀疑"];

export const ratingDescriptions: Record<UserRating, string> = {
  1: "随手收藏，价值不确定",
  2: "有点意思，未来可能用到",
  3: "有明确参考价值",
  4: "强相关，值得沉淀",
  5: "非常重要，改变判断 / 可直接用于输出"
};

export type IntentInput = Pick<MemoryIntent, "user_rating" | "topic"> & {
  emotion?: MemoryEmotion;
  user_note?: string;
};

function isUserRating(value: unknown): value is UserRating {
  return typeof value === "number" && [1, 2, 3, 4, 5].includes(value);
}

function isMemoryTopic(value: unknown): value is MemoryTopic {
  return typeof value === "string" && memoryTopicOptions.includes(value as MemoryTopic);
}

function isMemoryEmotion(value: unknown): value is MemoryEmotion {
  return typeof value === "string" && memoryEmotionOptions.includes(value as MemoryEmotion);
}

export function normalizeIntentInput(input?: Partial<IntentInput> | null): IntentInput {
  return {
    user_rating: isUserRating(input?.user_rating) ? input.user_rating : 3,
    topic: isMemoryTopic(input?.topic) ? input.topic : "Vibe Coding",
    emotion: isMemoryEmotion(input?.emotion) ? input.emotion : undefined,
    user_note: input?.user_note?.trim() || undefined
  };
}

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

function inferIntentTopic(item: RawItem, score: ItemScore, profile: UserProfile): MemoryTopic {
  const text = `${itemText(item)} ${score.value_tags.join(" ")} ${profile.current_projects.join(" ")}`.toLowerCase();

  if (text.includes("vibe") || text.includes("ai coding") || text.includes("backlog") || text.includes("cursor")) return "Vibe Coding";
  if (text.includes("商业") || text.includes("business") || text.includes("增长") || text.includes("pricing") || text.includes("订阅")) return "商业模式";
  if (text.includes("审美") || text.includes("设计") || text.includes("pwa") || text.includes("界面") || text.includes("style")) return "审美风格";
  if (text.includes("rag") || text.includes("llm wiki") || text.includes("模型") || text.includes("技术") || text.includes("向量")) return "技术突破";
  if (text.includes("交互") || text.includes("workflow") || text.includes("agent") || text.includes("节点")) return "交互范式";
  if (text.includes("传播") || text.includes("获客") || text.includes("增长") || text.includes("社区")) return "增长方式";
  if (text.includes("工作流") || text.includes("自动") || text.includes("流程") || text.includes("低代码")) return "工作流改造";
  if (text.includes("趋势") || text.includes("信号") || text.includes("未来") || text.includes("行业")) return "趋势信号";

  if (score.actionability >= 75) return "工作流改造";
  if (score.novelty >= 75) return "趋势信号";
  return "Vibe Coding";
}

function inferEmotion(score: ItemScore): MemoryEmotion | undefined {
  if (score.relevance_score >= 88 || score.novelty >= 82) return "惊艳";
  if (score.role_fit >= 78 || score.goal_fit >= 78) return "共鸣";
  if (score.reading_cost === "high") return "困惑";
  if (score.noise_penalty >= 35) return "怀疑";
  return undefined;
}

function ratingLabel(rating: UserRating) {
  return `${rating} 星有用性`;
}

export function guessMemoryIntent(item: RawItem, score: ItemScore, profile: UserProfile): IntentInput & { ai_guess_reason: string } {
  const projectUses = relatedProjects(item, profile);
  const topic = inferIntentTopic(item, score, profile);

  return {
    user_rating: 3,
    topic,
    emotion: inferEmotion(score),
    ai_guess_reason: `这条内容可能会服务 ${formatList(projectUses)}，并补充「${topic}」相关判断。`
  };
}

export function createMemoryIntent(item: RawItem, decisionId: string, input: IntentInput, aiGuessReason?: string): MemoryIntent {
  const normalized = normalizeIntentInput(input);
  const now = nowIso();

  return {
    id: makeId("intent"),
    item_id: item.id,
    decision_id: decisionId,
    user_rating: normalized.user_rating,
    topic: normalized.topic,
    emotion: normalized.emotion,
    user_note: normalized.user_note,
    ai_guess_reason: aiGuessReason,
    created_at: now,
    updated_at: now
  };
}

export function createMemoryCard(item: RawItem, score: ItemScore, profile: UserProfile, intent: MemoryIntent): MemoryCard {
  const projects = relatedProjects(item, profile);
  const topics = uniqueList([intent.topic, ...relatedTopics(item)]).slice(0, 4);
  const memoryType = inferMemoryType(item, score);
  const title = item.title.replace(/^长文：/, "");
  const now = nowIso();
  const ratingText = ratingDescriptions[intent.user_rating];

  const memory: MemoryCard = {
    id: makeId("memory"),
    item_id: item.id,
    intent_id: intent.id,
    title,
    user_rating: intent.user_rating,
    topic: intent.topic,
    emotion: intent.emotion,
    user_note: intent.user_note,
    one_sentence_value: `${item.raw_summary} 你把它归入「${intent.topic}」，当前有用性为 ${intent.user_rating} 星：${ratingText}。`,
    why_i_saved_it:
      intent.user_note ||
      `${score.recommendation_reason} 你选择记住它，是因为它对「${intent.topic}」有 ${intent.user_rating} 星参考价值。`,
    core_insights: uniqueList([
      item.raw_summary,
      `${score.action_suggestion}`,
      `收藏主题是「${intent.topic}」，有用性为 ${intent.user_rating} 星，阅读成本为 ${score.reading_cost}。`
    ]),
    memory_type: memoryType,
    emotion_tags: intent.emotion ? [intent.emotion] : [],
    value_tags: [intent.topic],
    use_case_tags: [ratingLabel(intent.user_rating)],
    reusable_scenarios: uniqueList([
      `写「${intent.topic}」相关内容时作为素材`,
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
      current_judgment: `当前判断：${topicName} 的价值不在于保存更多信息，而在于把用户主动选择过的信息持续编译成可复用判断。最近新增的「${newMemory.title}」被评为 ${newMemory.user_rating} 星，强化了这一点。`,
      key_points: keyPoints,
      supporting_memory_ids: topicMemories,
      open_questions: uniqueList([
        ...(current?.open_questions ?? []),
        `这个主题下一步能否转化为更高有用性的判断或输出？`,
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
