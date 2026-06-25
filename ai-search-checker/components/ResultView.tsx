"use client";

import { useState } from "react";
import type { DiagnosisResult } from "@/lib/diagnose/types";
import ScoreGauge from "./ScoreGauge";
import RadarChart from "./RadarChart";
import CategoryCard from "./CategoryCard";
import LeadForm from "./LeadForm";
import ShareButtons from "./ShareButtons";
import { CONSULT_CTA_URL } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

interface ResultViewProps {
  results: DiagnosisResult[];
  notices?: string[];
  onReset: () => void;
  /** サンプル(デモ)表示か。trueなら詳細レポートを最初から開示しリード入力を省く。 */
  demo?: boolean;
}

/** 診断結果の表示。複数ページはタブで切替。サマリー → リードフォーム → 詳細レポートの順に開示する。 */
export default function ResultView({ results, notices = [], onReset, demo = false }: ResultViewProps) {
  const [unlocked, setUnlocked] = useState(demo);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = results[activeIndex] ?? results[0];
  // リード保存はメイン(先頭=サイトトップ)の結果を使う
  const primary = results[0];

  const radarData = active.categories.map((c) => ({
    label: c.label,
    percent: c.percent,
  }));

  return (
    <div className="space-y-6">
      {/* サンプル表示時の案内バナー */}
      {demo && (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-brand-800">
            これは「サンプル」の診断結果です。あなたのECサイトの実際のスコアを30秒で無料診断できます。
          </p>
          <button
            onClick={onReset}
            className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
          >
            自分のサイトを無料診断する
          </button>
        </div>
      )}

      {/* 診断対象 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-ink-500">
          <span className="font-semibold text-ink-700">{demo ? "サンプル対象：" : "診断対象："}</span>
          <span className="break-all">{active.finalUrl}</span>
        </div>
        <button
          onClick={onReset}
          className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
        >
          {demo ? "自分のURLを診断する" : "別のURLを診断する"}
        </button>
      </div>

      {/* 商品ページ診断失敗などの注意 */}
      {notices.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notices.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      )}

      {/* ページ切替タブ(複数ページ時のみ) */}
      {results.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {results.map((r, i) => (
            <button
              key={r.finalUrl + i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                i === activeIndex
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-slate-300 bg-white text-ink-700 hover:bg-slate-50"
              }`}
            >
              {r.pageLabel}
              <span className="ml-2 tabular-nums opacity-80">{r.totalScore}点</span>
            </button>
          ))}
        </div>
      )}

      {/* サマリー(リード獲得前に表示) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        {results.length > 1 && (
          <div className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            {active.pageLabel}の診断結果
          </div>
        )}
        <div className="grid items-center gap-6 sm:grid-cols-[auto,1fr]">
          <div className="flex justify-center">
            <ScoreGauge score={active.totalScore} grade={active.grade} />
          </div>
          <div>
            <h2 className="text-lg font-bold">総合診断サマリー</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{active.summary}</p>

            <div className="mt-4">
              <RadarChart data={radarData} />
            </div>
          </div>
        </div>

        {/* カテゴリ別ミニスコア */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {active.categories.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
              <div className="text-xs text-ink-500">{c.label}</div>
              <div className="mt-1 text-lg font-bold tabular-nums">
                {c.score}
                <span className="text-xs font-medium text-ink-500">/{c.maxScore}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SNSシェア(リード獲得前から可能=バイラルループ) */}
        <div className="mt-6">
          <ShareButtons score={active.totalScore} grade={active.grade} />
        </div>
      </div>

      {/* リードフォーム or 詳細レポート */}
      {!unlocked ? (
        <LeadForm
          url={primary.url}
          score={primary.totalScore}
          grade={primary.grade}
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <div className="space-y-6 fade-up">
          {/* AI講評 */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-600 text-xs font-bold text-white">
                AI
              </span>
              総合講評
              {results.length > 1 && (
                <span className="text-sm font-medium text-ink-500">（{active.pageLabel}）</span>
              )}
            </h2>
            <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink-700">
              {active.review.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* 項目別詳細 */}
          <div>
            <h2 className="mb-3 text-lg font-bold">
              項目別の詳細レポート
              {results.length > 1 && (
                <span className="ml-2 text-sm font-medium text-ink-500">（{active.pageLabel}）</span>
              )}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {active.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* 専門家相談CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-center text-white shadow-card">
            <h2 className="text-xl font-bold sm:text-2xl">
              診断結果をもとに、改善を一緒に進めませんか?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-100">
              構造化データの実装やAIクローラー対応は、専門知識があると確実かつスピーディに進められます。
              貴社サイトに合わせた具体的な改善方法を、専門家が無料でご相談に応じます。
            </p>
            <a
              href={CONSULT_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("consult_cta_click", { score: primary.totalScore })}
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              専門家による無料相談を申し込む
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
