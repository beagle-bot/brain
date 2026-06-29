import { NextResponse } from "next/server";
import { defaultProfile } from "@/lib/profile";

export async function GET() {
  return NextResponse.json({ profile: defaultProfile });
}
