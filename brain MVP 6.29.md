# brain v0.1 MVP 需求文档

## 1. 项目名称

**brain**

## 2. 产品一句话

brain 是一个移动端优先的个人信息筛选与认知沉淀工具。  
它从 AI HOT 等外部信息流中读取内容，根据用户的职业、目标、兴趣和当前项目判断内容是否“对我有用”，用户通过手机端快速选择“记住 / 略过 / 稍后读”，被记住的内容会被转化为个人记忆资产，并进一步支持写作、决策、学习和项目输出。

## 3. v0.1 核心定位

v0.1 不是完整知识库，不是复杂推荐系统，也不是原生 App。

v0.1 的核心是跑通一个最小闭环：

```text
AI HOT 内容输入
→ 根据用户画像判断相关性
→ 手机端 PWA 卡片流展示
→ 用户选择：记住 / 略过 / 稍后读
→ 收藏时补充 Memory Intent
→ 生成 Memory Card
→ 生成 Memory Manual
→ 更新 Topic Page
→ 基于沉淀资产生成输出
```

brain 的核心价值不是“收藏内容”，而是：

```text
我选择的信息
+ 我为什么选择它
+ AI 编译成记忆资产
+ 形成长期主题判断
+ 用于写作、决策、学习和项目
= 我的个人认知资产
```

---

# 4. 背景与问题

## 4.1 背景

AI 更新速度太快，用户出于 FOMO 情绪以及跟上热点的诉求，需要一个高质量的信息入口，帮助自己阅读、筛选和积累信息。

以 AI HOT 为例，它已经提供了较好的 AI 信息源，但仍然存在三个问题：

## 4.2 当前问题

### 问题一：内容太多

AI HOT 仍然是一个大众编辑队列。  
其中有很多纯技术向、融资向、营销向或短期新闻向内容，对某些用户可能有价值，但对当前用户未必有价值。

当前问题：

```text
同一批内容，对不同职业、不同目标、不同项目的人，价值完全不同。
```

例如：

- 对工程师有价值的技术框架，对低代码产品构想者可能太硬。
    
- 对投资人有价值的融资新闻，对独立开发者可能只是噪音。
    
- 对内容创作者有价值的趋势信号，对研究者可能不够严谨。
    

所以 brain 需要解决：

```text
如何从大众信息中捕捉“对我有用”的内容？
```

### 问题二：记不住

用户看到很多信息，但通常只能用截图、收藏、稍后读等方式简单 follow。

当前问题：

```text
收藏只是保存链接，并没有转化为未来可复用的认知资产。
```

brain 需要解决：

```text
如何让用户选择记住的内容，真正沉淀下来？
```

### 问题三：未来怎么用

内容很贵，但什么时候有价值，是一个更难的问题。

单纯把内容存成 Markdown，再用 RAG 给 AI 对话，价值不一定足够强。因为联网搜索已经很发达，普通知识库未必能提供差异化价值。

brain 需要解决：

```text
被我记住的内容，未来如何用于写作、决策、学习、项目和 AI 上下文？
```

---

# 5. 产品目标

## 5.1 v0.1 目标

v0.1 只验证一件事：

```text
用户是否愿意在手机上轻量刷 AI HOT，并把有价值内容转化为可复用的个人认知资产。
```

## 5.2 v0.1 成功标准

完成后，用户应该可以：

1. 在 iPhone Safari 中打开 brain PWA。
    
2. 看到来自 AI HOT 的内容卡片。
    
3. 每条卡片都显示相关性分数和推荐理由。
    
4. 用户可以右滑或点击“记住”。
    
5. 用户可以左滑或点击“略过”。
    
6. 用户可以选择“稍后读”。
    
7. 右滑记住时，弹出轻量 Memory Intent 面板。
    
8. 用户可以选择情绪、价值、用途标签，也可以跳过。
    
9. 被记住内容自动生成 Memory Card。
    
10. 被记住内容自动生成 Memory Manual。
    
11. 相关 Topic Page 被创建或更新。
    
12. 用户可以查看已记住内容。
    
13. 用户可以查看主题页。
    
14. 用户可以基于已记住内容生成输出。
    
15. 输出支持复制 Markdown，方便粘贴到 Obsidian。
    

---

# 6. 非目标

v0.1 暂不做：

1. 不做原生 iOS App。
    
2. 不做 TestFlight。
    
3. 不做复杂多用户系统。
    
4. 不做付费系统。
    
5. 不做完整 RAG 问答。
    
6. 不做 Obsidian 本地自动写入。
    
7. 不做浏览器插件。
    
8. 不做团队协作。
    
9. 不做真正机器学习推荐系统。
    
10. 不做复杂知识图谱。
    
11. 不做多信息源聚合，只先支持 AI HOT mock 数据。
    

---

# 7. 目标用户

## 7.1 v0.1 第一目标用户

第一版优先服务：

```text
关注 AI 的产品构想者 / 低代码独立开发者 / 内容创作者 / 研究型知识工作者
```

他们的共同特征：

