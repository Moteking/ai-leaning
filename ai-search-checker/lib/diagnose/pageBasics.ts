import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 8;

/**
 * ページ表示の基本(HTTPS・モバイル viewport・charset・応答速度)の診断。満点8点。
 */
export function analyzePageBasics(
  $: CheerioAPI,
  isHttps: boolean,
  responseTimeMs: number,
  htmlBytes: number
): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  // --- HTTPS (3点) ---
  if (isHttps) {
    score += 3;
    items.push({
      id: "https",
      label: "HTTPS",
      status: "ok",
      detail: "HTTPSで配信されています。",
    });
  } else {
    items.push({
      id: "https",
      label: "HTTPS",
      status: "fail",
      detail: "HTTPSではありません(http接続)。",
      advice:
        "HTTPSはセキュリティと検索評価の前提条件です。SSL証明書を導入し、サイト全体をHTTPS化してください。",
    });
  }

  // --- viewport (2点) ---
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport && /width\s*=\s*device-width/i.test(viewport)) {
    score += 2;
    items.push({
      id: "viewport",
      label: "モバイル viewport",
      status: "ok",
      detail: "viewport(width=device-width)が設定されています。",
    });
  } else if (viewport) {
    score += 1;
    items.push({
      id: "viewport",
      label: "モバイル viewport",
      status: "warning",
      detail: "viewport はありますが width=device-width が含まれていません。",
      advice:
        'モバイル表示の最適化のため、viewport に "width=device-width, initial-scale=1" を設定してください。',
    });
  } else {
    items.push({
      id: "viewport",
      label: "モバイル viewport",
      status: "fail",
      detail: "viewport メタタグがありません。",
      advice:
        'スマホ表示が崩れる原因になります。<meta name="viewport" content="width=device-width, initial-scale=1"> を追加してください。',
    });
  }

  // --- charset (1点) ---
  const charsetMeta =
    $("meta[charset]").attr("charset") ||
    $('meta[http-equiv="Content-Type" i]').attr("content");
  if (charsetMeta) {
    score += 1;
    items.push({
      id: "charset",
      label: "文字コード(charset)",
      status: "ok",
      detail: "charset の指定があります。",
    });
  } else {
    items.push({
      id: "charset",
      label: "文字コード(charset)",
      status: "warning",
      detail: "charset の指定が見当たりません。",
      advice:
        '<meta charset="utf-8"> を <head> の先頭付近に指定すると、文字化けを防ぎAIも正しくテキストを取得できます。',
    });
  }

  // --- 応答速度 / HTMLサイズ (2点) ---
  {
    const kb = Math.round(htmlBytes / 1024);
    let status: "ok" | "warning" | "fail";
    let detail: string;
    let advice: string | undefined;
    if (responseTimeMs <= 1200) {
      score += 2;
      status = "ok";
      detail = `初回HTML応答が高速です(約${responseTimeMs}ms / ${kb}KB)。`;
    } else if (responseTimeMs <= 3000) {
      score += 1;
      status = "warning";
      detail = `初回HTML応答にやや時間がかかっています(約${responseTimeMs}ms / ${kb}KB)。`;
      advice =
        "サーバー応答(TTFB)が遅いと、クローラーのクロール効率やユーザー体験に影響します。キャッシュ・CDN・サーバー最適化を検討してください。";
    } else {
      status = "fail";
      detail = `初回HTML応答が遅い状態です(約${responseTimeMs}ms / ${kb}KB)。`;
      advice =
        "サーバー応答が3秒超と遅く、クロール効率・離脱率に悪影響です。CDN導入やサーバー・DBの最適化を強く推奨します。";
    }
    items.push({ id: "performance", label: "応答速度(初回HTML)", status, detail, advice });
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "pageBasics",
    label: "ページ表示の基本",
    description: "HTTPS・モバイル対応などの基礎的な品質",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
