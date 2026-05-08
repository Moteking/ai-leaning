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
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

const STATUS_LABEL: Record<string, string> = {
  AWAITING_DIAGNOSTIC: "診断回答待ち",
  SUBMITTED: "AI 評価済み",
  REVIEWED: "面接官レビュー済み",
  HIRED: "採用",
  REJECTED: "不採用",
};

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const { id } = await params;
  const job = await prisma.jobOpening.findFirst({ where: { id, companyId } });
  if (!job) notFound();

  const applicants = await prisma.applicant.findMany({
    where: { jobOpeningId: job.id },
    include: { application: true },
    orderBy: [
      // Highest scores first; nulls (still awaiting) sink to the bottom.
      { application: { fitScore: { sort: "desc", nulls: "last" } } },
      { createdAt: "desc" },
    ],
  });

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">APPLICANTS</p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">{job.title}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            応募者ごとに履歴書 + 性格診断回答を AI が評価し、適合度スコアで並びます。
          </p>
        </div>
        <Link href={`/company/jobs/${job.id}`}>
          <Button variant="outline">求人を編集</Button>
        </Link>
      </header>

      <section className="mt-8 space-y-3">
        {applicants.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              まだ応募者がいません。Phase C で応募者アップロードを実装します。
            </CardContent>
          </Card>
        )}
        {applicants.map((a) => {
          const app = a.application;
          const status = app?.status ?? "AWAITING_DIAGNOSTIC";
          return (
            <Card key={a.id}>
              <CardContent className="flex items-start justify-between gap-4 py-5">
                <div>
                  <p className="font-serif text-xl">{a.fullName}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{a.email}</p>
                  <p className="mt-1 text-xs tracking-[0.15em] text-[var(--muted-foreground)]">
                    {STATUS_LABEL[status] ?? status}
                  </p>
                </div>
                <div className="text-right">
                  {typeof app?.fitScore === "number" ? (
                    <>
                      <p className="font-serif text-3xl text-[var(--accent)]">
                        {Math.round(app.fitScore)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">FitScore</p>
                    </>
                  ) : (
                    <p className="text-xs text-[var(--muted-foreground)]">未評価</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </AppShell>
  );
}
