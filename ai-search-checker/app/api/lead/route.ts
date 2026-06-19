import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/db/leadStore";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // 濫用防止のレートリミット(ベストエフォート)
  const { allowed } = rateLimit(`lead:${getClientIp(request)}`, 30, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "送信が多すぎます。しばらく時間をおいて再度お試しください。" },
      { status: 429 }
    );
  }

  let body: {
    company?: string;
    email?: string;
    url?: string;
    score?: number;
    grade?: string;
    website?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  // ハニーポット: 通常非表示のフィールドに入力があればボットとみなす。
  // ボットに気づかせないため、成功を装って保存はしない。
  if ((body.website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const company = (body.company ?? "").trim();
  const email = (body.email ?? "").trim();
  const url = (body.url ?? "").trim();
  const score = Number(body.score);
  const grade = (body.grade ?? "").trim();

  if (!company) {
    return NextResponse.json({ error: "会社名を入力してください。" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "正しいメールアドレスを入力してください。" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(score)) {
    return NextResponse.json({ error: "診断スコアが不正です。" }, { status: 400 });
  }

  const lead = {
    company,
    email,
    url,
    score: Math.round(score),
    grade: grade || "-",
  };

  try {
    const store = await getLeadStore();
    const record = await store.save(lead);
    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    // 保存に失敗してもユーザーのレポート閲覧は妨げない(機会損失を避ける)。
    // ただし取りこぼし監視のため、リード内容をログに必ず残す(Vercel等のログで確認可能)。
    console.error(
      "[lead] 保存に失敗しました(ユーザーには成功扱いで返却)。lead=",
      JSON.stringify(lead),
      "error=",
      err
    );
    return NextResponse.json({ ok: true, persisted: false });
  }
}
