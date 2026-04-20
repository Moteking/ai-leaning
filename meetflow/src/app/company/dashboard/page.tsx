import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "面談", href: "/company/meetings" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function CompanyDashboard() {
  await requireRole("COMPANY_ADMIN");
  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">COMPANY</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">採用パイプライン</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          今月の面談数、プラン残枠、AI推薦の候補者がここに表示されます。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">今月の面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>プラン残枠の表示は Phase 5 で実装</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">アクティブ求人</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>Phase 2 で求人CRUDを実装</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">新規マッチ</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>Phase 3 でAIマッチング実装</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
