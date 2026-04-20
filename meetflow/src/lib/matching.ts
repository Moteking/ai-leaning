import { prisma } from "@/lib/prisma";
import {
  buildCandidateEmbeddingText,
  buildJobEmbeddingText,
  findNearestJobsForCandidate,
  setCandidateEmbedding,
  setJobEmbedding,
} from "@/lib/embeddings/store";
import {
  evaluateMatch,
  type CandidateContext,
  type JobContext,
  type MatchEvaluation,
} from "@/lib/ai/match-evaluator";

// Threshold per spec §5.2: only persist matches scored >= 70 with APPROVE.
// MVP operates in post-hoc audit mode — matches go straight to APPROVED so the
// candidate sees them, and PLATFORM_ADMIN can flip to REJECTED_BY_AUDIT later.
const SCORE_THRESHOLD = 70;
const CANDIDATE_TOP_K = 20;

export type MatchingSummary = {
  candidateId: string;
  evaluated: number;
  persisted: number;
  skipped: number;
  errors: { jobId: string; message: string }[];
};

/**
 * Generate matches for a single candidate. Idempotent: an existing
 * (candidate, job) pair is updated in place, never duplicated.
 */
export async function runMatchingForCandidate(
  candidateProfileId: string
): Promise<MatchingSummary> {
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateProfileId },
  });
  if (!candidate) throw new Error(`Candidate profile ${candidateProfileId} not found`);

  // Refresh embedding if missing. We can't introspect pgvector via Prisma, so
  // the DB tells us via a one-off count query.
  const [{ hasEmbedding }] = await prisma.$queryRawUnsafe<{ hasEmbedding: boolean }[]>(
    `SELECT (embedding IS NOT NULL) AS "hasEmbedding" FROM "CandidateProfile" WHERE id = $1`,
    candidateProfileId
  );
  if (!hasEmbedding) {
    const text = buildCandidateEmbeddingText({
      displayName: candidate.displayName,
      currentPosition: candidate.currentPosition,
      yearsOfExperience: candidate.yearsOfExperience,
      skills: candidate.skills,
      desiredRoles: candidate.desiredRoles,
      workStyle: candidate.workStyle,
      resumeText: candidate.resumeText,
    });
    await setCandidateEmbedding(candidate.id, text);
  }

  const nearest = await findNearestJobsForCandidate(candidate.id, CANDIDATE_TOP_K);

  const summary: MatchingSummary = {
    candidateId: candidate.id,
    evaluated: 0,
    persisted: 0,
    skipped: 0,
    errors: [],
  };

  for (const { jobId } of nearest) {
    try {
      const result = await evaluateAndPersist(candidate.id, jobId);
      summary.evaluated += 1;
      if (result === "persisted") summary.persisted += 1;
      else summary.skipped += 1;
    } catch (error) {
      summary.errors.push({
        jobId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return summary;
}

/**
 * Evaluate a single (candidate, job) pair and persist the match if it clears
 * the threshold. Returns what happened so the caller can summarise.
 */
async function evaluateAndPersist(
  candidateId: string,
  jobId: string
): Promise<"persisted" | "skipped"> {
  const [candidate, job] = await Promise.all([
    prisma.candidateProfile.findUnique({ where: { id: candidateId } }),
    prisma.jobPosting.findUnique({
      where: { id: jobId },
      include: { company: true },
    }),
  ]);
  if (!candidate || !job || job.status !== "ACTIVE") {
    throw new Error("Candidate or job not eligible");
  }

  const candidateContext: CandidateContext = {
    id: candidate.id,
    displayName: candidate.displayName,
    currentPosition: candidate.currentPosition,
    yearsOfExperience: candidate.yearsOfExperience,
    skills: candidate.skills,
    desiredRoles: candidate.desiredRoles,
    desiredSalaryMin: candidate.desiredSalaryMin,
    desiredSalaryMax: candidate.desiredSalaryMax,
    workStyle: candidate.workStyle,
    cultureAnswers: (candidate.cultureAnswers as Record<string, string> | null) ?? {},
    resumeText: candidate.resumeText,
  };

  const jobContext: JobContext = {
    id: job.id,
    title: job.title,
    description: job.description,
    requiredSkills: job.requiredSkills,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    workStyle: job.workStyle,
    company: {
      name: job.company.name,
      industry: job.company.industry,
      description: job.company.description,
      size: job.company.size,
    },
  };

  const evaluation = await evaluateMatch(candidateContext, jobContext);
  return persistMatch(candidate.id, job.id, evaluation);
}

async function persistMatch(
  candidateProfileId: string,
  jobPostingId: string,
  evaluation: MatchEvaluation
): Promise<"persisted" | "skipped"> {
  const qualifies =
    evaluation.recommendation === "APPROVE" && evaluation.fitScore >= SCORE_THRESHOLD;

  // We always upsert so we can re-score: an existing below-threshold match can
  // later rise above threshold and become visible.
  const existing = await prisma.match.findUnique({
    where: {
      candidateProfileId_jobPostingId: { candidateProfileId, jobPostingId },
    },
  });

  if (!qualifies) {
    // Don't clutter the DB with low-fit rows unless one already exists; if it
    // does, leave it intact so the audit trail is preserved.
    if (!existing) return "skipped";
    return "skipped";
  }

  const data = {
    fitScore: evaluation.fitScore,
    fitReasonJson: evaluation,
    // MVP: auto-approve. Placement officer can flip to REJECTED_BY_AUDIT.
    status: existing?.status === "SCHEDULED" ? "SCHEDULED" as const : "APPROVED" as const,
  };

  const match = await prisma.match.upsert({
    where: {
      candidateProfileId_jobPostingId: { candidateProfileId, jobPostingId },
    },
    update: data,
    create: {
      candidateProfileId,
      jobPostingId,
      ...data,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: "system:matching",
      action: existing ? "MATCH_RESCORED" : "MATCH_CREATED",
      targetType: "Match",
      targetId: match.id,
      metadata: {
        fitScore: evaluation.fitScore,
        recommendation: evaluation.recommendation,
      },
    },
  });

  return "persisted";
}

/** Regenerate embeddings for any row missing one, then score everyone. */
export async function runWeeklyMatching(): Promise<{
  candidatesBackfilled: number;
  jobsBackfilled: number;
  perCandidate: MatchingSummary[];
}> {
  const candidatesBackfilled = await backfillCandidateEmbeddings();
  const jobsBackfilled = await backfillJobEmbeddings();

  const candidates = await prisma.candidateProfile.findMany({
    select: { id: true },
  });
  const perCandidate: MatchingSummary[] = [];
  for (const { id } of candidates) {
    try {
      perCandidate.push(await runMatchingForCandidate(id));
    } catch (error) {
      perCandidate.push({
        candidateId: id,
        evaluated: 0,
        persisted: 0,
        skipped: 0,
        errors: [{ jobId: "-", message: error instanceof Error ? error.message : String(error) }],
      });
    }
  }
  return { candidatesBackfilled, jobsBackfilled, perCandidate };
}

async function backfillCandidateEmbeddings(): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "CandidateProfile" WHERE embedding IS NULL`
  );
  let count = 0;
  for (const { id } of rows) {
    const c = await prisma.candidateProfile.findUnique({ where: { id } });
    if (!c) continue;
    const text = buildCandidateEmbeddingText({
      displayName: c.displayName,
      currentPosition: c.currentPosition,
      yearsOfExperience: c.yearsOfExperience,
      skills: c.skills,
      desiredRoles: c.desiredRoles,
      workStyle: c.workStyle,
      resumeText: c.resumeText,
    });
    await setCandidateEmbedding(id, text);
    count += 1;
  }
  return count;
}

async function backfillJobEmbeddings(): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "JobPosting" WHERE embedding IS NULL AND status = 'ACTIVE'`
  );
  let count = 0;
  for (const { id } of rows) {
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!job) continue;
    const text = buildJobEmbeddingText({
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      workStyle: job.workStyle,
      companyName: job.company.name,
      companyIndustry: job.company.industry,
      companyDescription: job.company.description,
    });
    await setJobEmbedding(id, text);
    count += 1;
  }
  return count;
}
