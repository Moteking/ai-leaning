"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/config";

/** バッジのプレビューと埋め込みコード(被リンク用)を生成。 */
export default function BadgeBuilder() {
  const [score, setScore] = useState<string>("");
  const [copied, setCopied] = useState<string>("");

  const scoreParam = score.trim() !== "" ? `?score=${encodeURIComponent(score.trim())}` : "";
  const badgeUrl = `${SITE_URL}/api/badge${scoreParam}`;

  const html = `<a href="${SITE_URL}" target="_blank" rel="noopener">\n  <img src="${badgeUrl}" alt="AI検索対応診断" width="234" height="40" />\n</a>`;
  const markdown = `[![AI検索対応診断](${badgeUrl})](${SITE_URL})`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <label className="block text-sm font-semibold" htmlFor="score">
          スコア(任意・空欄なら「診断済み」表示)
        </label>
        <input
          id="score"
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="例: 85"
          className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-4">
          <div className="text-xs text-ink-500">プレビュー</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={badgeUrl} alt="AI検索対応診断" width={234} height={40} className="mt-1" />
        </div>
      </div>

      {[
        { key: "html", title: "HTML(サイトのフッター等に貼る)", code: html },
        { key: "md", title: "Markdown(GitHub / note 等)", code: markdown },
      ].map((b) => (
        <div key={b.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{b.title}</span>
            <button
              onClick={() => copy(b.code, b.key)}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
            >
              {copied === b.key ? "コピー済み ✓" : "コピー"}
            </button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
            <code>{b.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
