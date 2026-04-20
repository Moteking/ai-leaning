import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { parseResume } from "@/lib/ai/parse-resume";

const bodySchema = z.object({
  resumeText: z.string().min(50).max(20000),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "本文は50文字以上20,000文字以下で入力してください。" }, { status: 400 });
  }

  try {
    const structure = await parseResume(parsed.data.resumeText);
    return NextResponse.json({ structure });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AIの整形に失敗しました。";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
