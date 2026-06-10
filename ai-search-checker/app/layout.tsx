import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { PROVIDER_NAME, SERVICE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SERVICE_NAME} | ECサイトのAI検索対応度を無料診断`,
  description:
    "ECサイトのURLを入力するだけで、ChatGPT検索・Perplexity・Google AI Overview などのAI検索への対応度を無料診断。構造化データやAIクローラー対応をスコア化し、改善アドバイスをお届けします。",
  robots: { index: true, follow: true },
  openGraph: {
    title: `${SERVICE_NAME} | ECサイトのAI検索対応度を無料診断`,
    description:
      "URLを入力するだけでAI検索対応度を100点満点で診断。構造化データ・AIクローラー対応・SEOを総合チェック。",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
              AI
            </span>
            <span className="font-bold text-lg tracking-tight">{SERVICE_NAME}</span>
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              無料
            </span>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-ink-500">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 pb-4">
              <Link href="/company" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                運営会社情報
              </Link>
              <Link href="/privacy" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                プライバシーポリシー
              </Link>
              <Link href="/tokushoho" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                特定商取引法に基づく表記
              </Link>
            </nav>
            <p className="mt-4">
              © {new Date().getFullYear()} {PROVIDER_NAME}
            </p>
            <p className="mt-1 text-xs">
              ※本診断は指定ページのHTMLを自動解析した参考情報です。実際の検索結果・AI回答での表示を保証するものではありません。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
