import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MatchAuditRow } from "./audit-row";
import { RunBatchButton } from "./run-batch";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "マッチ監査", href: "/admin/matches" },
  { label: "コンプライアンス", href: "/admin/compliance" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
  { label: "企業", href: "/admin/companies" },
];

type FitReason = {
  skillMatch?: string;
  cultureMatch?: string;
  careerMatch?: string;
  concerns?: string[];
  reasoning?: string;
};

export default async function AdminMatchesPage() {
  await requireRole("PLATFORM_ADMIN");
  const matches = await prisma.match.findMany({
    where: { status: { in: ["APPROVED", "SCHEDULED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      candidateProfile: { select: { displayName: true, currentPosition: true } },
      jobPosting: { select: { title: true, company: { select: { name: true } } } },
    },
    take: 100,
  });

  return (
    <AppShell title="職業紹介責任者" nav={NAV}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">MATCH AUDIT</p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">マッチ監査</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            MVPは事後監査モードです。差別的要素や不適切なマッチを発見した際に無効化してください。
          </p>
        </div>
        <RunBatchButton />
      </header>

      <section className="mt-8">
        <Card>
          <CardContent className="py-6">
            <CardTitle>最近の承認済みマッチ</CardTitle>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              FitScore が 70 以上かつ AI が APPROVE と判定したマッチです。
            </p>
            <div className="mt-5 space-y-3">
              {matches.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                  まだ監査対象のマッチはありません。
                </p>
              )}
              {matches.map((m) => {
                const reason = (m.fitReasonJson as FitReason | null) ?? {};
                return (
                  <MatchAuditRow
                    key={m.id}
                    matchId={m.id}
                    fitScore={m.fitScore}
                    status={m.status}
                    candidateName={m.candidateProfile.displayName}
                    candidatePosition={m.candidateProfile.currentPosition ?? ""}
                    jobTitle={m.jobPosting.title}
                    companyName={m.jobPosting.company.name}
                    reasoning={reason.reasoning ?? ""}
                    concerns={reason.concerns ?? []}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
