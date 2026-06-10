"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "サイトのHTMLを取得しています...",
  "構造化データ(JSON-LD)を解析しています...",
  "robots.txt のAIクローラー設定を確認しています...",
  "llms.txt の有無を確認しています...",
  "基本SEO・多言語・モバイル対応を判定しています...",
  "スコアを集計し、改善提案をまとめています...",
];

/** 診断中のプログレス表示(疑似進捗) */
export default function ProgressView() {
  const [progress, setProgress] = useState(6);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // 95%手前で漸近的に減速しながら進む
      setProgress((p) => (p >= 95 ? p : p + Math.max(1, Math.round((95 - p) / 12))));
    }, 600);
    const stepId = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 1800);
    return () => {
      clearInterval(id);
      clearInterval(stepId);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
      <h2 className="mt-4 text-lg font-bold">AI検索対応度を診断中です</h2>
      <p className="mt-1 text-sm text-ink-500">通常30秒ほどで完了します。少々お待ちください。</p>

      <div className="mx-auto mt-6 max-w-md">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-brand-700">{STEPS[stepIndex]}</p>
      </div>
    </div>
  );
}
