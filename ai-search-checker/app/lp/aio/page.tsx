import type { Metadata } from "next";
import Link from "next/link";
import { CONSULT_CTA_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "AIO/LLMO対策ツール | ECサイトのAI検索対応を無料で診断・改善",
  description:
    "ChatGPT検索・Perplexity・Google AI OverviewなどのAI検索（AIO/LLMO）対応を、無料診断・AI引用チェック・実践メディアでまるごと支援。ECサイトのAI時代の集客を、まず現状把握から。",
  alternates: { canonical: "/lp/aio" },
  openGraph: {
    title: "AIO/LLMO対策ツール | ECサイトのAI検索対応を無料で診断・改善",
    description:
      "AI検索（AIO/LLMO）対応を、無料診断・AI引用チェック・実践メディアでまるごと支援。",
    type: "website",
  },
};

const faqs = [
  {
    q: "AIO・LLMOとは何ですか?",
    a: "AIO（AI Optimization）・LLMO（Large Language Model Optimization）は、ChatGPTやPerplexity、Google AI OverviewなどのAIが生成する回答に、自社サイトが引用・参照されるための最適化です。SEOの次に重要とされる領域です。",
  },
  {
    q: "SEO対策をしていればAIO対策は不要ですか?",
    a: "いいえ。重複する部分はありますが、AIクローラーの許可、構造化データ、JavaScriptなしで本文が読めるかなど、AIO特有の重要項目があります。SEOとAIOは両輪です。",
  },
  {
    q: "費用はかかりますか?",
    a: "AI検索対応診断・AIOメディアの閲覧は無料です。AI引用チェックも無料でご利用いただけます。より踏み込んだ改善実装は、専門家による有料サポートもご用意しています。",
  },
  {
    q: "ECサイト以外でも使えますか?",
    a: "診断ロジックはEC向けの項目（商品の構造化データなど）に最適化されていますが、AI検索対応の基本項目は他業種のサイトにも有効です。",
  },
  {
    q: "診断にはどれくらい時間がかかりますか?",
    a: "URLを入力するだけで、約30秒で総合スコアと改善ポイントが表示されます。会員登録は不要です。",
  },
];

export default function AioLpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <span className="inline-block rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-brand-700">
            ChatGPT検索 / Perplexity / Google AI Overview 対応
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            AIの浸透で「調べ方」が
            <br />
            変わっています。
            <br className="hidden sm:block" />
            <span className="text-brand-700">あなたのECは対応できていますか?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
            検索は「リンク一覧」から「AIが要約して答える」形へ。AIに引用されないECは、機会を失います。
            <strong className="text-ink-900">AIO/LLMO対策</strong>を、無料の診断・チェック・実践メディアでまるごと支援します。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-brand-600 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-brand-700"
            >
              無料でAI検索対応度を診断する
            </Link>
            <Link
              href="/ai-mention"
              className="rounded-xl border border-brand-300 bg-white px-7 py-3.5 text-base font-bold text-brand-700 transition hover:bg-brand-50"
            >
              AI引用チェックを試す
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-500">会員登録不要・約30秒・完全無料</p>
        </div>
      </section>

      {/* 課題提起 */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">その課題、AIO/LLMO対策で解決できます</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "AIにサイトが出てこない", d: "ChatGPTやPerplexityで質問しても、自社が引用されない。" },
            { t: "何をすればいいか分からない", d: "AIO対策の情報が少なく、優先順位がつけられない。" },
            { t: "SEOだけでは不安", d: "検索行動の変化に、今の施策で対応できているか不安。" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="text-base font-bold text-ink-900">「{c.t}」</div>
              <p className="mt-2 text-sm text-ink-700">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3つの無料ツール */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">3つの無料ツールで、AI検索対応を前進</h2>
          <div className="mt-10 space-y-5">
            {[
              {
                n: "01",
                t: "AI検索対応診断",
                d: "URLを入れるだけで、構造化データ・AIクローラー対応・可読性などを100点満点でスコア化。項目別の改善アドバイス付き。",
                href: "/",
                cta: "無料で診断する",
              },
              {
                n: "02",
                t: "AI引用チェック",
                d: "「○○ おすすめ」とAIに聞いたとき、あなたのブランドが回答に登場するかを実際に確認。参照元（競合の手がかり）も表示。",
                href: "/ai-mention",
                cta: "引用をチェックする",
              },
              {
                n: "03",
                t: "AIOメディア",
                d: "構造化データ・robots.txt・llms.txtなど、AIO対策の実践ノウハウを記事で配信。今日から使える具体策が手に入ります。",
                href: "/blog",
                cta: "記事を読む",
              },
            ].map((f) => (
              <div
                key={f.n}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center"
              >
                <div className="text-3xl font-extrabold text-brand-200">{f.n}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900">{f.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">{f.d}</p>
                </div>
                <Link
                  href={f.href}
                  className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
                >
                  {f.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEOとAIOの違い */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">SEO対策と、AIO/LLMO対策の違い</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-50 px-3 py-3 text-left font-bold">観点</th>
                <th className="border border-slate-200 bg-slate-50 px-3 py-3 text-left font-bold">SEO</th>
                <th className="border border-slate-200 bg-brand-50 px-3 py-3 text-left font-bold text-brand-800">
                  AIO / LLMO
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["目的", "検索結果での上位表示", "AIの回答に引用されること"],
                ["対象", "Googleなどの検索エンジン", "ChatGPT検索・Perplexity・AI Overview"],
                ["重視点", "キーワード・被リンク・品質", "構造化データ・クローラー許可・可読性"],
                ["着手状況", "多くの企業が対応済み", "大半が未対応＝今が先行のチャンス"],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border border-slate-200 px-3 py-2.5 font-bold text-ink-900">{row[0]}</td>
                  <td className="border border-slate-200 px-3 py-2.5 text-ink-700">{row[1]}</td>
                  <td className="border border-slate-200 bg-brand-50/40 px-3 py-2.5 text-ink-700">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ご利用の流れ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">ご利用の流れ</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              ["1", "URLを入力", "診断したいECサイトのURLを入力"],
              ["2", "無料診断", "30秒でスコアと弱点を可視化"],
              ["3", "改善提案を確認", "項目別の具体的アドバイスを取得"],
              ["4", "改善・再診断", "対応後に再診断してスコアUP"],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-card">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {n}
                </div>
                <div className="mt-3 text-sm font-bold text-ink-900">{t}</div>
                <p className="mt-1 text-xs text-ink-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">よくある質問</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-bold text-ink-900">Q. {f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 最終CTA */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-white">
          <h2 className="text-2xl font-extrabold sm:text-3xl">まずは、あなたのECの現在地を知ることから</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-100">
            AI検索対応は早く着手するほど有利です。URLを入れるだけ・30秒・完全無料で、今すぐ診断できます。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 hover:bg-brand-50"
            >
              無料診断をはじめる
            </Link>
            <a
              href={CONSULT_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/40 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10"
            >
              専門家に無料相談する
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
