import type { RawSiteData } from "./types";

// HTTPヘッダー値はLatin-1のみ許容されるため、ASCII文字で構成する
const USER_AGENT =
  "AISearchCheckerBot/1.0 (+https://example.com/ai-search-checker; site diagnosis bot)";

const FETCH_TIMEOUT_MS = 15000;

/** タイムアウト付き fetch */
async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(init?.headers ?? {}),
      },
      redirect: "follow",
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

/** 入力文字列を正規化し、http/https のURLに整える */
export function normalizeUrl(raw: string): string {
  let value = raw.trim();
  if (!value) {
    throw new Error("URLが入力されていません。");
  }
  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("URLの形式が正しくありません。");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("http または https のURLを入力してください。");
  }
  // ローカル・内部ネットワーク宛のアクセスはブロック(SSRF対策)
  const host = parsed.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    /^169\.254\./.test(host);
  if (blocked) {
    throw new Error("内部ネットワーク宛のURLは診断できません。");
  }
  return parsed.toString();
}

/** robots.txt / llms.txt をオリジン直下から取得 */
async function fetchOriginFile(
  origin: string,
  path: string
): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(new URL(path, origin).toString(), {}, 8000);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

/**
 * 診断対象URLおよび関連ファイル(robots.txt / llms.txt)を取得する。
 */
export async function fetchSiteData(inputUrl: string): Promise<RawSiteData> {
  const normalized = normalizeUrl(inputUrl);

  let res: Response;
  const startedAt = performance.now();
  try {
    res = await fetchWithTimeout(normalized);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("対象サイトの応答がタイムアウトしました。時間をおいて再度お試しください。");
    }
    throw new Error("対象サイトにアクセスできませんでした。URLをご確認ください。");
  }

  if (!res.ok) {
    throw new Error(
      `対象サイトからエラー応答(HTTP ${res.status})が返されました。URLをご確認ください。`
    );
  }

  const html = await res.text();
  const responseTimeMs = Math.round(performance.now() - startedAt);
  const htmlBytes = Buffer.byteLength(html, "utf8");
  const finalUrl = res.url || normalized;
  const finalParsed = new URL(finalUrl);
  const origin = finalParsed.origin;

  // レスポンスヘッダーを小文字キーで収集(X-Robots-Tag 等の判定に使用)
  const headers: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // robots.txt / llms.txt / sitemap.xml は並行取得
  const [robotsTxt, llmsTxtRaw, sitemapRaw] = await Promise.all([
    fetchOriginFile(origin, "/robots.txt"),
    fetchOriginFile(origin, "/llms.txt"),
    fetchOriginFile(origin, "/sitemap.xml"),
  ]);

  const llmsTxtFound = !!llmsTxtRaw && llmsTxtRaw.trim().length > 0;
  const sitemapFound =
    !!sitemapRaw && /<(urlset|sitemapindex)[\s>]/i.test(sitemapRaw);
  const robotsSitemapDeclared = !!robotsTxt && /^\s*sitemap\s*:/im.test(robotsTxt);

  return {
    inputUrl: normalized,
    finalUrl,
    html,
    isHttps: finalParsed.protocol === "https:",
    headers,
    responseTimeMs,
    htmlBytes,
    robotsTxt,
    llmsTxtFound,
    sitemapFound,
    robotsSitemapDeclared,
  };
}
