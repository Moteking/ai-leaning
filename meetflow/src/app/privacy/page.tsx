import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="font-serif text-4xl tracking-tight">プライバシーポリシー</h1>
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            本ページは初版ドラフトです。許可取得・法人化に合わせて確定版を掲載します。
          </p>
          <section className="mt-10 space-y-4 text-sm text-[var(--muted-foreground)]">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">取得する情報</h2>
            <p>氏名、メールアドレス、経歴、スキル、希望条件、カルチャー診断回答、カレンダーの空き情報。</p>
            <h2 className="font-serif text-2xl text-[var(--foreground)]">利用目的</h2>
            <p>求人企業とのマッチング提示、面談日程の自動確定、サービス品質向上のための分析。</p>
            <h2 className="font-serif text-2xl text-[var(--foreground)]">第三者提供</h2>
            <p>
              候補者の情報は、マッチが承認された求人企業にのみ、面談に必要な範囲で開示します。
              現職企業への情報流出を防ぐ設計としています。
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
