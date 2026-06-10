import * as cheerio from "cheerio";
import { fetchSiteData } from "./fetchSite";
import { analyzeStructuredData } from "./structuredData";
import { analyzeAiCrawler } from "./aiCrawler";
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
 */
export async function runDiagnosis(inputUrl: string): Promise<DiagnosisResult> {
  const site = await fetchSiteData(inputUrl);
  const $ = cheerio.load(site.html);

  const categories: CategoryResult[] = [
    analyzeStructuredData($),
    analyzeAiCrawler(site.robotsTxt),
    analyzeLlmsTxt(site.llmsTxtFound),
    analyzeBasicSeo($),
    analyzeHreflang($),
    analyzePageBasics($, site.isHttps),
  ];

  const totalScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0)
  );
  const grade = gradeFromScore(totalScore);
  const summary = buildSummary(totalScore, grade, categories);

  const partial: Omit<DiagnosisResult, "review"> = {
    url: site.inputUrl,
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
