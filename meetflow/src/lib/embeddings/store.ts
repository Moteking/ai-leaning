import { prisma } from "@/lib/prisma";
import { embed, toVectorLiteral } from "@/lib/ai/embeddings";

// Prisma cannot bind a pgvector parameter directly, so we cast it in SQL. The
// vector literal is passed as a string which pgvector parses via `::vector`.

type CandidateSeed = {
  displayName: string;
  currentPosition: string | null;
  yearsOfExperience: number | null;
  skills: string[];
  desiredRoles: string[];
  workStyle: string;
  resumeText: string | null;
};

export function buildCandidateEmbeddingText(p: CandidateSeed): string {
  const parts = [
    `候補者: ${p.displayName}`,
    p.currentPosition && `現職: ${p.currentPosition}`,
    typeof p.yearsOfExperience === "number" && `経験年数: ${p.yearsOfExperience}年`,
    `勤務スタイル: ${p.workStyle}`,
    p.skills.length > 0 && `スキル: ${p.skills.join(", ")}`,
    p.desiredRoles.length > 0 && `希望職種: ${p.desiredRoles.join(", ")}`,
    p.resumeText && `経歴:\n${p.resumeText}`,
  ].filter(Boolean);
  return parts.join("\n");
}

type JobSeed = {
  title: string;
  description: string;
  requiredSkills: string[];
  salaryMin: number;
  salaryMax: number;
  workStyle: string;
  companyName: string;
  companyIndustry: string;
  companyDescription: string;
};

export function buildJobEmbeddingText(j: JobSeed): string {
  return [
    `求人: ${j.title}`,
    `会社: ${j.companyName} (${j.companyIndustry})`,
    `勤務スタイル: ${j.workStyle}`,
    `年収: ${j.salaryMin}〜${j.salaryMax} 万円`,
    j.requiredSkills.length > 0 && `必要スキル: ${j.requiredSkills.join(", ")}`,
    `職務内容:\n${j.description}`,
    `会社説明:\n${j.companyDescription}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function setCandidateEmbedding(profileId: string, text: string): Promise<void> {
  const vector = await embed(text);
  const literal = toVectorLiteral(vector);
  // $executeRawUnsafe because pgvector casting needs to be interpolated; the
  // other values remain parameterised to prevent SQL injection.
  await prisma.$executeRawUnsafe(
    `UPDATE "CandidateProfile" SET embedding = $1::vector WHERE id = $2`,
    literal,
    profileId
  );
}

export async function setJobEmbedding(jobId: string, text: string): Promise<void> {
  const vector = await embed(text);
  const literal = toVectorLiteral(vector);
  await prisma.$executeRawUnsafe(
    `UPDATE "JobPosting" SET embedding = $1::vector WHERE id = $2`,
    literal,
    jobId
  );
}

export type NearestJob = { jobId: string; similarity: number };

export async function findNearestJobsForCandidate(
  profileId: string,
  limit = 20
): Promise<NearestJob[]> {
  // Cosine distance with pgvector is 1 - cosine_similarity. We expose
  // `similarity` as 1 - distance to keep downstream code intuitive.
  const rows = await prisma.$queryRawUnsafe<{ id: string; distance: number }[]>(
    `SELECT j.id, (j.embedding <=> c.embedding) AS distance
     FROM "JobPosting" j
     CROSS JOIN "CandidateProfile" c
     WHERE c.id = $1
       AND c.embedding IS NOT NULL
       AND j.embedding IS NOT NULL
       AND j.status = 'ACTIVE'
     ORDER BY j.embedding <=> c.embedding
     LIMIT ${Math.max(1, Math.min(100, Math.floor(limit)))}`,
    profileId
  );
  return rows.map((r) => ({ jobId: r.id, similarity: 1 - Number(r.distance) }));
}

export type NearestCandidate = { profileId: string; similarity: number };

export async function findNearestCandidatesForJob(
  jobId: string,
  limit = 20
): Promise<NearestCandidate[]> {
  const rows = await prisma.$queryRawUnsafe<{ id: string; distance: number }[]>(
    `SELECT c.id, (c.embedding <=> j.embedding) AS distance
     FROM "CandidateProfile" c
     CROSS JOIN "JobPosting" j
     WHERE j.id = $1
       AND j.embedding IS NOT NULL
       AND c.embedding IS NOT NULL
     ORDER BY c.embedding <=> j.embedding
     LIMIT ${Math.max(1, Math.min(100, Math.floor(limit)))}`,
    jobId
  );
  return rows.map((r) => ({ profileId: r.id, similarity: 1 - Number(r.distance) }));
}
