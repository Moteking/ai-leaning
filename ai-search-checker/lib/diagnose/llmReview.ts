import type { CategoryResult, DiagnosisResult } from "./types";

/**
 * AIによる講評文を生成する。
 *
 * 現状は外部APIキー不要のルールベース実装。
 * 後から OpenAI / Anthropic 等のLLMに差し替えられるよう、
 * 「結果を受け取り講評文(string)を返す非同期関数」というインターフェースに統一している。
 *
 * 差し替え例:
 *   const review = await generateReview(partialResult);
 *   ↓ 環境変数 LLM_API_KEY があればLLM呼び出しに分岐、なければルールベース、など。
 */
export async function generateReview(
  result: Omit<DiagnosisResult, "review">
): Promise<string> {
  // 将来的な分岐ポイント(現状は常にルールベース)
  // if (process.env.LLM_API_KEY) return generateReviewWithLlm(result);
  return generateRuleBasedReview(result);
}

/** ルールベースの講評文生成 */
function generateRuleBasedReview(
  result: Omit<DiagnosisResult, "review">
): string {
  const { totalScore, grade, categories } = result;
  const lines: string[] = [];

  lines.push(
    `貴社サイトのAI検索対応度は ${totalScore}点(グレード${grade})と診断されました。`
  );

  // 強み
  const ok = categories.filter((c) => c.percent >= 80);
  if (ok.length > 0) {
    lines.push(
      `強みとして、${ok
        .map((c) => `「${c.label}」`)
        .join("・")}が良好に整備されています。`
    );
  }

  // 課題(配点が高く、達成率が低いものを優先)
  const weak = [...categories]
    .filter((c) => c.percent < 70)
    .sort((a, b) => a.percent / 100 - b.percent / 100 || b.maxScore - a.maxScore);

  if (weak.length === 0) {
    lines.push(
      "大きな弱点は見当たりません。現状を維持しつつ、構造化データの拡充でさらに優位性を高められます。"
    );
  } else {
    const top = weak.slice(0, 3);
    lines.push(
      `優先的に取り組むべき領域は ${top
        .map((c) => `「${c.label}」`)
        .join("・")}です。`
    );
    lines.push(...top.map((c) => "・" + categoryAdvice(c)));
  }

  lines.push(
    "AI検索(ChatGPT検索・Perplexity・Google AI Overview)は構造化データとクローラー許可を特に重視します。" +
      "まずは商品ページのJSON-LD整備と、AIクローラーのブロック解除から着手することをおすすめします。"
  );

  return lines.join("\n");
}

/** カテゴリ単位の要約アドバイス */
function categoryAdvice(c: CategoryResult): string {
  switch (c.id) {
    case "structuredData":
      return `${c.label}: Product / Offer / AggregateRating など主要スキーマをJSON-LDで実装し、必須プロパティを揃えましょう。`;
    case "aiCrawler":
      return `${c.label}: robots.txt でAIクローラー(GPTBot等)をブロックしていないか確認し、必要に応じて許可しましょう。`;
    case "llmsTxt":
      return `${c.label}: /llms.txt を設置し、サイト概要と主要ページをAIに伝えましょう。`;
    case "basicSeo":
      return `${c.label}: title・meta description・OGP・canonical を適切な長さ・内容で整備しましょう。`;
    case "hreflang":
      return `${c.label}: 越境ECなら hreflang と x-default で言語・地域を明示しましょう。`;
    case "pageBasics":
      return `${c.label}: HTTPS化とモバイル viewport の設定を確認しましょう。`;
    default:
      return `${c.label}: 改善の余地があります。`;
  }
}
