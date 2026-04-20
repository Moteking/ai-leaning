import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  displayName: z.string().min(1).max(100),
  currentPosition: z.string().max(200).optional().nullable(),
  yearsOfExperience: z.number().int().min(0).max(60).optional().nullable(),
  skills: z.array(z.string().min(1).max(80)).max(30),
  desiredRoles: z.array(z.string().min(1).max(120)).max(10),
  desiredSalaryMin: z.number().int().min(0).max(100000).nullable().optional(),
  desiredSalaryMax: z.number().int().min(0).max(100000).nullable().optional(),
  workStyle: z.enum(["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"]),
  cultureAnswers: z.record(z.string(), z.string()),
  resumeText: z.string().min(50).max(20000),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容に不備があります。" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "候補者として登録されていません。" }, { status: 403 });
  }

  const data = parsed.data;

  // [COMPLIANCE] consentedAt records the moment the candidate finalised their
  // profile. The checkbox consent was captured earlier at role selection.
  const profile = await prisma.candidateProfile.upsert({
    where: { userId: user.id },
    update: {
      displayName: data.displayName,
      currentPosition: data.currentPosition ?? null,
      yearsOfExperience: data.yearsOfExperience ?? null,
      skills: data.skills,
      desiredRoles: data.desiredRoles,
      desiredSalaryMin: data.desiredSalaryMin ?? null,
      desiredSalaryMax: data.desiredSalaryMax ?? null,
      workStyle: data.workStyle,
      cultureAnswers: data.cultureAnswers,
      resumeText: data.resumeText,
    },
    create: {
      userId: user.id,
      displayName: data.displayName,
      currentPosition: data.currentPosition ?? null,
      yearsOfExperience: data.yearsOfExperience ?? null,
      skills: data.skills,
      desiredRoles: data.desiredRoles,
      desiredSalaryMin: data.desiredSalaryMin ?? null,
      desiredSalaryMax: data.desiredSalaryMax ?? null,
      workStyle: data.workStyle,
      cultureAnswers: data.cultureAnswers,
      resumeText: data.resumeText,
      consentedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "CANDIDATE_PROFILE_SAVED",
      targetType: "CandidateProfile",
      targetId: profile.id,
      metadata: { skills: data.skills.length, desiredRoles: data.desiredRoles.length },
    },
  });

  return NextResponse.json({ ok: true });
}
