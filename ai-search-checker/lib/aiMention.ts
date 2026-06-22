import Anthropic from "@anthropic-ai/sdk";

export interface MentionSource {
  title: string;
  url: string;
}

export interface MentionResult {
  available: boolean; // ANTHROPIC_API_KEY が設定されているか
  query: string;
  brand: string;
  mentioned: boolean;
  answer: string;
  sources: MentionSource[];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "");
}

/**
 * 指定の検索クエリを Claude(ウェブ検索ツール付き)に質問し、
 * AIの回答にブランド/サイトが引用・言及されるかを判定する。
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
    answer: "",
    sources: [],
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

  const userMessage =
    `${query}について、おすすめを教えてください。` +
    `実在する具体的なサービス名・店舗名・ブランド名を複数挙げ、それぞれの特徴を簡潔に説明してください。` +
    `最新の情報を踏まえて回答してください。`;

  // ウェブ検索ツール付きでAIに回答させる
  type Msg = Anthropic.MessageParam;
  const messages: Msg[] = [{ role: "user", content: userMessage }];

  let answer = "";
  const sources: MentionSource[] = [];

  // server-tool ループ(pause_turn)に最大3回まで対応
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
        answer += block.text;
      } else if (block.type === "web_search_tool_result") {
        const content = (block as { content?: unknown }).content;
        if (Array.isArray(content)) {
          for (const r of content as Array<Record<string, unknown>>) {
            if (r && r.type === "web_search_result" && typeof r.url === "string") {
              sources.push({ title: String(r.title ?? r.url), url: String(r.url) });
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

  // ブランド/サイトが回答・参照元に登場するか
  const brandNorm = normalize(brand);
  const hay = normalize(answer + " " + sources.map((s) => s.title + " " + s.url).join(" "));
  const mentioned = brandNorm.length > 1 && hay.includes(brandNorm);

  // 参照元は重複URLを除去
  const seen = new Set<string>();
  const uniqueSources = sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });

  return {
    available: true,
    query,
    brand,
    mentioned,
    answer: answer.trim(),
    sources: uniqueSources.slice(0, 10),
  };
}
