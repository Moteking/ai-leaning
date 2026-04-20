import { NextResponse } from "next/server";
import { runWeeklyMatching } from "@/lib/matching";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron hits this endpoint with `Authorization: Bearer $CRON_SECRET`.
// Platform admins can also invoke it manually from the audit screen — the
// check below accepts either the cron header or an admin session.
async function authorize(request: Request): Promise<"cron" | "admin" | null> {
  const header = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && header === `Bearer ${secret}`) return "cron";

  const { userId, sessionClaims } = await auth();
  if (!userId) return null;
  const role = (sessionClaims as { publicMetadata?: { role?: string } } | null)?.publicMetadata?.role;
  return role === "PLATFORM_ADMIN" ? "admin" : null;
}

// Long-running batch. 300s is the Vercel Hobby cap; Pro is higher. We cap the
// promise locally too so we never hang the cron forever.
export const maxDuration = 300;

export async function POST(request: Request) {
  const caller = await authorize(request);
  if (!caller) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const started = Date.now();
  try {
    const report = await runWeeklyMatching();
    await prisma.auditLog.create({
      data: {
        actorId: caller === "cron" ? "system:cron" : "system:admin",
        action: "MATCH_BATCH_COMPLETED",
        targetType: "MatchBatch",
        targetId: new Date().toISOString(),
        metadata: {
          caller,
          durationMs: Date.now() - started,
          candidatesBackfilled: report.candidatesBackfilled,
          jobsBackfilled: report.jobsBackfilled,
          candidates: report.perCandidate.length,
          persisted: report.perCandidate.reduce((a, s) => a + s.persisted, 0),
        },
      },
    });
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "batch failed";
    await prisma.auditLog.create({
      data: {
        actorId: caller === "cron" ? "system:cron" : "system:admin",
        action: "MATCH_BATCH_FAILED",
        targetType: "MatchBatch",
        targetId: new Date().toISOString(),
        metadata: { message },
      },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Convenience GET handler: Vercel Cron sends GET by default.
export const GET = POST;
