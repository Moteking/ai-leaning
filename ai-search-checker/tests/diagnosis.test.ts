import { describe, it, expect } from "vitest";
import * as cheerio from "cheerio";
import { analyzeStructuredData } from "../lib/diagnose/structuredData";
import { analyzeAiReadability } from "../lib/diagnose/aiReadability";
import { analyzeAiCrawler } from "../lib/diagnose/aiCrawler";
import { analyzeCrawlBasis } from "../lib/diagnose/crawlBasis";
import { analyzeBasicSeo } from "../lib/diagnose/basicSeo";
import { analyzeLlmsTxt } from "../lib/diagnose/llmsTxt";
import { analyzeHreflang } from "../lib/diagnose/hreflang";
import { analyzePageBasics } from "../lib/diagnose/pageBasics";
import { gradeFromScore } from "../lib/diagnose/scoring";
import { normalizeUrl } from "../lib/diagnose/fetchSite";

const empty = cheerio.load("<html><head></head><body></body></html>");

describe("カテゴリ配点の合計は100点", () => {
  it("各カテゴリの満点を足すと100になる", () => {
    const maxes = [
      analyzeStructuredData(empty).maxScore,
      analyzeAiReadability(empty, "").maxScore,
      analyzeAiCrawler(null).maxScore,
      analyzeCrawlBasis(empty, {}, false, false).maxScore,
      analyzeBasicSeo(empty).maxScore,
      analyzeLlmsTxt(false).maxScore,
      analyzeHreflang(empty).maxScore,
      analyzePageBasics(empty, true, 100, 1000).maxScore,
    ];
    expect(maxes.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("各カテゴリの score は 0..maxScore の範囲に収まる", () => {
    const cats = [
      analyzeStructuredData(empty),
      analyzeAiReadability(empty, ""),
      analyzeAiCrawler(null),
      analyzeCrawlBasis(empty, {}, false, false),
      analyzeBasicSeo(empty),
      analyzeLlmsTxt(false),
      analyzeHreflang(empty),
      analyzePageBasics(empty, true, 100, 1000),
    ];
    for (const c of cats) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(c.maxScore);
      expect(c.percent).toBeGreaterThanOrEqual(0);
      expect(c.percent).toBeLessThanOrEqual(100);
    }
  });
});

describe("構造化データ解析", () => {
  it("Product JSON-LD(必須充足)を検出して該当項目がOKになる", () => {
    const html = `<html><head><script type="application/ld+json">
      {"@context":"https://schema.org","@type":"Product","name":"商品X","image":"https://e/x.jpg","description":"説明"}
    </script></head><body></body></html>`;
    const $ = cheerio.load(html);
    const cat = analyzeStructuredData($);
    const product = cat.items.find((i) => i.id === "schema-product");
    expect(product?.status).toBe("ok");
    expect(cat.score).toBeGreaterThan(0);
  });

  it("JSON-LDが無ければ Product は未対応(fail)", () => {
    const cat = analyzeStructuredData(empty);
    const product = cat.items.find((i) => i.id === "schema-product");
    expect(product?.status).toBe("fail");
    expect(cat.score).toBe(0);
  });
});

describe("AIクローラー(robots.txt)解析", () => {
  it("全ブロック(Disallow: /)なら全ボットが fail でスコア0", () => {
    const cat = analyzeAiCrawler("User-agent: *\nDisallow: /");
    const bots = cat.items.filter((i) => i.id.startsWith("bot-"));
    expect(bots.every((b) => b.status === "fail")).toBe(true);
    expect(cat.score).toBe(0);
  });

  it("全許可(空Disallow)なら満点", () => {
    const cat = analyzeAiCrawler("User-agent: *\nDisallow:");
    expect(cat.score).toBe(cat.maxScore);
  });

  it("特定ボット(GPTBot)だけブロックできる", () => {
    const cat = analyzeAiCrawler("User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nDisallow:");
    const gptbot = cat.items.find((i) => i.id === "bot-gptbot");
    const oai = cat.items.find((i) => i.id === "bot-oai-searchbot");
    expect(gptbot?.status).toBe("fail");
    expect(oai?.status).toBe("ok");
  });
});

describe("インデックス基盤(noindex)", () => {
  it("meta robots の noindex を検出して fail", () => {
    const $ = cheerio.load('<html><head><meta name="robots" content="noindex"></head><body></body></html>');
    const cat = analyzeCrawlBasis($, {}, true, true);
    const noindex = cat.items.find((i) => i.id === "noindex");
    expect(noindex?.status).toBe("fail");
  });

  it("X-Robots-Tag ヘッダーの noindex も検出する", () => {
    const cat = analyzeCrawlBasis(empty, { "x-robots-tag": "noindex" }, true, true);
    const noindex = cat.items.find((i) => i.id === "noindex");
    expect(noindex?.status).toBe("fail");
  });
});

describe("グレード判定", () => {
  it("スコア帯ごとに S/A/B/C/D を返す", () => {
    expect(gradeFromScore(95)).toBe("S");
    expect(gradeFromScore(80)).toBe("A");
    expect(gradeFromScore(65)).toBe("B");
    expect(gradeFromScore(45)).toBe("C");
    expect(gradeFromScore(20)).toBe("D");
  });
});

describe("URL正規化 / SSRF対策", () => {
  it("スキームを補完する", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });
  it("httpはhttpのまま", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com/");
  });
  it("内部ネットワーク宛は拒否する", () => {
    expect(() => normalizeUrl("http://localhost")).toThrow();
    expect(() => normalizeUrl("http://127.0.0.1")).toThrow();
    expect(() => normalizeUrl("http://192.168.0.1")).toThrow();
    expect(() => normalizeUrl("http://10.0.0.5")).toThrow();
  });
  it("空入力は拒否する", () => {
    expect(() => normalizeUrl("")).toThrow();
    expect(() => normalizeUrl("   ")).toThrow();
  });
});
