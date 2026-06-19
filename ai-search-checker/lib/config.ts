// サイト全体の差し替え可能な設定値

/** 本番の公開URL(sitemap / robots / OGP の絶対URL生成に使用) */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** 「専門家による無料相談」CTAのリンク先(後で差し替え可能) */
export const CONSULT_CTA_URL =
  process.env.NEXT_PUBLIC_CONSULT_CTA_URL || "https://kaaay.co.jp";

/** Google Analytics 4 の測定ID(設定された場合のみ計測タグを読み込む) */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/** サービス名 */
export const SERVICE_NAME = "AI検索対応診断";

/** 運営者表記(フッターのコピーライト用) */
export const PROVIDER_NAME = "株式会社KAAAY";
