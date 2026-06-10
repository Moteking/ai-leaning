import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 10;

/**
 * ページ表示の基本(HTTPS・モバイル viewport)の診断。満点10点。
 */
export function analyzePageBasics($: CheerioAPI, isHttps: boolean): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  // --- HTTPS (5点) ---
  if (isHttps) {
    score += 5;
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

  // --- viewport (5点) ---
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport && /width\s*=\s*device-width/i.test(viewport)) {
    score += 5;
    items.push({
      id: "viewport",
      label: "モバイル viewport",
      status: "ok",
      detail: "viewport(width=device-width)が設定されています。",
    });
  } else if (viewport) {
    score += 2.5;
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
