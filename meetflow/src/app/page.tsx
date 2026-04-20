import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const STEPS = [
  {
    index: "01",
    title: "登録 (5分)",
    body: "職務経歴書を貼り付けるだけ。AIが構造化し、5つのカルチャー診断に答えて完了です。",
  },
  {
    index: "02",
    title: "マッチを受け取る",
    body: "毎週日曜夜、AIがあなたに合う求人を厳選。スカウトメールの山に埋もれません。",
  },
  {
    index: "03",
    title: "面談が自動で確定",
    body: "承諾した瞬間、双方のカレンダーから最適な時間が選ばれ、面談リンクが発行されます。",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "¥150,000",
    unit: "月額 / 5面談まで",
    highlights: ["採用ファネルの試験運用に", "求人2件まで掲載", "AI推薦レポート"],
  },
  {
    name: "Growth",
    price: "¥300,000",
    unit: "月額 / 15面談まで",
    highlights: ["成長フェーズの標準プラン", "求人5件まで掲載", "面接官3名までの招待"],
    featured: true,
  },
  {
    name: "Scale",
    price: "¥600,000",
    unit: "月額 / 40面談まで",
    highlights: ["複数職種を並行採用", "求人無制限", "採用データAPI / 専任担当"],
  },
];

const VALUES = [
  {
    title: "スカウトしない、される側に回らない",
    body: "候補者は受け身、企業も送り手に回らない。AIが仲介者として単独で両者を見立てます。",
  },
  {
    title: "日程調整の往復をゼロに",
    body: "空き時間の交差から最適解を1件だけ提示。双方のカレンダーに自動で入ります。",
  },
  {
    title: "年収10%の成功報酬",
    body: "業界標準30-35%より大幅に低く、採用コストを構造的に引き下げます。",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">
              AI-FIRST RECRUITMENT MATCHING
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.2] tracking-tight md:text-6xl">
              スカウトもメッセージも<br />日程調整もない、<br />面談だけが残る転職。
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-[var(--muted-foreground)]">
              MeetFlowは、候補者と企業をAIが厳選し、面談日時まで自動で確定する中途採用サービスです。
              書類選考やメッセージ交換の往復を全廃し、本当に会うべき30分だけを残します。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg">候補者として登録</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" size="lg">
                  企業の方はこちら
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-serif text-3xl tracking-tight">なぜ MeetFlow か</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title}>
                  <hr className="rule" />
                  <h3 className="mt-6 font-serif text-xl">{v.title}</h3>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-serif text-3xl tracking-tight">仕組み</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              従来の「スカウト→メッセージ→選考→日程調整→面談」という5工程を、3工程に圧縮しました。
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.index}>
                  <p className="font-serif text-3xl text-[var(--accent)]">{step.index}</p>
                  <h3 className="mt-3 font-serif text-xl">{step.title}</h3>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-serif text-3xl tracking-tight">料金 (企業向け)</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              候補者は基本無料。企業は月額サブスクリプション + 採用成立時に年収の10%。
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PRICING.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.featured ? "border-[var(--accent)] ring-2 ring-[var(--accent)]" : ""}
                >
                  <CardContent className="py-8">
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="mt-4 font-serif text-4xl">{plan.price}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{plan.unit}</p>
                    <ul className="mt-6 space-y-2 text-sm">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="text-[var(--accent)]">—</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <CardDescription className="mt-6">
                      すべてのプランで、採用成立時の成功報酬は年収の10%です。
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="compliance">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-serif text-3xl tracking-tight">法令遵守への取り組み</h2>
            <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
              MeetFlowは有料職業紹介事業の許可取得を前提に設計されています。
              個人情報の取り扱い、差別的選別の防止、職業紹介責任者による監査、料金の明示など、
              厚生労働省のガイドラインに沿って運営します。
            </p>
            <div className="mt-8">
              <Link href="/compliance">
                <Button variant="outline">法令遵守の詳細を見る</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
