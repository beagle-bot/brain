import type { ItemScore, RawItem, ReadingCost, UserProfile } from "@/lib/types";
import { clamp, includesAny } from "@/lib/utils";

const lowNoiseTags = ["产品设计", "方法论", "案例", "教程", "工具", "开源项目", "长期知识"];
const highNoiseTerms = ["纯融资新闻", "大厂 PR", "模型跑分", "纯营销内容", "低价值 AI 新闻"];

const valueTagMap: Record<string, string[]> = {
  "AI Agent": ["新工作流", "技术方案"],
  RAG: ["技术方案", "决策证据"],
  "LLM Wiki": ["产品灵感", "长期知识"],
  Obsidian: ["工具试用", "长期知识"],
  "AI coding": ["可立即行动", "项目 backlog"],
  PWA: ["新产品路线", "可立即行动"],
  开源项目: ["开源工具", "工具试用"],
  产品设计: ["产品灵感", "案例参考"],
  商业模式: ["新商业模式", "产品判断"],
  新交互方式: ["新交互方式", "产品灵感"],
  趋势信号: ["趋势信号", "写作素材"],
  反方观点: ["反方观点", "决策证据"],
  个人知识管理: ["长期知识", "写作素材"],
  方法论: ["可立即行动", "学习资料"],
  案例: ["案例参考", "决策证据"]
};

function itemText(item: RawItem) {
  return `${item.title} ${item.raw_summary} ${(item.raw_content ?? "")} ${item.raw_tags.join(" ")}`;
}

function matchScore(text: string, terms: string[], base: number, step: number, max = 100) {
  const matches = terms.filter((term) => text.toLowerCase().includes(term.toLowerCase()));
  return clamp(base + matches.length * step, 0, max);
}

function readingCost(item: RawItem): ReadingCost {
  if (includesAny(itemText(item), ["技术深度", "chunk", "embedding", "rerank", "评测", "向量数据库"])) {
    return "high";
  }

  if (includesAny(itemText(item), ["教程", "技术方案", "Agent", "RAG", "开源"])) {
    return "medium";
  }

  return "low";
}

function deriveValueTags(item: RawItem) {
  const tags = item.raw_tags.flatMap((tag) => valueTagMap[tag] ?? []);
  if (tags.length === 0 && includesAny(itemText(item), ["新闻", "融资", "发布"])) {
    tags.push("只是新闻", "低优先级");
  }

  return Array.from(new Set(tags)).slice(0, 4);
}

export function scoreItem(item: RawItem, profile: UserProfile): ItemScore {
  const text = itemText(item);
  const profileTerms = [
    ...profile.current_projects,
    ...profile.goals,
    ...profile.preferred_topics,
    ...profile.preferred_content_types
  ];
  const dislikedTerms = [...profile.disliked_topics, ...highNoiseTerms];
  const preferredHits = profileTerms.filter((term) => text.toLowerCase().includes(term.toLowerCase()));
  const dislikedHits = dislikedTerms.filter((term) => text.toLowerCase().includes(term.toLowerCase()));
  const usefulFormatBonus = lowNoiseTags.filter((tag) => item.raw_tags.includes(tag)).length * 5;
  const isTooTechnical = includesAny(text, ["chunk", "embedding", "rerank", "向量数据库", "评测指标"]);

  const role_fit = matchScore(text, [profile.role, "产品", "独立开发", "低代码", "知识工作者"], 45, 12);
  const goal_fit = matchScore(text, profile.goals, 42, 14);
  const project_fit = matchScore(text, profile.current_projects, 36, 16);
  const knowledge_level_fit = clamp(isTooTechnical ? 58 : 78 + usefulFormatBonus);
  const actionability = clamp(matchScore(text, ["工具", "教程", "开源", "流程", "backlog", "PWA", "可视化"], 45, 10) + usefulFormatBonus);
  const reusability = clamp(matchScore(text, ["长期", "Wiki", "Markdown", "知识", "记忆", "上下文", "方法论"], 50, 10));
  const novelty = clamp(matchScore(text, ["新", "提出", "开始", "重新", "替代", "模式"], 45, 9));
  const durability = clamp(matchScore(text, ["长期", "方法论", "架构", "判断", "知识", "工作流"], 45, 10));
  const noise_penalty = clamp(dislikedHits.length * 25 + (includesAny(text, ["融资", "发布稿", "跑分"]) ? 15 : 0));

  const relevance_score = clamp(
    role_fit * 0.15 +
      goal_fit * 0.2 +
      project_fit * 0.2 +
      knowledge_level_fit * 0.1 +
      actionability * 0.15 +
      reusability * 0.1 +
      novelty * 0.05 +
      durability * 0.1 -
      noise_penalty * 0.15
  );

  const value_tags = deriveValueTags(item);
  const reasonSubject =
    preferredHits.length > 0
      ? `它命中了 ${preferredHits.slice(0, 3).join("、")} 等当前关注点`
      : "它和你的长期知识沉淀方向有一定关系";
  const penaltyText =
    dislikedHits.length > 0 ? `不过它也带有 ${dislikedHits.slice(0, 2).join("、")} 的噪音，需要降低优先级。` : "并且未来可能复用于产品判断或写作。";

  return {
    id: `score-${item.id}-${profile.id}`,
    item_id: item.id,
    profile_id: profile.id,
    relevance_score,
    role_fit,
    goal_fit,
    project_fit,
    knowledge_level_fit,
    actionability,
    reusability,
    novelty,
    durability,
    noise_penalty,
    recommendation_reason: `${reasonSubject}。${penaltyText}`,
    value_tags,
    action_suggestion:
      relevance_score >= 82
        ? "适合记住，并补充你为什么想留住它。"
        : relevance_score >= 65
          ? "可以先记录一个轻量理由，之后用于输出。"
          : "如果你仍然想保存，请写清楚它对你的具体用途。",
    reading_cost: readingCost(item),
    created_at: new Date().toISOString()
  };
}

export function sortFeedItems(items: RawItem[], scores: ItemScore[]) {
  const scoreMap = new Map(scores.map((score) => [score.item_id, score]));

  return [...items].sort((a, b) => {
    const scoreDiff = (scoreMap.get(b.id)?.relevance_score ?? 0) - (scoreMap.get(a.id)?.relevance_score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;

    const rankDiff = (a.aihot_rank ?? 999) - (b.aihot_rank ?? 999);
    if (rankDiff !== 0) return rankDiff;

    return new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime();
  });
}
