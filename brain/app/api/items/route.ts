import { NextResponse } from "next/server";
import { fetchAihotItems } from "@/lib/aihot";
import { rawItems } from "@/lib/storage";

export async function GET() {
  try {
    const items = await fetchAihotItems();
    return NextResponse.json({ items, source: "aihot" });
  } catch (error) {
    return NextResponse.json(
      {
        items: rawItems,
        source: "mock",
        error: error instanceof Error ? error.message : "AIHOT request failed"
      },
      { status: 200 }
    );
  }
}
