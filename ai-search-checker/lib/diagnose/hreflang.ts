import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 8;

/**
 * 多言語・国際化対応の診断。満点8点。
 * - hreflang(越境EC向けの言語・地域指定): 5点
 * - html lang 属性(ページ言語の明示): 3点
 */
export function analyzeHreflang($: CheerioAPI): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  // --- hreflang (5点) ---
  const alternates = $('link[rel="alternate"][hreflang]');
  const count = alternates.length;
  const langs: string[] = [];
  alternates.each((_, el) => {
    const lang = $(el).attr("hreflang");
    if (lang) langs.push(lang);
  });
  const hasXDefault = langs.some((l) => l.toLowerCase() === "x-default");

  if (count === 0) {
    items.push({
      id: "hreflang-presence",
      label: "hreflang タグ",
      status: "warning",
      detail: "hreflang タグが見つかりませんでした。",
      advice:
        "越境ECで複数言語・地域に対応する場合は、各言語版URLを hreflang で関連付けてください。国内専売の場合は必須ではありません。",
    });
  } else if (!hasXDefault) {
    score += 4;
    items.push({
      id: "hreflang-presence",
      label: "hreflang タグ",
      status: "warning",
      detail: `hreflang を ${count} 件検出(言語: ${langs.slice(0, 6).join(", ")})。x-default が未設定です。`,
      advice:
        "どの言語にも一致しないユーザー向けに hreflang=\"x-default\" を追加すると、地域判定の精度が上がります。",
    });
  } else {
    score += 5;
    items.push({
      id: "hreflang-presence",
      label: "hreflang タグ",
      status: "ok",
      detail: `hreflang を ${count} 件検出、x-default も設定済み(言語: ${langs.slice(0, 6).join(", ")})。`,
    });
  }

  // --- html lang 属性 (3点) ---
  const htmlLang = ($("html").attr("lang") ?? "").trim();
  if (htmlLang) {
    score += 3;
    items.push({
      id: "html-lang",
      label: "html lang 属性",
      status: "ok",
      detail: `<html lang="${htmlLang}"> が設定されています。`,
    });
  } else {
    items.push({
      id: "html-lang",
      label: "html lang 属性",
      status: "fail",
      detail: "<html> に lang 属性がありません。",
      advice:
        'ページの言語を示す lang 属性(例: <html lang="ja">)を設定すると、AI・検索エンジン・読み上げが言語を正しく判定できます。',
    });
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "i18n",
    label: "多言語対応",
    description: "hreflang(越境EC)と html lang による言語・地域の明示",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
