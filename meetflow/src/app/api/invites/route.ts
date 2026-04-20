import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email(),
  role: z.literal("HIRING_MANAGER"),
});

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "入力が不正です。" }, { status: 400 });

  const admin = await prisma.companyAdmin.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!admin) return NextResponse.json({ error: "企業管理者のみ発行できます。" }, { status: 403 });

  // 40-char random token; collisions are astronomically unlikely but we rely on
  // the DB unique constraint as the final arbiter.
  const token = `inv_${randomBytes(18).toString("hex")}`;
  const invite = await prisma.invite.create({
    data: {
      token,
      companyId: admin.companyId,
      email: parsed.data.email,
      role: parsed.data.role,
      expiresAt: new Date(Date.now() + TWO_WEEKS_MS),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "INVITE_CREATED",
      targetType: "Invite",
      targetId: invite.id,
      metadata: { email: parsed.data.email, role: parsed.data.role },
    },
  });

  // Email delivery is added in Phase 4 (Resend). MVP returns the token directly.
  return NextResponse.json({ ok: true, token });
}
