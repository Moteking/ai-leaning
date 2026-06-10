"use client";

import { useState } from "react";
import type { DiagnosisResult } from "@/lib/diagnose/types";
import ProgressView from "./ProgressView";
import ResultView from "./ResultView";

type Phase = "idle" | "loading" | "result";

const FEATURES = [
  { title: "構造化データ", desc: "Product・Offer・FAQなどJSON-LDの実装状況" },
  { title: "AIクローラー対応", desc: "GPTBot・ClaudeBot等のブロック有無" },
  { title: "llms.txt / SEO", desc: "AI向けファイルと基本SEOの品質" },
];

/** トップページの中核。URL入力 → 進捗 → 結果表示までを管理する。 */
export default function DiagnoseApp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError("診断したいECサイトのURLを入力してください。");
      return;
    }
    setPhase("loading");
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "診断に失敗しました。");
      }
      setResult(data.result as DiagnosisResult);
      setPhase("result");
      // 結果表示位置へスクロール
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "診断に失敗しました。");
      setPhase("idle");
    }
  };

  const handleReset = () => {
    setResult(null);
    setPhase("idle");
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {phase === "idle" && (
        <>
          {/* ヒーロー */}
          <div className="text-center">
            <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              ChatGPT検索 / Perplexity / Google AI Overview 対応
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              あなたのECサイトは
              <br className="sm:hidden" />
              <span className="text-brand-700">AI検索に対応</span>できていますか?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
              URLを入力するだけで、AI検索と通常検索への対応度を100点満点で無料診断。
              構造化データ・AIクローラー対応・SEOを総合チェックし、具体的な改善アドバイスをお届けします。
            </p>
          </div>

          {/* 入力フォーム */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
          >
            <label htmlFor="url" className="block text-sm font-semibold">
              診断するECサイトのURL
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="url"
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-shop.example.com"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-700"
              >
                無料診断
              </button>
            </div>
            {error && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <p className="mt-3 text-xs text-ink-500">
              ※ 会員登録不要・無料。トップページのHTMLを解析します。
            </p>
          </form>

          {/* 診断内容の紹介 */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                <div className="text-sm font-bold text-brand-700">{f.title}</div>
                <div className="mt-1 text-xs text-ink-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {phase === "loading" && <ProgressView />}

      {phase === "result" && result && (
        <ResultView result={result} onReset={handleReset} />
      )}
    </div>
  );
}
