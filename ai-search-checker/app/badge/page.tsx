import type { Metadata } from "next";
import Link from "next/link";
import BadgeBuilder from "@/components/BadgeBuilder";

export const metadata: Metadata = {
  title: "AI検索対応バッジ | AI検索対応診断",
  description:
    "「AI検索対応診断」のバッジを自社サイトに掲載できます。埋め込みコードをコピーして貼るだけ。",
  alternates: { canonical: "/badge" },
};

export default function BadgePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">
          ← トップに戻る
        </Link>
      </nav>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        AI検索対応バッジを掲載する
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        AI検索対応に取り組んでいることを、自社サイトのフッターや会社概要ページでアピールできます。
        下記の埋め込みコードをコピーして貼るだけ。バッジはクリックすると当診断ページにリンクします。
      </p>

      <div className="mt-8">
        <BadgeBuilder />
      </div>

      <div className="mt-10 rounded-xl border border-brand-200 bg-brand-50/50 p-5 text-sm text-ink-700">
        <p className="font-bold">活用のヒント</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>スコアが高いサイトは、スコア入りバッジで信頼感を演出できます。</li>
          <li>定期的に再診断し、スコアの改善をサイトでアピールしましょう。</li>
          <li>
            まだ診断していない場合は{" "}
            <Link href="/" className="font-semibold text-brand-700 hover:underline">
              無料診断
            </Link>{" "}
            から。
          </li>
        </ul>
      </div>
    </div>
  );
}
