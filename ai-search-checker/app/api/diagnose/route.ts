import { NextResponse } from "next/server";
import { runDiagnosis } from "@/lib/diagnose";
import type { DiagnosisResult } from "@/lib/diagnose/types";

// 外部URLを取得するため Node.js ランタイムで実行(Edge不可)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 入力起因のエラーか(メッセージで判定して 400/502 を切り分け) */
function isInputError(message: string): boolean {
  return /URL|入力|http|タイムアウト|アクセス|内部ネットワーク|エラー応答/.test(message);
}

export async function POST(request: Request) {
  let body: { url?: string; productUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const url = (body.url ?? "").trim();
  const productUrl = (body.productUrl ?? "").trim();
  if (!url) {
    return NextResponse.json({ error: "URLを入力してください。" }, { status: 400 });
  }

  // メインURL(サイトトップ)は必須。失敗したらリクエスト全体を失敗扱い。
  let primary: DiagnosisResult;
  try {
    primary = await runDiagnosis(url, "サイトトップ");
  } catch (err) {
    const message = err instanceof Error ? err.message : "診断中にエラーが発生しました。";
    return NextResponse.json(
      { error: message },
      { status: isInputError(message) ? 400 : 502 }
    );
  }

  const results: DiagnosisResult[] = [primary];
  const notices: string[] = [];

  // 商品ページURLは任意。失敗してもメイン結果は返す(ベストエフォート)。
  if (productUrl && productUrl !== url) {
    try {
      const product = await runDiagnosis(productUrl, "商品ページ");
      results.push(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : "診断中にエラーが発生しました。";
      notices.push(`商品ページの診断に失敗しました(${message})。サイトトップの結果のみ表示します。`);
    }
  }

  return NextResponse.json({ results, notices });
}
