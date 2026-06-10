import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 14;

/** body の可視テキスト量を概算(script/style を除外し空白を圧縮) */
function visibleTextLength($: CheerioAPI): number {
  const body = $("body").clone();
  body.find("script, style, noscript, template, svg").remove();
  const text = body.text().replace(/\s+/g, " ").trim();
  return text.length;
}

/**
 * AI可読性の診断(満点14点)。
 * AIクローラーの多くはJSを実行しないため、サーバーから返るHTMLに本文があるかが重要。
 */
export function analyzeAiReadability($: CheerioAPI, html: string): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  const textLen = visibleTextLength($);
  const scriptCount = $("script").length;
  // SSR/ハイドレーションの痕跡(これらがあれば本文がHTMLに含まれる可能性が高い)
  const hasSsrMarkers =
    /__NEXT_DATA__|data-server-rendered|data-reactroot|__NUXT__|window\.__INITIAL/i.test(
      html
    );

  // --- レンダリング方式(JS依存)(5点) ---
  if (textLen < 400 && scriptCount >= 3 && !hasSsrMarkers) {
    items.push({
      id: "rendering",
      label: "レンダリング方式(JS依存)",
      status: "fail",
      detail: `取得HTMLの本文が極端に少なく(約${textLen}文字)、JavaScriptで描画するSPA構成の可能性が高いです。`,
      advice:
        "GPTBotやCommon CrawlなどAIクローラーの多くはJavaScriptを実行しません。クライアントサイドレンダリングのみだとAIに本文が見えず、AI検索でほぼ評価されません。SSR(サーバーサイドレンダリング)や静的化、プリレンダリングの導入を強く推奨します。",
    });
  } else if (textLen < 400) {
    score += 2.5;
    items.push({
      id: "rendering",
      label: "レンダリング方式(JS依存)",
      status: "warning",
      detail: `取得HTMLの本文が少なめです(約${textLen}文字)。`,
      advice:
        "AIクローラーはJSを実行しない前提で、サーバーから返すHTMLに主要な本文・商品情報が含まれているか確認してください。",
    });
  } else {
    score += 5;
    items.push({
      id: "rendering",
      label: "レンダリング方式(JS依存)",
      status: "ok",
      detail: `取得HTMLに十分な本文が含まれています(約${textLen}文字${hasSsrMarkers ? "、SSRの痕跡あり" : ""})。`,
    });
  }

  // --- 本文テキスト量(3点) ---
  if (textLen >= 1500) {
    score += 3;
    items.push({
      id: "text-amount",
      label: "本文テキスト量",
      status: "ok",
      detail: `AIが内容を理解するのに十分な本文量です(約${textLen}文字)。`,
    });
  } else if (textLen >= 500) {
    score += 1.5;
    items.push({
      id: "text-amount",
      label: "本文テキスト量",
      status: "warning",
      detail: `本文がやや少なめです(約${textLen}文字)。`,
      advice:
        "商品説明・特徴・利用シーンなど、AIが引用できるテキスト情報を充実させると、AI検索での露出が高まります。",
    });
  } else {
    items.push({
      id: "text-amount",
      label: "本文テキスト量",
      status: "fail",
      detail: `本文テキストがほとんどありません(約${textLen}文字)。`,
      advice:
        "AIが引用できる本文がほぼない状態です。商品・サービスの説明テキストをHTML内に十分に含めてください。",
    });
  }

  // --- 見出し(h1)(2点) ---
  const h1Count = $("h1").length;
  if (h1Count === 1) {
    score += 2;
    items.push({
      id: "h1",
      label: "見出し(h1)",
      status: "ok",
      detail: "h1 が1つ適切に設定されています。",
    });
  } else if (h1Count === 0) {
    items.push({
      id: "h1",
      label: "見出し(h1)",
      status: "fail",
      detail: "h1 見出しがありません。",
      advice:
        "ページの主題を示す h1 を1つ設定してください。AI・検索エンジンがページの主題を把握する重要な手がかりです。",
    });
  } else {
    score += 1;
    items.push({
      id: "h1",
      label: "見出し(h1)",
      status: "warning",
      detail: `h1 が ${h1Count} 個あります(1つが理想)。`,
      advice: "h1 はページの主題を表す1つに絞ると、構造が明確になり理解されやすくなります。",
    });
  }

  // --- 見出し階層(h2)(1点) ---
  const h2Count = $("h2").length;
  if (h2Count >= 1) {
    score += 1;
    items.push({
      id: "headings",
      label: "見出し階層(h2)",
      status: "ok",
      detail: `h2 見出しを ${h2Count} 個検出しました。`,
    });
  } else {
    items.push({
      id: "headings",
      label: "見出し階層(h2)",
      status: "warning",
      detail: "h2 見出しが見当たりません。",
      advice:
        "h2 などで内容を見出し分けすると、AIがセクション単位で内容を理解・引用しやすくなります。",
    });
  }

  // --- 画像 alt(2点) ---
  const imgs = $("img");
  const imgCount = imgs.length;
  if (imgCount === 0) {
    score += 1;
    items.push({
      id: "img-alt",
      label: "画像の代替テキスト(alt)",
      status: "warning",
      detail: "img 要素が検出されませんでした(画像なし、または遅延読み込み)。",
    });
  } else {
    let withAlt = 0;
    imgs.each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt !== undefined && alt.trim() !== "") withAlt++;
    });
    const ratio = withAlt / imgCount;
    if (ratio >= 0.8) {
      score += 2;
      items.push({
        id: "img-alt",
        label: "画像の代替テキスト(alt)",
        status: "ok",
        detail: `画像の ${Math.round(ratio * 100)}% に alt が設定されています(${withAlt}/${imgCount})。`,
      });
    } else if (ratio >= 0.4) {
      score += 1;
      items.push({
        id: "img-alt",
        label: "画像の代替テキスト(alt)",
        status: "warning",
        detail: `alt の設定率が ${Math.round(ratio * 100)}% です(${withAlt}/${imgCount})。`,
        advice:
          "商品画像に alt を付けると、AIや画像検索が画像の内容を理解できます。商品名や特徴を簡潔に記述してください。",
      });
    } else {
      items.push({
        id: "img-alt",
        label: "画像の代替テキスト(alt)",
        status: "fail",
        detail: `alt の設定率が ${Math.round(ratio * 100)}% と低い状態です(${withAlt}/${imgCount})。`,
        advice:
          "多くの画像に alt がありません。特に商品画像には alt を設定し、内容をテキストでも伝えてください。",
      });
    }
  }

  // --- 鮮度(更新日時)(1点) ---
  const hasModified =
    $('meta[property="article:modified_time"]').length > 0 ||
    $("time[datetime]").length > 0 ||
    /"dateModified"/.test(html);
  if (hasModified) {
    score += 1;
    items.push({
      id: "freshness",
      label: "更新日時(鮮度)",
      status: "ok",
      detail: "更新日時を示す情報(dateModified / time 等)を検出しました。",
    });
  } else {
    items.push({
      id: "freshness",
      label: "更新日時(鮮度)",
      status: "warning",
      detail: "更新日時を示す情報が見当たりません。",
      advice:
        "更新日時(dateModified など)を明示すると、AIが情報の鮮度を判断しやすくなり、最新情報として引用されやすくなります。",
    });
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "aiReadability",
    label: "AI可読性",
    description: "JSなしでも本文が読めるか・見出し・代替テキスト等の内容の伝わりやすさ",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
