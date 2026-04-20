import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";

const NAV = [
  { label: "ホーム", href: "/dashboard" },
  { label: "マッチ一覧", href: "/matches" },
  { label: "確定面談", href: "/meetings" },
  { label: "空き時間", href: "/availability" },
  { label: "プロフィール", href: "/profile" },
];

export default async function CandidateDashboard() {
  await requireRole("CANDIDATE");
  return (
    <AppShell title="候補者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">DASHBOARD</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">ようこそ</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          今週のマッチと、確定した面談がここに表示されます。Phase 2 以降で実データを接続します。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">確定面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>今週予定されている面談数</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">承諾待ちのマッチ</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>AIが推薦した未確認のマッチ</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">プロフィール完成度</CardTitle>
            <p className="mt-4 font-serif text-4xl">—</p>
            <CardDescription>Phase 2 でプロフィール編集を実装</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
