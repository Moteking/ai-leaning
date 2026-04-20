import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  token: z.string().min(10).max(100),
  displayName: z.string().min(1).max(100),
  position: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "入力が不正です。" }, { status: 400 });

  const invite = await prisma.invite.findUnique({ where: { token: parsed.data.token } });
  if (!invite) return NextResponse.json({ error: "招待コードが見つかりません。" }, { status: 404 });
  if (invite.acceptedAt) return NextResponse.json({ error: "この招待は利用済みです。" }, { status: 409 });
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "この招待は期限切れです。" }, { status: 410 });
  }
  if (invite.role !== "HIRING_MANAGER") {
    return NextResponse.json({ error: "この招待タイプには対応していません。" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { hiringManager: true },
  });
  if (!user) return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
  if (user.role !== "HIRING_MANAGER") {
    return NextResponse.json({ error: "面接官としてサインアップしてから受諾してください。" }, { status: 403 });
  }
  if (user.hiringManager) {
    return NextResponse.json({ error: "すでに別企業の面接官として登録されています。" }, { status: 409 });
  }

  // Run creation + invite mark in a single transaction so partial states never
  // slip through.
  await prisma.$transaction([
    prisma.hiringManager.create({
      data: {
        userId: user.id,
        companyId: invite.companyId,
        displayName: parsed.data.displayName,
        position: parsed.data.position,
      },
    }),
    prisma.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        actorId: userId,
        action: "INVITE_ACCEPTED",
        targetType: "Invite",
        targetId: invite.id,
        metadata: { companyId: invite.companyId },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
