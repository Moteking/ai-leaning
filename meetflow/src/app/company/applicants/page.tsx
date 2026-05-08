import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function ApplicantsPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const applicants = await prisma.applicant.findMany({
    where: { companyId },
    include: { jobOpening: { select: { title: true } }, application: true },
    orderBy: [
      { application: { fitScore: { sort: "desc", nulls: "last" } } },
      { createdAt: "desc" },
    ],
    take: 100,
  });

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">APPLICANTS</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">応募者(全求人)</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          各求人の応募者を横断で確認できます。応募者の追加と性格診断の発行は Phase C で実装します。
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {applicants.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              まだ応募者がいません。
            </CardContent>
          </Card>
        )}
        {applicants.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-start justify-between gap-4 py-5">
              <div>
                <p className="font-serif text-lg">{a.fullName}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {a.email} / {a.jobOpening.title}
                </p>
              </div>
              <div className="text-right">
                {typeof a.application?.fitScore === "number" ? (
                  <p className="font-serif text-3xl text-[var(--accent)]">
                    {Math.round(a.application.fitScore)}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)]">未評価</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
