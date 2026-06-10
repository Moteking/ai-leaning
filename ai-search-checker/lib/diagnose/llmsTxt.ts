import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 4;

/**
 * llms.txt の有無を診断(満点4点)。
 * llms.txt は AI に対しサイトの要約・重要ページを伝える新興の慣習(任意)。
 */
export function analyzeLlmsTxt(llmsTxtFound: boolean): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  if (llmsTxtFound) {
    score = CATEGORY_MAX;
    items.push({
      id: "llms-txt",
      label: "llms.txt",
      status: "ok",
      detail: "オリジン直下に llms.txt を検出しました。",
    });
  } else {
    items.push({
      id: "llms-txt",
      label: "llms.txt",
      status: "fail",
      detail: "llms.txt が見つかりませんでした。",
      advice:
        "llms.txt(/llms.txt)を設置すると、AIにサイトの概要・主要カテゴリ・問い合わせ先などを構造的に伝えられます。事業概要と主要ページのリンクをMarkdownで記述して設置することをおすすめします。",
    });
  }

  return {
    id: "llmsTxt",
    label: "llms.txt 対応",
    description: "AI向けにサイト概要を伝える llms.txt の設置状況",
    score,
    maxScore: CATEGORY_MAX,
    percent: Math.round((score / CATEGORY_MAX) * 100),
    items,
  };
}
