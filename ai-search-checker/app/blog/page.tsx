import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "AIOメディア | AI検索対応診断",
  description:
    "ECサイトのAI検索対応(AIO)・構造化データ・LLMO/GEO・ChatGPT検索対策に関する実践記事をお届けするメディアです。",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">
          ← トップに戻る
        </Link>
      </nav>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">AIOメディア</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        AI検索時代のEC集客(AIO=AI最適化)に役立つ実践記事をお届けします。構造化データ、AIクローラー対応、
        ChatGPT検索/Perplexity/Google AI Overview への最適化などをわかりやすく解説します。
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-ink-500">記事は近日公開予定です。</p>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-300"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-lg font-bold text-ink-900 hover:text-brand-700">
                  {post.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{post.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.tags.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-center text-white shadow-card">
        <h2 className="text-lg font-bold">あなたのECのAI検索対応度は何点?</h2>
        <p className="mt-2 text-sm text-brand-100">URLを入れるだけで、30秒で無料診断できます。</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          無料診断をはじめる
        </Link>
      </div>
    </div>
  );
}
