import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function CompanyDashboard() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const [activeJobs, totalApplicants, awaiting, evaluated] = await Promise.all([
    prisma.jobOpening.count({ where: { companyId, status: "ACTIVE" } }),
    prisma.applicant.count({ where: { companyId } }),
    prisma.application.count({
      where: { jobOpening: { companyId }, status: "AWAITING_DIAGNOSTIC" },
    }),
    prisma.application.count({
      where: {
        jobOpening: { companyId },
        status: { in: ["SUBMITTED", "REVIEWED", "HIRED", "REJECTED"] },
      },
    }),
  ]);

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">COMPANY</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">採用パイプライン</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          公開中の求人、応募者数、AI 評価ステータスをここで把握できます。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">公開中の求人</CardTitle>
            <p className="mt-4 font-serif text-4xl">{activeJobs}</p>
            <CardDescription>ステータスが ACTIVE の求人</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">応募者総数</CardTitle>
            <p className="mt-4 font-serif text-4xl">{totalApplicants}</p>
            <CardDescription>登録された応募者の累計</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">診断待ち</CardTitle>
            <p className="mt-4 font-serif text-4xl">{awaiting}</p>
            <CardDescription>応募者が回答前の応募</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">AI 評価済み</CardTitle>
            <p className="mt-4 font-serif text-4xl">{evaluated}</p>
            <CardDescription>スコアが算出された応募</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
