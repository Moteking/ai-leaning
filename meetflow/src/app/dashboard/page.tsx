import Link from "next/link";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const NAV = [
  { label: "ホーム", href: "/dashboard" },
  { label: "マッチ一覧", href: "/matches" },
  { label: "確定面談", href: "/meetings" },
  { label: "空き時間", href: "/availability" },
  { label: "プロフィール", href: "/profile" },
];

export default async function CandidateDashboard() {
  const { userId } = await requireRole("CANDIDATE");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: true },
  });

  const candidateProfileId = user?.candidateProfile?.id;
  const [approvedMatches, scheduledMeetings] = await Promise.all([
    candidateProfileId
      ? prisma.match.count({
          where: { candidateProfileId, status: "APPROVED" },
        })
      : 0,
    candidateProfileId
      ? prisma.meeting.count({
          where: {
            match: { candidateProfileId },
            status: "SCHEDULED",
            scheduledAt: { gte: new Date() },
          },
        })
      : 0,
  ]);

  return (
    <AppShell title="候補者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">DASHBOARD</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">ようこそ</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          承諾待ちのマッチはこちらから確認できます。面談は承諾後に自動確定します。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">確定面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">{scheduledMeetings}</p>
            <CardDescription>今後予定されている面談</CardDescription>
          </CardContent>
        </Card>
        <Link href="/matches">
          <Card className="h-full transition hover:border-[var(--accent)]">
            <CardContent className="py-6">
              <CardTitle className="text-base">承諾待ちのマッチ</CardTitle>
              <p className="mt-4 font-serif text-4xl">{approvedMatches}</p>
              <CardDescription>AI が推薦した未確認のマッチ</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">プロフィール</CardTitle>
            <p className="mt-4 font-serif text-4xl">
              {user?.candidateProfile ? "登録済" : "未登録"}
            </p>
            <CardDescription>
              <Link className="underline" href="/profile">
                編集する
              </Link>
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
