import type { CategoryResult, DiagnosisItem } from "./types";

/** robots.txt の1グループ(User-agent と紐づくルール) */
interface RobotsGroup {
  agents: string[];
  rules: { allow: boolean; path: string }[];
}

/** robots.txt をグループ単位でパース */
function parseRobots(txt: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;

  const lines = txt.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === "user-agent") {
      // 連続する user-agent 行は同一グループに属する
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === "disallow" || field === "allow") {
      if (!current) {
        current = { agents: ["*"], rules: [] };
        groups.push(current);
      }
      current.rules.push({ allow: field === "allow", path: value });
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

/**
 * 指定UAについて、トップページ "/" がブロックされているか判定する。
 * 具体UAのグループを優先し、無ければ "*" グループにフォールバック。
 */
function isBlocked(groups: RobotsGroup[], userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  const specific = groups.find((g) => g.agents.includes(ua));
  const wildcard = groups.find((g) => g.agents.includes("*"));
  const group = specific ?? wildcard;
  if (!group) return false; // ルールなし = 許可

  // "/" に対する最長一致でAllow/Disallowを評価
  let decision: { allow: boolean; len: number } | null = null;
  for (const rule of group.rules) {
    if (rule.path === "") {
      // 空の Disallow は「全許可」、空の Allow は無視
      if (!rule.allow) {
        if (!decision || decision.len <= 0) decision = { allow: true, len: 0 };
      }
      continue;
    }
    // "/" にマッチするか(先頭一致)
    if ("/".startsWith(rule.path) || rule.path === "/" || rule.path === "/*") {
      const len = rule.path.length;
      if (!decision || len >= decision.len) {
        decision = { allow: rule.allow, len };
      }
    }
  }
  if (!decision) return false;
  return !decision.allow;
}

const BOTS: { id: string; name: string; label: string; note: string }[] = [
  {
    id: "gptbot",
    name: "GPTBot",
    label: "GPTBot(ChatGPT検索)",
    note: "OpenAI / ChatGPT の検索・学習クローラー",
  },
  {
    id: "claudebot",
    name: "ClaudeBot",
    label: "ClaudeBot(Claude)",
    note: "Anthropic Claude のクローラー",
  },
  {
    id: "perplexitybot",
    name: "PerplexityBot",
    label: "PerplexityBot(Perplexity)",
    note: "Perplexity AI の検索クローラー",
  },
  {
    id: "google-extended",
    name: "Google-Extended",
    label: "Google-Extended(Google AI)",
    note: "Google の生成AI(Gemini / AI Overview)向けトークン",
  },
];

const CATEGORY_MAX = 20;
const PER_BOT = CATEGORY_MAX / BOTS.length; // 5点ずつ

/**
 * AIクローラー対応の診断。
 * robots.txt で主要なAIクローラーがブロックされていないかを確認(満点20点)。
 */
export function analyzeAiCrawler(robotsTxt: string | null): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  if (robotsTxt === null) {
    // robots.txt が無い = 制限なし(全クローラー許可とみなす)
    items.push({
      id: "robots-presence",
      label: "robots.txt",
      status: "warning",
      detail: "robots.txt が見つかりませんでした(クローラーは制限されていません)。",
      advice:
        "AIクローラーはブロックされていないため診断上は問題ありませんが、意図したクロール制御のために robots.txt の設置を検討してください。",
    });
    for (const bot of BOTS) {
      score += PER_BOT;
      items.push({
        id: `bot-${bot.id}`,
        label: bot.label,
        status: "ok",
        detail: "ブロックされていません(robots.txt 不在のため許可)。",
      });
    }
    return buildCategory(items, score);
  }

  const groups = parseRobots(robotsTxt);
  items.push({
    id: "robots-presence",
    label: "robots.txt",
    status: "ok",
    detail: "robots.txt を検出しました。",
  });

  for (const bot of BOTS) {
    const blocked = isBlocked(groups, bot.name);
    if (blocked) {
      items.push({
        id: `bot-${bot.id}`,
        label: bot.label,
        status: "fail",
        detail: `robots.txt でブロックされています(${bot.note})。`,
        advice: `${bot.name} がトップページをクロールできません。AI検索に表示させたい場合は robots.txt の Disallow 設定を見直してください。`,
      });
    } else {
      score += PER_BOT;
      items.push({
        id: `bot-${bot.id}`,
        label: bot.label,
        status: "ok",
        detail: "ブロックされていません(クロール可能)。",
      });
    }
  }

  return buildCategory(items, score);
}

function buildCategory(items: DiagnosisItem[], score: number): CategoryResult {
  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "aiCrawler",
    label: "AIクローラー対応",
    description: "AI検索のクローラー(GPTBot等)がブロックされていないか",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
