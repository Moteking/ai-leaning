import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="font-serif text-4xl tracking-tight">お問い合わせ</h1>
          <p className="mt-6 text-[var(--muted-foreground)]">
            企業向け導入のご相談、取材、採用に関するお問い合わせは、以下の連絡先までお願いいたします。
          </p>
          <p className="mt-6 font-serif text-lg">contact@meetflow.example</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
