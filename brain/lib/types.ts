export type SourceName = "AI HOT" | "RSS" | "Manual";

export type ReadingCost = "low" | "medium" | "high";

export type DecisionType = "remembered";

export type MemoryType =
  | "观点"
  | "工具"
  | "案例"
  | "教程"
  | "论文"
  | "产品灵感"
  | "决策证据"
  | "反方观点"
  | "技术方案"
  | "行动项";

export type OutputType =
  | "文章大纲"
  | "产品判断"
  | "决策备忘录"
  | "项目 backlog"
  | "一周认知复盘";

export type RawItem = {
  id: string;
  source: SourceName;
  source_url: string;
  title: string;
  raw_summary: string;
  raw_content?: string;
  author?: string;
  published_at?: string;
  aihot_rank?: number;
  raw_tags: string[];
  created_at: string;
};

export type UserProfile = {
  id: string;
  role: string;
  level: string;
  current_projects: string[];
  goals: string[];
  preferred_topics: string[];
  disliked_topics: string[];
  preferred_content_types: string[];
  output_goals: string[];
  custom_description: string;
};

export type ItemScore = {
  id: string;
  item_id: string;
  profile_id: string;
  relevance_score: number;
  role_fit: number;
  goal_fit: number;
  project_fit: number;
  knowledge_level_fit: number;
  actionability: number;
  reusability: number;
  novelty: number;
  durability: number;
  noise_penalty: number;
  recommendation_reason: string;
  value_tags: string[];
  action_suggestion: string;
  reading_cost: ReadingCost;
  created_at: string;
};

export type Decision = {
  id: string;
  item_id: string;
  profile_id: string;
  decision: DecisionType;
  feedback_note?: string;
  created_at: string;
};

export type MemoryIntent = {
  id: string;
  item_id: string;
  decision_id: string;
  memory_id?: string;
  emotion_tags: string[];
  value_tags: string[];
  use_case_tags: string[];
  user_note?: string;
  ai_guess_reason?: string;
  created_at: string;
};

export type MemoryCard = {
  id: string;
  item_id: string;
  intent_id?: string;
  title: string;
  one_sentence_value: string;
  why_i_saved_it: string;
  core_insights: string[];
  memory_type: MemoryType;
  emotion_tags: string[];
  value_tags: string[];
  use_case_tags: string[];
  reusable_scenarios: string[];
  related_projects: string[];
  related_topics: string[];
  confidence: number;
  markdown_content: string;
  created_at: string;
};

export type MemoryManual = {
  id: string;
  memory_id: string;
  when_to_use: string[];
  when_not_to_use: string[];
  good_for_questions: string[];
  not_good_for_questions: string[];
  limitations: string[];
  retrieval_keywords: string[];
  priority: number;
  created_at: string;
};

export type TopicPage = {
  id: string;
  topic_name: string;
  current_judgment: string;
  key_points: string[];
  supporting_memory_ids: string[];
  open_questions: string[];
  markdown_content: string;
  last_updated_at: string;
};

export type GeneratedOutput = {
  id: string;
  output_type: OutputType;
  title: string;
  content: string;
  related_topic_ids: string[];
  related_memory_ids: string[];
  created_at: string;
};

export type BrainState = {
  profile: UserProfile;
  decisions: Decision[];
  intents: MemoryIntent[];
  memories: MemoryCard[];
  manuals: MemoryManual[];
  topics: TopicPage[];
  outputs: GeneratedOutput[];
};
