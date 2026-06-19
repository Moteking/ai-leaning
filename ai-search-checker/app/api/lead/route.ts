import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/db/leadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    company?: string;
    email?: string;
    url?: string;
    score?: number;
    grade?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
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
