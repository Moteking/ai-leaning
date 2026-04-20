import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  decision: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().max(2000).optional(),
});

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await requireRole("PLATFORM_ADMIN");
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "入力が不正です。" }, { status: 400 });

  const { id } = await ctx.params;
  const match = await prisma.match.findUnique({ where: { id } });
  if (!match) return NextResponse.json({ error: "マッチが見つかりません。" }, { status: 404 });

  if (parsed.data.decision === "REJECT") {
    if (!parsed.data.reason || parsed.data.reason.trim().length < 5) {
      return NextResponse.json({ error: "理由を5文字以上で記入してください。" }, { status: 400 });
    }
    await prisma.match.update({
      where: { id },
      data: {
        status: "REJECTED_BY_AUDIT",
        auditedBy: userId,
        auditedAt: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: "MATCH_REJECTED_BY_AUDIT",
        targetType: "Match",
        targetId: match.id,
        metadata: { reason: parsed.data.reason, fitScore: match.fitScore },
      },
    });
    return NextResponse.json({ ok: true });
  }

  // APPROVE is used when a previously-rejected match needs to be reinstated.
  await prisma.match.update({
    where: { id },
    data: { status: "APPROVED", auditedBy: userId, auditedAt: new Date() },
  });
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "MATCH_APPROVED_BY_AUDIT",
      targetType: "Match",
      targetId: match.id,
      metadata: { reason: parsed.data.reason ?? null },
    },
  });
  return NextResponse.json({ ok: true });
}
