"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/config";

interface ShareButtonsProps {
  score: number;
  grade: string;
}

/** 診断結果のSNSシェアボタン(バイラルループ用)。 */
export default function ShareButtons({ score, grade }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = SITE_URL;
  const text = `私のECサイトのAI検索対応スコアは${score}点(${grade})でした。\nChatGPT検索・Perplexity・Google AI Overview への対応度を無料診断👇`;

  const enc = encodeURIComponent;
  const links = {
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}&hashtags=AI検索,AIO,EC`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${enc(url)}&text=${enc(text)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボード不可の環境は無視 */
    }
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:opacity-90";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-ink-900">この結果をシェアする</p>
      <p className="mt-0.5 text-xs text-ink-500">
        診断結果を共有して、知り合いのEC事業者にも教えてあげましょう。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={links.x} target="_blank" rel="noopener noreferrer" className={btn} style={{ backgroundColor: "#000" }}>
          𝕏 でシェア
        </a>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={btn} style={{ backgroundColor: "#1877F2" }}>
          Facebook
        </a>
        <a href={links.line} target="_blank" rel="noopener noreferrer" className={btn} style={{ backgroundColor: "#06C755" }}>
          LINE
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={btn} style={{ backgroundColor: "#0A66C2" }}>
          LinkedIn
        </a>
        <button onClick={handleCopy} className={`${btn} border border-slate-300 !text-ink-700`} style={{ backgroundColor: "#fff" }}>
          {copied ? "コピーしました ✓" : "リンクをコピー"}
        </button>
      </div>
    </div>
  );
}
