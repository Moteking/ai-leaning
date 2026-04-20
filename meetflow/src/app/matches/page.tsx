import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const NAV = [
  { label: "ホーム", href: "/dashboard" },
  { label: "マッチ一覧", href: "/matches" },
  { label: "確定面談", href: "/meetings" },
  { label: "空き時間", href: "/availability" },
  { label: "プロフィール", href: "/profile" },
];

const STATUS_LABEL = {
  PENDING: "監査待ち",
  APPROVED: "承諾可能",
  REJECTED_BY_AUDIT: "運営により無効化",
  SCHEDULED: "面談確定済み",
  EXPIRED: "期限切れ",
} as const;

export default async function MatchesPage() {
  const { userId } = await requireRole("CANDIDATE");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: true },
  });
  if (!user?.candidateProfile) redirect("/onboarding/candidate");

  const matches = await prisma.match.findMany({
    where: {
      candidateProfileId: user.candidateProfile.id,
      status: { in: ["APPROVED", "SCHEDULED"] },
    },
    include: { jobPosting: { include: { company: true } } },
    orderBy: { fitScore: "desc" },
  });

  return (
    <AppShell title="候補者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">MATCHES</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">あなたへの推薦</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          AI が整合性を評価した企業のみ表示されます。承諾すると面談日程の自動調整に進みます。
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {matches.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              現在お勧めできるマッチはありません。週次バッチ(日曜夜)で更新されます。
            </CardContent>
          </Card>
        )}
        {matches.map((m) => (
          <Link key={m.id} href={`/matches/${m.id}`}>
            <Card className="transition hover:border-[var(--accent)]">
              <CardContent className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">
                      {STATUS_LABEL[m.status]}
                    </p>
                    <p className="mt-1 font-serif text-xl">{m.jobPosting.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {m.jobPosting.company.name} / {m.jobPosting.company.industry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl text-[var(--accent)]">{Math.round(m.fitScore)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">FitScore</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
