import Anthropic from "@anthropic-ai/sdk";
import { fetchOtherEngines, type EngineResult } from "./aiProviders";

export type { EngineResult } from "./aiProviders";

export interface MentionSource {
  title: string;
  url: string;
}

/** AIの回答に登場したブランド/サービス(競合シェア) */
export interface CompetitorRef {
  name: string;
  mentions: number;
  isYou: boolean;
}

/** AIが参照した情報源の種別内訳 */
export interface SourceCategory {
  type: string;
  count: number;
}

/** 優先度付きの改善アクション */
export interface ActionItem {
  title: string;
  detail: string;
  priority: "高" | "中" | "低";
}

export interface MentionResult {
  available: boolean; // ANTHROPIC_API_KEY が設定されているか
  query: string;
  brand: string;
  mentioned: boolean;
  rank: number | null; // 競合の中での順位(1始まり)。未掲載は null
  visibilityScore: number; // AI可視性スコア 0-100
  summary: string; // 状況の一言要約(このケース固有)
  answer: string;
  sources: MentionSource[];
  competitors: CompetitorRef[]; // AIに選ばれているブランドのランキング
  competitorStrength: string; // 上位競合がAIに選ばれている共通の勝因
  sourceCategories: SourceCategory[]; // 参照元の種別内訳
  reasons: string[]; // 引用されない(/されている)理由
  actions: ActionItem[]; // 改善アクション
  relatedQueries: string[]; // 次に狙う/チェックすべき関連クエリ
  engines: EngineResult[]; // AI横断比較(Claude + 設定済みの他AI)
  coverageMentioned: number; // 掲載しているAIの数
  coverageTotal: number; // 比較したAIの数
  unconfiguredEngines: string[]; // 未設定で比較できなかったAI名
  analyzed: boolean; // 競合解析(フェーズ2)が成功したか
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "");
}

/** AIの回答テキストから ```json フェンス等を除いて最初のJSONオブジェクトを取り出す */
function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("no json");
  return JSON.parse(text.slice(start, end + 1));
}

/** フェーズ2解析の出力スキーマ(構造化出力) */
const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mentioned: { type: "boolean" },
    // 競合の中での順位。1始まり。未掲載なら 0
    rank: { type: "integer" },
    // AI可視性スコア 0-100
    visibilityScore: { type: "integer" },
    summary: { type: "string" },
    competitorStrength: { type: "string" },
    relatedQueries: { type: "array", items: { type: "string" } },
    competitors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          mentions: { type: "integer" },
          isYou: { type: "boolean" },
        },
        required: ["name", "mentions", "isYou"],
      },
    },
    sourceCategories: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string" },
          count: { type: "integer" },
        },
        required: ["type", "count"],
      },
    },
    reasons: { type: "array", items: { type: "string" } },
    actions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          priority: { type: "string", enum: ["高", "中", "低"] },
        },
        required: ["title", "detail", "priority"],
      },
    },
  },
  required: [
    "mentioned",
    "rank",
    "visibilityScore",
    "summary",
    "competitorStrength",
    "relatedQueries",
    "competitors",
    "sourceCategories",
    "reasons",
    "actions",
  ],
} as const;

/**
 * 指定の検索クエリを Claude(ウェブ検索ツール付き)に質問し、AIの回答を取得したうえで、
 * 「競合シェア・AI可視性スコア・参照元の内訳・引用されない理由・改善アクション」まで解析して返す。
 * 単に『自分でAIに聞く』だけでは得られない競合インテリジェンスを提供するのが狙い。
 *
 * ANTHROPIC_API_KEY が未設定なら available:false を返す（ツールは「準備中」表示）。
 * モデルは MENTION_MODEL（既定 claude-haiku-4-5。Vercel無料枠の60秒に収めるため最速モデルを採用）。
 */
