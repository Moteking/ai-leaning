import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "マッチ監査", href: "/admin/matches" },
  { label: "コンプライアンス", href: "/admin/compliance" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
  { label: "企業", href: "/admin/companies" },
];

const SIZE_LABEL = {
  STARTUP: "スタートアップ",
  SMB: "中小",
  MID_MARKET: "中堅",
  ENTERPRISE: "大企業",
} as const;

export default async function AdminCompaniesPage() {
  await requireRole("PLATFORM_ADMIN");
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { jobPostings: true, hiringManagers: true } },
    },
    take: 100,
  });

  return (
    <AppShell title="職業紹介責任者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">COMPANIES</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">企業一覧 (最新100件)</h1>
      </header>
      <section className="mt-8 space-y-3">
        {companies.length === 0 && (
          <Card>
            <CardContent className="py-6 text-[var(--muted-foreground)]">登録企業はまだありません。</CardContent>
          </Card>
        )}
        {companies.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-lg">{c.name}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {c.industry} / {SIZE_LABEL[c.size]}
                  </p>
                  {c.websiteUrl && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{c.websiteUrl}</p>
                  )}
                </div>
                <div className="text-right text-xs text-[var(--muted-foreground)]">
                  <p>求人 {c._count.jobPostings}件</p>
                  <p>面接官 {c._count.hiringManagers}名</p>
                  <p className="mt-1">{new Date(c.createdAt).toLocaleDateString("ja-JP")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