1. 每天接触大量 AI 信息。
    
2. 有 FOMO 情绪，担心错过关键趋势。
    
3. 不想只收藏，希望未来能复用。
    
4. 需要把信息转化为文章、产品判断、项目 backlog、学习复盘或决策备忘录。
    
5. 不一定具备完整工程能力，更需要轻量、舒服、移动端优先的体验。
    

## 7.2 默认用户画像

v0.1 内置一个默认画像：

```json
{
  "role": "AI 产品构想者 / 低代码独立开发者",
  "level": "低代码小白，能使用 AI coding 工具，但不具备完整工程经验",
  "current_projects": ["brain", "AI HOT", "个人认知系统", "Obsidian 知识库"],
  "goals": ["寻找 AI 产品机会", "开发 MVP", "沉淀个人知识资产", "基于资产输出文章和产品判断"],
  "preferred_topics": ["AI Agent", "RAG", "Obsidian", "LLM Wiki", "AI coding", "PWA", "个人知识管理", "AI 产品设计", "独立开发"],
  "disliked_topics": ["纯融资新闻", "大厂 PR", "过度技术细节", "模型跑分", "纯营销内容"],
  "preferred_content_types": ["产品思路", "工具", "开源项目", "教程", "案例", "方法论", "观点"],
  "output_goals": ["文章大纲", "产品判断", "项目 backlog", "决策备忘录", "学习复盘"],
  "custom_description": "我希望从高速 AI 信息流中筛选真正对我有用的内容，并把它们转化为未来可复用、可输出的个人认知资产。"
}
```

---

# 8. 产品核心流程

## 8.1 主流程

```text
用户打开 brain
→ 进入首页 Feed
→ 系统展示已评分的 AI HOT 内容
→ 用户浏览卡片
→ 用户右滑：记住
→ 弹出 Memory Intent 面板
→ 用户选择标签或跳过
→ 系统生成记忆资产
→ 用户可在 Saved 查看
→ 系统更新 Topic Page
→ 用户进入 Output Studio
→ 基于记忆资产生成文章大纲 / 产品判断 / 决策备忘录
```

## 8.2 左滑流程

```text
用户左滑内容
→ 内容被标记为 skipped
→ 从当前 Feed 中消失
→ 可选：记录跳过原因
```

## 8.3 右滑流程

```text
用户右滑内容
→ 内容被标记为 remembered
→ 弹出 Memory Intent
→ 用户选择情绪、价值、用途标签
→ 用户可补充一句备注
→ 系统生成 Memory Card
→ 系统生成 Memory Manual
→ 系统更新 Topic Page
```

## 8.4 稍后读流程

```text
用户点击稍后读
→ 内容被标记为 later
→ 从首页主 Feed 中移除
→ 可以在 later 或 saved 页面查看
```

---

# 9. 信息源模块：Raw Library

## 9.1 目标

Raw Library 保存原始内容。  
这一层是事实层，不做 AI 改写，保证可追溯。

## 9.2 v0.1 输入方式

第一版先使用 mock 数据，文件位置：

```text
/data/mock-aihot-items.json
```

后续可替换为真实 AI HOT API / RSS。

## 9.3 Raw Item 字段

```ts
type RawItem = {
  id: string;
  source: "AI HOT" | "RSS" | "Manual";
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
```

## 9.4 Mock 数据要求

至少准备 20 条 mock 内容，覆盖以下类型：

1. AI Agent
    
2. RAG
    
3. Obsidian
    
4. LLM Wiki
    
5. AI coding
    
6. 开源项目
    
7. 产品设计
    
8. AI 工具
    
9. 技术深度内容
    
10. 低价值 AI 新闻
    
11. 商业模式
    
12. 新交互方式
    
13. 新产品路线
    
14. 纯融资新闻
    
15. 大厂 PR
    

---

# 10. 用户画像模块：Profile

## 10.1 目标

用户画像用于判断“什么内容对我有用”。

v0.1 不做复杂推荐系统，而是做：

```text
可解释的规则评分 + AI 语义判断
```

## 10.2 Profile 页面路径

```text
/profile
```

## 10.3 Profile 字段

```ts
type UserProfile = {
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
```

## 10.4 页面功能

用户可以编辑：

1. 我的角色
    
2. 我的知识水平
    
3. 当前项目
    
4. 当前目标
    
5. 感兴趣主题
    
6. 不感兴趣主题
    
7. 偏好内容类型
    
8. 希望产出的内容类型
    
9. 自定义描述
    

---

# 11. 相关性评分模块：Relevance Scoring

## 11.1 目标

每条内容都需要被判断：

```text
这条内容是否对当前用户有用？
```

注意：这不是推荐系统，而是规则化、可解释的相关性排序。

## 11.2 评分维度

```ts
type ItemScore = {
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
  reading_cost: "low" | "medium" | "high";

  created_at: string;
};
```

## 11.3 维度解释

### role_fit

内容是否和用户角色相关。

### goal_fit

内容是否和用户当前目标相关。

