"use client";

import { useState } from "react";
import Link from "next/link";
import { CONSULT_CTA_URL } from "@/lib/config";

interface MentionSource {
  title: string;
  url: string;
}
interface CompetitorRef {
  name: string;
  mentions: number;
  isYou: boolean;
}
interface SourceCategory {
  type: string;
  count: number;
}
interface ActionItem {
  title: string;
  detail: string;
  priority: "高" | "中" | "低";
}
interface EngineResult {
  id: string;
  label: string;
  configured: boolean;
  ok: boolean;
  mentioned: boolean;
  answer: string;
  sources: MentionSource[];
}
interface HistoryPoint {
  date: string;
  score: number;
  mentioned: boolean;
}
interface MentionResult {
  query: string;
  brand: string;
  mentioned: boolean;
  rank: number | null;
  visibilityScore: number;
  summary: string;
  answer: string;
  sources: MentionSource[];
  competitors: CompetitorRef[];
  competitorStrength: string;
  sourceCategories: SourceCategory[];
  reasons: string[];
  actions: ActionItem[];
  relatedQueries: string[];
  engines: EngineResult[];
  coverageMentioned: number;
  coverageTotal: number;
  unconfiguredEngines: string[];
  analyzed: boolean;
}

type Phase = "idle" | "loading" | "result";

const EXAMPLES = [
  "福岡 ECコンサル おすすめ",
  "オーガニックコスメ 通販 人気",
  "ペット用品 ネットショップ おすすめ",
];

function scoreColor(score: number): { text: string; ring: string } {
  if (score >= 70) return { text: "text-green-700", ring: "ring-green-200" };
  if (score >= 40) return { text: "text-amber-700", ring: "ring-amber-200" };
  return { text: "text-red-700", ring: "ring-red-200" };
}

const PRIORITY_STYLE: Record<ActionItem["priority"], string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-amber-100 text-amber-700",
  低: "bg-slate-100 text-slate-600",
};

interface Verdict {
  wrap: string; // カード全体の border + bg(静的クラスでJIT検出可能にする)
  titleClass: string;
  badge: string;
  badgeClass: string;
  title: string;
  message: string;
}

