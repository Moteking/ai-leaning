import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-[var(--muted-foreground)]">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="font-serif text-base text-[var(--foreground)]">MeetFlow</p>
            <p className="mt-1">AI面談マッチング (中途採用)</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            <div>
              <p className="mb-2 text-[var(--foreground)]">サービス</p>
              <ul className="space-y-1">
                <li><Link href="/#how-it-works">仕組み</Link></li>
                <li><Link href="/#pricing">料金</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[var(--foreground)]">法令遵守</p>
              <ul className="space-y-1">
                <li><Link href="/compliance">職業紹介事業について</Link></li>
                <li><Link href="/privacy">プライバシーポリシー</Link></li>
                <li><Link href="/terms">利用規約</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[var(--foreground)]">会社</p>
              <ul className="space-y-1">
                <li><Link href="/contact">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs">
          (C) {new Date().getFullYear()} MeetFlow. 本サービスは有料職業紹介事業の許可取得を前提に設計されています。
        </p>
      </div>
    </footer>
  );
}
