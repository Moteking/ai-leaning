import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem, ItemStatus } from "./types";

const CATEGORY_MAX = 16;

/**
 * 基本SEO(title / meta description / OGP / canonical / Twitter Card / favicon)の診断。満点16点。
 */
export function analyzeBasicSeo($: CheerioAPI): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  // --- title (6点) ---
  const title = $("head > title").first().text().trim();
  {
    let status: ItemStatus;
    let detail: string;
    let advice: string | undefined;
    if (!title) {
      status = "fail";
      detail = "title タグがありません。";
      advice =
        "ページの主題を表す title タグは検索・AI双方で最重要です。商品名やカテゴリを含む30〜60文字程度のtitleを設定してください。";
    } else if (title.length < 10 || title.length > 60) {
      status = "warning";
      detail = `title あり(${title.length}文字)。長さが推奨範囲(10〜60文字)外です。`;
      advice =
        "title は10〜60文字程度が理想です。短すぎ・長すぎは検索結果やAIの引用で省略・軽視されやすくなります。";
      score += 2.5;
    } else {
      status = "ok";
      detail = `title あり(${title.length}文字)。`;
      score += 5;
    }
    items.push({ id: "seo-title", label: "title タグ", status, detail, advice });
  }

  // --- meta description (5点) ---
  const desc = ($('meta[name="description"]').attr("content") ?? "").trim();
  {
    let status: ItemStatus;
    let detail: string;
    let advice: string | undefined;
    if (!desc) {
      status = "fail";
      detail = "meta description がありません。";
      advice =
        "meta description はAIがページ概要を把握する手がかりになります。商品・サービスの要点を80〜120文字でまとめて設定してください。";
    } else if (desc.length < 50 || desc.length > 160) {
      status = "warning";
      detail = `meta description あり(${desc.length}文字)。長さが推奨範囲(50〜160文字)外です。`;
      advice = "meta description は50〜160文字程度が目安です。要点を簡潔にまとめてください。";
      score += 2;
    } else {
      status = "ok";
      detail = `meta description あり(${desc.length}文字)。`;
      score += 4;
    }
    items.push({ id: "seo-description", label: "meta description", status, detail, advice });
  }

  // --- OGP (5点) ---
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogType = $('meta[property="og:type"]').attr("content");
  {
    const ogPresent = [ogTitle, ogImage, ogDesc, ogType].filter(Boolean).length;
    let status: ItemStatus;
    let detail: string;
    let advice: string | undefined;
    if (ogPresent === 0) {
      status = "fail";
      detail = "OGP(og:*)タグがありません。";
      advice =
        "og:title / og:image / og:description / og:type を設定すると、SNSやAIによる引用時の表示が安定します。";
    } else if (!ogTitle || !ogImage) {
      status = "warning";
      detail = `OGPの一部のみ設定(${ogPresent}項目)。og:title または og:image が不足しています。`;
      advice = "少なくとも og:title と og:image は設定してください。";
      score += 1.5;
    } else {
      status = "ok";
      detail = `OGP設定あり(${ogPresent}項目)。`;
      score += 3;
    }
    items.push({ id: "seo-ogp", label: "OGP(og:*)", status, detail, advice });
  }

  // --- canonical (4点) ---
  const canonical = $('link[rel="canonical"]').attr("href");
  {
    let status: ItemStatus;
    let detail: string;
    let advice: string | undefined;
    if (!canonical) {
      status = "warning";
      detail = "canonical タグがありません。";
      advice =
        "正規URLを示す canonical タグを設定すると、重複URLによる評価分散を防げます。ECサイトはパラメータ付きURLが多いため特に有効です。";
    } else {
      status = "ok";
      detail = "canonical タグあり。";
      score += 2;
    }
    items.push({ id: "seo-canonical", label: "canonical", status, detail, advice });
  }

  // --- Twitter Card (1点) ---
  {
    const twCard = $('meta[name="twitter:card"]').attr("content");
    if (twCard) {
      score += 1;
      items.push({
        id: "seo-twitter",
        label: "Twitter Card",
        status: "ok",
        detail: `Twitter Card 設定あり(${twCard})。`,
      });
    } else {
      items.push({
        id: "seo-twitter",
        label: "Twitter Card",
        status: "warning",
        detail: "twitter:card がありません。",
        advice:
          "twitter:card(summary_large_image 等)を設定すると、X(旧Twitter)等での共有時の表示が最適化されます。",
      });
    }
  }

  // --- favicon (1点) ---
  {
    const favicon = $(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    ).length;
    if (favicon > 0) {
      score += 1;
      items.push({
        id: "seo-favicon",
        label: "ファビコン",
        status: "ok",
        detail: "ファビコン(link rel=icon 等)が設定されています。",
      });
    } else {
      items.push({
        id: "seo-favicon",
        label: "ファビコン",
        status: "warning",
        detail: "ファビコンの指定が見当たりません。",
        advice:
          "ファビコンを設定すると、検索結果やブラウザタブでのブランド認知・信頼感が高まります。",
      });
    }
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "basicSeo",
    label: "基本SEO",
    description: "title・description・OGP・canonical などの基礎",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
