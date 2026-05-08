import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
  { label: "企業", href: "/admin/companies" },
];

export default async function AdminDashboard() {
  await requireRole("PLATFORM_ADMIN");
  const [companies, applicants, evaluatedApplications] = await Promise.all([
    prisma.company.count(),
    prisma.applicant.count(),
    prisma.application.count({ where: { fitScore: { not: null } } }),
  ]);

  return (
    <AppShell title="プラットフォーム管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">PLATFORM ADMIN</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">プラットフォーム統計</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          サービス全体の運営状況を確認します。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">登録企業</CardTitle>
            <p className="mt-4 font-serif text-4xl">{companies}</p>
            <CardDescription>全プラン合算</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">応募者総数</CardTitle>
            <p className="mt-4 font-serif text-4xl">{applicants}</p>
            <CardDescription>各企業に登録された累計</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">AI 評価済み</CardTitle>
            <p className="mt-4 font-serif text-4xl">{evaluatedApplications}</p>
            <CardDescription>fitScore が算出された応募</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