### project_fit

内容是否和用户正在做的项目相关。

### knowledge_level_fit

内容难度是否适合用户当前知识水平。

### actionability

看完后是否可以产生行动。

### reusability

未来是否可复用。

### novelty

是否提供新信息、新视角、新方法。

### durability

是否有长期价值，而不只是短期新闻。

### noise_penalty

是否属于噪音、营销、重复、短期热点、纯 PR。

## 11.4 评分公式

```text
relevance_score =
role_fit * 0.15
+ goal_fit * 0.20
+ project_fit * 0.20
+ knowledge_level_fit * 0.10
+ actionability * 0.15
+ reusability * 0.10
+ novelty * 0.05
+ durability * 0.10
- noise_penalty * 0.15
```

最终分数限制在 0-100。

## 11.5 价值标签

`value_tags` 不是主题标签，而是用途标签。

可选值：

```text
产品灵感
技术方案
写作素材
决策证据
学习资料
工具试用
趋势信号
竞品观察
案例参考
反方观点
可立即行动
长期知识
新交互方式
新产品路线
新商业模式
新工作流
开源工具
只是新闻
低优先级
```

## 11.6 推荐理由

每条内容必须生成 `recommendation_reason`。

示例：

```text
这条内容与你正在做的 brain 项目高度相关。它讨论了 RAG 与长期知识沉淀的关系，可以帮助你判断 brain 的记忆层是否应该只做普通 RAG，还是应该采用 Memory Card + Topic Page 的方式。
```

## 11.7 v0.1 实现方式

支持两种模式：

### Mock Scoring

没有 API Key 时，使用本地规则和关键词打分。

### AI Scoring

如果配置了 `OPENAI_API_KEY`，调用 AI 生成评分。

环境变量：

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# 12. Feed 模块：移动端卡片流

## 12.1 页面路径

```text
/
```

## 12.2 目标

让用户在手机上快速判断：

```text
这条内容要不要进入我的脑子？
```

## 12.3 页面形态

移动端优先 PWA。

卡片流支持：

1. 单列推荐流
    
2. 后续可扩展双列选择模式
    

v0.1 优先实现单列推荐流。

## 12.4 卡片展示内容

每张卡片显示：

```text
来源 / AI HOT rank
标题
一句话摘要
相关性分数
为什么推荐给你
价值标签
建议动作
阅读成本
按钮：记住 / 稍后读 / 略过 / 打开原文
```

## 12.5 卡片交互

### 右滑 / 记住

```text
触发 remembered
打开 Memory Intent 面板
```

### 左滑 / 略过

```text
触发 skipped
卡片从 Feed 消失
```

### 稍后读

```text
触发 later
卡片从主 Feed 消失
```

### 打开原文

```text
新窗口打开 source_url
```

## 12.6 排序逻辑

首页 Feed 默认排序：

```text
1. 排除 skipped
2. 排除 remembered
3. 排除 later
4. 按 relevance_score 降序
5. 同分按 aihot_rank 升序
6. 再按 published_at 降序
```

---

# 13. Memory Intent 模块：收藏意图

## 13.1 为什么需要 Memory Intent

用户记住一条内容，不只是因为“它是什么”，而是因为“我为什么被它触动”。

这种触动可能是：

1. 情绪上的
    
2. 用途上的
    
3. 价值判断上的
    
4. 项目相关的
    
5. 输出相关的
    

如果不记录这个部分，brain 只能生成普通 AI 摘要。  
如果记录了它，brain 才能知道：

```text
这条内容是怎么进入我的脑子的。
```

## 13.2 触发时机

当用户右滑或点击“记住”时，弹出一个轻量底部面板。

标题：

```text
你为什么想记住它？
```

## 13.3 交互原则

Memory Intent 必须轻量，不能变成负担。

原则：

1. AI 自动预选标签。
    
2. 用户只需要点击确认。
    
3. 用户可以修改标签。
    
4. 用户可以补充一句备注。
    
5. 用户可以跳过，直接保存。
    
6. 不强迫用户填写。
    

## 13.4 面板结构

```text
已收藏。你想怎么记住它？

情绪反应：
[惊艳 / fancy] [有启发] [想试试] [不认同] [困惑] [焦虑 / FOMO] [以后可能有用]

价值类型：
[新交互方式] [新产品路线] [新商业模式] [新技术路径] [新工作流]
[开源工具] [竞品观察] [趋势信号] [案例证据] [反方观点] [概念解释] [方法论]

未来用途：
[用于 brain] [用于文章] [用于产品判断] [用于 backlog] [用于学习复盘]
[用于技术选型] [用于决策备忘录] [用于以后问 AI] [只是收藏]

备注：
[可选输入一句话]

按钮：
[确认保存] [跳过，直接保存]
```

## 13.5 情绪标签

```text
惊艳 / fancy
有启发
想试试
不认同
困惑
焦虑 / FOMO
被说服
觉得危险
以后可能有用
只是觉得新鲜
```

## 13.6 价值标签

