import type { RawItem } from "@/lib/types";

type AihotItem = {
  id: string;
  title: string;
  url: string;
  permalink: string;
  source: string;
  publishedAt: string;
  summary: string;
  category: string;
  score?: number;
  selected?: boolean;
};

const AIHOT_ITEMS_URL = "https://aihot.virxact.com/api/public/items?mode=selected&take=50";

export async function fetchAihotItems(): Promise<RawItem[]> {
  const response = await fetch(AIHOT_ITEMS_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "brain-v0.1"
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`AIHOT request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { items?: AihotItem[] };
  return (payload.items ?? []).map((item, index) => ({
    id: item.id,
    source: "AI HOT",
    source_url: item.url || item.permalink,
    title: item.title,
    raw_summary: item.summary,
    raw_content: item.permalink,
    author: item.source,
    published_at: item.publishedAt,
    aihot_rank: index + 1,
    raw_tags: [item.category, item.selected ? "精选" : "", typeof item.score === "number" ? `AIHOT ${item.score}` : ""].filter(Boolean),
    created_at: item.publishedAt
  }));
}
