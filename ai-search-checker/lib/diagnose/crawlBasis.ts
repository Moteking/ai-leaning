import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem } from "./types";

const CATEGORY_MAX = 10;

/**
 * インデックス可否・クロール基盤の診断(満点10点)。
 * - meta robots / X-Robots-Tag による noindex(検索・AI双方で致命的)
 * - sitemap.xml の有無(/sitemap.xml と robots.txt の Sitemap: 宣言)
 */
export function analyzeCrawlBasis(
  $: CheerioAPI,
  headers: Record<string, string>,
  sitemapFound: boolean,
  robotsSitemapDeclared: boolean
): CategoryResult {
  const items: DiagnosisItem[] = [];
  let score = 0;

  // --- noindex 判定 (5点) ---
  const metaRobots = ($('meta[name="robots"]').attr("content") ?? "").toLowerCase();
  const metaGooglebot = ($('meta[name="googlebot"]').attr("content") ?? "").toLowerCase();
  const xRobots = (headers["x-robots-tag"] ?? "").toLowerCase();
  const noindexSources: string[] = [];
  if (/\bnoindex\b/.test(metaRobots)) noindexSources.push("meta robots");
  if (/\bnoindex\b/.test(metaGooglebot)) noindexSources.push("meta googlebot");
  if (/\bnoindex\b/.test(xRobots)) noindexSources.push("X-Robots-Tag ヘッダー");

  if (noindexSources.length > 0) {
    items.push({
      id: "noindex",
      label: "インデックス可否(noindex)",
      status: "fail",
      detail: `noindex が指定されています(${noindexSources.join(" / ")})。検索・AI検索の対象から除外されます。`,
      advice:
        "意図しない noindex はサイトを検索・AIから完全に見えなくします。トップ/主要ページの noindex 指定を直ちに見直してください(テスト環境の設定残りに注意)。",
    });
  } else {
    score += 5;
    items.push({
      id: "noindex",
      label: "インデックス可否(noindex)",
      status: "ok",
      detail: "noindex は指定されていません(インデックス可能)。",
    });
  }

  // 参考: noai / noimageai(学習拒否系)を情報として表示
  const noai = /\bnoai\b/.test(metaRobots) || /\bnoai\b/.test(xRobots);
  if (noai) {
    items.push({
      id: "noai",
      label: "AI利用ディレクティブ(noai)",
      status: "warning",
      detail: "noai が指定されています(AIによる利用を拒否する意思表示)。",
      advice:
        "AI検索に積極的に表示させたい場合は noai の指定を外すことを検討してください(意図的な設定なら問題ありません)。",
    });
  }

  // --- sitemap.xml (5点: 直接 3点 + robots宣言 2点) ---
  if (sitemapFound) {
    score += 3;
    items.push({
      id: "sitemap-xml",
      label: "sitemap.xml",
      status: "ok",
      detail: "/sitemap.xml を検出しました(クロール発見性が良好)。",
    });
  } else {
    items.push({
      id: "sitemap-xml",
      label: "sitemap.xml",
      status: "warning",
      detail: "/sitemap.xml が見つかりませんでした。",
      advice:
        "XMLサイトマップを設置すると、クローラーが全商品・全カテゴリページを効率的に発見できます。ECは商品数が多いため特に効果的です。",
    });
  }

  if (robotsSitemapDeclared) {
    score += 2;
    items.push({
      id: "robots-sitemap",
      label: "robots.txt のSitemap宣言",
      status: "ok",
      detail: "robots.txt に Sitemap: 行が宣言されています。",
    });
  } else {
    items.push({
      id: "robots-sitemap",
      label: "robots.txt のSitemap宣言",
      status: "warning",
      detail: "robots.txt に Sitemap: 行がありません。",
      advice:
        "robots.txt に `Sitemap: https://example.com/sitemap.xml` を記載すると、クローラーがサイトマップを確実に発見できます。",
    });
  }

  const rounded = Math.round(Math.min(score, CATEGORY_MAX));
  return {
    id: "crawlBasis",
    label: "インデックス基盤",
    description: "noindex の有無とサイトマップによるクロール発見性",
    score: rounded,
    maxScore: CATEGORY_MAX,
    percent: Math.round((rounded / CATEGORY_MAX) * 100),
    items,
  };
}
