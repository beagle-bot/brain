import { NextResponse } from "next/server";
import { generateOutput } from "@/lib/output";
import { createInitialState } from "@/lib/storage";
import type { BrainState, OutputType } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    state?: BrainState;
    outputType?: OutputType;
  };
  const state = body.state ?? createInitialState();
  const output = generateOutput(state, body.outputType ?? "文章大纲");

  return NextResponse.json({ output });
}
