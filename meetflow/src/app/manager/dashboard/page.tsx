import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const NAV = [
  { label: "ホーム", href: "/manager/dashboard" },
  { label: "応募者", href: "/manager/applicants" },
];

export default async function ManagerDashboard() {
  const { userId } = await requireRole("HIRING_MANAGER");
  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { hiringManager: true },
  });
  const companyId = me?.hiringManager?.companyId;

  const [submitted, reviewed] = companyId
    ? await Promise.all([
        prisma.application.count({
          where: { status: "SUBMITTED", jobOpening: { companyId } },
        }),
        prisma.application.count({
          where: { status: "REVIEWED", jobOpening: { companyId } },
        }),
      ])
    : [0, 0];

  return (
    <AppShell title="面接官" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">HIRING MANAGER</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">レビュー待ちの応募者</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          AI 評価が終わった応募者を確認し、面接判断に活用してください。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">レビュー待ち</CardTitle>
            <p className="mt-4 font-serif text-4xl">{submitted}</p>
            <CardDescription>AI 評価済み・面接官未確認</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">レビュー済み</CardTitle>
            <p className="mt-4 font-serif text-4xl">{reviewed}</p>
            <CardDescription>面接官が確認済み</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
