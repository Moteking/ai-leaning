import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  decision: z.enum(["ACCEPT", "DECLINE"]),
});

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "入力が不正です。" }, { status: 400 });

  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: true },
  });
  if (!user?.candidateProfile) {
    return NextResponse.json({ error: "候補者プロフィールが見つかりません。" }, { status: 403 });
  }

  const match = await prisma.match.findFirst({
    where: { id, candidateProfileId: user.candidateProfile.id },
  });
  if (!match) return NextResponse.json({ error: "マッチが見つかりません。" }, { status: 404 });
  if (match.status !== "APPROVED") {
    return NextResponse.json({ error: "このマッチは操作できません。" }, { status: 409 });
  }

  if (parsed.data.decision === "ACCEPT") {
    // Phase 4 will consume APPROVED+candidateAccepted matches and create a
    // meeting. For now we mark status back to APPROVED and write an audit
    // entry describing the acceptance; the scheduling job looks for an
    // `ACCEPTED_BY_CANDIDATE` audit action.
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: "MATCH_ACCEPTED_BY_CANDIDATE",
        targetType: "Match",
        targetId: match.id,
        metadata: { fitScore: match.fitScore },
      },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.match.update({ where: { id: match.id }, data: { status: "EXPIRED" } });
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "MATCH_DECLINED_BY_CANDIDATE",
      targetType: "Match",
      targetId: match.id,
      metadata: {},
    },
  });
  return NextResponse.json({ ok: true });
}
