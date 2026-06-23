# 経時追跡（AI可視性スコアの推移グラフ）セットアップ

AI引用チェックのスコアを日々記録し、結果画面に**推移グラフ**を表示する機能です。
無料の Supabase（Postgres）と GitHub Actions の日次実行で動きます。
**未設定でもサイトは通常どおり動作します**（推移グラフが出ないだけ）。

## 仕組み

1. ユーザーが診断するたびに、スコアを Supabase に記録（`mention_snapshots`）し、
   そのブランド×クエリを追跡対象（`tracked_queries`）に登録。
2. 結果画面に、その ブランド×クエリ の過去スコアを折れ線グラフで表示。
3. GitHub Actions が毎日 `/api/track` を叩いて追跡対象を再診断 → 履歴が自動で伸びる。

## セットアップ手順（あなたの作業）

### 1. Supabase プロジェクトを作る
1. https://supabase.com で無料プロジェクトを作成。
2. 「SQL Editor」で下記を実行（テーブル作成）：

```sql
create table if not exists mention_snapshots (
  id bigint generated always as identity primary key,
  brand text not null,
  query text not null,
  visibility_score int not null default 0,
  mentioned boolean not null default false,
  rank int,
  coverage_mentioned int not null default 0,
  coverage_total int not null default 0,
  source text not null default 'user',
  created_at timestamptz not null default now()
);
create index if not exists idx_snapshots_brand_query
  on mention_snapshots (brand, query, created_at);

create table if not exists tracked_queries (
  brand text not null,
  query text not null,
  last_tracked_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (brand, query)
);
```

3. 「Project Settings → API」で以下を控える：
   - **Project URL**（`https://xxxx.supabase.co`）
   - **service_role** キー（`Project API keys` の `service_role`。**公開厳禁**）

### 2. Vercel の環境変数に追加（本番反映）
Vercel → プロジェクト → Settings → Environment Variables：

| Name | Value |
|---|---|
| `SUPABASE_URL` | 上記 Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 上記 service_role キー |
| `TRACK_SECRET` | 任意のランダム文字列（例：`openssl rand -hex 16` の出力） |

保存後「Redeploy」で反映。

### 3. GitHub に日次実行用シークレットを追加
GitHub リポジトリ → Settings → Secrets and variables → Actions：
- **New repository secret**：`TRACK_SECRET` = Vercel に入れたものと**同じ値**

（任意）独自ドメイン以外を使う場合は Variables に `SITE_URL` を追加。

これだけで完了です。設定後の診断から推移が記録され、翌日以降に自動でグラフが伸びていきます。

## 動作確認
- 同じブランド×クエリで2回診断すると、結果画面に折れ線グラフが出ます。
- 手動実行：GitHub の Actions → 「Track AI mentions (daily)」→ Run workflow。
