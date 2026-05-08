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

export default async function TemplatesPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const templates = await prisma.diagnosticTemplate.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true, jobOpenings: true } } },
  });

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">DIAGNOSTIC TEMPLATES</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">性格診断テンプレート</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          標準テンプレート(Big5 / 働き方志向)とカスタム作成を Phase B で実装します。
          作成したテンプレートを求人に紐付けると、応募者に診断リンクを発行できるようになります。
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {templates.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-[var(--muted-foreground)]">
              まだテンプレートがありません。
            </CardContent>
          </Card>
        )}
        {templates.map((t) => (
          <Card key={t.id}>
            <CardContent className="py-5">
              <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">{t.origin}</p>
              <p className="mt-1 font-serif text-lg">{t.name}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                質問 {t._count.questions}件 / 紐付け求人 {t._count.jobOpenings}件
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