/** 掲載状況を全パターンに分けて、それぞれ専用の見出し・色・メッセージを返す */
function getVerdict(r: MentionResult): Verdict {
  // パターン1: 最有力(1番手)
  if (r.mentioned && r.rank === 1) {
    return {
      wrap: "border-emerald-200 bg-emerald-50",
      titleClass: "text-emerald-700",
      badge: "最有力",
      badgeClass: "bg-emerald-600",
      title: "🏆 AIに“一番手”として推奨されています",
      message:
        "このクエリでは、AIが最初にあなたのブランドを挙げています。AI検索での勝者ポジションです。引用を取りこぼさないよう、構造化データやレビューを維持・強化しましょう。",
    };
  }
  // パターン2: 上位で引用(2〜3番手)
  if (r.mentioned && r.rank !== null && r.rank <= 3) {
    return {
      wrap: "border-green-200 bg-green-50",
      titleClass: "text-green-700",
      badge: `${r.rank}番手`,
      badgeClass: "bg-green-600",
      title: `✓ 上位でAIに引用されています（${r.rank}番手）`,
      message:
        "AIはあなたのブランドを上位で認識しています。あと一歩で一番手です。下の改善アクションで、より確実・上位での引用を狙えます。",
    };
  }
  // パターン3: 下位で引用(4番手以下、または順位不明だが言及あり)
  if (r.mentioned) {
    return {
      wrap: "border-amber-200 bg-amber-50",
      titleClass: "text-amber-700",
      badge: r.rank ? `${r.rank}番手` : "下位",
      badgeClass: "bg-amber-500",
      title: `△ AIに認識されていますが${r.rank ? `${r.rank}番手と` : ""}下位です`,
      message:
        "登場はしていますが、上位の競合に埋もれています。下の競合シェアと改善アクションで、上位へ押し上げる施策を進めましょう。",
    };
  }
  // パターン4: 圏外(未掲載)
  return {
    wrap: "border-rose-200 bg-rose-50",
    titleClass: "text-rose-700",
    badge: "圏外",
    badgeClass: "bg-rose-500",
    title: "✗ まだAIの回答に登場していません（圏外）",
    message:
      "このクエリではAIにあなたのブランドが認識されていません。下の『AIに選ばれているブランド』が今の勢力図、『改善アクション』が割り込むための手順です。",
  };
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** AI可視性スコアの推移を描く簡易折れ線グラフ(SVG) */
function TrendChart({ points }: { points: HistoryPoint[] }) {
  const W = 600;
  const H = 130;
  const P = 14;
  const n = points.length;
  const coords = points.map((p, i) => {
    const x = n === 1 ? W / 2 : P + (i / (n - 1)) * (W - 2 * P);
    const score = Math.max(0, Math.min(100, p.score));
    const y = P + (1 - score / 100) * (H - 2 * P);
    return { x, y, mentioned: p.mentioned };
  });
  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="スコア推移グラフ">
      {[0, 25, 50, 75, 100].map((g) => {
        const y = P + (1 - g / 100) * (H - 2 * P);
        return (
          <g key={g}>
            <line x1={P} y1={y} x2={W - P} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x={0} y={y + 3} fontSize={9} fill="#94a3b8">
              {g}
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="#1d4ed8" strokeWidth={2.5} />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={4} fill={c.mentioned ? "#16a34a" : "#1d4ed8"} />
      ))}
    </svg>
  );
}

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
  const [history, setHistory] = useState<HistoryPoint[]>([]);

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
      setHistory(Array.isArray(data.history) ? (data.history as HistoryPoint[]) : []);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "チェックに失敗しました。");
      setPhase("idle");
    }
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
    setPhase("idle");
    setError(null);
  };

  if (phase === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
        <h2 className="mt-4 text-lg font-bold">AIに質問し、競合状況を解析中…</h2>
        <p className="mt-1 text-sm text-ink-500">
          AIがWebを検索して回答を生成し、競合シェア・引用要因を分析します。20〜40秒ほどかかります。
        </p>
      </div>
    );
  }

  if (phase === "result" && result) {
    const sc = scoreColor(result.visibilityScore);
    const v = getVerdict(result);
    const maxMentions = Math.max(1, ...result.competitors.map((c) => c.mentions));
    const youInList = result.competitors.some((c) => c.isYou);

    return (
      <div className="space-y-6">
        {/* ===== 判定(全パターン別) + 可視性スコア ===== */}
        <div className={`rounded-2xl border p-6 shadow-card ${v.wrap}`}>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${v.badgeClass}`}>
              {v.badge}
            </span>
            <span className="truncate">
              クエリ：「{result.query}」／ブランド：「{result.brand}」
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={`text-2xl font-extrabold ${v.titleClass}`}>{v.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{v.message}</p>
            </div>
            <div
              className={`mx-auto flex h-28 w-28 flex-none flex-col items-center justify-center rounded-full bg-white ring-4 ${sc.ring}`}
            >
              <span className={`text-3xl font-extrabold ${sc.text}`}>{result.visibilityScore}</span>
              <span className="text-[11px] font-medium text-ink-500">AI可視性スコア</span>
              <span className="text-[10px] text-ink-400">/100</span>
            </div>
          </div>
        </div>

        {/* ===== AI横断カバー率 ===== */}
        {result.engines.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">AI横断カバー率</h3>
              <span className="text-sm font-bold">
                <span className="text-brand-700">{result.coverageMentioned}</span>
                <span className="text-ink-400"> / {result.coverageTotal} AIで掲載</span>
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              主要AIに同じ質問をして、あなたのブランドが回答に登場したかを横断比較しました。
            </p>
            <ul className="mt-4 space-y-2">
              {result.engines.map((e, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span className="w-24 flex-none text-sm font-semibold text-ink-700">{e.label}</span>
                  {e.ok ? (
                    e.mentioned ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        ✓ 掲載
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                        ✗ 未掲載
                      </span>
                    )
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      取得できず
                    </span>
                  )}
                  {e.ok && e.answer && (
                    <details className="ml-auto min-w-0 text-xs text-brand-700">
                      <summary className="cursor-pointer">回答を見る</summary>
                      <div className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-2 text-ink-600">
                        {e.answer}
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ul>
            {result.unconfiguredEngines.length > 0 && (
              <p className="mt-3 text-xs text-ink-400">
                未設定で比較できなかったAI：{result.unconfiguredEngines.join("・")}
                （各社APIキーを設定すると横断比較に追加されます）
              </p>
            )}
          </div>
        )}

        {/* ===== AI可視性スコアの推移 ===== */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">AI可視性スコアの推移</h3>
              {history.length >= 2 && (
                <span className="text-xs text-ink-500">
                  {fmtDate(history[0].date)} 〜 {fmtDate(history[history.length - 1].date)}
                </span>
              )}
            </div>
            {history.length >= 2 ? (
              <>
                <div className="mt-3">
                  <TrendChart points={history} />
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  緑の点＝そのAIに掲載されていた日。継続診断・日次自動追跡で線が伸びます。
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-600">
                📈 追跡を開始しました。同じブランド×クエリで再診断するたびに、ここへ推移が記録されます（日次の自動追跡にも登録済み）。
              </p>
            )}
          </div>
        )}

        {/* ===== 分析サマリー ===== */}
        {result.summary && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 shadow-card">
            <div className="flex gap-3">
              <span className="text-xl leading-none">🧭</span>
              <div>
                <h3 className="text-sm font-bold text-brand-800">分析サマリー</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== 競合シェア(誰がAIに選ばれているか) ===== */}
        {result.competitors.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-base font-bold">このクエリで「AIに選ばれている」ブランド</h3>
            <p className="mt-1 text-xs text-ink-500">
              AIの回答に登場したブランドを掲載順に並べました。これがAI検索における“今の勢力図”です。
            </p>
            <ul className="mt-4 space-y-2.5">
              {result.competitors.map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 flex-none text-right text-sm font-bold text-ink-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`truncate text-sm font-semibold ${
                          c.isYou ? "text-brand-700" : "text-ink-700"
                        }`}
                      >
                        {c.name}
                      </span>
                      {c.isYou && (
                        <span className="flex-none rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          あなた
                        </span>
                      )}
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${c.isYou ? "bg-brand-600" : "bg-slate-400"}`}
                        style={{ width: `${Math.round((c.mentions / maxMentions) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 flex-none text-right text-xs text-ink-500">{c.mentions}回</span>
                </li>
              ))}
            </ul>
            {!youInList && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="font-bold">あなた（{result.brand}）：圏外</span>
                ー このクエリではAIに認識されていません。上位の競合に割り込むには下の対策が有効です。
              </div>
            )}
            {result.competitorStrength && (
              <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-ink-600">
                <span className="font-bold text-ink-700">競合の勝因：</span>
                {result.competitorStrength}
              </div>
            )}
          </div>
        )}

        {/* ===== 改善アクション ===== */}
        {result.actions.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-base font-bold">AIに引用されるための改善アクション</h3>
            <p className="mt-1 text-xs text-ink-500">優先度の高い順に着手するのがおすすめです。</p>
            <ol className="mt-4 space-y-3">
              {result.actions.map((a, i) => (
                <li key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-bold ${PRIORITY_STYLE[a.priority]}`}
                    >
                      優先度{a.priority}
                    </span>
                    <span className="text-sm font-bold text-ink-700">{a.title}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{a.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ===== 引用要因 + 参照元の内訳 ===== */}
        {(result.reasons.length > 0 || result.sourceCategories.length > 0) && (
          <div className="grid gap-6 sm:grid-cols-2">
            {result.reasons.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold">引用される/されない要因</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-400" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.sourceCategories.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold">AIが参照した情報源の内訳</h3>
                <p className="mt-1 text-xs text-ink-500">
                  AIはこれらの“種類”のページを根拠にしています。ここに自社が載ることが引用への近道です。
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.sourceCategories.map((s, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-ink-700">{s.type}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-ink-500">
                        {s.count}件
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===== 参照元の実URL ===== */}
        {result.sources.length > 0 && (
          <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <summary className="cursor-pointer text-base font-bold">
              AIが参照した実際のページ（{result.sources.length}件）
            </summary>
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
          </details>
        )}

        {/* ===== AIの生成回答(折りたたみ) ===== */}
        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <summary className="cursor-pointer text-base font-bold">
            AIの回答（実際の生成結果）を全文表示
          </summary>
          <div className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-ink-700">
            {result.answer || "（回答を取得できませんでした）"}
          </div>
        </details>

        {/* ===== 次に狙う関連クエリ ===== */}
        {result.relatedQueries.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-base font-bold">次にチェックすべき関連クエリ</h3>
            <p className="mt-1 text-xs text-ink-500">
              クリックすると、そのクエリで続けて診断できます（会社名・メールは保持されます）。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.relatedQueries.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuery(q);
                    setResult(null);
                    setError(null);
                    setPhase("idle");
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
                >
                  🔎 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== CTA ===== */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-center text-white shadow-card">
          <h3 className="text-lg font-bold sm:text-xl">AIに引用されるサイトへ改善しませんか?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100">
            まずは自社サイトのAI検索対応度を無料診断。上の改善アクションを、サイトの構造化データや
            AIクローラー対応の具体的な設定に落とし込めます。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50">
              無料でサイトを診断する
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
          AIに聞いて競合状況をチェック
        </button>
        <p className="text-center text-[11px] text-ink-500">
          ※実際にAIへ質問し、Web検索を踏まえた回答から競合シェア・可視性スコア・改善策まで解析します。
        </p>
      </div>
    </form>
  );
}