export async function runMentionCheck(brand: string, query: string): Promise<MentionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const base: MentionResult = {
    available: false,
    query,
    brand,
    mentioned: false,
    rank: null,
    visibilityScore: 0,
    summary: "",
    answer: "",
    sources: [],
    competitors: [],
    competitorStrength: "",
    sourceCategories: [],
    reasons: [],
    actions: [],
    relatedQueries: [],
    engines: [],
    coverageMentioned: 0,
    coverageTotal: 0,
    unconfiguredEngines: [],
    analyzed: false,
  };
  if (!apiKey) return base;

  // Vercel Hobby の関数上限は60秒。SDK側を50秒で打ち切り、504(関数強制終了)に
  // なる前にきれいなエラーで返す。timeout はミリ秒。リトライは時間を倍化させるため0。
  const client = new Anthropic({ apiKey, timeout: 50_000, maxRetries: 0 });
  // 既定は Haiku 4.5(最速。Vercel無料枠の60秒に確実に収める)。
  // 品質重視なら MENTION_MODEL=claude-sonnet-4-6 / claude-opus-4-8 で上書き可
  // (検索が長引くと60秒超で失敗する場合あり)。
  const model = process.env.MENTION_MODEL || "claude-haiku-4-5";

  // dynamic filtering 対応モデルのみ最新版 web 検索を使う。Haiku 等は基本版(軽量・高速)。
  const supportsNewSearch = /claude-(opus-4-(6|7|8)|sonnet-4-6|fable-5)/.test(model);
  const webSearchTool = (
    supportsNewSearch
      ? { type: "web_search_20260209", name: "web_search", max_uses: 3 }
      : { type: "web_search_20250305", name: "web_search", max_uses: 3 }
  ) as Anthropic.Messages.ToolUnion;

  // ===== フェーズ1: ウェブ検索付きでAIに「おすすめ」を回答させる =====
  const userMessage =
    `${query}について、おすすめを教えてください。` +
    `実在する具体的なサービス名・店舗名・ブランド名を複数挙げ、それぞれの特徴を簡潔に説明してください。` +
    `最新の情報を踏まえて回答してください。`;

  // Claudeの回答を web検索付きで取得する
  async function fetchClaudeAnswer(): Promise<{ answer: string; sources: MentionSource[] }> {
    type Msg = Anthropic.MessageParam;
    const messages: Msg[] = [{ role: "user", content: userMessage }];
    let ans = "";
    const src: MentionSource[] = [];

    // server-tool ループ(pause_turn)に対応
    for (let i = 0; i < 4; i++) {
      const res = await client.messages.create({
        model,
        max_tokens: 1200,
        // 検索回数を3回に制限し、時間切れ(60秒)を防ぐ
        tools: [webSearchTool],
        messages,
      });

      for (const block of res.content) {
        if (block.type === "text") {
          ans += block.text;
        } else if (block.type === "web_search_tool_result") {
          const content = (block as { content?: unknown }).content;
          if (Array.isArray(content)) {
            for (const r of content as Array<Record<string, unknown>>) {
              if (r && r.type === "web_search_result" && typeof r.url === "string") {
                src.push({ title: String(r.title ?? r.url), url: String(r.url) });
              }
            }
          }
        }
      }

      if (res.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: res.content });
        continue; // サーバーツールの続きを再開
      }
      break;
    }

    // 参照元は重複URLを除去
    const seen = new Set<string>();
    const dedup = src.filter((s) => {
      if (seen.has(s.url)) return false;
      seen.add(s.url);
      return true;
    });
    return { answer: ans.trim(), sources: dedup };
  }

  // Claude と 他社AI(ChatGPT/Gemini/Perplexity/Grok) を並列実行して横断比較
  const [claude, other] = await Promise.all([
    fetchClaudeAnswer(),
    fetchOtherEngines(userMessage, brand),
  ]);

  const answer = claude.answer;
  const uniqueSources = claude.sources;

  // ブランド/サイトの単純な文字列一致(フェーズ2が失敗したときのフォールバック)
  const brandNorm = normalize(brand);
  const hay = normalize(answer + " " + uniqueSources.map((s) => s.title + " " + s.url).join(" "));
  const fallbackMentioned = brandNorm.length > 1 && hay.includes(brandNorm);

  const result: MentionResult = {
    available: true,
    query,
    brand,
    mentioned: fallbackMentioned,
    rank: null,
    visibilityScore: fallbackMentioned ? 50 : 10,
    summary: "",
    answer,
    sources: uniqueSources.slice(0, 10),
    competitors: [],
    competitorStrength: "",
    sourceCategories: [],
    reasons: [],
    actions: [],
    relatedQueries: [],
    engines: [],
    coverageMentioned: 0,
    coverageTotal: 0,
    unconfiguredEngines: other.unconfigured,
    analyzed: false,
  };

  // ===== フェーズ2: AIの回答を解析して競合インテリジェンスを生成(高速・ツールなし) =====
  // 解析は別モデルにも切替可。失敗してもフェーズ1の結果は返す(機会損失を避ける)。
  const analysisModel = process.env.MENTION_ANALYSIS_MODEL || "claude-haiku-4-5";
  const sourceList = uniqueSources
    .slice(0, 10)
    .map((s, i) => `${i + 1}. ${s.title} (${s.url})`)
    .join("\n");

  const analysisPrompt =
    `あなたはAIO(AI検索最適化)の専門アナリストです。以下は、検索クエリ「${query}」に対して` +
    `AIが生成した「おすすめ回答」と、AIが根拠として参照した情報源の一覧です。` +
    `ターゲットブランド「${brand}」が、このAI回答の中でどう扱われているかを分析してください。\n\n` +
    `# AIの回答\n${answer.slice(0, 4000)}\n\n` +
    `# AIが参照した情報源\n${sourceList || "(なし)"}\n\n` +
    `# 分析タスク(必ず日本語で)\n` +
    `1. mentioned: 「${brand}」がAI回答に実質的に登場・推奨されているか(表記ゆれも考慮)。\n` +
    `2. rank: 回答で挙げられたブランドの中での「${brand}」の掲載順位(1始まり)。未掲載なら0。\n` +
    `3. visibilityScore(0-100): AI検索での可視性。未掲載=5〜25、下位で言及=40〜60、上位で明確に推奨=70〜100。\n` +
    `4. competitors: 回答で挙げられた実在ブランド/サービスを登場順に最大8件。各 name(ブランド名)、` +
    `mentions(回答内での言及回数の目安1以上)、isYou(それが「${brand}」自身ならtrue)。\n` +
    `5. sourceCategories: 参照元を「比較・ランキングメディア」「レビューサイト」「競合の公式サイト」` +
    `「ニュース・メディア」「ECモール」「その他」等に分類し、種別ごとの件数。\n` +
    `6. reasons: 「${brand}」がAIに引用される/されない要因を2〜4個(構造化データ、AIクローラー許可、` +
    `第三者メディア掲載、レビューの有無、コンテンツ量など具体的に)。\n` +
    `7. actions: 「${brand}」がAIに引用されるための改善アクションを優先度付きで3〜5個。` +
    `各 title(短い見出し)、detail(具体的にどうするか1〜2文)、priority(高/中/低)。\n` +
    `8. summary: この状況の一言要約(1〜2文)。誰が上位を占め、「${brand}」がどの位置かを具体的に。\n` +
    `9. competitorStrength: 上位の競合がAIに選ばれている共通の勝因(1〜2文)。「${brand}」が何で負けているか分かるように。\n` +
    `10. relatedQueries: 「${brand}」が次に狙う/チェックすべき関連検索クエリを3〜5個(実際にユーザーが打ちそうな日本語クエリ)。\n` +
    `JSONのみを出力してください。`;

  try {
    const analysisParams: Record<string, unknown> = {
      model: analysisModel,
      max_tokens: 1500,
      messages: [{ role: "user", content: analysisPrompt }],
      output_config: { format: { type: "json_schema", schema: ANALYSIS_SCHEMA } },
    };
    const aRes = await client.messages.create(
      analysisParams as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming
    );
    let txt = "";
    for (const b of aRes.content) {
      if (b.type === "text") txt += b.text;
    }
    const parsed = extractJson(txt) as {
      mentioned?: boolean;
      rank?: number;
      visibilityScore?: number;
      summary?: string;
      competitorStrength?: string;
      relatedQueries?: string[];
      competitors?: CompetitorRef[];
      sourceCategories?: SourceCategory[];
      reasons?: string[];
      actions?: ActionItem[];
    };

    const rankNum = typeof parsed.rank === "number" ? parsed.rank : 0;
    result.mentioned = Boolean(parsed.mentioned);
    result.rank = rankNum > 0 ? rankNum : null;
    result.summary = typeof parsed.summary === "string" ? parsed.summary : "";
    result.competitorStrength =
      typeof parsed.competitorStrength === "string" ? parsed.competitorStrength : "";
    result.relatedQueries = Array.isArray(parsed.relatedQueries)
      ? parsed.relatedQueries.map((q) => String(q)).filter(Boolean).slice(0, 5)
      : [];
    result.visibilityScore = Math.max(
      0,
      Math.min(100, Math.round(parsed.visibilityScore ?? result.visibilityScore))
    );
    result.competitors = Array.isArray(parsed.competitors)
      ? parsed.competitors.slice(0, 8).map((c) => ({
          name: String(c.name ?? ""),
          mentions: Math.max(1, Number(c.mentions) || 1),
          isYou: Boolean(c.isYou),
        }))
      : [];
    result.sourceCategories = Array.isArray(parsed.sourceCategories)
      ? parsed.sourceCategories.slice(0, 8).map((s) => ({
          type: String(s.type ?? ""),
          count: Math.max(0, Number(s.count) || 0),
        }))
      : [];
    result.reasons = Array.isArray(parsed.reasons)
      ? parsed.reasons.map((r) => String(r)).slice(0, 5)
      : [];
    result.actions = Array.isArray(parsed.actions)
      ? parsed.actions.slice(0, 5).map((a) => ({
          title: String(a.title ?? ""),
          detail: String(a.detail ?? ""),
          priority: (["高", "中", "低"].includes(String(a.priority))
            ? a.priority
            : "中") as ActionItem["priority"],
        }))
      : [];
    result.analyzed = true;
  } catch (err) {
    console.error("[ai-mention] 競合解析(フェーズ2)失敗:", err);
  }

  // ===== AI横断カバー率(Claude + 設定済みの他AI) =====
  const claudeEngine: EngineResult = {
    id: "claude",
    label: "Claude",
    configured: true,
    ok: true,
    mentioned: result.mentioned, // フェーズ2の意味的判定に揃える
    answer: claude.answer,
    sources: claude.sources.slice(0, 8),
  };
  const engines: EngineResult[] = [claudeEngine, ...other.engines];
  result.engines = engines;
  result.coverageTotal = engines.filter((e) => e.ok).length;
  result.coverageMentioned = engines.filter((e) => e.ok && e.mentioned).length;

  return result;
}
