import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function CompliancePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="font-serif text-4xl tracking-tight">法令遵守について</h1>
          <p className="mt-6 text-[var(--muted-foreground)]">
            MeetFlowは職業安定法に基づく有料職業紹介事業の許可取得を前提に設計されています。
            本ページは許可取得までの暫定版で、許可取得後に許可番号・職業紹介責任者名を掲載します。
          </p>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl">取り組み</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--muted-foreground)]">
              <li>個人情報利用について、登録時に明示的な同意を取得します。</li>
              <li>AIによるマッチング判断から年齢・性別・国籍等の差別的要素を除外しています。</li>
              <li>職業紹介責任者が全マッチを事後監査し、問題のあるマッチを無効化できます。</li>
              <li>料金は本サイトに明示し、成功報酬は契約書に計算式を記載します。</li>
              <li>求人情報の適正表示(給与・勤務地・雇用形態の必須化)を強制します。</li>
              <li>監査ログを5年間保管し、厚労省の調査に対応できる形式で保持します。</li>
            </ul>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl">料金の明示</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              候補者は基本無料です。企業は月額サブスクリプション(¥150,000 / ¥300,000 / ¥600,000)に加え、
              採用成立時に採用者の初年度年収の10%を成功報酬としてお支払いいただきます。
              詳細は個別の業務委託契約書に記載します。
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
