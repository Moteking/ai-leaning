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

  try {
    const store = await getLeadStore();
    const record = await store.save({
      company,
      email,
      url,
      score: Math.round(score),
      grade: grade || "-",
    });
    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[lead] 保存に失敗しました:", err);
    return NextResponse.json(
      { error: "リード情報の保存に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
