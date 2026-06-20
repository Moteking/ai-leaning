import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost } from "@/lib/blog";
import { CONSULT_CTA_URL, SITE_URL } from "@/lib/config";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | AIOメディア`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  // Article + FAQPage の構造化データ(このメディア自身もAIOを実践)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "ja",
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        author: { "@type": "Organization", name: "株式会社KAAAY" },
        publisher: { "@type": "Organization", name: "株式会社KAAAY" },
      },
      ...(post.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm">
        <Link href="/blog" className="text-brand-700 hover:underline">
          ← AIOメディア一覧
        </Link>
      </nav>

      <h1 className="text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <time dateTime={post.date}>{post.date}</time>
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
            #{t}
          </span>
        ))}
      </div>

      <div
        className="prose-article mt-8"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">よくある質問</h2>
          <div className="mt-4 space-y-4">
            {post.faq.map((f, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-ink-900">Q. {f.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">A. {f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-center text-white shadow-card">
        <h2 className="text-lg font-bold sm:text-xl">
          あなたのECは、AI検索に対応できていますか?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-brand-100">
          記事の内容ができているか、URLを入れるだけで30秒で無料診断。改善ポイントが項目別にわかります。
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            無料診断をはじめる
          </Link>
          <a
            href={CONSULT_CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            専門家に相談する
          </a>
        </div>
      </div>
    </article>
  );
}
