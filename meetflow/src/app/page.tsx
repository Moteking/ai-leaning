import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const STEPS = [
  {
    index: "01",
    title: "求人と性格診断を設定",
    body: "自社のカルチャー、求人要件、性格診断の質問を登録します。プリセットテンプレートをそのまま使うか、自由にカスタマイズできます。",
  },
  {
    index: "02",
    title: "応募者をアップロード",
    body: "応募者の氏名・メール・履歴書テキストを登録すると、診断回答用の専用リンクが発行されます。リンクを応募者に共有してください。",
  },
  {
    index: "03",
    title: "AI が即時スコアリング",
    body: "応募者が診断を提出すると、Claude が履歴書 × 求人要件 × 自社カルチャーを照合し、適合度スコアと評価コメントを返します。",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "¥30,000",
    unit: "月額 / 応募者 30名まで",
    highlights: ["求人 3件まで", "標準テンプレート利用可", "AI スコアリング無制限"],
  },
  {
    name: "Growth",
    price: "¥80,000",
    unit: "月額 / 応募者 150名まで",
    highlights: ["求人 10件まで", "カスタムテンプレート無制限", "面接官 5名まで招待"],
    featured: true,
  },
  {
    name: "Scale",
    price: "¥200,000",
    unit: "月額 / 応募者無制限",
    highlights: ["求人無制限", "API 連携 / SSO", "専任カスタマーサクセス"],
  },
];

const VALUES = [
  {
    title: "自社カルチャーを軸に評価",
    body: "「うちで活躍する人」を文章で定義し、AI がそれに沿って一貫した基準で応募者を評価します。",
  },
  {
    title: "履歴書だけでは見えない適合性",
    body: "性格診断と履歴書を組み合わせて、面接前にカルチャーフィットの仮説を立てられます。",
  },
  {
    title: "面接官の負担を減らす",
    body: "事前にスコアと AI コメントを渡すことで、限られた面接時間を本質的な確認に使えます。",
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
              AI APPLICANT SCORING FOR HIRING TEAMS
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.2] tracking-tight md:text-6xl">
              履歴書と性格診断で、<br />「自社に合うか」を<br />数字で見立てる。
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-[var(--muted-foreground)]">
              MeetFlow は、応募者の履歴書と独自の性格診断を組み合わせ、自社カルチャーへの
              適合度を AI がスコアリングする中途採用支援ツールです。
              履歴書だけでは見えない「合う/合わない」を、面接前に可視化します。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg">企業として始める</Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg">
                  仕組みを見る
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
              アップロードからスコア算出まで、最短数分。応募者にはアカウント登録不要のリンクを送るだけです。
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
            <h2 className="font-serif text-3xl tracking-tight">料金</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              シンプルな月額制。応募者数に応じて 3 プランからお選びください。年間契約で 15% オフ。
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
                      初期費用なし、いつでも解約可能。
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="compliance">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-serif text-3xl tracking-tight">プライバシーと公正性</h2>
            <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
              応募者情報は契約企業ごとに分離され、AI 評価のプロンプトには年齢・性別・国籍などの
              属性で判断しないよう明示的なガードレールを組み込んでいます。
              個人情報は契約企業が管理者となり、MeetFlow は処理者として運用します。
            </p>
            <div className="mt-8">
              <Link href="/compliance">
                <Button variant="outline">プライバシーと公正性の詳細</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
