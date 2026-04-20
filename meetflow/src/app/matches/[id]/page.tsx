import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { MatchResponseActions } from "./actions";

const NAV = [
  { label: "ホーム", href: "/dashboard" },
  { label: "マッチ一覧", href: "/matches" },
  { label: "確定面談", href: "/meetings" },
  { label: "空き時間", href: "/availability" },
  { label: "プロフィール", href: "/profile" },
];

type FitReason = {
  fitScore?: number;
  skillMatch?: string;
  cultureMatch?: string;
  careerMatch?: string;
  concerns?: string[];
  reasoning?: string;
};

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireRole("CANDIDATE");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: true },
  });
  if (!user?.candidateProfile) redirect("/onboarding/candidate");

  const { id } = await params;
  const match = await prisma.match.findFirst({
    where: { id, candidateProfileId: user.candidateProfile.id },
    include: { jobPosting: { include: { company: true } } },
  });
  if (!match) notFound();

  const reason = (match.fitReasonJson as FitReason | null) ?? {};

  return (
    <AppShell title="候補者" nav={NAV}>
      <header className="max-w-3xl">
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">MATCH</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">{match.jobPosting.title}</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          {match.jobPosting.company.name} / {match.jobPosting.company.industry}
        </p>
      </header>

      <section className="mt-8 grid max-w-3xl gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <CardTitle>AI 評価サマリ</CardTitle>
              <span className="font-serif text-4xl text-[var(--accent)]">
                {Math.round(match.fitScore)}
              </span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">{reason.reasoning}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ReasonBlock title="スキル" body={reason.skillMatch} />
              <ReasonBlock title="カルチャー" body={reason.cultureMatch} />
              <ReasonBlock title="キャリア" body={reason.careerMatch} />
            </div>
            {Array.isArray(reason.concerns) && reason.concerns.length > 0 && (
              <div className="mt-6">
                <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">懸念点</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-[var(--muted-foreground)]">
                  {reason.concerns.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <CardTitle>求人</CardTitle>
            <CardDescription>
              年収 {match.jobPosting.salaryMin}〜{match.jobPosting.salaryMax} 万円 / {match.jobPosting.workStyle}
            </CardDescription>
            <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--foreground)]">
              {match.jobPosting.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <CardTitle>会社について</CardTitle>
            <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">
              {match.jobPosting.company.description}
            </p>
          </CardContent>
        </Card>

        {match.status === "APPROVED" && (
          <MatchResponseActions matchId={match.id} />
        )}
        {match.status === "SCHEDULED" && (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-[var(--accent)]">
                面談が確定しています。ダッシュボードからご確認ください。
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </AppShell>
  );
}

function ReasonBlock({ title, body }: { title: string; body: string | undefined }) {
  if (!body) return null;
  return (
    <div>
      <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">{title}</p>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
