import { AppShell } from "@/components/app/app-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/roles";

const NAV = [
  { label: "統計", href: "/admin/dashboard" },
  { label: "マッチ監査", href: "/admin/matches" },
  { label: "コンプライアンス", href: "/admin/compliance" },
  { label: "監査ログ", href: "/admin/audit-logs" },
  { label: "ユーザー", href: "/admin/users" },
];

export default async function AdminDashboard() {
  await requireRole("PLATFORM_ADMIN");
  return (
    <AppShell title="職業紹介責任者" nav={NAV}>
      <header>
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">PLATFORM ADMIN</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">プラットフォーム統計</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          職業紹介責任者として、全マッチの監査とコンプライアンス対応を行います。
        </p>
      </header>
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">登録候補者</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>同意済みの候補者のみ</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">登録企業</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>有効プランのみ</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">監査待ちマッチ</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>Phase 3 で事後監査を実装</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <CardTitle className="text-base">今週の面談</CardTitle>
            <p className="mt-4 font-serif text-4xl">0</p>
            <CardDescription>Phase 4 で自動確定を実装</CardDescription>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
