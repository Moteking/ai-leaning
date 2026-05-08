import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { InviteManagerForm } from "./invite-form";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function ManagersPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const [managers, invites] = await Promise.all([
    prisma.hiringManager.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    }),
    prisma.invite.findMany({
      where: { companyId, acceptedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">HIRING MANAGERS</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">面接官</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          招待メールを送るか、招待コードを直接共有してください。面接官はサインアップ後に参加できます。
        </p>
      </header>

      <section className="mt-8 max-w-xl">
        <InviteManagerForm />
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl">参加中の面接官 ({managers.length})</h2>
        <div className="mt-4 space-y-3">
          {managers.length === 0 && (
            <Card>
              <CardContent className="py-6 text-[var(--muted-foreground)]">まだ面接官がいません。</CardContent>
            </Card>
          )}
          {managers.map((m) => (
            <Card key={m.id}>
              <CardContent className="py-4">
                <p className="font-medium">{m.displayName}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {m.position} / {m.user.email}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl">未処理の招待 ({invites.length})</h2>
        <div className="mt-4 space-y-3">
          {invites.length === 0 && (
            <Card>
              <CardContent className="py-6 text-[var(--muted-foreground)]">未処理の招待はありません。</CardContent>
            </Card>
          )}
          {invites.map((i) => (
            <Card key={i.id}>
              <CardContent className="py-4">
                <p className="font-medium">{i.email}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  招待コード: <span className="font-mono">{i.token}</span>
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  期限: {new Date(i.expiresAt).toLocaleString("ja-JP")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
