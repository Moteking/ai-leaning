// 診断結果に関する型定義

/** 各診断項目の状態: OK / 要改善 / 未対応 */
export type ItemStatus = "ok" | "warning" | "fail";

/** 個別の診断項目 */
export interface DiagnosisItem {
  /** 項目の安定ID */
  id: string;
  /** 表示ラベル(日本語) */
  label: string;
  /** 判定結果 */
  status: ItemStatus;
  /** 観測された事実(例: 「title タグあり(42文字)」) */
  detail: string;
  /** 改善アドバイス(要改善・未対応の場合に表示) */
  advice?: string;
}

/** カテゴリ別の診断結果 */
export interface CategoryResult {
  /** カテゴリの安定ID */
  id: string;
  /** 表示ラベル(日本語) */
  label: string;
  /** カテゴリの一言説明 */
  description: string;
  /** 獲得スコア */
  score: number;
  /** カテゴリ満点 */
  maxScore: number;
  /** 0-100 に正規化したスコア(レーダーチャート用) */
  percent: number;
  /** 配下の診断項目 */
  items: DiagnosisItem[];
}

/** 診断全体の結果 */
export interface DiagnosisResult {
  /** 入力されたURL */
  url: string;
  /** このページの種別ラベル(例: サイトトップ / 商品ページ) */
  pageLabel: string;
  /** 実際に取得できた最終URL(リダイレクト後) */
  finalUrl: string;
  /** 総合スコア(0-100) */
  totalScore: number;
  /** 評価グレード S/A/B/C/D */
  grade: string;
  /** 先に見せるサマリー文(リード獲得前に表示) */
  summary: string;
  /** カテゴリ別結果 */
  categories: CategoryResult[];
  /** AIによる講評(現状はルールベース。後でLLMに差し替え可能) */
  review: string;
  /** 診断日時(ISO文字列) */
  diagnosedAt: string;
}

/** 解析に必要な生データ一式 */
export interface RawSiteData {
  /** 入力URL */
  inputUrl: string;
  /** 最終URL */
  finalUrl: string;
  /** ページHTML */
  html: string;
  /** HTTPSか */
  isHttps: boolean;
  /** レスポンスヘッダー(小文字キー) */
  headers: Record<string, string>;
  /** メインHTML取得にかかった時間(ms) */
  responseTimeMs: number;
  /** HTMLのバイトサイズ */
  htmlBytes: number;
  /** robots.txt の本文(取得失敗時は null) */
  robotsTxt: string | null;
  /** llms.txt が存在し中身があるか */
  llmsTxtFound: boolean;
  /** sitemap.xml が取得できたか(/sitemap.xml への直接アクセス) */
  sitemapFound: boolean;
  /** robots.txt 内に Sitemap: 行が宣言されているか */
  robotsSitemapDeclared: boolean;
}
