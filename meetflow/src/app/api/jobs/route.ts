import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { jobInputSchema } from "@/lib/validations/job";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = jobInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容に不備があります。" }, { status: 400 });
  }
  if (parsed.data.salaryMax < parsed.data.salaryMin) {
    return NextResponse.json({ error: "年収上限は下限以上にしてください。" }, { status: 400 });
  }

  const admin = await prisma.companyAdmin.findFirst({
    where: { user: { clerkId: userId } },
    include: { user: true },
  });
  if (!admin) return NextResponse.json({ error: "企業管理者のみ実行できます。" }, { status: 403 });

  const job = await prisma.jobPosting.create({
    data: {
      companyId: admin.companyId,
      title: parsed.data.title,
      description: parsed.data.description,
      requiredSkills: parsed.data.requiredSkills,
      salaryMin: parsed.data.salaryMin,
      salaryMax: parsed.data.salaryMax,
      workStyle: parsed.data.workStyle,
      status: parsed.data.status ?? "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "JOB_CREATED",
      targetType: "JobPosting",
      targetId: job.id,
      metadata: { title: job.title },
    },
  });

  return NextResponse.json({ ok: true, jobId: job.id });
}
