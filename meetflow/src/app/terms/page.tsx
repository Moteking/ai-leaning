import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="font-serif text-4xl tracking-tight">利用規約</h1>
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            本ページは初版ドラフトです。正式リリース前に確定版を掲載します。
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
