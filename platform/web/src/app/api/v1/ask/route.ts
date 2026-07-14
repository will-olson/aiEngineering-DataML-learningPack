import { NextResponse } from "next/server";
import { runAsk } from "@/lib/ask";
import type { AskContext } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      query?: string;
      course_ids?: string[];
      history?: { role: string; content: string }[];
      context?: AskContext;
    };
    const query = body.query?.trim();
    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }
    const result = await runAsk({
      query,
      course_ids: body.course_ids,
      history: body.history,
      context: body.context,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ask failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
