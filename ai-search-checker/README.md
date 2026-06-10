# AI検索対応診断(ai-search-checker)

EC事業者向けの無料Webサービス。ECサイトのURLを入力すると、AI検索(ChatGPT検索 / Perplexity / Google AI Overview)と通常検索への対応度を自動診断し、スコアとレポートを表示するリード獲得用ツールです。

## 主な機能

- URL入力 → サーバーサイドでHTMLを取得・解析し、AI検索対応度を **100点満点** で診断
- **商品ページURLの追加診断(任意)**: サイトトップに加え商品ページURLを指定すると、商品ページに実装される Product / Offer / レビュー系スキーマも評価し、ページ別にタブで結果を表示
- 総合スコア・サマリーを先に表示し、**詳細レポートは会社名・メール入力(リード獲得)後に開示**
- カテゴリ別スコアを **レーダーチャート** で可視化
- 各項目を **OK / 要改善 / 未対応** の3段階で表示し、改善アドバイスを日本語で提示
- リード情報(会社名・メール・URL・スコア・日時)を **ローカルSQLite** に保存(差し替え可能な構成)

## 診断カテゴリと配点(合計100点)

| カテゴリ | 配点 | 内容 |
| --- | --- | --- |
| 構造化データ | 24 | JSON-LDの有無、Product / Offer / AggregateRating / Review / FAQPage / BreadcrumbList / Organization / WebSite+SearchAction / ItemList の有無と必須・推奨プロパティ(商品識別子・送料・返品など)。microdata/RDFaも参考検出 |
| AI可読性 | 14 | JS非実行クローラー向けにHTMLへ本文があるか(SPA/CSR検出)、本文テキスト量、h1・見出し階層、画像alt、更新日時(鮮度) |
| AIクローラー対応 | 16 | robots.txt で OAI-SearchBot / GPTBot / ChatGPT-User / ClaudeBot / PerplexityBot / Perplexity-User / Google-Extended / Applebot-Extended / Bingbot / CCBot がブロックされていないか(重要度で加重) |
| インデックス基盤 | 10 | meta robots / X-Robots-Tag の noindex、sitemap.xml の有無、robots.txt の Sitemap 宣言 |
| 基本SEO | 16 | title / meta description / OGP / canonical / Twitter Card / favicon の有無と品質 |
| llms.txt 対応 | 4 | `/llms.txt` の有無(新興の任意標準) |
| 多言語対応 | 8 | hreflang(越境EC向け)と `<html lang>` の有無 |
| ページ表示の基本 | 8 | HTTPS / モバイル viewport / charset / 初回HTML応答速度 |

## 技術スタック

- **Next.js 14(App Router)** + **TypeScript** + **Tailwind CSS**
- 診断ロジックはサーバーサイド(API Route, Node.js runtime)で実行
- HTML取得は `fetch`、解析は `cheerio`
- レーダーチャート・スコアゲージは外部ライブラリ不使用の自前SVG実装
- **外部APIキー不要** で動作(AI講評文はルールベース。後でLLMに差し替え可能)

## セットアップ

```bash
cd ai-search-checker
npm install
cp .env.example .env.local   # 必要に応じて値を編集
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### 本番ビルド

```bash
npm run build
npm run start
```

## ディレクトリ構成

```
ai-search-checker/
├── app/
│   ├── layout.tsx              # 共通レイアウト(ヘッダー・フッター)
│   ├── page.tsx                # トップページ
│   ├── globals.css
│   └── api/
│       ├── diagnose/route.ts   # 診断実行 API
│       └── lead/route.ts       # リード保存 API
├── components/                 # UI(クライアントコンポーネント)
│   ├── DiagnoseApp.tsx         # 入力→進捗→結果の状態管理
│   ├── ProgressView.tsx        # 診断中プログレス
│   ├── ResultView.tsx          # 結果表示(サマリー→リード→詳細)
│   ├── LeadForm.tsx            # リード獲得フォーム
│   ├── ScoreGauge.tsx          # 総合スコア円形ゲージ
│   ├── RadarChart.tsx          # カテゴリ別レーダーチャート
│   └── CategoryCard.tsx        # 項目別詳細カード
├── lib/
│   ├── config.ts               # CTAリンク等の差し替え可能な設定
│   ├── diagnose/               # 診断ロジック(サーバー専用)
│   │   ├── index.ts            # オーケストレーション
│   │   ├── fetchSite.ts        # URL/robots.txt/llms.txt 取得(SSRF対策込み)
│   │   ├── structuredData.ts   # JSON-LD 解析
│   │   ├── aiReadability.ts    # JS依存/本文量/見出し/alt/鮮度
│   │   ├── aiCrawler.ts        # robots.txt のAIクローラー判定
│   │   ├── crawlBasis.ts       # noindex / sitemap.xml
│   │   ├── llmsTxt.ts
│   │   ├── basicSeo.ts         # title/desc/OGP/canonical/Twitter/favicon
│   │   ├── hreflang.ts         # hreflang / html lang
│   │   ├── pageBasics.ts       # HTTPS/viewport/charset/応答速度
│   │   ├── scoring.ts          # グレード・サマリー算出
│   │   ├── llmReview.ts        # AI講評(差し替えポイント)
│   │   └── types.ts
│   └── db/                     # リード保存(差し替え可能)
│       ├── leadStore.ts        # インターフェース & ファクトリ
│       ├── sqliteLeadStore.ts  # ローカルSQLite実装
│       └── memoryLeadStore.ts  # フォールバック実装
```

## 後で差し替えるポイント

- **AI講評文の生成**: `lib/diagnose/llmReview.ts` の `generateReview()` を OpenAI / Anthropic 等のLLM呼び出しに差し替え可能(現状はルールベース)。
- **リード保存先**: `lib/db/leadStore.ts` の `getLeadStore()` に、スプレッドシート連携や外部DB実装(`SpreadsheetLeadStore` など)を追加するだけで切り替え可能。
- **相談CTAリンク**: 環境変数 `NEXT_PUBLIC_CONSULT_CTA_URL` で差し替え。

## Vercel デプロイ

このディレクトリ(`ai-search-checker`)を Root Directory に指定してデプロイできます。

> **注意**: Vercel のサーバーレス環境はファイルシステムが読み取り専用(`/tmp` のみ書き込み可・永続化なし)です。本番でリードを永続保存する場合は、`LEADS_DB_PATH=/tmp/leads.db` を指定したうえで、実運用では外部DB/スプレッドシート実装への差し替えを推奨します。SQLiteが利用できない場合は自動的にメモリ保存へフォールバックします。
