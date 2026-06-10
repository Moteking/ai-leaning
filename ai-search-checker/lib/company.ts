// 運営会社情報と、後で差し替えるプレースホルダを集約。
// プレースホルダは [ ] で囲み、各ページから参照する。

/** 差し替えが必要なプレースホルダ(末尾の一覧表示にも使用) */
export const PLACEHOLDERS = {
  /** お問い合わせ用メールアドレス(運営会社情報・プライバシーポリシー共通) */
  contactEmail: "[お問い合わせメールアドレスを設定してください(例: info@kaaay.co.jp)]",
  /** 特商法表記の電話番号 */
  phone: "[電話番号を設定してください]",
  /** 特商法表記の支払方法(追加分) */
  paymentMethod: "[利用可能な支払方法・決済代行サービスを設定してください]",
  /** 特商法表記の支払時期 */
  paymentTiming: "[支払時期を設定してください(例: ご請求書発行後14日以内)]",
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
