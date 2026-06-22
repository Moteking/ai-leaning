import type { Metadata } from "next";
import Link from "next/link";
import AiMentionApp from "@/components/AiMentionApp";

export const metadata: Metadata = {
  title: "AI引用チェック | あなたのブランドはAIの回答に出てくる?",
  description:
    "ChatGPTのようにAIが質問に答えるとき、あなたのブランドが引用されるかを無料でチェック。AIに実際に質問し、Web検索を踏まえた回答で言及されるかを確認します。",
  alternates: { canonical: "/ai-mention" },
  openGraph: {
    title: "AI引用チェック | あなたのブランドはAIの回答に出てくる?",
    description: "AIに実際に質問し、あなたのブランドが引用されるかを無料でチェックします。",
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
          ChatGPTやPerplexityのようにAIが質問に答える時代。ユーザーが「○○ おすすめ」と聞いたとき、
          あなたのブランドが引用されるかを実際にAIに質問してチェックします。
        </p>
      </div>

      <div className="mt-8">
        <AiMentionApp />
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
        {[
          { t: "実際にAIへ質問", d: "Web検索を踏まえてAIが回答を生成します" },
          { t: "引用の有無を判定", d: "回答にあなたのブランドが登場するか確認" },
          { t: "競合の手がかり", d: "AIが参照した情報源（競合候補）も表示" },
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
