import * as cheerio from "cheerio";
import { fetchSiteData } from "./fetchSite";
import { analyzeStructuredData } from "./structuredData";
import { analyzeAiCrawler } from "./aiCrawler";
import { analyzeCrawlBasis } from "./crawlBasis";
import { analyzeAiReadability } from "./aiReadability";
import { analyzeLlmsTxt } from "./llmsTxt";
import { analyzeBasicSeo } from "./basicSeo";
import { analyzeHreflang } from "./hreflang";
import { analyzePageBasics } from "./pageBasics";
import { buildSummary, gradeFromScore } from "./scoring";
import { generateReview } from "./llmReview";
import type { CategoryResult, DiagnosisResult } from "./types";

export type { DiagnosisResult, CategoryResult, DiagnosisItem, ItemStatus } from "./types";

/**
 * URLを受け取り、AI検索対応度を診断して結果を返すメイン関数。
 * @param inputUrl 診断対象URL
 * @param pageLabel ページ種別ラベル(例: サイトトップ / 商品ページ)
 */
export async function runDiagnosis(
  inputUrl: string,
  pageLabel = "サイトトップ"
): Promise<DiagnosisResult> {
  const site = await fetchSiteData(inputUrl);
  const $ = cheerio.load(site.html);

  const categories: CategoryResult[] = [
    analyzeStructuredData($),
    analyzeAiReadability($, site.html),
    analyzeAiCrawler(site.robotsTxt),
    analyzeCrawlBasis($, site.headers, site.sitemapFound, site.robotsSitemapDeclared),
    analyzeBasicSeo($),
    analyzeLlmsTxt(site.llmsTxtFound),
    analyzeHreflang($),
    analyzePageBasics($, site.isHttps, site.responseTimeMs, site.htmlBytes),
  ];

  const totalScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0)
  );
  const grade = gradeFromScore(totalScore);
  const summary = buildSummary(totalScore, grade, categories);

  const partial: Omit<DiagnosisResult, "review"> = {
    url: site.inputUrl,
    pageLabel,
    finalUrl: site.finalUrl,
    totalScore,
    grade,
    summary,
    categories,
    diagnosedAt: new Date().toISOString(),
  };

  const review = await generateReview(partial);

  return { ...partial, review };
}
