import { NextResponse } from "next/server";
import { defaultProfile } from "@/lib/profile";
import { scoreItem } from "@/lib/scoring";
import { rawItems } from "@/lib/storage";
import type { RawItem, UserProfile } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    item?: RawItem;
    profile?: UserProfile;
  };
  const profile = body.profile ?? defaultProfile;

  if (body.item) {
    return NextResponse.json({ score: scoreItem(body.item, profile) });
  }

  return NextResponse.json({ scores: rawItems.map((item) => scoreItem(item, profile)) });
}