```text
新交互方式
新产品路线
新商业模式
新技术路径
新工作流
开源工具
竞品观察
趋势信号
案例证据
反方观点
概念解释
方法论
可立即实践
长期知识
低优先级收藏
```

## 13.7 用途标签

```text
用于 brain
用于 AI HOT
用于文章
用于产品判断
用于项目 backlog
用于学习复盘
用于技术选型
用于决策备忘录
用于以后问 AI
只是收藏
```

## 13.8 数据结构

```ts
type MemoryIntent = {
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
```

## 13.9 重要原则

Memory Card 不能只基于原文生成。  
Memory Card 必须基于：

```text
原文内容
+ 用户画像
+ 相关性评分
+ Memory Intent
```

这样生成的记忆才是“我的记忆”，而不是普通摘要。

---

# 14. Decisions 模块：用户决策

## 14.1 目标

记录用户对每条内容的选择。

## 14.2 字段

```ts
type Decision = {
  id: string;
  item_id: string;
  profile_id: string;
  decision: "remembered" | "skipped" | "later";
  feedback_note?: string;
  created_at: string;
};
```

## 14.3 规则

同一个用户对同一条 item 只能有一个最新 decision。

如果用户从 later 改成 remembered，需要更新状态。

---

# 15. Memory System：沉淀系统

## 15.1 目标

沉淀系统是 v0.1 的核心。

它不是简单分类，而是把用户主动选择记住的内容，转化为未来可被使用的认知资产。

## 15.2 四层结构

```text
Raw Items = 我看到了什么
Memory Intent = 我为什么想记住它
Memory Cards = 我如何理解它
Memory Manuals = AI 什么时候该调用它
Topic Pages = 它如何改变我的长期判断
```

---

# 16. Memory Card：记忆卡

## 16.1 目标

Memory Card 是一条被用户记住的内容经过 AI 编译后的结果。

它要回答：

1. 这条内容的一句话价值是什么？
    
2. 为什么它对我有用？
    
3. 它有哪些核心洞察？
    
4. 它未来可以在哪些场景复用？
    
5. 它属于什么记忆类型？
    
6. 它和哪些项目、主题相关？
    
7. 它和我的 Memory Intent 有什么关系？
    

## 16.2 字段

```ts
type MemoryCard = {
  id: string;
  item_id: string;
  intent_id?: string;

  title: string;
  one_sentence_value: string;
  why_i_saved_it: string;
  core_insights: string[];

  memory_type:
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
```

## 16.3 Markdown 模板

```md
---
source: AI HOT
status: remembered
memory_type:
relevance_score:
emotion_tags:
value_tags:
use_case_tags:
related_projects:
related_topics:
created:
original_url:
---

# {{title}}

## 一句话价值

{{one_sentence_value}}

## 为什么我会记住它

{{why_i_saved_it}}

## 我的收藏意图

### 情绪反应

{{emotion_tags}}

### 价值判断

{{value_tags}}

### 未来用途

{{use_case_tags}}

### 我的备注

{{user_note}}

## 核心洞察

{{core_insights}}

## 可复用场景

{{reusable_scenarios}}

## 相关项目

{{related_projects}}

## 相关主题

{{related_topics}}

## 原文链接

{{original_url}}
```

---

# 17. Memory Manual：记忆说明书

## 17.1 目标

Memory Manual 是给 AI 用的说明书。  
它告诉 AI：

```text
什么时候应该使用这条记忆？
什么时候不应该使用？
它适合回答什么问题？
它的局限是什么？
```

普通 RAG 的问题是只按相似度召回。  
brain 的目标是让记忆拥有“使用条件”。

## 17.2 字段

```ts
type MemoryManual = {
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
```

## 17.3 Markdown 模板

```md
# 使用说明：{{memory_title}}

## 适合调用的场景

{{when_to_use}}

## 不适合调用的场景

{{when_not_to_use}}

## 适合回答的问题

{{good_for_questions}}

## 不适合回答的问题

{{not_good_for_questions}}

## 局限

{{limitations}}

## 检索关键词

{{retrieval_keywords}}

## 调用优先级

{{priority}}
```

---

# 18. Topic Page：主题页

## 18.1 目标

Topic Page 是 brain 的长期判断层。

如果只有单篇 Memory Card，brain 会退化成收藏夹。  
Topic Page 的作用是把多条记忆汇总到一个主题中，让知识产生复利。

## 18.2 字段

```ts
type TopicPage = {
  id: string;
  topic_name: string;

  current_judgment: string;
  key_points: string[];
  supporting_memory_ids: string[];
  open_questions: string[];

  markdown_content: string;
  last_updated_at: string;
};
```

## 18.3 更新逻辑

当用户记住一条内容后：

1. 从 Memory Card 中识别 `related_topics`。
    
2. 如果 topic 不存在，则创建 Topic Page。
    
3. 如果 topic 已存在，则追加新记忆。
    
4. 更新当前判断、关键点和待验证问题。
    
5. v0.1 可以用简单合并逻辑，不要求完美。
    

