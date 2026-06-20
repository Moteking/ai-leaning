# AIOメディア 自動記事生成

GitHub Actions が毎日、Claude API を使って AIO（AI検索最適化）記事を自動生成し、
`content/blog/` にコミット → Vercel が自動公開します。**記事の作成から公開まで全自動**です。

## 構成
- `topics.txt` … 記事トピックのプール（1行1トピック。自由に追加・編集OK）
- `generate-articles.mjs` … 生成スクリプト（公式 `@anthropic-ai/sdk` 使用、構造化出力でJSONを生成）
- `.github/workflows/generate-articles.yml` … 毎日06:00(JST)に実行＋手動実行も可
- 出力先 … `ai-search-checker/content/blog/<slug>.md`（frontmatter付きMarkdown）

各記事ページは `Article` / `FAQPage` の構造化データ・OGP・sitemap に自動対応します
（＝メディア自身がAIOを実践し、検索/AI検索に載りやすい設計）。

## 有効化手順（APIキーを入れるだけ）
1. [Anthropic Console](https://console.anthropic.com/) で API キーを発行（少額の従量課金）
2. GitHubリポジトリ → Settings → Secrets and variables → Actions → **New repository secret**
   - `ANTHROPIC_API_KEY` = 発行したキー
3. Actions タブ → "Generate AIO articles" → "Run workflow"（手動テスト）→ 1〜2本生成されればOK

> キー未設定でもアプリ・既存記事は正常に動作します（自動生成だけ行われません）。

## 設定
- **生成本数**：ワークフローの `ARTICLES_PER_RUN`（既定2）。手動実行時は `count` 入力で指定可。
- **モデル**：既定 `claude-opus-4-8`（高品質）。コスト重視なら、ワークフローの `env` に
  `ARTICLE_MODEL: claude-haiku-4-5` を追加すると安価なモデルに切り替えられます。
- **トピック**：`topics.txt` を編集（push）するだけで追加・変更できます。`topic` 名で重複生成を防止。

## コストの目安
- 記事1本あたり数千トークン程度。Opus 4.8 で概ね数十円/本、Haiku 4.5 ならさらに安価。
- 1日2本なら月60本前後。費用を抑えたい場合は生成本数やモデルで調整してください。
- 「完全に無料」にはなりません（LLM生成のためのAPI費用が発生します）。費用0を優先するなら、
  本機能は使わず、`MARKETING.md` の記事タイトル案をもとに手動執筆する運用も可能です。

## 品質・安全面
- 生成物はMarkdownのみ（スクリプト等は描画時にもサニタイズ）。
- 自動公開のため、定期的に内容をレビューし、不適切な記事は該当 `.md` を削除してください（次の生成で別トピックになります）。
- 事実性が重要なテーマは、人によるファクトチェックを推奨します。
