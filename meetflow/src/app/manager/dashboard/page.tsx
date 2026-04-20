import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";

const NAV = [
  { label: "ホーム", href: "/manager/dashboard" },
  { label: "空き時間", href: "/manager/availability" },
  { label: "面談一覧", href: "/manager/meetings" },
];

export default async function ManagerDashboard() {
  await requireRole("HIRING_MANAGER");
  return (
    <AppShell title="面接官" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">HIRING MANAGER</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">今日・今週の面談</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          カレンダー連携と空き時間登録は Phase 4 で実装します。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">今日の面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>AIブリーフィングと参加リンクを表示予定</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">今週の面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>Google Calendar 連携時の自動同期</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
