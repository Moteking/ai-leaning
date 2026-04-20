import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  size: z.enum(["STARTUP", "SMB", "MID_MARKET", "ENTERPRISE"]),
  websiteUrl: z.string().url().nullable().optional(),
  description: z.string().min(30).max(5000),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容に不備があります。" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { companyAdmins: true },
  });
  if (!user || user.role !== "COMPANY_ADMIN") {
    return NextResponse.json({ error: "企業管理者として登録されていません。" }, { status: 403 });
  }
  if (user.companyAdmins.length > 0) {
    return NextResponse.json({ error: "すでに会社が登録されています。" }, { status: 409 });
  }

  const data = parsed.data;
  const company = await prisma.company.create({
    data: {
      name: data.name,
      industry: data.industry,
      size: data.size,
      websiteUrl: data.websiteUrl ?? null,
      description: data.description,
      admins: { create: { userId: user.id } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "COMPANY_CREATED",
      targetType: "Company",
      targetId: company.id,
      metadata: { name: company.name, industry: company.industry },
    },
  });

  return NextResponse.json({ ok: true, companyId: company.id });
}