## 18.4 Markdown 模板

```md
# {{topic_name}}

## 当前判断

{{current_judgment}}

## 关键观点

{{key_points}}

## 相关记忆

{{supporting_memories}}

## 待验证问题

{{open_questions}}

## 最近更新

{{last_updated_at}}
```

---

# 19. Output Studio：输出模块

## 19.1 页面路径

```text
/output
```

## 19.2 目标

证明 brain 的价值不只是收藏，而是基于沉淀资产进行输出。

## 19.3 v0.1 支持的输出类型

```text
文章大纲
产品判断
决策备忘录
项目 backlog
一周认知复盘
```

## 19.4 页面交互

用户进入 `/output` 后：

1. 选择输出类型。
    
2. 选择相关主题，或默认使用最近记住的内容。
    
3. 点击生成。
    
4. 系统基于 Memory Cards、Memory Manuals、Topic Pages 生成输出。
    
5. 支持复制 Markdown。
    

## 19.5 输出 Prompt

```text
你是 brain 的输出助手。

请基于用户已经记住的 Memory Cards、Memory Manuals 和 Topic Pages，生成一个有用的输出。

注意：
1. 不要泛泛而谈。
2. 优先使用用户已经选择记住的内容。
3. 体现用户的当前项目、目标和偏好。
4. 体现用户当时为什么记住这些内容，包括情绪、价值判断和用途标签。
5. 如果信息不足，请明确指出。
6. 输出要能直接被用户复制到 Obsidian 或文档中继续编辑。

输出类型：{{output_type}}

用户画像：
{{user_profile}}

相关主题页：
{{topic_pages}}

相关记忆：
{{memory_cards}}

请生成 Markdown。
```

---

# 20. Markdown 复制与 Obsidian

## 20.1 v0.1 目标

v0.1 不做 Obsidian 自动同步。  
先支持复制 Markdown。

## 20.2 需要支持复制的页面

1. Memory Card 详情页
    
2. Topic Page 详情页
    
3. Output 结果页
    

## 20.3 按钮文案

```text
复制 Markdown
```

复制成功后提示：

```text
已复制，可粘贴到 Obsidian
```

---

# 21. 页面结构

## 21.1 必须页面

```text
/              首页，推荐卡片流
/profile       用户画像配置
/saved         已记住内容
/topics        主题页列表
/topics/[id]   主题页详情
/memories/[id] 记忆卡详情
/output        输出模块
```

## 21.2 可选页面

```text
/later         稍后读内容
/settings      设置
/debug         开发调试页面
```

---

# 22. UI 要求

## 22.1 风格关键词

```text
干净
轻量
移动端优先
像信息卡片
少干扰
适合每天刷 5 分钟
```

## 22.2 首页卡片示例

```text
AI HOT #12

标题：Karpathy 提出 LLM Wiki 作为 RAG 替代思路

一句话总结：
普通 RAG 每次都临时检索，而 LLM Wiki 倾向于把知识持续编译进 Markdown Wiki。

相关性分数：94

为什么推荐给你：
这条内容与你正在思考的 brain 记忆层高度相关。它可以帮助你判断 brain 是否应该只做普通 RAG，还是应该采用 Memory Card + Topic Page 的方式。

价值标签：
产品灵感 / 决策证据 / RAG 替代方案 / 长期知识

建议动作：
记住，并更新「brain 记忆层设计」主题页。

[记住] [稍后读] [略过]
[打开原文]
```

## 22.3 Memory Intent 面板示例

```text
你为什么想记住它？

情绪反应：
[有启发 ✓] [惊艳 / fancy] [想试试] [不认同] [困惑]

价值类型：
[新产品路线 ✓] [决策证据 ✓] [新交互方式] [技术方案]

未来用途：
[用于 brain ✓] [用于产品判断 ✓] [用于文章] [用于 backlog]

备注：
这可能说明 brain 不应该只做 RAG，而应该做长期主题页。

[确认保存] [跳过，直接保存]
```

---

# 23. 技术栈

```text
Framework: Next.js App Router
Language: TypeScript
UI: Tailwind CSS
Database: Supabase
Deployment: Vercel
PWA: next-pwa 或手动 manifest + service worker
AI: OpenAI API，可先 mock
State: React hooks
Package Manager: pnpm
```

---

# 24. 项目目录建议

```text
brain/
  app/
    page.tsx
    profile/page.tsx
    saved/page.tsx
    later/page.tsx
    topics/page.tsx
    topics/[id]/page.tsx
    memories/[id]/page.tsx
    output/page.tsx
    settings/page.tsx
    api/
      items/route.ts
      items/seed/route.ts
      score/route.ts
      decision/route.ts
      remember/route.ts
      memories/route.ts
      topics/route.ts
      output/route.ts
      profile/route.ts

  components/
    ItemCard.tsx
    SwipeableCard.tsx
    MemoryIntentSheet.tsx
    ScoreBadge.tsx
    ValueTags.tsx
    BottomNav.tsx
    MemoryCardView.tsx
    TopicPageView.tsx
    OutputComposer.tsx
    MarkdownCopyButton.tsx

  lib/
    supabase.ts
    scoring.ts
    ai.ts
    markdown.ts
    memory.ts
    topic.ts
    intent.ts
    output.ts

  data/
    mock-aihot-items.json

  docs/
    v0.1-mvp-requirements.md
    prompts.md
    database.sql

  public/
    manifest.json
    icons/

  README.md
```

