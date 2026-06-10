import type { CategoryResult } from "./types";

/** 総合スコアからグレード(S/A/B/C/D)を算出 */
export function gradeFromScore(score: number): string {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

/** グレードに対応する短い評価ラベル */
export function gradeLabel(grade: string): string {
  switch (grade) {
    case "S":
      return "AI検索に非常によく対応できています";
    case "A":
      return "AI検索への対応は良好です";
    case "B":
      return "対応の基礎はあるが改善余地が大きい";
    case "C":
      return "重要な対応が複数不足しています";
    default:
      return "AI検索対応はこれからの状態です";
  }
}

/** カテゴリ結果から先出しサマリー文を生成 */
export function buildSummary(
  totalScore: number,
  grade: string,
  categories: CategoryResult[]
): string {
  // 最も点数比率が低いカテゴリを「優先改善ポイント」として挙げる
  const sorted = [...categories].sort(
    (a, b) => a.score / a.maxScore - b.score / b.maxScore
  );
  const weakest = sorted.slice(0, 2).map((c) => c.label);
  const strongest = [...categories].sort(
    (a, b) => b.score / b.maxScore - a.score / a.maxScore
  )[0];

  return (
    `総合スコアは ${totalScore}点(グレード${grade})です。${gradeLabel(grade)}。` +
    `特に「${strongest.label}」は良好な一方、` +
    `「${weakest.join("」「")}」に改善の余地があります。` +
    `詳細レポートでは項目ごとの具体的な改善アドバイスをご確認いただけます。`
  );
}
