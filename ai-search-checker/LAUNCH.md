# ローンチ チェックリスト（AI検索対応診断）

サービス公開までに必要なタスクを「あなた（運営者）がやること」と「コード側で対応済み／私ができること」に分けて整理しています。

---

## 🧑‍💻 あなたがやること（外部アカウント・意思決定・内容確定）

### 1. デプロイ（Vercel 推奨・無料枠で可）
- [ ] [Vercel](https://vercel.com) にGitHubアカウントで登録
- [ ] このリポジトリ `Moteking/ai-leaning` をインポート
- [ ] **Root Directory に `ai-search-checker` を指定**（重要：リポジトリ直下ではない）
- [ ] デプロイ実行 → 発行されたURL（`xxx.vercel.app`）で動作確認
- [ ] （任意）独自ドメインを割り当て（例: `diag.kaaay.co.jp`）

### 2. 環境変数の設定（Vercel の Settings → Environment Variables）
`.env.example` 参照。最低限これらを設定：
- [ ] `NEXT_PUBLIC_SITE_URL` … 公開URL（例 `https://diag.kaaay.co.jp`）
- [ ] `NEXT_PUBLIC_CONSULT_CTA_URL` … 「無料相談」ボタンの遷移先（問い合わせフォーム等）
- [ ] `LEADS_WEBHOOK_URL` … **リードの保存先**（下記3）
- [ ] （任意）`NEXT_PUBLIC_GA_ID` … Google Analytics 4 の測定ID

> ⚠️ Vercelはサーバーレスのため、ローカルのSQLiteは本番で永続化されません。本番では必ず `LEADS_WEBHOOK_URL` を設定してください（未設定だとリードが保存されません）。

### 3. リード（会社名・メール）の保存先を用意
いずれか1つを選び、その受信URLを `LEADS_WEBHOOK_URL` に設定：
- [ ] **Googleスプレッドシート**（無料・おすすめ）… Google Apps Scriptで `doPost` を作り、ウェブアプリURLを取得 → 設定
- [ ] **Zapier / Make** の Webhook → スプレッドシートやCRM・メール通知へ連携
- [ ] 自社CRM / Slack Incoming Webhook など
  - 送信されるJSON: `{ company, email, url, score, grade, createdAt, source }`
  - ※ご希望あれば、Googleスプレッドシート連携用のApps Scriptコードをこちらで用意します。

### 4. 法務ページのプレースホルダを確定（`lib/company.ts`）
- [ ] お問い合わせメールアドレス
- [ ] 電話番号（特商法表記）
- [ ] 支払方法・支払時期（有料サービス向け／特商法表記）
- [ ] プライバシーポリシー・特商法表記の内容を**自社または専門家がレビュー**して確定
  - ※雛形は用意済みですが、最終的な法的妥当性の確認は運営者責任となります。

### 5. ブランディング・計測
- [ ] ロゴ / OGP画像（SNSシェア時のサムネ画像）を用意（任意）
- [ ] Google Analytics 4 のプロパティ作成 → 測定IDを `NEXT_PUBLIC_GA_ID` に設定（任意）
- [ ] Google Search Console にサイト登録 → `sitemap.xml` を送信（公開後）

### 6. 有料サービスの設計（特商法表記が前提とする内容）
- [ ] 「改善実装サポート」「月額モニタリング」等の**料金・内容ページ**を用意
- [ ] 決済手段（銀行振込／クレジットカード決済代行）の契約

---

## ✅ コード側で対応済み（私が実装済み）

- 診断ロジック（8カテゴリ・100点）、商品ページ追加診断、結果レポート、リード獲得フォーム
- 運営会社情報／プライバシーポリシー／特定商取引法に基づく表記の3ページ＋共通フッターリンク
- フォーム送信ボタン下のプライバシーポリシー同意文言
- **本番リード保存**：`LEADS_WEBHOOK_URL` 方式（サーバーレス対応）。未設定時はローカルSQLite→メモリへ自動フォールバック
- リード保存が失敗してもユーザーのレポート閲覧は止めず、内容をサーバーログに記録（取りこぼし監視可能）
- **濫用対策**：診断APIに簡易レートリミット（IP単位）、対象URLのSSRF対策
- **サービス自身のSEO/AI対応**：`robots.txt`・`sitemap.xml` 自動生成、Organization/WebSite/WebApplication のJSON-LD、OGP/Twitterカード、canonical
- Google Analytics 連携（`NEXT_PUBLIC_GA_ID` 設定時のみ読込・プライバシーポリシーと整合）
- 日本語UI・スマホ対応・404ページ

---

## 🔜 私が追加でできること（指示があれば対応）

- Googleスプレッドシート連携用 Apps Script コードの作成
- AI講評文をLLM（Claude等）で生成する実装への差し替え
- 診断回数・リード数の簡易管理画面、メール自動返信
- 商品ページ未指定時に、トップHTMLから商品ページURLを自動推定して提案
- 利用規約ページの追加、OGP画像の自動生成
- E2E/単体テストの追加、CI（GitHub Actions）設定