---

# 25. Supabase 数据库设计

## 25.1 profiles

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  role text,
  level text,
  current_projects text[],
  goals text[],
  preferred_topics text[],
  disliked_topics text[],
  preferred_content_types text[],
  output_goals text[],
  custom_description text,
  created_at timestamp with time zone default now()
);
```

## 25.2 raw_items

```sql
create table raw_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text not null,
  title text not null,
  raw_summary text,
  raw_content text,
  author text,
  published_at timestamp with time zone,
  aihot_rank int,
  raw_tags text[],
  created_at timestamp with time zone default now()
);
```

## 25.3 item_scores

```sql
create table item_scores (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  relevance_score int,
  role_fit int,
  goal_fit int,
  project_fit int,
  knowledge_level_fit int,
  actionability int,
  reusability int,
  novelty int,
  durability int,
  noise_penalty int,
  recommendation_reason text,
  value_tags text[],
  action_suggestion text,
  reading_cost text,
  created_at timestamp with time zone default now()
);
```

## 25.4 decisions

```sql
create table decisions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  decision text not null,
  feedback_note text,
  created_at timestamp with time zone default now(),
  unique(item_id, profile_id)
);
```

## 25.5 memory_intents

```sql
create table memory_intents (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  decision_id uuid references decisions(id) on delete cascade,
  memory_id uuid,

  emotion_tags text[],
  value_tags text[],
  use_case_tags text[],

  user_note text,
  ai_guess_reason text,

  created_at timestamp with time zone default now()
);
```

## 25.6 memory_cards

```sql
create table memory_cards (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  intent_id uuid references memory_intents(id) on delete set null,

  title text,
  one_sentence_value text,
  why_i_saved_it text,
  core_insights text[],

  memory_type text,

  emotion_tags text[],
  value_tags text[],
  use_case_tags text[],

  reusable_scenarios text[],
  related_projects text[],
  related_topics text[],

  confidence int,
  markdown_content text,
  created_at timestamp with time zone default now()
);
```

## 25.7 memory_manuals

```sql
create table memory_manuals (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid references memory_cards(id) on delete cascade,

  when_to_use text[],
  when_not_to_use text[],
  good_for_questions text[],
  not_good_for_questions text[],
  limitations text[],
  retrieval_keywords text[],

  priority int,
  created_at timestamp with time zone default now()
);
```

## 25.8 topic_pages

```sql
create table topic_pages (
  id uuid primary key default gen_random_uuid(),
  topic_name text unique not null,

  current_judgment text,
  key_points text[],
  supporting_memory_ids uuid[],
  open_questions text[],

  markdown_content text,
  last_updated_at timestamp with time zone default now()
);
```

## 25.9 outputs

```sql
create table outputs (
  id uuid primary key default gen_random_uuid(),

  output_type text,
  title text,
  content text,

  related_topic_ids uuid[],
  related_memory_ids uuid[],

  created_at timestamp with time zone default now()
);
```

---

# 26. API Routes

使用 Next.js App Router。

```text
/api/items
  GET: 获取推荐流内容

/api/items/seed
  POST: 导入 mock AI HOT 数据

/api/profile
  GET: 获取用户画像
  POST: 更新用户画像

/api/score
  POST: 对内容进行评分

/api/decision
  POST: 记录用户决策

/api/intent
  POST: 生成或保存 Memory Intent

/api/remember
  POST: 记住一条内容，生成 Memory Intent、Memory Card、Memory Manual、Topic Page

/api/memories
  GET: 获取记忆卡列表

/api/memories/[id]
  GET: 获取记忆卡详情

/api/topics
  GET: 获取主题页列表

/api/topics/[id]
  GET: 获取主题页详情

/api/output
  POST: 基于记忆资产生成输出
```

---

# 27. Prompt 设计

## 27.1 相关性评分 Prompt

```text
你是 brain 的个人相关性判断器。

你的任务是根据用户画像，判断一条 AI HOT 内容对用户是否有价值。

请不要只判断主题是否匹配，而要判断：
1. 它是否和用户的职业相关；
2. 它是否和用户当前目标相关；
3. 它是否和用户正在做的项目相关；
4. 它是否适合用户当前知识水平；
5. 它是否能带来行动；
6. 它是否未来可复用；
7. 它是否有长期价值；
8. 它是否只是噪音、营销或短期新闻。

