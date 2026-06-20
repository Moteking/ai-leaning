// 運営会社情報と、各ページ共通の連絡先を集約。

/** 各ページ共通の連絡先 */
export const PLACEHOLDERS = {
  /** お問い合わせ用メールアドレス(運営会社情報・プライバシーポリシー・特商法表記 共通) */
  contactEmail: "info@kaaay.co.jp",
} as const;

export const COMPANY = {
  name: "株式会社KAAAY",
  representative: "代表取締役 茂木 龍二",
  representativeName: "茂木 龍二",
  postalCode: "810-0001",
  address: "福岡県福岡市中央区天神2丁目2番12号 T&Jビルディング7F",
  business: [
    "ECコンサルティング",
    "越境ECコンサルティング",
    "AI活用コンサルティング",
    "広告代理店業",
    "デザイン制作",
  ],
  corporateSite: "https://kaaay.co.jp",
} as const;

/** 制定日・最終改定日(必要に応じて更新) */
export const LEGAL_DATES = {
  established: "2026年6月10日",
  lastUpdated: "2026年6月10日",
} as const;
