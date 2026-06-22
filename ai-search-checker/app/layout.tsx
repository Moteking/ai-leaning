import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import "./globals.css";
import { PROVIDER_NAME, SERVICE_NAME, SITE_URL } from "@/lib/config";
import { COMPANY } from "@/lib/company";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SERVICE_NAME} | ECサイトのAI検索対応度を無料診断`,
  description:
    "ECサイトのURLを入力するだけで、ChatGPT検索・Perplexity・Google AI Overview などのAI検索への対応度を無料診断。構造化データやAIクローラー対応をスコア化し、改善アドバイスをお届けします。",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SERVICE_NAME} | ECサイトのAI検索対応度を無料診断`,
    description:
      "URLを入力するだけでAI検索対応度を100点満点で診断。構造化データ・AIクローラー対応・SEOを総合チェック。",
    type: "website",
    locale: "ja_JP",
    siteName: SERVICE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SERVICE_NAME} | ECサイトのAI検索対応度を無料診断`,
    description:
      "URLを入力するだけでAI検索対応度を100点満点で診断。",
  },
};

/** サービス自身の構造化データ(自分の診断項目を満たす) */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SERVICE_NAME,
      url: SITE_URL,
      inLanguage: "ja",
    },
    {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.corporateSite,
    },
    {
      "@type": "WebApplication",
      name: SERVICE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <VercelAnalytics />
        <header className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
                AI
              </span>
              <span className="font-bold text-lg tracking-tight">{SERVICE_NAME}</span>
              <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                無料
              </span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 text-sm font-medium text-ink-700">
              <Link href="/ai-mention" className="hidden hover:text-brand-700 sm:inline">
                AI引用チェック
              </Link>
              <Link href="/blog" className="hover:text-brand-700">
                AIOメディア
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-ink-500">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 pb-4">
              <Link href="/lp/aio" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                サービス紹介
              </Link>
              <Link href="/ai-mention" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                AI引用チェック
              </Link>
              <Link href="/blog" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                AIOメディア
              </Link>
              <Link href="/badge" className="font-medium text-ink-700 hover:text-brand-700 hover:underline">
                AI検索対応バッジ
              </Link>
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