请输出 JSON：
{
  "relevance_score": 0-100,
  "role_fit": 0-100,
  "goal_fit": 0-100,
  "project_fit": 0-100,
  "knowledge_level_fit": 0-100,
  "actionability": 0-100,
  "reusability": 0-100,
  "novelty": 0-100,
  "durability": 0-100,
  "noise_penalty": 0-100,
  "recommendation_reason": "为什么推荐或不推荐给这个用户",
  "value_tags": ["产品灵感", "写作素材"],
  "action_suggestion": "建议用户如何处理这条内容",
  "reading_cost": "low | medium | high"
}
```

## 27.2 Memory Intent 预判 Prompt

```text
你是 brain 的收藏意图预判器。

用户即将记住一条内容。请根据用户画像、内容本身和相关性评分，预判用户为什么可能想记住它。

请输出 JSON：
{
  "emotion_tags": ["有启发"],
  "value_tags": ["新产品路线", "决策证据"],
  "use_case_tags": ["用于 brain", "用于产品判断"],
  "ai_guess_reason": "这条内容可能会启发用户重新思考 brain 的记忆层设计。"
}

可选 emotion_tags：
惊艳 / fancy、有启发、想试试、不认同、困惑、焦虑 / FOMO、被说服、觉得危险、以后可能有用、只是觉得新鲜

可选 value_tags：
新交互方式、新产品路线、新商业模式、新技术路径、新工作流、开源工具、竞品观察、趋势信号、案例证据、反方观点、概念解释、方法论、可立即实践、长期知识、低优先级收藏

可选 use_case_tags：
用于 brain、用于 AI HOT、用于文章、用于产品判断、用于项目 backlog、用于学习复盘、用于技术选型、用于决策备忘录、用于以后问 AI、只是收藏
```

## 27.3 Memory Card 生成 Prompt

```text
你是 brain 的记忆编译器。

请根据以下信息生成一张 Memory Card：

1. 原始内容
2. 用户画像
3. 相关性评分
4. 用户的收藏意图 Memory Intent

注意：
这不是普通摘要。
你需要解释这条内容为什么进入用户的 brain，它对用户的项目、目标、判断或输出有什么意义。

请输出 JSON：
{
  "title": "",
  "one_sentence_value": "",
  "why_i_saved_it": "",
  "core_insights": [],
  "memory_type": "",
  "emotion_tags": [],
  "value_tags": [],
  "use_case_tags": [],
  "reusable_scenarios": [],
  "related_projects": [],
  "related_topics": [],
  "confidence": 0-100,
  "markdown_content": ""
}
```

## 27.4 Memory Manual 生成 Prompt

```text
你是 brain 的记忆说明书生成器。

请根据 Memory Card 生成一份 Memory Manual，告诉未来的 AI 在什么情况下应该调用这条记忆。

请输出 JSON：
{
  "when_to_use": [],
  "when_not_to_use": [],
  "good_for_questions": [],
  "not_good_for_questions": [],
  "limitations": [],
  "retrieval_keywords": [],
  "priority": 0-100
}
```

## 27.5 Topic Page 更新 Prompt

```text
你是 brain 的主题页维护器。

请根据新生成的 Memory Card，创建或更新相关 Topic Page。

Topic Page 的作用不是堆砌摘要，而是形成用户对某个主题的长期判断。

请输出 JSON：
{
  "topic_name": "",
  "current_judgment": "",
  "key_points": [],
  "supporting_memory_ids": [],
  "open_questions": [],
  "markdown_content": ""
}
```

## 27.6 Output 生成 Prompt

```text
你是 brain 的输出助手。

请基于用户已经记住的 Memory Cards、Memory Manuals 和 Topic Pages，生成一个有用的输出。

注意：
1. 不要泛泛而谈。
2. 优先使用用户已经选择记住的内容。
3. 体现用户的当前项目、目标和偏好。
4. 体现用户当时为什么记住这些内容，包括情绪、价值判断和用途标签。
5. 如果信息不足，请明确指出。
6. 输出要能直接被用户复制到 Obsidian 或文档中继续编辑。

输出类型：{{output_type}}

用户画像：
{{user_profile}}

相关主题页：
{{topic_pages}}

相关记忆：
{{memory_cards}}

