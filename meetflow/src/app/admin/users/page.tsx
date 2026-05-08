import { requireRole, ROLE_LABELS } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
  { label: "企業", href: "/admin/companies" },
];

export default async function AdminUsersPage() {
  await requireRole("PLATFORM_ADMIN");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hiringManager: { select: { displayName: true, company: { select: { name: true } } } },
      companyAdmins: { include: { company: { select: { name: true } } } },
    },
    take: 100,
  });

  return (
    <AppShell title="プラットフォーム管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">USERS</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">ユーザー一覧 (最新100件)</h1>
      </header>
      <section className="mt-8 space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{u.hiringManager?.displayName ?? u.email}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{u.email}</p>
                  {u.companyAdmins.length > 0 && (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      所属企業: {u.companyAdmins.map((a) => a.company.name).join(", ")}
                    </p>
                  )}
                  {u.hiringManager && (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      面接官所属: {u.hiringManager.company.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-[0.15em] text-[var(--muted-foreground)]">
                    {ROLE_LABELS[u.role]}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
