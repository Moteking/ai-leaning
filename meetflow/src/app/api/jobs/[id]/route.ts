import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { jobInputSchema } from "@/lib/validations/job";
import { buildJobEmbeddingText, setJobEmbedding } from "@/lib/embeddings/store";

async function resolveAdminOwnedJob(clerkId: string, jobId: string) {
  const admin = await prisma.companyAdmin.findFirst({
    where: { user: { clerkId } },
    include: { company: true },
  });
  if (!admin) return null;
  const job = await prisma.jobPosting.findFirst({
    where: { id: jobId, companyId: admin.companyId },
  });
  if (!job) return null;
  return { admin, job };
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = jobInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容に不備があります。" }, { status: 400 });
  }
  if (parsed.data.salaryMax < parsed.data.salaryMin) {
    return NextResponse.json({ error: "年収上限は下限以上にしてください。" }, { status: 400 });
  }

  const { id } = await ctx.params;
  const record = await resolveAdminOwnedJob(userId, id);
  if (!record) return NextResponse.json({ error: "求人が見つかりません。" }, { status: 404 });

  const job = await prisma.jobPosting.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      requiredSkills: parsed.data.requiredSkills,
      salaryMin: parsed.data.salaryMin,
      salaryMax: parsed.data.salaryMax,
      workStyle: parsed.data.workStyle,
      status: parsed.data.status ?? record.job.status,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "JOB_UPDATED",
      targetType: "JobPosting",
      targetId: job.id,
      metadata: { title: job.title },
    },
  });

  try {
    const text = buildJobEmbeddingText({
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      workStyle: job.workStyle,
      companyName: record.admin.company.name,
      companyIndustry: record.admin.company.industry,
      companyDescription: record.admin.company.description,
    });
    await setJobEmbedding(job.id, text);
  } catch (error) {
    console.warn("job embedding refresh failed", error);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await ctx.params;
  const record = await resolveAdminOwnedJob(userId, id);
  if (!record) return NextResponse.json({ error: "求人が見つかりません。" }, { status: 404 });

  await prisma.jobPosting.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "JOB_DELETED",
      targetType: "JobPosting",
      targetId: id,
      metadata: { title: record.job.title },
    },
  });
  return NextResponse.json({ ok: true });
}
