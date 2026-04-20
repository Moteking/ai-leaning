import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "マッチ監査", href: "/admin/matches" },
  { label: "コンプライアンス", href: "/admin/compliance" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
  { label: "企業", href: "/admin/companies" },
];

export default async function AdminDashboard() {
  await requireRole("PLATFORM_ADMIN");
  const [candidates, companies, pendingMatches, scheduledMeetings] = await Promise.all([
    prisma.candidateProfile.count(),
    prisma.company.count(),
    prisma.match.count({ where: { status: "PENDING" } }),
    prisma.meeting.count({
      where: { status: "SCHEDULED", scheduledAt: { gte: startOfToday() } },
    }),
  ]);

  return (
    <AppShell title="職業紹介責任者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">PLATFORM ADMIN</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">プラットフォーム統計</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          職業紹介責任者として、全マッチの監査とコンプライアンス対応を行います。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <Stat title="登録候補者" value={candidates} description="同意済みの候補者のみ" />
        <Stat title="登録企業" value={companies} description="全ステータス" />
        <Stat title="監査待ちマッチ" value={pendingMatches} description="Phase 3 で生成されるマッチ" />
        <Stat title="今後の面談" value={scheduledMeetings} description="Phase 4 で自動確定" />
      </section>
    </AppShell>
  );
}

function Stat({ title, value, description }: { title: string; value: number; description: string }) {
  return (
    <Card>
      <CardContent className="py-6">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="mt-4 font-serif text-4xl">{value}</p>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
