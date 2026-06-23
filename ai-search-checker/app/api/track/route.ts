import { NextResponse } from "next/server";
import { runMentionCheck } from "@/lib/aiMention";
import { recordSnapshot, listTrackedQueries, isTrackingEnabled } from "@/lib/db/snapshots";

// 外部API(Claude)を呼ぶため Node.js ランタイム
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** x-track-secret ヘッダが TRACK_SECRET と一致するか(未設定なら常に拒否) */
function authorized(request: Request): boolean {
  const secret = (process.env.TRACK_SECRET ?? "").trim();
  if (!secret) return false;
  return request.headers.get("x-track-secret") === secret;
}

/** GET: 追跡対象の一覧を返す(cronがこれを取得して1件ずつPOSTする) */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isTrackingEnabled()) {
    return NextResponse.json({ error: "tracking disabled (Supabase未設定)" }, { status: 503 });
  }
  const queries = await listTrackedQueries(30);
  return NextResponse.json({ queries });
}

/** POST: 指定 {brand, query} を1件再診断してスナップショットを記録する */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isTrackingEnabled()) {
    return NextResponse.json({ error: "tracking disabled (Supabase未設定)" }, { status: 503 });
  }

  let body: { brand?: string; query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const brand = (body.brand ?? "").trim();
  const query = (body.query ?? "").trim();
  if (!brand || !query) {
    return NextResponse.json({ error: "brand and query required" }, { status: 400 });
  }

  try {
    const result = await runMentionCheck(brand, query);
    if (!result.available) {
      return NextResponse.json({ error: "AI未設定" }, { status: 503 });
    }
    await recordSnapshot({
      brand,
      query,
      visibilityScore: result.visibilityScore,
      mentioned: result.mentioned,
      rank: result.rank,
      coverageMentioned: result.coverageMentioned,
      coverageTotal: result.coverageTotal,
      source: "cron",
    });
    return NextResponse.json({ ok: true, brand, query, score: result.visibilityScore });
  } catch (err) {
    console.error("[track] 失敗:", err);
    return NextResponse.json({ error: "check failed" }, { status: 502 });
  }
}
