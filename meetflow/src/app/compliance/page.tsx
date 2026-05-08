import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function CompliancePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="font-serif text-4xl tracking-tight">プライバシーと公正性</h1>
          <p className="mt-6 text-[var(--muted-foreground)]">
            MeetFlow は、契約企業の採用活動を支援する SaaS ツールです。応募者の個人情報は契約企業が
            管理者(コントローラ)、MeetFlow が処理者(プロセッサ)として、必要な範囲でのみ取り扱います。
          </p>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl">取り組み</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--muted-foreground)]">
              <li>応募者は性格診断回答前に、利用目的と評価方法の説明を確認できます。</li>
              <li>AI 評価のプロンプトに年齢・性別・国籍・人種・宗教・婚姻状況・健康状態などを
                判断材料にしないよう明示的なガードレールを組み込んでいます。</li>
              <li>応募者データはテナントごとに分離され、他企業から参照できません。</li>
              <li>採用終了後の応募者データは、契約企業の保管ポリシーに従って削除可能です。</li>
              <li>すべての操作は監査ログに記録されます。</li>
            </ul>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl">評価モデルについて</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              AI による適合度スコアは「補助情報」です。最終的な採用判断は契約企業の採用責任者が行います。
              スコアの根拠は AI コメントとして提示し、必要に応じて応募者に開示できる形式で保管されます。
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
