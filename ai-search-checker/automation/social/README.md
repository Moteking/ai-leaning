# SNS定期自動投稿（X）

GitHub Actions が毎日09:00(JST)に、`x-queue.txt` から1本を自動投稿します（30本をローテーション）。
X APIキーを GitHub Secrets に登録すれば稼働。未登録なら自動スキップ（無害）。

## 構成
- `post-to-x.mjs` … 投稿スクリプト（年内通算日でローテーション、状態保存不要）
- `x-queue.txt` … 投稿文のキュー（`---` 区切りで30本。自由に追加・編集OK）
- `.github/workflows/social-post.yml` … スケジュール実行（毎日 / 手動実行も可）

## 有効化手順
1. [X Developer Portal](https://developer.x.com/) で無料の開発者登録 → アプリ作成
2. アプリの権限を **Read and Write** に設定
3. 以下4つのキーを取得：API Key / API Key Secret / Access Token / Access Token Secret
   - ※Access Token は "Read and Write" 権限で再生成すること
4. GitHubリポジトリ → Settings → Secrets and variables → Actions → **New repository secret** で登録：
   - `X_API_KEY`
   - `X_API_SECRET`
   - `X_ACCESS_TOKEN`
   - `X_ACCESS_SECRET`
5. Actions タブ → "Daily X post" → "Run workflow" で手動テスト（1本投稿されればOK）

## 運用メモ
- 投稿文は `x-queue.txt` を編集するだけで差し替え可能（PR/pushで反映）。
- 投稿頻度を変えるには `social-post.yml` の `cron` を変更（例: 1日2回 `0 0,9 * * *`）。
- X無料枠は月間の投稿数に上限があります。超える場合は頻度を調整してください。
- 画像付き投稿やスレッド化は `twitter-api-v2` で拡張可能（必要なら対応します）。

## 他チャネルへの展開
同じ仕組みで、Slack/Discord Webhook（社内通知）、Threads、LinkedIn 等にも拡張できます。
LinkedIn/Threads はAPI申請がやや重いので、まずはXから。
