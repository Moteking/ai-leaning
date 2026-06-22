import { NextResponse } from "next/server";
import { runMentionCheck } from "@/lib/aiMention";
import { getLeadStore } from "@/lib/db/leadStore";
import { sendThankYouEmail } from "@/lib/email";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

// 外部API(Claude)を呼ぶため Node.js ランタイム
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // LLM呼び出しを伴うため厳しめのレートリミット
  const { allowed } = rateLimit(`mention:${getClientIp(request)}`, 8, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "チェックのリクエストが多すぎます。時間をおいて再度お試しください。" },
      { status: 429 }
    );
  }

  let body: {
    brand?: string;
    query?: string;
    company?: string;
    email?: string;
    website?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  // ハニーポット
  if ((body.website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const brand = (body.brand ?? "").trim();
  const query = (body.query ?? "").trim();
  const company = (body.company ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!brand) return NextResponse.json({ error: "ブランド名・サイト名を入力してください。" }, { status: 400 });
  if (!query) return NextResponse.json({ error: "想定する検索クエリ・カテゴリを入力してください。" }, { status: 400 });
  if (!company) return NextResponse.json({ error: "会社名を入力してください。" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "正しいメールアドレスを入力してください。" }, { status: 400 });
  }

  // リードとして保存(機会損失を避けるため失敗してもチェックは続行)
  try {
    const store = await getLeadStore();
    await store.save({ company, email, url: `${brand} / ${query}`, score: 0, grade: "AI引用チェック" });
  } catch (err) {
    console.error("[ai-mention] リード保存失敗:", err);
  }

  try {
    const result = await runMentionCheck(brand, query);
    if (!result.available) {
      return NextResponse.json(
        {
          error:
            "このツールは現在準備中です（AI連携の設定待ち）。サイトのAI検索対応度は『無料診断』からすぐにご確認いただけます。",
          unavailable: true,
        },
        { status: 503 }
      );
    }
    // サンクスメール(キー設定時のみ)
    await sendThankYouEmail({ company, email, url: `${brand} / ${query}`, score: 0, grade: "AI引用チェック" }).catch(() => {});
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[ai-mention] チェック失敗:", err);
    return NextResponse.json(
      { error: "AIへの問い合わせ中にエラーが発生しました。時間をおいて再度お試しください。" },
      { status: 502 }
    );
  }
}
