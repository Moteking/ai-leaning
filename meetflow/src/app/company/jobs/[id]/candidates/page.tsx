import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "面談", href: "/company/meetings" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

type FitReason = {
  skillMatch?: string;
  cultureMatch?: string;
  careerMatch?: string;
  concerns?: string[];
  reasoning?: string;
};

export default async function JobCandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const { id } = await params;
  const job = await prisma.jobPosting.findFirst({ where: { id, companyId } });
  if (!job) notFound();

  // Candidate PII is intentionally minimised until a meeting is scheduled.
  // `displayName` is the only identifier shown; resume/email come later.
  const matches = await prisma.match.findMany({
    where: { jobPostingId: job.id, status: { in: ["APPROVED", "SCHEDULED"] } },
    include: { candidateProfile: true },
    orderBy: { fitScore: "desc" },
  });

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">CANDIDATES</p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">{job.title}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            AI が推薦した候補者です。氏名以外の個人情報は面談確定後に開示されます。
          </p>
        </div>
        <Link href={`/company/jobs/${job.id}`}>
          <Button variant="outline">求人を編集</Button>
        </Link>
      </header>

      <section className="mt-8 space-y-3">
        {matches.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              まだ推薦候補者がいません。日曜夜の週次バッチで更新されます。
            </CardContent>
          </Card>
        )}
        {matches.map((m) => {
          const reason = (m.fitReasonJson as FitReason | null) ?? {};
          return (
            <Card key={m.id}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl">{m.candidateProfile.displayName}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {m.candidateProfile.currentPosition ?? "(現職未記入)"} /
                      経験 {m.candidateProfile.yearsOfExperience ?? 0}年
                    </p>
                    {reason.reasoning && (
                      <p className="mt-3 text-sm text-[var(--foreground)]">{reason.reasoning}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl text-[var(--accent)]">{Math.round(m.fitScore)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">FitScore</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{m.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </AppShell>
  );
}
