import Link from "next/link";
import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

const STATUS_LABEL = { ACTIVE: "公開中", PAUSED: "一時停止", CLOSED: "終了" } as const;

export default async function JobsPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const jobs = await prisma.jobOpening.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applicants: true } } },
  });

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">JOB OPENINGS</p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">求人</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            性格診断テンプレートを紐付けた求人を作成すると、応募者ごとに AI スコアが算出されます。
          </p>
        </div>
        <Link href="/company/jobs/new">
          <Button>新しい求人を作成</Button>
        </Link>
      </header>

      <section className="mt-8 space-y-3">
        {jobs.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              まだ求人がありません。右上から最初の求人を作成してください。
            </CardContent>
          </Card>
        )}
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">
                  {STATUS_LABEL[job.status]}
                </p>
                <p className="mt-1 font-serif text-xl">{job.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  年収 {job.salaryMin}〜{job.salaryMax} 万円 / 応募者 {job._count.applicants}名
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/company/jobs/${job.id}/applicants`}>
                  <Button variant="ghost">応募者</Button>
                </Link>
                <Link href={`/company/jobs/${job.id}`}>
                  <Button variant="outline">編集</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
