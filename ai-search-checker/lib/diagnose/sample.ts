import type { DiagnosisResult } from "./types";

/**
 * 「サンプル結果を見る」用のデモ診断データ。
 * 実在サイトを叩かず、入力不要で診断結果の見え方を体験してもらうためのもの。
 * 実際の診断ロジックの出力形式(8カテゴリ・合計100点)に合わせている。
 */
export const SAMPLE_RESULT: DiagnosisResult = {
  url: "https://example-shop.jp",
  pageLabel: "サイトトップ",
  finalUrl: "https://example-shop.jp/",
  totalScore: 58,
  grade: "C",
  summary:
    "基本的なSEOとモバイル対応はできていますが、AI検索で最も重視される「構造化データ」と「AIクローラー対応」に伸びしろがあります。商品情報をAIが正しく理解できる形にすると、ChatGPTやPerplexityの回答に引用される可能性が高まります。",
  categories: [
    {
      id: "structuredData",
      label: "構造化データ",
      description: "JSON-LDによる商品・評価・FAQなどの構造化(AI検索が最も重視)",
      score: 9,
      maxScore: 24,
      percent: 38,
      items: [
        {
          id: "ld-product",
          label: "Product 構造化データ",
          status: "fail",
          detail: "商品のJSON-LD(Product)が見つかりませんでした。",
          advice:
            "商品名・価格・在庫・ブランドを Product スキーマで記述すると、AIが商品を正確に認識できます。",
        },
        {
          id: "ld-aggregaterating",
          label: "レビュー(AggregateRating)",
          status: "fail",
          detail: "レビュー評価の構造化データがありません。",
          advice: "星評価・件数を AggregateRating で記述すると信頼性の根拠として引用されやすくなります。",
        },
        {
          id: "ld-organization",
          label: "Organization",
          status: "ok",
          detail: "運営者情報(Organization)のJSON-LDを確認しました。",
        },
      ],
    },
    {
      id: "aiReadability",
      label: "AI可読性",
      description: "JSなしでも本文が読めるか・見出し・代替テキスト等の内容の伝わりやすさ",
      score: 9,
      maxScore: 14,
      percent: 64,
      items: [
        {
          id: "csr",
          label: "JavaScriptなしでの本文表示",
          status: "warning",
          detail: "一部の本文がJavaScript実行後に表示される構成です。",
          advice: "主要な商品説明はHTMLに直接出力すると、AIクローラーが確実に読み取れます。",
        },
        {
          id: "headings",
          label: "見出し構造(h1/h2)",
          status: "ok",
          detail: "h1・h2 が適切に使われています。",
        },
      ],
    },
    {
      id: "aiCrawler",
      label: "AIクローラー対応",
      description: "AI検索のクローラー(OAI-SearchBot等)がブロックされていないか",
      score: 8,
      maxScore: 16,
      percent: 50,
      items: [
        {
          id: "oai-searchbot",
          label: "OAI-SearchBot(ChatGPT検索)",
          status: "warning",
          detail: "robots.txt に明示的な許可がありません。",
          advice: "OAI-SearchBot を Allow にしておくと、ChatGPT検索からの参照が確実になります。",
        },
        {
          id: "perplexitybot",
          label: "PerplexityBot(Perplexity)",
          status: "ok",
          detail: "ブロックされていません。",
        },
      ],
    },
    {
      id: "crawlBasis",
      label: "インデックス基盤",
      description: "noindex の有無とサイトマップによるクロール発見性",
      score: 7,
      maxScore: 10,
      percent: 70,
      items: [
        {
          id: "noindex",
          label: "noindex の有無",
          status: "ok",
          detail: "noindex は設定されていません(検索に表示可能)。",
        },
        {
          id: "sitemap",
          label: "サイトマップ",
          status: "warning",
          detail: "sitemap.xml は確認できましたが robots.txt 内で宣言されていません。",
          advice: "robots.txt に Sitemap: 行を追加するとクローラーが発見しやすくなります。",
        },
      ],
    },
    {
      id: "basicSeo",
      label: "基本SEO",
      description: "title・description・OGP・canonical などの基礎",
      score: 13,
      maxScore: 16,
      percent: 81,
      items: [
        { id: "seo-title", label: "title タグ", status: "ok", detail: "title あり(38文字)。" },
        {
          id: "seo-description",
          label: "meta description",
          status: "ok",
          detail: "description あり(112文字)。",
        },
        {
          id: "seo-ogp",
          label: "OGP(og:*)",
          status: "warning",
          detail: "og:image が未設定です。",
          advice: "SNSシェア時のサムネイル用に og:image を設定しましょう。",
        },
      ],
    },
    {
      id: "llmsTxt",
      label: "llms.txt 対応",
      description: "AI向けにサイト概要を伝える llms.txt の設置状況",
      score: 0,
      maxScore: 4,
      percent: 0,
      items: [
        {
          id: "llms-txt",
          label: "llms.txt",
          status: "fail",
          detail: "/llms.txt が見つかりませんでした。",
          advice: "サイト概要と主要URLを記した llms.txt を設置すると、AIが全体像を把握しやすくなります。",
        },
      ],
    },
    {
      id: "i18n",
      label: "多言語対応",
      description: "hreflang(越境EC)と html lang による言語・地域の明示",
      score: 4,
      maxScore: 8,
      percent: 50,
      items: [
        {
          id: "html-lang",
          label: "html lang 属性",
          status: "ok",
          detail: 'lang="ja" を確認しました。',
        },
        {
          id: "hreflang",
          label: "hreflang",
          status: "warning",
          detail: "hreflang は未設定です。",
          advice: "越境ECで多言語展開する場合は hreflang で言語・地域を明示しましょう。",
        },
      ],
    },
    {
      id: "pageBasics",
      label: "ページ表示の基本",
      description: "HTTPS・モバイル対応などの基礎的な品質",
      score: 8,
      maxScore: 8,
      percent: 100,
      items: [
        { id: "https", label: "HTTPS", status: "ok", detail: "HTTPSで配信されています。" },
        {
          id: "viewport",
          label: "モバイル対応(viewport)",
          status: "ok",
          detail: "viewport が設定されています。",
        },
      ],
    },
  ],
  review:
    "総合58点(グレードC)。土台はできていますが、AI検索で最重要の「構造化データ」が38%にとどまっているのが最大の改善ポイントです。\n特に商品(Product)と評価(AggregateRating)のJSON-LDを実装すると、AIが商品を具体的に理解し、回答内で引用しやすくなります。\nあわせて OAI-SearchBot の許可と llms.txt の設置を行うと、ChatGPT検索・Perplexityでの露出が一段と高まる見込みです。",
  diagnosedAt: "2026-01-01T00:00:00.000Z",
};
