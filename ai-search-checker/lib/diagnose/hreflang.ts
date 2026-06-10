import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 10;

/**
 * 多言語対応(hreflang)の診断。満点10点。越境EC向けの指標。
 */
export function analyzeHreflang($: CheerioAPI): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

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
    score += 8;
    items.push({
      id: "hreflang-presence",
      label: "hreflang タグ",
      status: "warning",
      detail: `hreflang を ${count} 件検出(言語: ${langs.slice(0, 6).join(", ")})。x-default が未設定です。`,
      advice:
        "どの言語にも一致しないユーザー向けに hreflang=\"x-default\" を追加すると、地域判定の精度が上がります。",
    });
  } else {
    score += CATEGORY_MAX;
    items.push({
      id: "hreflang-presence",
      label: "hreflang タグ",
      status: "ok",
      detail: `hreflang を ${count} 件検出、x-default も設定済み(言語: ${langs.slice(0, 6).join(", ")})。`,
    });
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "hreflang",
    label: "多言語対応",
    description: "越境EC向けの hreflang による言語・地域指定",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
