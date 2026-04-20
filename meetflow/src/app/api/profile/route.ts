import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  displayName: z.string().min(1).max(100),
  currentPosition: z.string().max(200).nullable().optional(),
  yearsOfExperience: z.number().int().min(0).max(60),
  skills: z.array(z.string().min(1).max(80)).max(30),
  desiredRoles: z.array(z.string().min(1).max(120)).max(10),
  workStyle: z.enum(["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"]),
  desiredSalaryMin: z.number().int().min(0).max(100000).nullable().optional(),
  desiredSalaryMax: z.number().int().min(0).max(100000).nullable().optional(),
  resumeText: z.string().min(10).max(20000),
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
    include: { candidateProfile: true },
  });
  if (!user?.candidateProfile) {
    return NextResponse.json({ error: "プロフィールが見つかりません。" }, { status: 404 });
  }

  const data = parsed.data;
  const profile = await prisma.candidateProfile.update({
    where: { id: user.candidateProfile.id },
    data: {
      displayName: data.displayName,
      currentPosition: data.currentPosition ?? null,
      yearsOfExperience: data.yearsOfExperience,
      skills: data.skills,
      desiredRoles: data.desiredRoles,
      workStyle: data.workStyle,
      desiredSalaryMin: data.desiredSalaryMin ?? null,
      desiredSalaryMax: data.desiredSalaryMax ?? null,
      resumeText: data.resumeText,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "CANDIDATE_PROFILE_UPDATED",
      targetType: "CandidateProfile",
      targetId: profile.id,
      metadata: {},
    },
  });

  return NextResponse.json({ ok: true });
}
