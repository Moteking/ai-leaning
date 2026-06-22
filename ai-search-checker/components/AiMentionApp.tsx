"use client";

import { useState } from "react";
import Link from "next/link";
import { CONSULT_CTA_URL } from "@/lib/config";

interface MentionSource {
  title: string;
  url: string;
}
interface MentionResult {
  query: string;
  brand: string;
  mentioned: boolean;
  answer: string;
  sources: MentionSource[];
}

type Phase = "idle" | "loading" | "result";

const EXAMPLES = [
  "福岡 ECコンサル おすすめ",
  "オーガニックコスメ 通販 人気",
  "ペット用品 ネットショップ おすすめ",
];

export default function AiMentionApp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MentionResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!brand.trim() || !query.trim()) {
      setError("ブランド名と想定クエリを入力してください。");
      return;
    }
    if (!company.trim()) {
      setError("会社名を入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("正しいメールアドレスを入力してください。");
      return;
    }
    if (!agree) {
      setError("プライバシーポリシーに同意してください。");
      return;
    }
    setPhase("loading");
    try {
      const res = await fetch("/api/ai-mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand.trim(),
          query: query.trim(),
          company: company.trim(),
          email: email.trim(),
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "チェックに失敗しました。");
      setResult(data.result as MentionResult);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "チェックに失敗しました。");
      setPhase("idle");
    }
  };

  const reset = () => {
    setResult(null);
    setPhase("idle");
    setError(null);
  };

  if (phase === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
        <h2 className="mt-4 text-lg font-bold">AIに質問して引用状況を確認中…</h2>
        <p className="mt-1 text-sm text-ink-500">
          AIがWebを検索して回答を生成します。30秒〜1分ほどかかる場合があります。
        </p>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="space-y-6">
        <div
          className={`rounded-2xl border p-6 shadow-card ${
            result.mentioned ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="text-sm text-ink-500">
            クエリ：「{result.query}」／ブランド：「{result.brand}」
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">
            {result.mentioned ? (
              <span className="text-green-700">✓ AIの回答に登場しました</span>
            ) : (
              <span className="text-amber-700">まだAIの回答に登場していません</span>
            )}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {result.mentioned
              ? "このクエリでは、AIがあなたのブランドを認識・引用しています。さらに上位で確実に引用されるよう、構造化データやレビューを強化しましょう。"
              : "このクエリでは、AIの回答にあなたのブランドが登場していません。AIに見つけられ・引用されるための対策（構造化データ、AIクローラー許可、コンテンツ拡充）が有効です。"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-base font-bold">AIの回答（実際の生成結果）</h3>
          <div className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-ink-700">
            {result.answer || "（回答を取得できませんでした）"}
          </div>
        </div>

        {result.sources.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-base font-bold">AIが参照した情報源（競合の手がかり）</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {result.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 hover:underline"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              ※これらはAIが回答生成時に参照したページです。ここに自社が含まれていない場合、AIに見つけられていない可能性があります。
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-center text-white shadow-card">
          <h3 className="text-lg font-bold sm:text-xl">AIに引用されるサイトへ改善しませんか?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100">
            まずは自社サイトのAI検索対応度を無料診断。引用されるための具体的な改善ポイントがわかります。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50">
              無料診断をはじめる
            </Link>
            <a
              href={CONSULT_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              専門家に相談する
            </a>
          </div>
        </div>

        <button onClick={reset} className="text-sm font-medium text-brand-700 hover:underline">
          ← 別のブランド・クエリでチェックする
        </button>
      </div>
    );
  }

  // idle: フォーム
  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="space-y-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-semibold">
            ブランド名・サイト名 <span className="text-red-500">*</span>
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="例：株式会社サンプル / sample-shop"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label htmlFor="query" className="block text-sm font-semibold">
            想定する検索クエリ・カテゴリ <span className="text-red-500">*</span>
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：福岡 ECコンサル おすすめ"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuery(ex)}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-ink-500 hover:border-brand-300 hover:text-brand-700"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-sm font-semibold">
              会社名 <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="株式会社サンプル"
              autoComplete="organization"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-ink-500">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            <Link href="/privacy" target="_blank" className="text-brand-700 underline">
              プライバシーポリシー
            </Link>
            に同意の上で実行します。
          </span>
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-700"
        >
          AIに聞いて引用状況をチェック
        </button>
        <p className="text-center text-[11px] text-ink-500">
          ※実際にAIへ質問し、Web検索を踏まえた回答であなたのブランドが引用されるかを確認します。
        </p>
      </div>
    </form>
  );
}
