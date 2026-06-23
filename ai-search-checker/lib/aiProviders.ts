/**
 * 複数のAI(ChatGPT/Gemini/Perplexity/Grok)に同じ質問を投げ、
 * ブランドが回答に登場するかを横断比較するためのプロバイダ群。
 *
 * 各社のAPIキーは任意。未設定のプロバイダは自動でスキップする。
 * Claude(Anthropic)は本体(aiMention.ts)側で実行するためここには含めない。
 */

export interface EngineSource {
  title: string;
  url: string;
}

export interface EngineResult {
  id: string; // "openai" | "gemini" | "perplexity" | "grok"
  label: string; // 表示名(ChatGPT 等)
  configured: boolean; // APIキーが設定されているか
  ok: boolean; // 呼び出しが成功したか
  mentioned: boolean; // 回答/参照元にブランドが登場したか
  answer: string;
  sources: EngineSource[];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "");
}

function isMentioned(brand: string, answer: string, sources: EngineSource[]): boolean {
  const b = normalize(brand);
  if (b.length < 2) return false;
  const hay = normalize(answer + " " + sources.map((s) => s.title + " " + s.url).join(" "));
  return hay.includes(b);
}

/** タイムアウト付きJSON POST(古いNodeでも動くよう AbortController を使用) */
async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  ms = 30000
): Promise<Record<string, unknown>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t.slice(0, 200)}`);
    }
    return (await res.json()) as Record<string, unknown>;
  } finally {
    clearTimeout(timer);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// ===== ChatGPT (OpenAI) — web検索付きモデル =====
async function runOpenAI(userMessage: string): Promise<{ answer: string; sources: EngineSource[] }> {
  const key = process.env.OPENAI_API_KEY as string;
  const model = process.env.OPENAI_MENTION_MODEL || "gpt-4o-search-preview";
  const data: any = await postJson(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${key}` },
    { model, messages: [{ role: "user", content: userMessage }] }
  );
  const msg = data?.choices?.[0]?.message ?? {};
  const answer = String(msg.content ?? "");
  const sources: EngineSource[] = [];
  for (const a of msg.annotations ?? []) {
    const u = a?.url_citation;
    if (a?.type === "url_citation" && u?.url) {
      sources.push({ title: String(u.title ?? u.url), url: String(u.url) });
    }
  }
  return { answer, sources };
}

// ===== Gemini (Google) — Google検索グラウンディング =====
async function runGemini(userMessage: string): Promise<{ answer: string; sources: EngineSource[] }> {
  const key = process.env.GEMINI_API_KEY as string;
  const model = process.env.GEMINI_MENTION_MODEL || "gemini-2.0-flash";
  const data: any = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {},
    { contents: [{ parts: [{ text: userMessage }] }], tools: [{ google_search: {} }] }
  );
  const cand = data?.candidates?.[0] ?? {};
  const answer = (cand.content?.parts ?? []).map((p: any) => String(p?.text ?? "")).join("");
  const sources: EngineSource[] = [];
  for (const c of cand.groundingMetadata?.groundingChunks ?? []) {
    if (c?.web?.uri) sources.push({ title: String(c.web.title ?? c.web.uri), url: String(c.web.uri) });
  }
  return { answer, sources };
}

// ===== Perplexity — 標準でweb検索 =====
async function runPerplexity(
  userMessage: string
): Promise<{ answer: string; sources: EngineSource[] }> {
  const key = process.env.PERPLEXITY_API_KEY as string;
  const model = process.env.PERPLEXITY_MENTION_MODEL || "sonar";
  const data: any = await postJson(
    "https://api.perplexity.ai/chat/completions",
    { Authorization: `Bearer ${key}` },
    { model, messages: [{ role: "user", content: userMessage }] }
  );
  const answer = String(data?.choices?.[0]?.message?.content ?? "");
  const sources: EngineSource[] = [];
  const cites = data?.search_results ?? data?.citations ?? [];
  for (const c of cites) {
    if (typeof c === "string") sources.push({ title: c, url: c });
    else if (c?.url) sources.push({ title: String(c.title ?? c.url), url: String(c.url) });
  }
  return { answer, sources };
}

// ===== Grok (xAI) — Live Search =====
async function runGrok(userMessage: string): Promise<{ answer: string; sources: EngineSource[] }> {
  const key = process.env.XAI_API_KEY as string;
  const model = process.env.XAI_MENTION_MODEL || "grok-3";
  const data: any = await postJson(
    "https://api.x.ai/v1/chat/completions",
    { Authorization: `Bearer ${key}` },
    {
      model,
      messages: [{ role: "user", content: userMessage }],
      search_parameters: { mode: "auto" },
    }
  );
  const answer = String(data?.choices?.[0]?.message?.content ?? "");
  const sources: EngineSource[] = [];
  for (const c of data?.citations ?? []) {
    if (typeof c === "string") sources.push({ title: c, url: c });
    else if (c?.url) sources.push({ title: String(c.title ?? c.url), url: String(c.url) });
  }
  return { answer, sources };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

interface Provider {
  id: string;
  label: string;
  env: string;
  run: (userMessage: string) => Promise<{ answer: string; sources: EngineSource[] }>;
}

const PROVIDERS: Provider[] = [
  { id: "openai", label: "ChatGPT", env: "OPENAI_API_KEY", run: runOpenAI },
  { id: "gemini", label: "Gemini", env: "GEMINI_API_KEY", run: runGemini },
  { id: "perplexity", label: "Perplexity", env: "PERPLEXITY_API_KEY", run: runPerplexity },
  { id: "grok", label: "Grok", env: "XAI_API_KEY", run: runGrok },
];

/**
 * 設定済みの他社AIを並列で実行し、各AIでブランドが引用されるかを返す。
 * 未設定のAIは unconfigured に名前だけ返す(UIで「キー設定で有効化」を案内)。
 */
export async function fetchOtherEngines(
  userMessage: string,
  brand: string
): Promise<{ engines: EngineResult[]; unconfigured: string[] }> {
  const configured = PROVIDERS.filter((p) => (process.env[p.env] ?? "").trim() !== "");
  const unconfigured = PROVIDERS.filter((p) => (process.env[p.env] ?? "").trim() === "").map(
    (p) => p.label
  );

  const settled = await Promise.allSettled(
    configured.map(async (p) => {
      const { answer, sources } = await p.run(userMessage);
      return { answer, sources };
    })
  );

  const engines: EngineResult[] = settled.map((r, i) => {
    const p = configured[i];
    if (r.status === "fulfilled") {
      const { answer, sources } = r.value;
      return {
        id: p.id,
        label: p.label,
        configured: true,
        ok: true,
        mentioned: isMentioned(brand, answer, sources),
        answer,
        sources: sources.slice(0, 8),
      };
    }
    console.error(`[ai-mention] ${p.id} 失敗:`, r.reason);
    return {
      id: p.id,
      label: p.label,
      configured: true,
      ok: false,
      mentioned: false,
      answer: "",
      sources: [],
    };
  });

  return { engines, unconfigured };
}
