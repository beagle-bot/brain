import type { UserProfile } from "@/lib/types";

export const defaultProfile: UserProfile = {
  id: "profile-default",
  role: "AI 产品构想者 / 低代码独立开发者",
  level: "低代码小白，能使用 AI coding 工具，但不具备完整工程经验",
  current_projects: ["brain", "AI HOT", "个人认知系统", "Obsidian 知识库"],
  goals: ["寻找 AI 产品机会", "开发 MVP", "沉淀个人知识资产", "基于资产输出文章和产品判断"],
  preferred_topics: [
    "AI Agent",
    "RAG",
    "Obsidian",
    "LLM Wiki",
    "AI coding",
    "PWA",
    "个人知识管理",
    "AI 产品设计",
    "独立开发"
  ],
  disliked_topics: ["纯融资新闻", "大厂 PR", "过度技术细节", "模型跑分", "纯营销内容"],
  preferred_content_types: ["产品思路", "工具", "开源项目", "教程", "案例", "方法论", "观点"],
  output_goals: ["文章大纲", "产品判断", "项目 backlog", "决策备忘录", "学习复盘"],
  custom_description:
    "我希望从高速 AI 信息流中筛选真正对我有用的内容，并把它们转化为未来可复用、可输出的个人认知资产。"
};
