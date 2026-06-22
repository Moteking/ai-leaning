import type { Metadata } from "next";
import Link from "next/link";
import AiMentionApp from "@/components/AiMentionApp";

export const metadata: Metadata = {
  title: "AI引用チェック | 競合シェア・AI可視性スコアを無料分析",
  description:
    "ChatGPTのようにAIが答える時代に、あなたのブランドがAIの回答に引用されるかを無料分析。単なる確認で終わらず、そのクエリで“誰がAIに選ばれているか”の競合シェア、AI可視性スコア、参照元の内訳、優先度付きの改善アクションまで提示します。",
  alternates: { canonical: "/ai-mention" },
  openGraph: {
    title: "AI引用チェック | 競合シェア・AI可視性スコアを無料分析",
    description:
      "AIに実際に質問し、競合シェア・AI可視性スコア・改善アクションまで自動分析する無料ツール。",
    type: "website",
  },
};

export default function AiMentionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">
          ← トップに戻る
        </Link>
      </nav>

      <div className="text-center">
        <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          AIO / LLMO チェック
        </span>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          あなたのブランドは、
          <br className="sm:hidden" />
          <span className="text-brand-700">AIの回答に出てきますか?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-700">
          ユーザーが「○○ おすすめ」と聞いたとき、AIの回答に出てくるのは誰か。
          実際にAIへ質問し、<strong>そのクエリの競合シェア・AI可視性スコア・改善アクション</strong>まで自動分析します。
          「自分でAIに聞く」だけでは見えない“勝ち負け”が分かります。
        </p>
      </div>

      <div className="mt-8">
        <AiMentionApp />
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
        {[
          { t: "競合シェアを可視化", d: "そのクエリで“誰がAIに選ばれているか”をランキング表示" },
          { t: "AI可視性スコア", d: "あなたのAI検索での見つかりやすさを100点満点で数値化" },
          { t: "改善アクション", d: "引用される側に回るための施策を優先度付きで提示" },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-sm font-bold text-brand-700">{f.t}</div>
            <div className="mt-1 text-xs text-ink-500">{f.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-brand-200 bg-brand-50/50 p-5 text-sm text-ink-700">
        <p className="font-bold">サイト全体のAI検索対応度も診断できます</p>
        <p className="mt-1">
          引用されるための土台（構造化データ・AIクローラー許可・可読性）が整っているかは、
          <Link href="/" className="font-semibold text-brand-700 hover:underline">
            無料のAI検索対応診断
          </Link>
          で100点満点でチェックできます。
        </p>
      </div>
    </div>
  );
}
