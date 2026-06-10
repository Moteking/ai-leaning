import { NextResponse } from "next/server";
import { runDiagnosis } from "@/lib/diagnose";

// 外部URLを取得するため Node.js ランタイムで実行(Edge不可)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const url = (body.url ?? "").trim();
  if (!url) {
    return NextResponse.json({ error: "URLを入力してください。" }, { status: 400 });
  }

  try {
    const result = await runDiagnosis(url);
    return NextResponse.json({ result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "診断中にエラーが発生しました。";
    // 入力起因のエラーは 400、その他は 502 とする
    const status = /URL|入力|http|タイムアウト|アクセス|内部ネットワーク/.test(message)
      ? 400
      : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
