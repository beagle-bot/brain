# brain

brain 是一个移动端优先的个人信息筛选与认知沉淀工具。v0.1 直接读取 AI HOT 公开 API，用浏览器 localStorage 保存“我为什么想记住它”。

```text
AI HOT 公开 API
→ 移动端卡片流
→ 点击记住
→ Memory Intent
→ Saved
→ Output Markdown
```

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PWA manifest
- Supabase schema placeholder
- localStorage demo state

## Local Run

```bash
cd brain
corepack enable
pnpm install
pnpm dev
```

If `pnpm` is unavailable, npm also works:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` on desktop or iPhone Safari.

## Environment Variables

Copy `.env.example` to `.env.local`.

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The current demo does not require these variables. Without keys, all scoring and memory generation use local deterministic logic.

## Supabase

Run [docs/database.sql](./docs/database.sql) in the Supabase SQL editor. v0.1 ships with the schema and `lib/supabase.ts`, but the UI still stores demo state in localStorage so the PWA can run immediately without a backend.

## AI HOT Data

The app reads selected AI HOT items from:

```text
https://aihot.virxact.com/api/public/items?mode=selected&take=50
```

[data/mock-aihot-items.json](./data/mock-aihot-items.json) is kept only as a fallback if the public API is temporarily unavailable.

## Demo Flow

1. Open `/`.
2. Review selected AI HOT cards.
3. Click remember.
4. Confirm Memory Intent tags, or save the default reason directly.
5. Open `/saved` to view saved reasons.
6. Open `/output`, choose an output type, generate Markdown and copy it.

## Completed in v0.1

- Mobile-first Feed
- AI HOT public API loading
- Remember decisions
- Memory Intent bottom sheet
- Saved, Output and Me pages
- Markdown copy
- PWA manifest
- Supabase SQL schema
- Basic API routes for items, profile, score and output

## Current Limits

- No Supabase persistence wired to the UI yet.
- No OpenAI model calls yet.
- No login or multi-user support.
- PWA has manifest support but no advanced offline cache or push notifications.

## Vercel Deploy

1. Push this `brain/` project to GitHub.
2. Import it in Vercel.
3. Set the project root to `brain`.
4. Add environment variables if you want Supabase/OpenAI in later iterations.
5. Deploy.

## v0.2 TODO

- Wire Supabase persistence.
- Add OpenAI scoring and generation when `OPENAI_API_KEY` exists.
- Add real AI HOT API/RSS ingestion.
- Add export-all Markdown.
- Add real persistence when the local demo flow feels right.
- Add offline cache service worker.