请生成 Markdown。
```

---

# 28. PWA 要求

## 28.1 基础要求

1. 支持移动端 viewport。
    
2. 提供 `manifest.json`。
    
3. App name：brain。
    
4. 支持添加到 iPhone 主屏幕。
    
5. 首页适配 iPhone。
    
6. 不要求复杂离线缓存。
    
7. 不要求推送通知。
    

## 28.2 manifest 示例

```json
{
  "name": "brain",
  "short_name": "brain",
  "description": "Personal cognitive asset builder for AI information streams.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#111827",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

# 29. 开发优先级

## 29.1 P0：必须完成

1. Next.js 项目搭建。
    
2. Tailwind CSS。
    
3. Supabase 连接。
    
4. 数据库 SQL schema。
    
5. mock AI HOT 数据。
    
6. 默认用户画像。
    
7. 首页移动端卡片流。
    
8. 相关性评分 mock 逻辑。
    
9. 记住 / 略过 / 稍后读。
    
10. Memory Intent 面板。
    
11. 生成 Memory Card。
    
12. 生成 Memory Manual。
    
13. 创建或更新 Topic Page。
    
14. Saved 页面。
    
15. Topics 页面。
    
16. Output 页面。
    
17. Markdown 复制。
    
18. PWA manifest。
    
19. README 运行说明。
    

## 29.2 P1：建议完成

1. OpenAI API 真实生成。
    
2. 左右滑手势动画。
    
3. 稍后读页面。
    
4. 一键导出所有 Markdown。
    
5. 双列选择模式。
    
6. 更好的移动端底部导航。
    
7. Debug 页面，方便查看数据生成情况。
    

## 29.3 P2：暂缓

1. 真实 AI HOT API。
    
2. Obsidian 自动同步。
    
3. GitHub 自动提交 Markdown。
    
4. 真正 RAG 问答。
    
5. 多用户登录。
    
6. 团队协作。
    
7. 原生 iOS App。
    
8. 浏览器插件。
    

---

# 30. Demo 验收流程

完成后，demo 必须能跑通以下流程：

1. 本地运行项目。
    
2. 打开首页。
    
3. 点击 seed mock 数据。
    
4. 系统生成或展示 AI HOT mock 内容。
    
5. 首页按相关性排序展示内容卡片。
    
6. 用户点击或右滑“记住”。
    
7. 弹出 Memory Intent 面板。
    
8. AI 预选情绪、价值、用途标签。
    
9. 用户点击确认保存。
    
10. 系统生成 Memory Card。
    
11. 系统生成 Memory Manual。
    
12. 系统创建或更新 Topic Page。
    
13. 用户进入 `/saved` 查看记忆卡。
    
14. 用户进入 `/topics` 查看主题页。
    
15. 用户进入 `/output`。
    
16. 选择“文章大纲”或“产品判断”。
    
17. 系统基于已记住内容生成 Markdown 输出。
    
18. 用户复制 Markdown。
    
19. 项目可部署到 Vercel。
    
20. 用户可在 iPhone Safari 打开，并添加到主屏幕。
    

---

# 31. README 要求

README 必须包含：

1. 项目介绍。
    
2. 产品核心流程。
    
3. 技术栈。
    
4. 本地运行方法。
    
5. 环境变量说明。
    
6. Supabase 建表方法。
    
7. 如何导入 mock 数据。
    
8. 如何使用 demo。
    
9. 如何部署到 Vercel。
    
10. v0.1 已完成功能。
    
11. 当前限制。
    
12. v0.2 TODO。
    

---

# 32. Codex 开发指令

请根据本文档开发 brain v0.1 MVP。

优先目标不是做复杂功能，而是跑通完整闭环：

```text
AI HOT mock 数据
→ 用户画像
→ 内容相关性评分
→ 移动端卡片流
→ 记住 / 略过 / 稍后读
→ 收藏时补充 Memory Intent
→ 生成 Memory Card
→ 生成 Memory Manual
→ 更新 Topic Page
→ 基于记忆资产生成 Output
```

技术要求：

```text
Next.js App Router
TypeScript
Tailwind CSS
Supabase
PWA
Vercel 部署
pnpm
```

第一版要求：

1. 先使用 mock 数据。
    
2. 如果没有 OpenAI API Key，则使用本地 mock AI 生成逻辑。
    
3. 保证 `pnpm install && pnpm dev` 可以运行。
    
4. 所有页面优先适配手机端。
    
5. README 写清楚如何运行和部署。
    
6. 代码结构要清晰，方便后续迭代。
    

开发顺序：

```text
1. 初始化项目结构
2. 创建 Supabase SQL schema
3. 创建 mock AI HOT 数据
4. 实现默认用户画像
5. 实现首页移动端卡片流
6. 实现相关性评分逻辑
7. 实现记住 / 略过 / 稍后读
8. 实现 Memory Intent 面板
9. 实现 remember 流程
10. 生成 Memory Card
11. 生成 Memory Manual
12. 创建或更新 Topic Page
13. 实现 saved 页面
14. 实现 topics 页面
15. 实现 output 页面
16. 实现 Markdown 复制
17. 实现 PWA manifest
18. 补充 README
19. 自测完整 demo 流程
```

最终输出：

1. 已完成的功能清单。
    
2. 如何本地运行。
    
3. 如何配置 Supabase。
    
4. 如何部署到 Vercel。
    
5. 当前限制。
    
6. 下一步建议。
    

---

# 33. v0.1 一句话验收标准

当我在手机上打开 brain，我应该能看到一组来自 AI HOT 的内容卡片；它们已经按照“对我是否有用”排序；每条内容都告诉我为什么推荐；我可以右滑记住、左滑略过；当我记住一条内容时，可以轻量表达我为什么想记住它；系统会把这条内容转化为 Memory Card、Memory Manual，并更新 Topic Page；最后我可以基于这些记忆生成文章大纲、产品判断或决策备忘录，并复制 Markdown 到 Obsidian。

